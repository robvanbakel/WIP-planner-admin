const fs = require('fs');
const path = require('path');
const dayjs = require('../dayjs');

const getCollection = require('../helpers/getCollection');
const getUserFromToken = require('../helpers/getUserFromToken');
const shiftDeleted = require('../helpers/mail/templates/shiftDeleted');
const sendMail = require('../helpers/mail/sendMail');

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

const notify = async (req, res, next) => {
  if (req.params.collection === 'shifts') {
    if (req.method === 'DELETE') {
      const shifts = await getCollection('shifts');
      const foundShift = shifts.find((shift) => shift.id === req.params.doc);

      sendMail(foundShift.employeeId, 'Your shift has been cancelled', await shiftDeleted({ shiftId: foundShift.id }));
    }
  }

  console.log({
    method: req.method,
    params: req.params,
    body: req.body,
  });

  next();
};

const logger = (req, res, next) => {
  const rootDir = path.dirname(require.main.filename);

  fs.appendFile(
    path.join(rootDir, 'logs', `${dayjs().format('YYYY-MM-DD')}.log`),
    `${dayjs().format('YYYY-MM-DD HH:mm:ss Z')}\n${req.method} ${req.originalUrl}\n${['POST', 'PATCH'].includes(req.method) ? `${JSON.stringify(req.body)}\n` : ''}\n`,
    next,
  );
};

module.exports = { adminOnly, notify, logger };
