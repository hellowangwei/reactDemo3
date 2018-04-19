var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// webpack.config.js
var glob = require('glob');

var webpackConfig = {
    entry: {},
    output: {
        filename: '[name].js',
        path: __dirname + '/build'
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            },

        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }]
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://test.wangxiyang.com:8000',
                secure: false
            },
            '/user': {
                target: 'http://test.wangxiyang.com:8000',
                secure: false
            },
            '/api-img': {
                target: 'http://test.wangxiyang.com:8000',
                secure: false
            },
        }
    },
    plugins: [],
}

// 获取指定路径下的入口文件
function getEntries(globPath) {
    var files = glob.sync(globPath),
        entries = {};

    files.forEach(function(filepath) {
        // 取倒数第二层(view下面的文件夹)做包名
        var split = filepath.split('/');
        var name = split[split.length - 2];

        entries[name] = './' + filepath;
    });

    return entries;
}

var entries = getEntries('src/view/**/index.js');

Object.keys(entries).forEach(function(name) {
    // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
    webpackConfig.entry[name] = entries[name];

    // 每个页面生成一个html
    var plugin = new HtmlWebpackPlugin({
        // 生成出来的html文件名
        filename: name + '.html',
        // 每个html的模版，这里多个页面使用同一个模版
        template: './template.html',
        // 自动将引用插入html
        inject: true,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        chunks: [name]
    });
    webpackConfig.plugins.push(plugin);
})
module.exports = webpackConfig;