  import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js"
  import regeneratorRuntime from '../../lib/runtime/runtime'
  Page({
    data: {
      address:{},
      cart:[],
      totslPrice:0,
      totalNum:0
    },
    onShow(){
      // 1 获取缓存中的收货地址信息
      const address = wx.getStorageSync('address')
      // 获取缓存中的购物车数据
      const cart = wx.getStorageSync('cart')||[]
      // 过滤后的购物车数组
      let checkedCart = cart.filter(v=>v.checked)
      this.setData({address})
      // this.setCart(checkedCart)
      // 计算全选
      // 遍历数组的方法every 接收一个回调函数 只有当每一个回调函数的返回值都为true时 every的返回值才为true
      // const allChecked = cart.length?cart.every(v=>v.checked):false
      // 总价格 总数量
      let totalPrice = 0
      let totalNum = 0
      checkedCart.forEach(v => {
        totalPrice = v.num*v.goods_price
        totalNum += v.num
      })
      // 2 给data赋值
      this.setData({
        cart,
        totalPrice,
        totalNum
      })
      wx.setStorageSync('cart', cart)
    },
   
    // 点击结算
    handlePay() {
      console.log("支付")
    }
  })