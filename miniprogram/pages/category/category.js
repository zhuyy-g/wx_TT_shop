// pages/category/category.js
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    // 左侧的菜单数据
    leftMenuList:[],
    // 右侧的商品数据
    rightContent:[],
    // 被点击的左侧菜单
    currentIndex:0,
    // 右侧内容的滚动条距离顶部的位置
    scrollTop:0
  },

  // 接口的返回数据
  Cates:[],

  onLoad() {
    // 1 先判断本地存储中有没有旧的数据
    // 2 没有旧数据 直接发送新请求
    // 3 有旧的数据 同时 旧的数据没有过期 就使用本地存储中的旧数据
    const Cates = wx.getStorageSync("cates")                            
    // 判断
    if(!Cates) {
      // 不存在 发送请求获取数据
      this.getCates()
    }else {
      // 有旧的数据 定义过期时间10s
      if(Date.now() - Cates.time > 1000*10) {
        // 重新发送请求
        this.getCates()
      }else {
        this.Cates = Cates.data
        // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(v=>v.cat_name)
        // 构造右侧的商品数据
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

  // 获取分类数据
  async getCates() {
    // request({url: "/categories"})
    //   .then(res => {
    //     this.Cates = res.data.message
    //     console.log(this.Cates)
    //     // 把接口的数据存入到本地存储中
    //     wx.setStorageSync('cates', {time: Date.now(),data:this.Cates})
    //     // 构造左侧的大菜单数据
    //     let leftMenuList = this.Cates.map(v=>v.cat_name)
    //     // 构造右侧的商品数据
    //     let rightContent = this.Cates[0].children
    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     })
    //   })
    const res = await request({ url: "/categories" })
    this.Cates = res
    // 把接口的数据存入到本地存储中
    wx.setStorageSync('cates', {time: Date.now(),data:this.Cates})
    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v=>v.cat_name)
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  // 左侧菜单的点击事件
  handleItemTap(e) {
    // 1 获取被点击的标题身上的索引
    // 2 给data中currentIndex赋值就可以了
    // 3 根据不同的索引渲染右侧的商品内容
    const { index } = e.currentTarget.dataset
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置 右侧内容的scroll-view距离顶部的距离
      scrollTop:0
    })
  }
})