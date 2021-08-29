const path = require('path');

module.exports = {
  entry: './public/js/raytracer.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './bundle.js',
  },
};