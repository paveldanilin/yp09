const path = require('path');

module.exports = {
    entry: './src/index.js',

    mode: "development",

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ypt09.js',
        library: "ypt09",
        libraryTarget: "umd",
        umdNamedDefine: true,
        globalObject: "this"
    },

    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};