const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const {
    VueLoaderPlugin
} = require('vue-loader');


// Путь куда собирать
const outPath = path.resolve(__dirname, 'local/templates/main/dist');


// ********* Configs **********

// Сборка html, страницы для сборки
const htmlPages = fs
    .readdirSync(path.resolve(__dirname, 'src/pages'))
    .filter(fileName => (fileName.endsWith('.html')));

module.exports = (env = {}, argv) => {
    const isDev = argv.mode === 'development';
    const mode = argv.mode === 'development' ? 'development' : 'production';
    const config = {
        context: path.resolve(__dirname, 'src'),
        mode: mode,
        devtool: (() => (isDev ? 'source-map' : 'nosources-source-map'))(),
        entry: {
            app: [
                './js/app.js',
                './styles/app.scss',
            ]
        },
        resolve: {
            modules: [path.resolve(__dirname, 'src'), 'node_modules'],
            extensions: ['.js', '.json', '.vue', '.scss', '.html'],
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        },
        target: 'web',
        output: {
            filename: 'scripts/[name].js', // Выходной файл js
            path: outPath, // Директория сборки
            publicPath: '',
        },
        plugins: (() => {
            const common = [
            new MiniCssExtractPlugin(
                {
                    filename: "styles/[name].css"
                }
            ),
            new CleanWebpackPlugin(),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                'window.jQuery': "jquery"
            }),
            new VueLoaderPlugin(),
            // Сборка html
            ...htmlPages.map(page => new htmlPlugin({
                minimize: false,
                sources: false,
                publicPath: '../',
                template: `${path.resolve(__dirname, 'src/pages')}/${page}`,
                filename: `static/${page.split('.')[0]}.html`
            })),
            new SpriteLoaderPlugin({
                extract: true,
                spriteFilename: svgPath => `sprite${svgPath.substr(-4)}`
            }),
        ];
        const production = [
            new plugins.clean(['dist']),            
          ];
    
          const development = [
            new plugins.sync({
              host: 'localhost',
              port: 3000,
              proxy: 'http://localhost:8080/',
            }, {
              reload: false,
            },),
          ];
        return isDev ? 
            common.concat(development) :
            common.concat(production);

        })(),
        optimization: {},
        devServer: {
            open: true,
            watchFiles: path.join(__dirname, 'src'),
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
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../',
                            }
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: isDev
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        "autoprefixer"
                                    ]
                                },
                                sourceMap: isDev
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDev
                            }
                        },
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
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name].[ext]',
                    },
                    use: [
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                mozjpeg: {
                                    progressive: true,
                                },
                                // optipng.enabled: false will disable optipng
                                optipng: {
                                    enabled: false,
                                },
                                pngquant: {
                                    quality: [0.65, 0.90],
                                    speed: 4
                                },
                                gifsicle: {
                                    interlaced: false,
                                },
                                // the webp option will enable WEBP
                                webp: {
                                    quality: 75
                                }
                            },
                        },
                    ],
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
                            minimize: false,
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
