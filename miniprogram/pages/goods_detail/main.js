import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
// 商品收藏
// 1 页面onShow的时候 加载缓存中商品收藏的数据
// 2 判断当前商品是不是被收藏
//   1 是 改变页面的图标
//   2 不是
// 3 点击商品收藏按钮
//   1 判断该商品是否存在于缓存数组中
//   2 已经存在 删除商品
//   3 不存在 将商品加入收藏数组中 存入到缓存中
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollect: false
  },

  // 商品对象
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id} = options
    this.getGoodsDetail(goods_id)
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({url:"/goods/detail",data:{goods_id}})
    this.GoodsInfo=goodsObj
    // 获取缓存中商品收藏的数组
    let collect = wx.getStorageSync('collect') || []
    // 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id===this.GoodsInfo.goods_id)
    this.setData({
      goodsObj: {
        // 以下是为了处理接口返回数据有没有用到的部分，造成前台页面的冗余
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone部分手机 不支持webp图片格式
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  },

  // 点击轮播图 放大预览
  handlePreviewImage(e) {
    // 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid)
    // 接收传递过来的图片url
    const current = e.currentTarget.dataset
    // 接收传递过来的图片url
    wx.previewImage({
      current,
      urls
    })
  },

  // 点击 加入购物车
  handleCartAdd() {
    // 1 获取缓存中的购物车数组(用以下方法初始化一个购物车数组)
    let cart = wx.getStorageSync('cart')||[]
    // 2 判断 商品对象是否存在于购物车数组中
    let index = cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id)
    if(index===-1){
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    }else {
      cart[index].num++
    }
    // 把购物车重新加回缓存中
    wx.setStorageSync('cart', cart)
    // 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // 防止用户多次点击按钮
      mask: true
    })
  },

  // 点击商品收藏图标
  handleCollect() {
    let isCollect = false
    // 1 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect')||[]
    // 判断该商品是否被收藏过
    let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id)
    // 当index!==-1 表示已经收藏过
    if(index !== -1) {
      // 能找到 已经收藏过了 在数组中删除该商品
      collect.splice(index, 1)
      isCollect = false
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      })
    }else {
      collect.push(this.GoodsInfo)
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      })
    }
    wx.setStorageSync('collect', collect)
    this.setData({
      isCollect
    })
  }
})