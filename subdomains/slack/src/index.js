module.exports = (req, res) => {
  res.statusCode = 301
  res.setHeader('Location', 'https://api.devhubapp.com/slack')

  res.end()
}
