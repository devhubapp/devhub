module.exports = (req, res) => {
  res.writeHead(301, { Location: `https://devhubapp.com/${req.url.substr(1)}` })
  res.end()
}
