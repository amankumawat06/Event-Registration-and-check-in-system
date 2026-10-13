export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "You do not have access to access this resource",
    });
  }
  next();
};
