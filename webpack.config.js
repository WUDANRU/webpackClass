const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //引用需要使用{}
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //link(link href css)
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')


// path.resolve()/path.join()
// path.join(__dirname,'./dist')即webpack/dist
// __dirname是Nodejs全局变量
// 热模块更替(热更新/热开发)
// js不认识css,图片等，所以使用loader
// npm i style-loader css-loader -D ,保存为开发过程中的依赖
// npm i sass-loader -D   npm i node-sass -D
// 官网的指南的管理资源：加载css/图片/字体/数据可以使用loader
// 插件plugins解决loader无法解决的，比如html的形成
// 官网的插件有官方维护的插件，如热更新HMR
// npm i html-webpack-plugin -D

// "watch":"webpack --watch"是监听webpack变化，然后npm run watch,
// 然后更改index.js的console.log('hello webpack1111111')，显示原来的在浏览器控制台，这种方式只能进行热的编译不能进行热的页面刷新

//官网的指南的(HMR)模块热替换 启用HMR需要配合webpack-dev-middleware或者webpack-dev-server，webpack-dev-server可以刷新浏览器
// npm install webpack-dev-server --save-dev，然后"hot":"webpack-dev-server"和devServer:{hot:true}和const webpack=require('webpack')和
// new webpack.HotModuleReplacementPlugin(),然后npm run hot,出现Error: Cannot find module 'webpack-cli/bin/config-yargs'，
// 需要吧webpack-cli降级，然后npm uninstall webpack-cli，然后npm install webpack-cli@3 -D,然后npm run hot
// 然后终端会显示http://localhost:8080/，然后前提同时打开vscode和localhost:8080，更改template.html的body里的文字，按ctrl+s可以看到控制台console有被刷新，但浏览器页面没有正确显示需要手动刷新
// 但是更改index.js的console.log('hello webpack1111111')，显示后来正确的在浏览器控制台(原来是直接打开打包后的index.html后面npm run hot后是打开localhost:8080)
//npm run hot前需要npm run build

// 模块热替换原理(npm run hot后自动打开http://localhost:8080/)
// 前面说了， 使用 webpack-dev-server 可以实现浏览器自动加载、自动重新加载编译后的代码，这就是页面的自动刷新，
// 但这里的刷新，是页面整体的完全刷新，而模块热替换，实现的是页面模块（比如一个按钮的功能修改）的更新，而无需重新加载整个页面。

const config = {
    mode: 'development',
    entry: './src/index.js',
    optimization: { //optimization优化,minimizer最小化
        minimizer: [new TerserJSPlugin({}), new OptimizeCssAssetsPlugin({})]
    },
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, './dist')
    },
    devtool: "source-map", //作用是为了方便调试,多了.map文件(Sourcemap 构建了处理前以及处理后的代码之间的一座桥梁，方便定位生产环境中出现 bug 的位置)
    // loaders
    module: { // module单元
        rules: [{
                // test:/\.css$/,
                // use:['style-loader','css-loader'] //两个loader不要写反,写反会报错

                // 对scss文件打包
                // test:/\.(scss|sass)$/,
                // use:['style-loader','css-loader','sass-loader'] //链式操作(从后往前\!链式操作)

            },

            // 对scss文件压缩,压缩成css文件
            {
                test: /\.(scss|sass)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            //             {
            //  test: /\.(png|svg|jpg|gif)$/,
            //  use: ['file-loader']
            //             },
            {
                test: /\.js$/,
                loader: 'babel-loader' //测试，吧index.js的require改为import(es6改为es5),import('./index.scss')和import afn from './a'和afn()和.babelrc文件
            }, //用npm run build就不能用localhost:8080了，用dist/index.html文件直接在浏览器打开，看控制台的console显示a.js的内容

            // 对css文件压缩,压缩成css文件
            // {
            //     test:/\.css$/,
            //     use:[MiniCssExtractPlugin.loader,'css-loader']
            // },
        ]
    },
    devServer: {
        // contentBase: './dist', //相对目录，可以省略，默认针对打包后的目录
        hot: true,
        open: true, //npm run hot自动打开http://localhost:8080/
        // port:8090
    },
    plugins: [
        // new HtmlWebpackPlugin() //默认打包成index.html
        new HtmlWebpackPlugin({
            filename: 'index.html', //最后打包成的文件
            template: 'template.html' //当前html文件
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(), //dist下新建1.js执行npm run build，1.js会被删除
        new CopyWebpackPlugin({
            patterns: [ //patterns模式
                { from: path.join(__dirname, 'assets'), to: 'assets' }, // to: 'assets'是复制到打包文件夹dist的assets
                // { from: 'from/file.txt', to: 'to/file.txt' },
            ]
        }),

        //link(link href css) //Extract提取,chunk块
        new MiniCssExtractPlugin({ //吧css提取出来单独放在一个文件里面去引入到html里面
            filename: '[name].css',
            chunkFilename: '[id].css'
        })

    ]
}
module.exports = config

// module.exports={
//     entry:'./src/index.js'
// }