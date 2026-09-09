import jwt from 'jsonwebtoken';

export function authenticateAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization format'
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'JWT_SECRET is not configured'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    req.admin = decoded;

    next();

  } catch (error) {
    console.error(
      'Authentication error:',
      error.message
    );

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}