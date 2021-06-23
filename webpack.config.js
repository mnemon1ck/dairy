module.exports = function() {
  return {
    mode: 'development',
    entry: `${__dirname}/bundle.jsx`,
    output: {
      filename: 'bundle.js',
      path: `${__dirname}`
    },
    module: {
      rules: [
        {
          test: /\.jsx$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader"
          }
        },
      ]
    },
    stats: {
      assets: false,
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      modules: false,
      hash: false,
      version: false,
      entrypoints: false,
      timings: false,
      colors: true
    },
    node: {
      __filename: true
    }
  }
};