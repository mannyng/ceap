const path = require('path')
const http = require('http')
const express = require('express')

const app = express()
let server = http.Server(app)
const port = (process.env.PORT || 8080)

app.use(express.static(__dirname + '/public'))

const webpack = require('webpack')
let isProd = process.env.NODE_ENV === 'production'
let config = {
webpack: {
    entry: ['./app/App.js', !isProd && 'webpack-hot-middleware/client'].filter(x=>x),
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


server.listen(port)
console.log(`Listening at http://localhost:${port}`)

app.get('/test/*', (req, res) => {
  let html = `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Test Page</title>
    </head>
    <body>
      <h1>test page</h1>
      <script src="/analytics.js"></script>
    </body>
    </html>`

  res.send(html)
})

app.get('/', (req, res) => {
  let html = `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>PuzAir</title>
     <meta name="description" content="">
     <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
     <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
     <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
     <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css">
     <link rel="stylesheet" href="/public/styles.css">
     <link rel="stylesheet" href="/public/mo-styles.css">
    </head>
    <body>
      <div class="container" id="root"></div>
      <script src="bundle.js"></script>
    </body>
    </html>
  `

  res.send(html)
})
