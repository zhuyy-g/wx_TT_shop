//index.js
// 引入用来发送请求的 方法 一定要把路径补全
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
const app = getApp()

Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList: [],
    // 楼层数据
    floorList: []
  },
  // 页面开始加载 就会触发
  onLoad: function() {
    // 发送异步请求获取轮播图数据
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     console.log(result.data.message)
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   }
    // })
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },
  // 获取轮播图数据
  async getSwiperList() {
    // request({ url: "/home/swiperdata" })
    //   .then(result => {
    //     console.log(result.data.message)
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   })
    const res = await request({ url: "/home/swiperdata" })
    this.setData({
      swiperList: res
    })
  },
  // 获取分类导航数据
  async getCateList() {
    // request({ url: "/home/catitems" })
    //   .then(result => {
    //     this.setData({
    //       catesList: result.data.message
    //     })
    //   })
    const res = await request({ url: "/home/catitems" })
    this.setData({
      catesList: res
    }) 
  },
  // 获取楼层数据
  async getFloorList() {
    // request({ url: "/home/floordata" })
    // .then(result => {
    //   this.setData({
    //     floorList: result.data.message
    //   })
    // })
    const res = await request({ url: "/home/floordata" })
    res.forEach(element => {
      element.product_list.forEach(v => {
        let arr = v.navigator_url.split("?")
        v.navigator_url = arr[0] + "/goods_list" + "?" + arr[1]
      })
    });
    console.log(res)
    this.setData({
      floorList: res
    }) 
  }
})
