var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCSS = new ExtractTextPlugin("[name].css");

module.exports = {
	target: "web",
	entry: path.resolve(__dirname, 'js'),
	output: {
		path: path.resolve(__dirname, '..', 'dist'),
		filename: '[name].bundle.js'
	},
	devtool: 'cheap-module-eval-source-map',
	plugins: [
		new HtmlWebpackPlugin({
			title: process.env.npm_package_description,
			template: 'src/index.html'
		}),
		new CopyWebpackPlugin([
			{ from: 'src/css' },
			{ from: 'src/assets', to: 'assets' },
			{ from: 'node_modules/@blueprintjs/core/dist/blueprint.css.map' }
		]),
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
			minChunks: function(module) {
				// prevent css from being moved from their original chunk to vendor chunk
				if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
					return false;
				}
				return module.context && module.context.indexOf("node_modules") !== -1;
			}
		}),
		extractCSS
	],
	module: {
		rules: [{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					"plugins": [ ],
					"presets": ["env", "stage-0", "react"]
				}
			},
			{
				test: /\.css$/,
				use: extractCSS.extract({
					fallback: 'style-loader',
					use: ['css-loader?sourceMap=true']
				})
			},
			{
				test: /\.(eot|ttf|woff|woff2)$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'resources/[hash].[ext]'
				}
			}
		]
	}
};
