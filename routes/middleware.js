const fs = require('fs');
const path = require('path');
const dayjs = require('../dayjs');

const getUserFromToken = require('../helpers/getUserFromToken');

const demoGuard = async (req, res, next) => {
  if (req.method === 'GET') {
    next();
    return;
  }

  const user = await getUserFromToken(req.headers.authorization);

  if (user.demo) {
    res.send('No data will be saved in the demo environment');
    return;
  }

  next();
};

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

const logger = (req, res, next) => {
  const rootDir = path.dirname(require.main.filename);

  if (req.method === 'GET' && ['/admin/db/settings', '/admin/db/users', '/admin/db/shifts'].includes(req.originalUrl)) {
    next();
    return;
  }

  fs.appendFile(
    path.join(rootDir, 'logs', `${dayjs().format('YYYY-MM-DD')}.log`),
    `${dayjs().format('YYYY-MM-DD HH:mm:ss Z')}\n${req.method} ${req.originalUrl}\n${['POST', 'PATCH'].includes(req.method) ? `${JSON.stringify(req.body)}\n` : ''}\n`,
    next,
  );
};

module.exports = { adminOnly, logger, demoGuard };
