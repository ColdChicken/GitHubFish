// pages/ide/ide.js
const sweetFish = require("../../utils/sweetFish.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 代码块的大小
    windowHeight: 0,
    // rpx比率
    rpxR: 1.0,
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
    // 显示的行信息
    lines: [],

    // 一行代码的高度
    lineHeight: 1.0,
    // 代码块能显示的行数
    codeDivCap: 0,
    // 全部的行
    allLines: [],
    // 默认显示多少屏幕数据
    showLinesBase: 5,

    // Y轴变动
    changeY: 0.0,
    // 当前起始屏幕
    currentBegPos: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight
        var clientWidth = res.windowWidth
        var rpxR = clientWidth / 750
        var calc = clientHeight - (82 * rpxR)
        that.data.rpxR = rpxR
        that.setData({
          windowHeight: calc
        });
        that.data.lineHeight = 40 * rpxR // 40rpx,见wxss定义的height
        that.data.codeDivCap = parseInt(calc / that.data.lineHeight)
        console.log(`屏幕总高度 ${clientHeight} px, 代码块高度 ${calc} px, rpxR ${rpxR}, 行高 ${that.data.lineHeight} px, 全屏显示行 ${that.data.codeDivCap}`)
      }
    });
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
      console.log(result)
      that.data.allLines = result.lines
      that.data.currentBegPos = 0
      that.setData({
        lines: [],
      })

      that.setData({
        fileOpened: result.name,
        fileRawContent: result.rawContent,
      })

      // 如果代码数据行数不够，则在lines后面做补全
      if (that.data.allLines.length < that.data.codeDivCap * that.data.showLinesBase) {
        var targetLength = that.data.codeDivCap * that.data.showLinesBase - that.data.allLines.length
        for (var i = 0; i < targetLength; i++) {
          that.data.allLines.push([])
        }
      } else {
        // 如果代码够了，则补全整数倍
        var targetLength = that.data.codeDivCap * (parseInt(that.data.allLines.length / that.data.showLinesBase) + 1) - that.data.allLines.length
        for (var i = 0; i < targetLength; i++) {
          that.data.allLines.push([])
        }
      }
      console.log(`每屏幕代码行数 ${that.data.codeDivCap}， 要求显示 ${that.data.showLinesBase} 屏幕, 当前总行数 ${that.data.allLines.length}`)

      that.syncShowLines()

      that.showCatalog()
      wx.hideLoading()
    })
  },

  syncShowLines: function() {
    var that = this
    var lineChange = parseInt(this.data.changeY / this.data.lineHeight)
    var pageChange = parseInt(lineChange / this.data.codeDivCap)
    // 如果变动量小于1屏幕则不做任何动作
    if (pageChange == that.data.currentBegPos && that.data.lines.length != 0) {
      return
    }
    that.data.currentBegPos = pageChange
    var endLineNum = that.data.currentBegPos + that.data.showLinesBase
    console.log(`lineChange: ${lineChange}, begPageNum: ${pageChange}, endPageNum: ${endLineNum}, codeDivCap: ${this.data.codeDivCap}`)

    this.setData({
      lines: that.data.allLines.slice(pageChange * this.data.codeDivCap, endLineNum * this.data.codeDivCap),
    })
  },

  clickToken: function(e) {
    console.log(e)
  },

  codesScroll: function(e) {
    //console.log(e)
    var deltaY = e.detail.deltaY
    this.data.changeY -= deltaY
    this.syncShowLines()
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