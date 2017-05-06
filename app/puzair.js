//const Server = require('../server.js')
const port = (process.env.PORT || 8080)

let app = Server.server()

const webpack = require('webpack')
let isProd = process.env.NODE_ENV === 'production'
let config = {
webpack: {
    entry: ['./App.js', !isProd && 'webpack-hot-middleware/client'].filter(x=>x),
    output: { path: '/' },
    module: {
      loaders: [
        {
          test: /.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: { presets: ['es2015', 'react'] }
        },
        { test: /\.css$/, loader: 'style-loader!css-loader' },
        { test: /\.png$/, loader: "url" },
        { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' }
      ]
    },
    plugins: [
      isProd ? new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': "'production'" } }) : function() {},
      isProd ? new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }) : function() {},
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ],
    devtool: !isProd && 'source-map'
  }
}
let webpackDevMiddleware = require('webpack-dev-middleware')
let webpackHotMiddleware = require('webpack-hot-middleware')
let compiler = webpack(config.webpack)

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.webpack.output.publicPath,
  noInfo: true
}))

if (!isProd) {
  app.use(webpackHotMiddleware(compiler))
}


app.listen(port)
console.log(`Listening at http://localhost:${port}`)
