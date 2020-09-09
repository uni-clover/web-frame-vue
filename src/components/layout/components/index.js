/**
 * 实现按需导入
 * @author wangqian
 */

const { camelCase, upperFirst } = require('lodash')
// 当前目录下
const currentFiles = require.context('./', false, /\.vue$/)
// 递归下级目录
const recursiveFiles = require.context('./', true, /\/index\.vue$/)
let allModules = {};
[currentFiles, recursiveFiles].forEach(files => {
  files.keys().reduce((modules, modulePath) => {
    let name = modulePath.replace(/^.*\/([^/]+)\.\w+$/, '$1')
    if (name === 'index') {
      name = modulePath.replace(/^.*\/([^/]+)\/index\.\w+$/, '$1')
    }
    name = upperFirst(camelCase(name))
    modules[name] = files(modulePath).default
    return modules
  }, allModules)
})

module.exports = allModules
