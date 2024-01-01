export const authMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.session.role;
    console.log("userRole:", userRole);

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    next();
  };
};
