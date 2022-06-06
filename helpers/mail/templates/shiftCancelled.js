const dayjs = require('../../../dayjs');
const button = require('../components/button');

const shiftCancelled = ({ from }) => `<p>
    Your shift for <strong>${dayjs(from).format('LLL')}</strong> has been cancelled. Click on the button below to see your updated schedule.
  </p>
  ${button()}
  <p>
    If you believe a mistake has been made, please let us know by replying to this email.
  </p>`;

module.exports = shiftCancelled;
