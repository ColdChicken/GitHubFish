// pages/explore/explore.js
const sweetFish = require("../../utils/sweetFish.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    projects: [],
    inSearching: false,
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

  // user search projects
  search: function(e) {
    var that = this
    var searchInputs = e.detail.value
    that.setData({
      inSearching: true,
    })
    that.sweetFishMgr.searchProject(searchInputs, function(projects) {
      console.log(projects)
      that.setData({
        inSearching: false,
        projects: projects,
      })
    })
  },
})