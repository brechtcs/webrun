const fs = require('fs')
const fetch = require('node-fetch')
const filenamifyUrl = require('filenamify-url')
const cleanURL = require('../lib/clean-url')

module.exports = ({ cacheDir }) => async function getHTTPS (url) {
  const cachedName = filenamifyUrl(url.href)
  const cachedLocation = cleanURL(new URL(cachedName, cacheDir))

  try {
    await fs.stat(cachedLocation)

    return fs.readFile(cachedLocation, 'utf8')
  } catch (e) {
    const response = await fetch(url)

    const content = await response.text()

    await fs.writeFile(cachedLocation, content, 'utf8')

    return content
  }
}
