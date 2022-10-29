const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const globImporter = require('node-sass-glob-importer');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const {
    VueLoaderPlugin
} = require('vue-loader');


// Путь куда собирать
const outPath = path.resolve(__dirname, 'local/templates/main/assets');




// ********* Configs **********
// const htmlPathPages = path.resolve(__dirname, 'src/pages');
const htmlPages = fs
    .readdirSync(path.resolve(__dirname, 'src/pages'))
    .filter(fileName => (fileName.endsWith('.html')));

module.exports = (env = {}, argv) => {
    const isDev = argv.mode === 'development';
    const mode = argv.mode === 'development' ? 'development' : 'production';
    const config = {
        context: path.resolve(__dirname, 'src'),
        mode: 'development',
        devtool: (() => (isDev ? 'source-map' : 'nosources-source-map'))(),
        entry: [
            './js/app.js',
            './styles/app.scss'
        ],
        resolve: {
            modules: [path.resolve(__dirname, 'src'), 'node_modules'],
            extensions: ['.js', '.json', '.vue', '.scss', '.html'],
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        },
        target: 'web',
        output: {
            filename: 'main.js', // Выходной файл js
            path: path.resolve(__dirname, 'local/templates/main/assets'), // Директория сборки
            publicPath: '',
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
            }),
            new VueLoaderPlugin(),
            ...htmlPages.map(page => new htmlPlugin({
                template: `${path.resolve(__dirname, 'src/pages')}/${page}`,
                filename: `${page.split('.')[0]}.html`
            })),
            new SpriteLoaderPlugin({
                extract: true,
                spriteFilename: svgPath => `sprite${svgPath.substr(-4)}`
            }),

        ],
        optimization: {},
        devServer: {
            open: true,
            watchFiles: ["src/**/*"],
            hot: true,
        },
        devtool: !isDev ? 'hidden-source-map' : 'source-map',
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
                    test: /\.vue$/,
                    use: 'vue-loader',
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: isDev
                            }
                        },
                        {
                            loader: 'vue-style-loader'
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
                            loader: 'postcss-loader'
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    importer: globImporter()
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[name].[ext]',
                        }
                    }]
                },
                {
                    test: /\.(jpg|jpeg|png|gif)$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[ext]',
                        }
                    }],
                },
                {
                    test: /\.svg$/,
                    use: {
                        loader: 'svg-sprite-loader'
                    }
                },
                {
                    test: /\.html$/,
                    use: {
                        loader: 'html-loader',
                        options: {
                            preprocessor: (content, loaderContext) =>
                                content.replace(/\<include src=\"(.+)\"\/?\>(?:\<\/include\>)?/gi,
                                    (m, src) => fs.readFileSync(path.resolve(loaderContext.context, src), 'utf8'))
                        },
                    },
                }
            ]
        }
    }
    return config;
}
