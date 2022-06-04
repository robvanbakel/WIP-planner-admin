const getUserFromToken = require('../helpers/getUserFromToken');

const adminOnly = async (req, res, next) => {
  const user = await getUserFromToken(req.headers.authorization);

  if (!user) {
    res.status(401).end();
    return;
  }

  if (user.status !== 'ADMIN') {
    res.status(403).end();
    return;
  }

  next();
};

module.exports = { adminOnly };
