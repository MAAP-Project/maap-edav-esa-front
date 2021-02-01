const path = require('path');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = (env = {}) => {
    return webpackMerge(commonConfig({
        mode: 'production',
        ...env
    }),{
        mode: 'production',
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 0,
                                sourceMap: true,
                                import: false,
                                modules: false
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: '../bundle-report.html',
                openAnalyzer: false
            }),
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: "[name].[hash].bundle.css",
                chunkFilename: "[id].[hash].css"
            }),
            new CopyWebpackPlugin({
                patterns: [{
                    context: path.resolve(__dirname, 'data'),
                    from: '**/*',
                    to: path.join(env.outpath || path.resolve(__dirname, "dist"), 'data')
                }]
            })
        ]
    });
}

module.exports = config;
