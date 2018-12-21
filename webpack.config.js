const resolve = require("path").resolve;
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const parseUrl = require("url").parse;

const version = require("./package.json").version;

const ENV_PRODUCTION = "production";
const ENV_DEVELOPMENT = "development";

const env = process.env.NODE_ENV || ENV_PRODUCTION;
const isProd = env === ENV_PRODUCTION;

// Determine URL the plugin will be hosted
// Used to automatically determine the serviceUrl and viewUrl for the manifest.json file
let baseUrl = parseUrl(process.env.BASE_URL || "https://localhost:4000");

if (isProd && !process.env.BASE_URL) {
    console.error("Please define BASE_URL for production builds");
    process.exit(-1);
}

const src = resolve(__dirname, "src");
const dist = resolve(__dirname, "dist");

// noinspection JSUnusedGlobalSymbols
module.exports = {
    mode: (isProd) ? ENV_PRODUCTION : ENV_DEVELOPMENT,

    entry: {
        service: resolve(src, "service", "index.ts"),
        view: resolve(src, "view", "index.ts"),
    },

    output: {
        path: dist,
        publicPath: baseUrl.pathname,
        filename: "js/[name].js",
    },

    module: {
        rules: [
            {
                test: /\.tsx?/,
                exclude: /node_modules/,
                loader: "ts-loader",
            },
        ],
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },

    plugins: [
        new CleanWebpackPlugin(dist),

        new HtmlWebpackPlugin({
            title: "CTI Plugin - Service",
            filename: "service.html",
            chunks: ["vendor", "service"],
        }),

        new HtmlWebpackPlugin({
            template: resolve(src, "view", "view.html"),
            filename: "view.html",
            chunks: ["vendor", "view"],
        }),

        new CopyWebpackPlugin([
            // Auto-generate manifest
            {
                from: resolve(src, "manifest.json"),
                transform: (content) => {
                    const manifest = Object.assign(JSON.parse(content.toString()), {
                        version,
                        serviceUrl: `${baseUrl.href}service.html`,
                        viewUrl: `${baseUrl.href}view.html`,
                    });

                    return Buffer.from(JSON.stringify(manifest));
                },
            },
        ]),
    ],

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: "all",
                    name: "vendor",
                    priority: 10,
                    enforce: true,
                },
            },
        },
        nodeEnv: env,
    },

    devServer: {
        https: true,
        contentBase: dist,
        port: 4000,
    },
};
