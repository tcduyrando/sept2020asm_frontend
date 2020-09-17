var config = {
    entry: './main.js',
     
    output: {
       path: __dirname,
       publicPath: '/',
       filename: 'index.js',
    },
     
    devServer: {
       inline: true,
       port: 9000,
    },
     
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
              
          query: {
            presets: ['es2015', 'react']
          }
        },
        {
          test: /\.s?css$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader'
          ]
        }
       ]
    }
 }
 
 module.exports = config;