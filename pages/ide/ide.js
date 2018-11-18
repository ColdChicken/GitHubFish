// pages/ide/ide.js
const sweetFish = require("../../utils/sweetFish.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前项目ID
    projectId: -1,
    // 项目的目录信息
    catalog: {},
    // 当前浏览的目录
    currentCatalog: [],
    // 当前浏览的目录路径
    currentCatalogPath: [],
    // catalog是否正在显示
    catalogShowing: true,
    // 当前用户打开的文件名
    fileOpened: "",
    // 当前用户打开的文件内容
    fileRawContent: "",
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
      that.setData({
        catalog: catalog.catalog,
        currentCatalogPath: [],
      })
      that.updateCurrentCatalog()
      callback()
    })
  },

  updateCurrentCatalog: function() {
    var path = this.data.currentCatalogPath
    var catalog = this.data.catalog
    for (var loc of path) {
      for (var file of catalog) {
        if (file.name == loc && file.type == "目录") {
          catalog = file.subDirs
          break
        }
      }
    }
    var currentCatalogInfo = []
    for (var file of catalog) {
      currentCatalogInfo.push({
        name: file.name,
        type: file.type
      })
    }
    this.setData({
      currentCatalog: currentCatalogInfo,
    })
  },

  closeProject: function(e) {
    var that = this
    wx.showLoading({
      title: '正在关闭项目',
    })
    that.sweetFishMgr.closeProject(that.data.projectId, function () {
      that.setData({
        projectId: -1,
      })
      wx.hideLoading()
      wx.switchTab({
        url: '/pages/project/project'
      })
    })
  },

  showCatalog: function(e) {
    this.setData({
      catalogShowing: !this.data.catalogShowing
    })
  },

  upDir: function(e) {
    wx.showLoading({
      title: '正在解析目录',
    })
    var that = this
    var path = this.data.currentCatalogPath
    if (path.length == 0) {
      wx.hideLoading()
      return
    }
    path.pop()
    that.setData({
      currentCatalogPath: path,
    })
    that.updateCurrentCatalog()
    wx.hideLoading()
  },

  clickDir: function(e) {
    wx.showLoading({
      title: '正在解析目录',
    })
    var that = this
    var dirname = e.currentTarget.dataset.dirname
    var path = this.data.currentCatalogPath
    path.push(dirname)
    that.setData({
      currentCatalogPath: path,
    })
    that.updateCurrentCatalog()
    wx.hideLoading()
  },

  clickFile: function(e) {
    var that = this
    var filename = e.currentTarget.dataset.filename
    var filepath = that.data.currentCatalogPath.join("/")
    wx.showLoading({
      title: '正在加载文件',
    })
    that.sweetFishMgr.openFile(that.data.projectId, filepath, filename, function (result) {
      that.setData({
        fileOpened: result.name,
        fileRawContent: result.rawContent,
      })
      that.showCatalog()
      wx.hideLoading()
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