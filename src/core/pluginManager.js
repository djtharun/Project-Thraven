const plugins = [];

export function registerPlugin(plugin) {
  plugins.push(plugin);
}

export function getPlugins() {
  return plugins;
}