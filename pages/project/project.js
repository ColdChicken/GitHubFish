// pages/project/project.js
const sweetFish = require("../../utils/sweetFish.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    projects: [],
    hasProject: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.sweetFishMgr = new sweetFish.SweetFishMgr()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.syncProjects(()=>{})
  },

  syncProjects: function (callback) {
    // 加载项目信息
    var that = this
    wx.showLoading({
      title: '加载中，请稍等',
    })
    that.sweetFishMgr.listProjects(function (projects) {
      console.log(projects)
      var hasProject = false
      if (projects.length > 0 ) {
        hasProject = true
      }
      that.setData({
        projects: projects,
        hasProject: hasProject,
      })
      wx.hideLoading()
      callback()
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.syncProjects(()=>{
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 删除项目
  deleteProject: function(e) {
    var that = this
    var projectId = e.currentTarget.dataset.projectid
    wx.showLoading({
      title: '删除项目中',
    })
    that.sweetFishMgr.deleteProject(projectId, function(res) {
      wx.hideLoading()
      that.syncProjects(() => { })
    })
  },

  // 打开项目
  openProject: function(e) {
    var that = this
    var projectId = e.currentTarget.dataset.projectid
    wx.showLoading({
      title: '项目打开中',
    })
    that.sweetFishMgr.openProject(projectId, function(res){
      console.log(res)
      wx.hideLoading()
      if (res.result != "成功") {
        wx.showModal({
          title: "打开失败",
          content: res.errMsg,
          showCancel: false,
          confirmText: "关闭",
          confirmColor: "#888888",
          success(e) {
          }
        })
      } else {
        // 跳转到项目专有页面。这里使用redirectTo，保证用户返回时一定是点击了页面提供的关闭按钮返回，这样才能触发关闭项目的动作
        wx.redirectTo({
          url: `/pages/ide/ide?projectid=${projectId}`
        })
      }
      
    })
  },
})