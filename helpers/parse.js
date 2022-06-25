const { v4: uuidv4 } = require('uuid');
const dayjs = require('../dayjs');
const getCollection = require('./getCollection');

const parse = async (shifts) => {
  const admin = await getCollection('admin');
  const settings = admin.find((i) => i.id === 'settings');

  const { shiftNotes } = settings.shareWithEmployees;
  const { street, postalCode, city } = settings.address;

  let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Rob van Bakel//Spark//EN';

  shifts.forEach((shift) => {
    icsContent += '\nBEGIN:VEVENT'
    + `\nUID:${uuidv4()}`
    + `\nDTSTAMP:${dayjs().format('YYYYMMDDTHHmmss')}`
    + `\nDTSTART:${dayjs(shift.from).format('YYYYMMDDTHHmmss')}`
    + `\nDTEND:${dayjs(shift.to).format('YYYYMMDDTHHmmss')}`
    + `\nSUMMARY:${shift.location}`
    + `\nDESCRIPTION:${shiftNotes ? shift.notes : ''}`
    + `\nLOCATION:${street}\\n${postalCode} ${city}`
    + '\nEND:VEVENT';
  });

  icsContent += '\nEND:VCALENDAR';

  return icsContent;
};

module.exports = parse;
