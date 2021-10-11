const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

const generateRandomString = (length) => {
  const charsArray = chars.split("")

  let output = ""

  for (let i = 0; i < length; i++) {
    output += charsArray[Math.floor(Math.random() * charsArray.length)]
  }

  return output
}

module.exports = generateRandomString
