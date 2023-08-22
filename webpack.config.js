const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',

    entry: {
        main: path.resolve(__dirname, './src/index.js')
    },

    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'main.bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.(sass|scss|css)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',                    
                ]
            },
            {
                test: /\.ttf$/,
                type: 'asset/resource'
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html', 
        }),
    ], 

    devServer: {
        port: 3000,

        open: false,
        static: false,

        hot: true,
        compress: true,

        client: {
            logging: 'error',
            overlay: false
        }
    }
}