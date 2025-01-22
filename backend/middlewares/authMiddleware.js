import jwt from "jsonwebtoken";

// Middleware to protect routes by verifying JWT token
const protect = (req, res, next) => {
  // Extract the token from the Authorization header, cookies, or request body
  const token =
    req.cookies.token ||
    req.body.token ||
    (req.header("Authorization") &&
      req.header("Authorization").replace("Bearer ", "").trim());


  if (!token) {
    console.log("res: ", res);
    return res.status(401).json({ message: "No token, authorization denied" }); // Return 401 if no token
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to the request object
    req.user = {
      userId: decoded.userId, // Decoded user ID from the token
      username: decoded.username, // Decoded username from the token
    };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error); // Log the error for debugging
    return res.status(401).json({ message: "Token is not valid" }); // Return 401 if token verification fails
  }
};

export { protect };
