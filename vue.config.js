/* eslint-disable */
const WorkerPlugin = require("worker-plugin");

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  chainWebpack: config => {
    config.plugin("worker").use(WorkerPlugin);
  }
}