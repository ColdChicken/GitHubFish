const util = require("./util.js")

class SweetFishMgr {
  constructor() {

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
