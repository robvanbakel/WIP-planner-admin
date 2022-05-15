const dayjs = require('dayjs');

const localizedFormat = require('dayjs/plugin/localizedFormat');
const advancedFormat = require('dayjs/plugin/advancedFormat');
const isoWeek = require('dayjs/plugin/isoWeek');

const weekId = (option, dayjsClass) => {
  const proto = dayjsClass.prototype;
  proto.weekId = function () {
    return this.format('GGGG-WW');
  };
};

dayjs.extend(localizedFormat);
dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);
dayjs.extend(weekId);

module.exports = dayjs;
