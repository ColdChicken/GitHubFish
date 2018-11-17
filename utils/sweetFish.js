const util = require("./util.js")

class SweetFishMgr {
  constructor() {

  }

  // 登陆
  login(code, callback) {
    console.log(`开始用户登陆，code: ${code}`)
    util.request("/v1/tp/auth/login", // URL
      "POST", // METHOD
      {
        code: code,
      }, // DATA
      false, // AUTH
      function (res) {
        callback(res)
      }) // SUCCESS
  }

  // 列出当前用户的项目
  listProjects(callback) {
    console.log("开始获取当前用户的项目")
    util.request("/v1/tp/project/list", // URL
      "POST", // METHOD
      {}, // DATA
      true, // AUTH
      function (res) {
        // 翻译状态
        for (var project of res) {
          if (project.status == "正常") {
            project.status = "状态: 正常"
          } else if (project.status == "失败") {
            project.status = "状态: 异常，请删除重建"
          } else {
            project.status = "状态: 加载中"
          }
        }
        callback(res)
      }) // SUCCESS
  }

  // 创建项目
  createProject(projectId, callback) {
    console.log(`开始创建项目, projectId: ${projectId}`)
    util.request("/v1/tp/project/create", // URL
      "POST", // METHOD
      {
        projectId: projectId,
      }, // DATA
      true, // AUTH
      function (res) {
        callback(res)
      }) // SUCCESS
  }

  // 打开项目
  openProject(projectId, callback) {
    console.log(`开始打开项目, projectId: ${projectId}`)
    util.request("/v1/tp/project/open", // URL
      "POST", // METHOD
      {
        projectId: projectId,
      }, // DATA
      true, // AUTH
      function (res) {
        callback(res)
      }) // SUCCESS
  }

  // 关闭项目
  closeProject(projectId, callback) {
    console.log(`开始关闭项目, projectId: ${projectId}`)
    util.request("/v1/tp/project/close", // URL
      "POST", // METHOD
      {
        projectId: projectId,
      }, // DATA
      true, // AUTH
      function (res) {
        callback(res)
      }) // SUCCESS
  }

  // 打开项目
  listProjectCatalog(projectId, callback) {
    console.log(`开始列出项目目录, projectId: ${projectId}`)
    util.request("/v1/tp/project/listcatalog", // URL
      "POST", // METHOD
      {
        projectId: projectId,
      }, // DATA
      true, // AUTH
      function (res) {
        callback(res)
      }) // SUCCESS
  }

  // 搜索项目。inputs为关键字
  searchProject(inputs, callback) {
    console.log(`开始搜索项目，搜索关键字 ${inputs}`)
    util.request("/v1/tp/github/search", // URL
      "POST", // METHOD
      {
        inputs: inputs,
      }, // DATA
      false, // AUTH
      function (res) {
        callback(res)
      }) // SUCCESS
  }
}

module.exports.SweetFishMgr = SweetFishMgr
