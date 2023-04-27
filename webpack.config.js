const path = require("path")
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    watch:true,
    entry: {
        index: path.resolve(__dirname, "src", "main.js")
    },
    output: {
        path: path.resolve(__dirname, "build")
    },
    module: {

        rules: [
            // ... 其它规则
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html")
        }),
        // 请确保引入这个插件！
        new VueLoaderPlugin()
    ]
}