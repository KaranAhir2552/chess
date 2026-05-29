export const successResponse = <T>(message: string, data?: T) => ({
  success: true,
  statusCode: 200,
  message,
  data,
});
