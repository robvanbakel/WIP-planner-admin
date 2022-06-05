const getCollection = require('../helpers/getCollection');
const getUserFromToken = require('../helpers/getUserFromToken');
const shiftDeleted = require('../helpers/mailTemplates/shiftDeleted');
const sendMail = require('../helpers/sendMail');

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

module.exports = { adminOnly, notify };
