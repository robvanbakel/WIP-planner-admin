const dayjs = require('../../../dayjs');
const getCollection = require('../../getCollection');
const button = require('../components/button');

const shiftDeleted = async ({ shiftId }) => {
  const shifts = await getCollection('shifts');
  const foundShift = shifts.find((shift) => shift.id === shiftId);

  const from = dayjs(foundShift.from);

  return `<p>
    Your shift on <strong>${from.format('LLL')}</strong> has been cancelled. Click on the button below to see your updated schedule.
  </p>
 ${button()}
  <p>
    If you believe a mistake has been made, please let us know by replying to this email.
  </p>`;
};

module.exports = shiftDeleted;
