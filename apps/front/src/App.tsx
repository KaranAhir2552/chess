import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Dashboard from "./pages/dashboard";
function Home() {
  return <div className='flex justify-center items-center h-screen w-screen'>
      <a href="http://localhost:4000/api/auth/github">
        Login with GitHub
      </a>
    </div>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;