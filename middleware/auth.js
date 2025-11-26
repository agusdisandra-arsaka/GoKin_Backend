const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // expect header Authorization: Bearer <token>
  const authHeader = req.header('Authorization') || req.header('x-auth-token');
  if (!authHeader) return res.status(401).json({ msg: 'No token, authorization denied' });

  let token = authHeader;
  if (authHeader.startsWith('Bearer ')) token = authHeader.slice(7).trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token invalid' });
  }
};
