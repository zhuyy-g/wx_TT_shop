// pages/order/order.js
// 页面打开的时候 onShow (不同于onLoad 无法在形参接收options参数)
// 获取url上的参数type
// 根据type 发送请求获取订单数据
// 渲染页面
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ]
  },
  onShow() {
    // const token = wx.getStorageSync('token')
    // if(!token) {
    //   wx.navigateTo({
    //     url: '/pages/auth/auth',
    //   })
    //   return
    // }
    // 获取当前小程序的页面栈数组 （长度最大为10）
    let pages = getCurrentPages()
    let currentPage = pages[pages.length-1]
    // 获取url上的type参数
    const {type} = currentPage.options
    this.changeTitleByIndex(type-1)
    // 激活选中页面标题 当type = 1 index = 0
    this.getOrders(type)
  },
  async getOrders(type) {
    const res = await request({url:"/my/orders/all",data:{type}})
    this.setData({
      orders:res.orders
    })
  },
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const {index} = e.detail    
    this.changeTitleByIndex(index)
  },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
     // 2 修改原数组
     let {tabs} = this.data
     tabs.forEach((v,i) => i===index ? v.isActive = true : v.isActive = false)
     // 赋值到data中
     this.setData({
       tabs
     })
  }
})