// const webpack = require('webpack')
const path = require('path')

// const DeclarationBundlerPlugin = require('./declaration-bundler-webpack-plugin.fix')
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
// const TerserPlugin = require("terser-webpack-plugin");


module.exports = {
    target: "web",
    entry: {
        mylib: path.resolve(__dirname, 'src/ts/index.ts'),
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            // '@lib': path.resolve(__dirname, "../../../../../../lib")
            '@lib/helpers': path.resolve("d:/code/lib/helpers"),
            '@lib/ts-test': path.resolve("d:/code/lib/ts-test"),
            '@lib/ts-table': path.resolve("d:/code/lib/ts-table"),
            '@lib/ts-options': path.resolve("d:/code/lib/ts-options"),
        }
    },
    output: {
        publicPath: "static",
        path: path.resolve(__dirname, 'src/server/static/'),
        chunkFilename: 'bundle.js',
        filename: 'bundle.js'
    },

    mode: 'development',
    // watch: true,
    // plugins: [
    //     // new TerserPlugin(),
    //     new DeclarationBundlerPlugin({
    //         moduleName: '"mylib"',
    //         out: '@types/index.d.ts'
    //     })
    // ],
    devtool: 'source-map',
    optimization: {
        // splitChunks: {
        //     cacheGroups: {
        //         vendors: {
        //             priority: -10,
        //             test: /[\\/]node_modules[\\/]/
        //         }
        //     },

        //     chunks: 'async',
        //     minChunks: 1,
        //     minSize: 30000,
        //     name: true
        // }
    }
}