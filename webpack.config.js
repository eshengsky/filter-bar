const webpack = require('webpack');
module.exports = {
    watch: true,

    // 页面入口
    entry: {
        build: ['./src/code.js', './src/code.css'],
        'build.min': ['./src/code.js', './src/code.css']
    },

    // 出口文件输出配置
    output: {
        filename: './dist/[name].js'
    },

    // source map 支持
    // devtool: 'source-map',
    plugins: [
        // debug下不开启混淆压缩
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ],

    // 加载器
    module: {
        preLoaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader?presets[]=es2015'
        }],
        loaders: [{
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /.*\.(png|jpg|jpe?g|ico|gif|svg)$/i,
            loaders: [
                'image-webpack?{progressive:true, optimizationLevel: 3, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
                'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
            ]
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
