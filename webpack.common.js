const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const cesiumConfig = require('@oida/map-cesium/config/webpack.cesium.js');
const antdConfig = require('@oida/ui-react-antd/config/webpack.antd.js');

const webpackMerge = require('webpack-merge');

const config = (env = {}) => {
    return webpackMerge(
        cesiumConfig({ nodeModulesDir: 'node_modules' }),
        antdConfig({
            styleLoader: env.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
            tsLoaderOptions: {
                transpileOnly: true
            }
        }),
        {
            entry: {
                app: './src/index.tsx'
            },
            output: {
                path: env.outpath || path.resolve(__dirname, "dist"),
                filename: '[name].[hash].bundle.js',
            },
            resolve: {
                extensions: ['.ts', '.tsx', '.js', '.jsx'],
                symlinks: false
            },
            module: {
                rules: [
                    {
                        include: /oida[\/\\]/,
                        test: /\.jsx?$/,
                        enforce: 'pre',
                        use: [
                            {
                                loader: 'source-map-loader'
                            }
                        ]
                    },
                    {
                        test: /\.(png|jpe?g|gif|svg)$/i,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: 'assets/images/[name].[hash].[ext]'
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
                                    name: 'assets/fonts/[name].[hash].[ext]'
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
                new ForkTsCheckerWebpackPlugin()
            ]
        }
    )
};


module.exports = config;
