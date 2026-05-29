import express from "express";
import cors from "cors";
import crypto from "crypto";
import { env } from '@repo/backend-common/config';


const app = express();

const PORT = env.PORT || 4000;

//
// IMPORTANT
// raw body needed for github signature verification
//
app.use(
  "/webhooks/github",
  express.raw({
    type: "*/*",
  })
);

app.use(express.json());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

//
// HEALTH
//
app.get("/health", (_, res) => {
  return res.status(200).json({
    success: true,
    message: "Server healthy",
  });
});

//
// ======================================================
// PHASE 1
// GITHUB OAUTH LOGIN
// ======================================================
//

//
// STEP 1
// redirect user to github oauth
//
app.get("/api/auth/github", (_, res) => {
  const githubUrl =
    "https://github.com/login/oauth/authorize?" +
    new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID!,
      scope: "read:user user:email",
    });

  return res.redirect(githubUrl);
});

//
// STEP 2
// github oauth callback
//
app.get("/api/auth/github/callback", async (req, res) => {
  try {
    const code = req.query.code as string;
    const error = req.query.error as string | undefined;

    //
    // user cancelled login
    //
    if (error) {
      return res.redirect(
        `${env.FRONTEND_URL}/login?error=github_cancelled`
      );
    }

    //
    // missing code
    //
    if (!code) {
      return res.status(400).json({
        error: "Missing code",
      });
    }

    //
    // exchange code for token
    //
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: new URLSearchParams({
          client_id: env.GITHUB_CLIENT_ID!,
          client_secret: env.GITHUB_CLIENT_SECRET!,
          code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return res.status(400).json({
        error: "Failed to get access token",
      });
    }

    //
    // get github user
    //
    const userResponse = await fetch(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const githubUser = await userResponse.json();

    console.log("\n=================");
    console.log("GITHUB USER");
    console.log("=================");
    console.log(githubUser);

    //
    // TODO:
    //
    // create db user
    // create jwt/session
    //

    //
    // redirect dashboard
    //
    return res.redirect(
      `${env.FRONTEND_URL}/dashboard`
    );

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

//
// ======================================================
// PHASE 2
// GITHUB APP INSTALL FLOW
// ======================================================
//

//
// redirect user to github app install page
//
app.get("/api/github/install", (_, res) => {
  const installUrl =
    `https://github.com/apps/${env.GITHUB_APP_NAME}/installations/new`;

  return res.redirect(installUrl);
});

//
// github redirects here after app installation
//
app.get("/api/github/setup", async (req, res) => {
  try {
    const installationId = req.query.installation_id;

    console.log("\n=================");
    console.log("GITHUB APP INSTALLED");
    console.log("=================");
    console.log("installation_id:", installationId);

    //
    // TODO:
    //
    // save installation id in database
    //

    return res.redirect(
      `${env.FRONTEND_URL}/dashboard`
    );

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Setup failed",
    });
  }
});

//
// ======================================================
// PHASE 3
// GITHUB WEBHOOK RECEIVER
// ======================================================
//

app.post("/webhooks/github", async (req, res) => {
  try {
    //
    // github signature header
    //
    const signature = req.headers[
      "x-hub-signature-256"
    ] as string;

    //
    // github event type
    //
    const event = req.headers[
      "x-github-event"
    ] as string;

    //
    // raw body buffer
    //
    const rawBody = req.body;

    //
    // verify github signature
    //
    const expectedSignature =
      "sha256=" +
      crypto
        .createHmac(
          "sha256",
          env.GITHUB_WEBHOOK_SECRET!
        )
        .update(rawBody)
        .digest("hex");

    //
    // invalid signature
    //
    if (signature !== expectedSignature) {
      console.log("Invalid webhook signature");

      return res.status(401).json({
        error: "Invalid signature",
      });
    }

    //
    // parse payload
    //
    const payload = JSON.parse(rawBody.toString());

    console.log("\n=================");
    console.log("GITHUB WEBHOOK");
    console.log("=================");
    console.log("EVENT:", event);

    //
    // INSTALLATION EVENT
    //
    if (event === "installation") {
      console.log("Installation Event");

      console.log({
        action: payload.action,
        installationId: payload.installation?.id,
      });
    }

    //
    // PULL REQUEST EVENT
    //
    if (event === "pull_request") {
      const action = payload.action;

      const repoName =
        payload.repository?.full_name;

      const installationId =
        payload.installation?.id;

      const prNumber =
        payload.pull_request?.number;

      const prTitle =
        payload.pull_request?.title;

      const branch =
        payload.pull_request?.head?.ref;

      const sha =
        payload.pull_request?.head?.sha;

      console.log("\nPR EVENT");
      console.log({
        action,
        installationId,
        repoName,
        prNumber,
        prTitle,
        branch,
        sha,
      });

      //
      // PR OPENED
      //
      if (action === "opened") {
        console.log(
          `\n[QUEUE JOB] Build preview for PR #${prNumber}`
        );

        //
        // TODO:
        //
        // queue.add("build-preview", {})
        //
      }

      //
      // PR UPDATED
      //
      if (action === "synchronize") {
        console.log(
          `\n[QUEUE JOB] Rebuild preview for PR #${prNumber}`
        );
      }

      //
      // PR CLOSED
      //
      if (action === "closed") {
        console.log(
          `\n[QUEUE JOB] Cleanup preview for PR #${prNumber}`
        );
      }
    }

    return res.status(200).json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Webhook failed",
    });
  }
});

//
// ======================================================
// START SERVER
// ======================================================
//

app.listen(PORT, () => {
  console.log(`\nServer running on port ${PORT}`);
});