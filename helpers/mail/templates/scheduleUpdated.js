const button = require('../components/button');

const scheduleUpdated = ({ week }) => `<p>
    Your schedule for <strong>week ${week}</strong> has been updated. Please visit Spark to review and accept your shifts.
  </p>
  ${button({
    text: 'Review shifts',
  })}`;

module.exports = scheduleUpdated;
