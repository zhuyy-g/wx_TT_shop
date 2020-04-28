import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    // 商品列表数据
    goods_list: []
  },

  // 接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },

  // 总页数
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options当中存储的是传到这个页面的参数
    this.QueryParams.cid = options.cid||""
    this.QueryParams.query = options.query||""
    this.getGoodsList()
  },

  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({url:"/goods/search",data:this.QueryParams})
    // 获取总条数
    const total = res.total
    // 计算总页数
    this.totalPages = Math.ceil(total/this.QueryParams.pagesize) 
    this.setData({
      // 页面显示的数据要进行商品列表的拼接
      goods_list:[...this.data.goods_list,...res.goods]
    })
    // 关闭下拉刷新的窗口（加载数据比窗口显示时间长）
    wx.stopPullDownRefresh()
  },

  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const {index} = e.detail
    // 2 修改原数组
    let {tabs} = this.data
    tabs.forEach((v,i) => i===index ? v.isActive=true:v.isActive=false)
    this.setData({
      tabs
    })
  },

  // 页面上滑 滚动条触底事件(加载下一页)
  onReachBottom() {
    // 判断还有没有下一页
    if (this.QueryParams.pagenum>=this.totalPages) {
      wx.showToast({
        title: '没有下一页数据',
      })
    }else {
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },
  
  // 下拉刷新事件
  onPullDownRefresh() {
    // 1 重置数组
    this.setData({
      goods_list:[]
    })
    // 2 重置页码
    this.QueryParams.pagenum = 1
    // 3 发送请求
    this.getGoodsList()
  }
})