const request = (url, method = "GET", data = {}, auth = false, success = undefined) => {
  const app = getApp()
  const requestUrl = `${app.globalData.srvUrl}${url}`
  console.log(`发送 ${method} 请求到 ${requestUrl}， 认证 ${auth}， 请求报文 ${JSON.stringify(data)}`)
  wx.request({
    url: requestUrl,
    method: method,
    data: JSON.stringify(data),
    fail: function (res) {
      console.log("请求出错")
      console.log(res)
      wx.showModal({
        title: '获取数据异常',
        content: '抱歉，此次操作获取数据出现异常状况，请刷新或点击后退按钮后重新打开此页面。',
      })
      return
    },
    success: function (res) {
      if (res.statusCode != 200) {
        console.log("请求出错，返回码: " + res.statusCode + " 报错信息: ")
        console.log(res.data)
        wx.showModal({
          title: '获取数据异常',
          content: '抱歉，此次操作获取数据出现异常状况，请刷新或点击后退按钮后重新打开此页面。',
        })
        return
      }
      if (success) {
        success(res.data)
      }
    }
  })
}

module.exports = {
  request: request
}
