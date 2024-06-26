const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const path = require('path');

module.exports = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
        new WebpackManifestPlugin({
            publicPath: '',
            fileName: 'manifest.json',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(css)$/,
                use: [
                    {
                        // Adds CSS to the DOM by injecting a `<style>` tag
                        loader: 'style-loader',
                    },
                    {
                        // Interprets `@import` and `url()` like `import/require()` and will resolve them
                        loader: 'css-loader',
                    },
                ],
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash:8].js',
        clean: true,
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin({
                extractComments: false,
            }),
        ],
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                        // package names are URL-safe, but some servers don't like @ symbols
                        return `yarn.${packageName.replace('@', '')}`;
                    },
                },
            },
        },
    },
};