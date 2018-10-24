const path = require('path')
const OfflinePlugin = require('offline-plugin')

module.exports = {
  entry: './src/index.mjs',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  resolve: {
    extensions: ['.js', '.mjs']
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new OfflinePlugin({
      publicPath: '/',
      appShell: '/',
      externals: [
        '/'
      ]
    })
  ]
}
