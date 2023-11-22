const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();

  return {
    ...defaultConfig,
    resolver: {
      assetExts: [...defaultConfig.resolver.assetExts, 'db'], // Adicione aqui quaisquer extensões de arquivos extras que seu projeto possa precisar
    },
    transformer: {
      babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
    },
    // Adicione outras configurações do Metro aqui, se necessário
  };
})();
