const allowAllOriginsOutsideProduction = (res) => {
  if (process.env.NODE_ENV !== 'production') {
    res.setHeader('Access-Control-Allow-Origin', '*')
  }
}

module.exports = { allowAllOriginsOutsideProduction }
