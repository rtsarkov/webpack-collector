const path = require('path');


const isDev = true;

const babelOptions = preset => {
  const opts = {
    presets: [
      '@babel/preset-env'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ]
  }

  if (preset) {
    opts.presets.push(preset)
  }

  return opts
}

const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: babelOptions()
  }]

  if (isDev) {
    loaders.push('eslint-loader')
  }

  return loaders
}

module.export = {
	context: path.resolve(__dirname, 'src'),
	mode: 'developer',
	entry: './index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'my-first-webpack.bundl.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exlude: /node-modules/,
				use: jsLoaders()
			}
		]
	}
}
