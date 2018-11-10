//app.js
const sweetFish = require("./utils/sweetFish.js")

App({
  onLaunch: function () {
    var sweetFishMgr = new sweetFish.SweetFishMgr()

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        sweetFishMgr.login(res.code, function(token) {
          console.log(`token ${token}`)
          wx.setStorageSync('token', token)
        })
      }
    })

  },
  globalData: {
    userInfo: null,
    srvUrl: "http://192.168.1.102:8888",
  }
})