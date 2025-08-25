const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    // req.user is attached by the existing authMiddleware
    const userPermissions = req.user?.permissions;

    // Check if the user's permissions (from the JWT) include the required one
    if (userPermissions && userPermissions.includes(requiredPermission)) {
      next(); // Permission granted, proceed to the controller
    } else {
      res.status(403).json({
        success: false,
        message: "Forbidden: You don't have permission to access this resource."
      });
    }
  };
};

module.exports = checkPermission;