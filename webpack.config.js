const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const jsLoader = () => {
	const loaders = [{
		loader: 'babel-loader',
		options: {
			presets: ['@babel/preset-env'],
			plugins: ['@babel/plugin-transform-runtime']
		}
	}];

	if (isDev) {
		loaders.push('eslint-loader');
	}

	return loaders;
}

const cssLoader = (extra) => {
	const loaders = [
		MiniCssExtractPlugin.loader,
		{ 
			loader: 'css-loader', 
			options: { 
				sourceMap: true 
			} 
		}
	];

	if (extra) {
		let extraLoader = { 
    		loader: 'sass-loader', 
    		options: { 
    			sourceMap: true 
    		} 
    	};
		loaders.push(extraLoader);
	}	

	return loaders;
}

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	devtool: 'source-map',
	entry: {
		main: './index.js'
	},
	resolve: {
		extensions: ['.js', '.json', '.png'],
		alias: {
			'@module' : path.resolve(__dirname, 'src/moduls'),
			'@': path.resolve(__dirname, 'src')
		}
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'local/templates/main/assets'),
	},
	plugins: [
		new MiniCssExtractPlugin(
			{
				filename: '[name].css',	
			}
		),
		new CleanWebpackPlugin(),
	],
	optimization: {
	    minimize: true,
	    minimizer: [
	      new CssMinimizerPlugin({
	        minify: async (data, inputMap) => {
	          // eslint-disable-next-line global-require
	          const CleanCSS = require('clean-css');

	          const [[filename, input]] = Object.entries(data);
	          const minifiedCss = await new CleanCSS({ sourceMap: true }).minify({
	            [filename]: {
	              styles: input,
	              sourceMap: inputMap,
	            },
	          });

	          return {
	            code: minifiedCss.styles,
	            map: minifiedCss.sourceMap.toJSON(),
	            warnings: minifiedCss.warnings,
	          };
	        },
	      }),
	    ],
	  },
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: jsLoader()
			},
			{ 
				test: /\.css$/, 
				use: cssLoader() 
			},
			{
				test: /\.s[ac]ss$/,
				use: cssLoader('sass-loader')
			},
			{
	        	test: /\.(ttf|woff|woff2|eot)$/,
	        	type: 'asset/resource',
	        	generator: {
		        	filename: 'fonts/[name][ext]'
		       	}
	      	},
		]
	}
}
