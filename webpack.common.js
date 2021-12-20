const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cesiumConfig = require('@oidajs/map-cesium/config/webpack.cesium.js');
const antdConfig = require('@oidajs/ui-react-antd/config/webpack.antd.js');

const { merge } = require('webpack-merge');

const config = (env = {}) => {
    return merge(
        cesiumConfig({ nodeModulesDir: 'node_modules' }),
        antdConfig({
            styleLoader: env.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader'
        }),
        {
            entry: {
                app: './src/index.tsx'
            },
            output: {
                path: env.outpath || path.resolve(__dirname, "dist"),
                filename: '[name].[contenthash].bundle.js',
            },
            resolve: {
                extensions: ['.ts', '.tsx', '.js', '.jsx'],
                symlinks: false,
                fallback: {
                    util: require.resolve("util/"),
                    buffer: require.resolve("buffer/"),
                    https: false,
                    http: false,
                    fs: false
                }
            },
            target: 'web',
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: 'ts-loader',
                                options: {
                                    transpileOnly: true
                                }
                            }
                        ]
                    },
                    {
                        include: /oidajs[\/\\]/,
                        test: /\.jsx?$/,
                        enforce: 'pre',
                        use: [
                            {
                                loader: 'source-map-loader'
                            }
                        ]
                    },
                    {
                        test: /\.jsx?$/,
                        include:[
                            path.resolve(__dirname, "node_modules/geotiff")
                        ],
                        use: [
                            {
                                loader: 'ts-loader',
                                options: {
                                    transpileOnly: true,
                                    configFile: path.resolve(__dirname, 'tsconfig.json'),
                                    compilerOptions: {
                                        sourceMap: false
                                    },
                                    onlyCompileBundledFiles: true
                                }
                            }
                        ]
                    },
                    {
                        test: /\.(png|jpe?g|gif|svg)$/i,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: 'assets/images/[name].[contenthash].[ext]'
                                }
                            }
                        ]
                    },
                    {
                        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: 'assets/fonts/[name].[contenthash].[ext]'
                                }
                            }
                        ]
                    },
                ]
            },
            plugins: [
                new HtmlWebpackPlugin({
                    template: './src/index.ejs',
                    baseUrl: env.baseUrl || '/',
                    appVersion: env.appVersion || 'dev',
                    minify: false
                }),
                //in order for wkx to work
                // TODO: replace wkx with a browser native lib (e.g. @terraformer/wkt)
                new webpack.DefinePlugin({
                    'process.env.NODE_DEBUG': false
                }),
                new webpack.ProvidePlugin({
                    Buffer: ['buffer', 'Buffer'],
                })
            ]
        }
    )
};


module.exports = config;
