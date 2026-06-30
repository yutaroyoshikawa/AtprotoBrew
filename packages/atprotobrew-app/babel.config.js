module.exports = (api) => {
	api.cache(true);

	return {
		presets: ["babel-preset-expo"],
		plugins: ["babel-plugin-react-compiler", "@lingui/babel-plugin-lingui-macro", "react-native-worklets/plugin"],
	};
};
