export const checkManagerRole = (req, res, next) => {
  if (req.user && req.user.role === "manager") {
    next(); // User is a manager, proceed to the next middleware or route handler
  } else {
    throw new Error(
      401,
      "Access denied. Only managers can perform this action."
    );
  }
};
