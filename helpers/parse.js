const { v4: uuidv4 } = require('uuid');
const dayjs = require('../dayjs');
const getCollection = require('./getCollection');

const parse = async (shifts) => {
  const settings = await getCollection('settings');
  const { shiftNotes } = settings.find((setting) => setting.id === 'shareWithEmployees');
  const { address, postalCode, city } = settings.find((setting) => setting.id === 'location');

  let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Rob van Bakel//Spark//EN';

  shifts.forEach((shift) => {
    icsContent += '\nBEGIN:VEVENT'
    + `\nUID:${uuidv4()}`
    + `\nDTSTAMP:${dayjs().format('YYYYMMDDTHHmmss')}`
    + `\nDTSTART:${dayjs(shift.from).format('YYYYMMDDTHHmmss')}`
    + `\nDTEND:${dayjs(shift.to).format('YYYYMMDDTHHmmss')}`
    + `\nSUMMARY:${shift.location}`
    + `\nDESCRIPTION:${shiftNotes ? shift.notes : ''}`
    + `\nLOCATION:${address}\\n${postalCode} ${city}`
    + '\nEND:VEVENT';
  });

  icsContent += '\nEND:VCALENDAR';

  return icsContent;
};

module.exports = parse;
