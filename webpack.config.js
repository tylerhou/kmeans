var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlPlugin = require('html-webpack-plugin');

var config = {
    /* Entry points define modules or sets of modules. Each entry point
    is bundled into a separate file as specified by the output config
    object below. */
    entry: './index.js',
    /* Output defines where bundled objects are compiled to.
           path: the directory from the root.
           filename: the resulting filename. [name] refers to the key
               objects within the entry object. [chunkhash] refers to
               the hash of the contents of the resulting file, for
               caching purposes */
    output: {
        path: 'dist',
        filename: 'js/[name].[chunkhash].js'
    },
    module: {
        /* Loaders define how files are processed by webpack. Files
        which either match the test string or regex which also do
        not match the exclude string or regex are processed by
        loaders defined in either the loader or loaders key in
        each object. Loaders are processed from right to left,
        analagous to matrix multiplication or evalution of
        mathematical functions (e.g. f(g(x)) -> g first, then f).
        See the webpack documentation for more detail. */
        loaders: [
        {
            // Transpiles ES2015 to browser supported JavaScript.
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
              presets: ['es2015', 'stage-2']
            }
        },
        {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style', 'css')
        },
        {
            test: /\.jpg$|\.jpeg$|\.png$/,
            loader: 'url-loader?limit=8192&name=/assets/[name].[hash].[ext]'
        },
      ]
    },
    /* Plugins do additional transformations to the compilation.

    CommonsChunkPlugin extracts from all .js and .css files common
    requirements, which are separately stored and cached. This
    prevents redownload of shared dependencies.

    ExtractTextPlugin extracts .css files from being inlined in
    the compiled JavaScript code. Instead it bundles all required
    css inside a separate css file, which is loaded into the
    generated HTML through a stylesheet tag.

    CleanPlugin cleans the compile directory before each build. */
    plugins: [
        new ExtractTextPlugin("css/[name].[chunkhash].css", {allChunks: true}),
        new HtmlPlugin({chunks: ['vendor', 'main'], template: 'index.ejs'})
    ],

    devServer: {
      historyApiFallback: true
    }
};

module.exports = config;
