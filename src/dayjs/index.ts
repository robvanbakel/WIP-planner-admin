import dayjs from 'dayjs';

import localizedFormat from 'dayjs/plugin/localizedFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';

const weekId: dayjs.PluginFunc = (option, dayjsClass) => {
  const proto = dayjsClass.prototype;
  // eslint-disable-next-line func-names
  proto.weekId = function () {
    return this.format('GGGG-WW');
  };
};

const dateTime: dayjs.PluginFunc = (option, dayjsClass) => {
  const proto = dayjsClass.prototype;
  // eslint-disable-next-line func-names
  proto.dateTime = function () {
    return this.format('YYYY-MM-DDTHH:mm');
  };
};

dayjs.extend(localizedFormat);
dayjs.extend(advancedFormat);
dayjs.extend(dateTime);
dayjs.extend(isoWeek);
dayjs.extend(weekId);

export default dayjs;
