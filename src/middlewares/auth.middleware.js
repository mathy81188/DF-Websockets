//  export const authMiddleware = (role) => {
//   return (req, res, next) => {
//      if (req.user.role !== role) {
//      return res.status(403).json({ message: "not authorized" });
//     }
//      next();
//   };
// };
/*
export const authMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    next();
  };
};
*/

export const authMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    next();
  };
};
