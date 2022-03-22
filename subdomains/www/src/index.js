module.exports = (req, res) => {
  res.statusCode = 301
  res.setHeader('Location', `https://devhubapp.com/${req.url.slice(1)}`)

  res.end()
}
