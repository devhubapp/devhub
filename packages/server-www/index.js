module.exports = (req, res) => {
  const url = `https://devhubapp.com/${req.url.substr(1)}`

  res.end(
    `<!DOCTYPE html>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content=${JSON.stringify(`0;URL=${url}`)} />
    <title>Redirecting...</title>
    <script>window.location=${JSON.stringify(url)}</script>`,
  )
}
