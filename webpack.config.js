const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const mode = isDev ? 'development' : 'production';

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: mode,
    devtool: (() => (isDev ? 'source-map' : 'nosources-source-map'))(),
    entry: [
        './index.js',
        './style.scss'
    ],
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        alias: {
            '@module': path.resolve(__dirname, 'src/moduls'),
            '@': path.resolve(__dirname, 'src')
        }
    },
    output: {
        filename: 'main.js', // Выходной файл js
        path: path.resolve(__dirname, 'local/templates/main/assets'), // Директория сборки
    },
    plugins: [
        new MiniCssExtractPlugin(
            {
                filename: 'main.css', // выходной файл css
            }
        ),
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            'window.jQuery': "jquery"
        })
        
    ],
    optimization: {},
    devServer: {
        port: 4200,
        hot: isDev
      },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: isDev
                        }
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: isDev
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                          implementation: require("postcss"),
                          sourceMap: isDev
                        },
                      },
                    {
                        loader: 'sass-loader',
                        options: {                
                            sourceMap: isDev
                        }
                    }                 
                ]
            },
            {
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[ext]'
                }
            },
            {
                test: /\.(jpg|jpeg|png|gif|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'images/[name].[ext]',
                    }
                }],
            },
        ]
    }
}
