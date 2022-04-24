const dayjs = require('dayjs')

const localizedFormat = require('dayjs/plugin/localizedFormat')

dayjs.extend(localizedFormat)

module.exports = dayjs
