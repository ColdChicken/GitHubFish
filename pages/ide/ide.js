// pages/ide/ide.js
const sweetFish = require("../../utils/sweetFish.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectId: -1,
    catalog: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      projectId: parseInt(options.projectid)
    })
    this.sweetFishMgr = new sweetFish.SweetFishMgr()
    wx.showLoading({
      title: '正在加载项目',
    })
    this.loadCatalogs(()=>{
      wx.hideLoading()
    })
  },

  loadCatalogs: function(callback) {
    var that = this
    that.sweetFishMgr.listProjectCatalog(that.data.projectId, function (catalog) {
      console.log(catalog)
      that.setData({
        catalog: catalog,
      })
      callback()
    })
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
    var that = this
    that.sweetFishMgr.closeProject(that.data.projectId, ()=>{
      
    })
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

  }
})