"use strict";

import Vue from "vue";

// name 子系统名称
// url 子系统使用的环境变量（请求地址）
const subList = [
  {
    name: "API_LIST_LOGIN",
    url: "VUE_APP_LOGIN_URL"
  },
  {
    name: "API_LIST_USER",
    url: "VUE_APP_BASE_URL"
  },
  {
    name: "API_LIST_FILE",
    url: "VUE_APP_BASE_URL"
  }
];

// 所有api子系统
let API_LIST = {};
const moduleFiles = require.context("./modules", true, /\.js$/);
moduleFiles.keys().forEach(modulePath => {
  API_LIST = { ...API_LIST, ...moduleFiles(modulePath).default };
});

// 合成API地址集合
let apiList = {};
subList.forEach(it => {
  let subApi = Object.entries(API_LIST[it.name]).reduce((target, [key, value]) => {
    target[key] =
      process.env[it.url].replace(/\W*$/, "") + "/" + value.replace(/^\W*/, "");
    return target;
  }, {});
  apiList = { ...apiList, ...subApi };
});

// 注册所有API地址
Object.defineProperty(Vue.prototype, "$_API", {
  get() {
    return apiList;
  }
});
export default apiList;
