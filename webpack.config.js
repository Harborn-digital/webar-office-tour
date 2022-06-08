/**
 * Webpack configuration.
 */

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production';

// JS Directory path.
const JS_DIR = path.resolve(__dirname, 'src');
const BUILD_DIR = path.resolve(__dirname, 'dist');

module.exports = {
    mode: 'development',
}

const entry = {
    main: JS_DIR + '/index.js',
    secondary: JS_DIR + '/ar_logic.js',
};

const output = {
    path: BUILD_DIR,
    filename: '[name][contenthash].js',
    chunkFilename: '[id]-[chunkhash].js',
    clean: true,
};

/**
 * Note: argv.mode will return 'development' or 'production'.
 */
const plugins = (argv) => [
    new CleanWebpackPlugin({
        cleanStaleWebpackAssets: (argv.mode === 'production') // Automatically remove all unused webpack assets on rebuild, when set to true in production. ( https://www.npmjs.com/package/clean-webpack-plugin#options-and-defaults-optional )
    }),
    //    new MiniCssExtractPlugin({
    //      filename: devMode ? 'css/[name].css' : 'css/[name].[contenthash].css',
    //    }),
    new WebpackAssetsManifest(),
];

const rules = [
    {
        test: /\.js$/,
        include: [JS_DIR],
        exclude: /node_modules/,
        use: 'babel-loader'
    },
    {
        test: /\.scss$/,
        use: [
            'style-loader',
            'css-loader',
            // 'postcss-loader',
            'sass-loader',

        ]
    },
    {
        test: /textures.*\.(png|jpg|svg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        // generator: {
        //     filename: 'assets/images/[name].[hash][ext][query]'
        // }
        generator: {
            filename: '[name][ext]',
            outputPath: 'textures/'
        },
    },
    {
        test: /\.(png|jpg|svg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        // generator: {
        //     filename: 'assets/images/[name].[hash][ext][query]'
        // }
    },
    {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
            filename: 'assets/fonts/[name].[hash][ext][query]'
        }
    },
    // {
    //     test: /\.(gltf|bin|)$/,
    //     loader: 'file-loader',
    //     options: {
    //         esModule: false
    //     }
    // },
    {
        test: /\.(gltf|bin|dat|patt|)$/,
        type: 'asset/resource',
        generator: {
            filename: '[name][ext]',
        }
    },
    // {
    //     test: /\.bin$/,
    //     use: [
    //         {
    //             loader: 'url-loader',
    //             options: {
    //                 encoding: false,
    //                 mimetype: false,
    //                 generator: (content) => {
    //                     return content;
    //                 }
    //             },
    //         },
    //     ],
    // },
];

/**
 * Since you may have to disambiguate in your webpack.config.js between development and production builds,
 * you can export a function from your webpack configuration instead of exporting an object
 *
 * @param {string} env environment ( See the environment options CLI documentation for syntax examples. https://webpack.js.org/api/cli/#environment-options )
 * @param argv options map ( This describes the options passed to webpack, with keys such as output-filename and optimize-minimize )
 * @return {{output: *, devtool: string, entry: *, optimization: {minimizer: [*, *]}, plugins: *, module: {rules: *}, externals: {jquery: string}}}
 *
 * @see https://webpack.js.org/configuration/configuration-types/#exporting-a-function
 */
module.exports = (env, argv) => ({
    mode: 'development',
    entry: entry,
    output: output,
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist')
        },
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    /**
      * A full SourceMap is emitted as a separate file ( e.g.  main.js.map )
      * It adds a reference comment to the bundle so development tools know where to find it.
      * set this to false if you don't need it
      */
    devtool: 'source-map',
    module: {
        rules: rules,
    },
    optimization: {
        minimize: true,
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            `...`,
            new CssMinimizerPlugin(),
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Harborn AR Office Tour',
            filename: 'index.html',
            template: 'template.html',
            chunks: ['main']
        }),
        new HtmlWebpackPlugin({
            title: 'AR Component in Harborn WebAR',
            filename: 'ar.html',
            template: 'ar_template.html',
            chunks: ['secondary']
        }),
    ]
});