const path = require('path');
const helpers = require('./helpers');
const webpackMerge = require('webpack-merge'); //Used to merge webpack configs
const commonConfig = require('./webpack.common.js'); //The settings that are common to prod and dev

// Webpack Plugins
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('[name].css');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// Webpack Constants
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const METADATA = webpackMerge(commonConfig.metadata, {
    host: 'localhost',
    port: 3157,
    ENV: 'development',
    HMR: true
});

// AutoPrefixer Options
const autoprefixerOptions = {
    browsers: [
        'last 2 versions',
        'iOS >= 7',
        'Android >= 4',
        'Explorer >= 10',
        'ExplorerMobile >= 11'
    ],
    cascade: false
};


// Webpack configuration
// See: http://webpack.github.io/docs/configuration.html#cli
module.exports = webpackMerge(commonConfig, {
    // Merged metadata from webpack.common.js for index.html
    // See: (custom attribute)
    metadata: METADATA,

    // Switch loaders to debug mode.
    // See: http://webpack.github.io/docs/configuration.html#debug
    debug: true,

    // Developer tool to enhance debugging
    // See: http://webpack.github.io/docs/configuration.html#devtool
    // See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
    devtool: 'cheap-module-source-map',

    // Options affecting the output of the compilation.
    // See: http://webpack.github.io/docs/configuration.html#output
    output: {
        // The output directory as absolute path (required).
        // See: http://webpack.github.io/docs/configuration.html#output-path
        path: helpers.root('dist'),

        // TODO figure out if we want this
        // The public patch for script injections (required).
        // See: http://webpack.github.io/docs/configuration.html#public-path
        publicPath: '/',

        // Specifies the name of each output file on disk.
        // IMPORTANT: You must not specify an absolute path here!
        // See: http://webpack.github.io/docs/configuration.html#output-filename
        filename: '[name].bundle.js',

        // The filename of the SourceMaps for the JavaScript files.
        // They are inside the output.path directory.
        // See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
        sourceMapFilename: '[name].map',

        // The filename of non-entry chunks as relative path
        // inside the output.path directory.
        // See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
        chunkFilename: '[id].chunk.js'
    },

    // Options affecting the normal modules.
    // See: http://webpack.github.io/docs/configuration.html#module
    module: {
        // An array of automatically applied loaders.
        // IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
        // This means they are not resolved relative to the configuration file.
        // See: http://webpack.github.io/docs/configuration.html#module-loaders
        loaders: [
            // SCSS/Sass loader support for *.scss / .sass
            // Returns file content as string
            // See: https://github.com/jtangelder/sass-loader
            {
                test: /\.scss$/,
                loader: extractCSS.extract([
                    'raw-loader',
                    `autoprefixer?${JSON.stringify(autoprefixerOptions)}`,
                    'sass-loader'
                ])
            }
        ]
    },

    plugins: [
        // Plugin: CleanWebpackPlugin
        // Description: Cleans files before building
        // See: https://github.com/johnagan/clean-webpack-plugin
        new CleanWebpackPlugin(['dist'], {
            root: path.resolve(),
            verbose: false
        }),

        // Plugin: ExtractTextPlugin
        // Description: extracts text (scss) into css files
        // See: https://github.com/webpack/extract-text-webpack-plugin
        extractCSS,

        // Plugin: DefinePlugin
        // Description: Define free variables.
        // Useful for having development builds with debug logging or adding global constants.
        // Environment helpers
        // See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
        new DefinePlugin({
            'VERSION': JSON.stringify(METADATA.version),
            'ENV': JSON.stringify(METADATA.ENV),
            'HMR': METADATA.HMR,
            'process.env': {
                'ENV': JSON.stringify(METADATA.ENV),
                'NODE_ENV': JSON.stringify(METADATA.ENV)
            }
        })
    ],

    // Static analysis linter for JavaScript advanced options configuration
    // Description: An extensible linter for the JavaScript language.
    // See: https://github.com/MoOx/eslint-loader
    eslint: {
        emitErrors: false,
        failOnHint: false,
        resourcePath: 'src'
    },

    // // Webpack Development Server configuration
    // // Description: The webpack-dev-server is a little node.js Express server.
    // // The server emits information about the compilation state to the client,
    // // which reacts to those events.
    // // See: https://webpack.github.io/docs/webpack-dev-server.html
    // devServer: {
    //     port: METADATA.port,
    //     host: METADATA.host,
    //     historyApiFallback: true,
    //     watchOptions: {
    //         aggregateTimeout: 300,
    //         poll: 1000
    //     },
    //     quiet: true,
    //     outputPath: helpers.root('dist')
    // },

    node: {
        global: 'window',
        crypto: 'empty',
        process: true,
        module: false,
        clearImmediate: false,
        setImmediate: false
    }
});