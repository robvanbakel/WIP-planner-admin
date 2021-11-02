// Construct array of available characters
const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("")

const generateRandomString = (length) => {
  
  let output = ""

  // Add randomly picked character to output for chosen amount of times
  for (let i = 0; i < length; i++) {
    output += chars[Math.floor(Math.random() * chars.length)]
  }

  return output
}

module.exports = generateRandomString
