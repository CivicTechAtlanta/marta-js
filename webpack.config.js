const path = require('path')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const sharedConfig = {
  mode: process.env.NODE_ENV,
  entry: './src/index.ts',
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
        {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: "ts-loader"
        }
    ]
  }
}

const commonjsConfig = {
  ...sharedConfig,
  target: "node",
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'MartaApi'
  }
}

const browerConfig = {
  ...sharedConfig,
  target: "web",
  output: {
    filename: 'marta.min.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'var',
    library: 'MartaApi'
  },
  externals: {
    "moment": "moment",
    "moment-timezone": "moment"
  }
}
module.exports = [commonjsConfig, browerConfig]
