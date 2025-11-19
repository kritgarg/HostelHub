export const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";
  const msg = (message || "").toLowerCase();
  if (!err.status) {
    if (msg.includes("not found")) status = 404;
    else if (msg.includes("invalid credentials") || msg.includes("unauthorized")) status = 401;
    else if (msg.includes("forbidden")) status = 403;
    else if (msg.includes("invalid") || msg.includes("required") || msg.includes("incorrect")) status = 400;
  }
  res.status(status).json({ status, message });
};
