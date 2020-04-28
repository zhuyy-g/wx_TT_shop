// pages/cart/cart.js
// 获取用户的收货地址
// 1 绑定点击事件
// 2 调用小程序的内置api 获取用户的收货地址 wx.chooseAdress
  // 获取用户对小程序所授予获取地址的权限状态scope
  // 1 假设 用户点击获取收货地址的提示框 确定 scope：true
  // 2 取消 scope：false
  // 3 未调用 scope: undefined

import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totslPrice:0,
    totalNum:0
  },
  onShow(){
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address')
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart')||[]
    this.setData({address})
    this.setCart(cart)
  },
  // 点击 收货地址
  async handleChooseAddress() {
    // 获取收货地址
    // wx.getSetting({
    //   success: (result) => {
    //     const scopeAddresss = result.authSetting["scope.address"]
    //     if(scopeAddresss===true||scopeAddresss===undefined) {
    //       wx.chooseAddress({
    //         success: (res) => {console.log(res)},
    //       })
    //     }else{
    //       // 用户以前拒绝过授予权限 诱导用户打开授权页面
    //       wx.openSetting({
    //         success: (res) => {
    //           // 授权成功 调用获取用户地址api
    //           wx.chooseAddress({
    //             success: (res) => {console.log(res)},
    //           })
    //         },
    //       })
    //     }
    //   }
    // })
    try {
      // 1 获取 权限状态
      const res1 = await getSetting()
      const scopeAddresss = res1.authSetting["scope.address"]
      // 2 判断 权限状态
      if(scopeAddresss===false) {
        await openSetting()
      }
      const address = await chooseAddress()
      address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo
      // 存入到缓存中
      wx.setStorageSync('address', address)
    }catch(error) {
      console.log(error)
    }
  },
  // 商品的选中
  handleItemChange(e) {
    // 1 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id
    // 2 获取购物车数组
    let { cart } = this.data
    // 找到被修改的商品对象
    let index = cart.findIndex(v=>v.goods_id===goods_id)
    // 选中状态取反
    cart[index].checked = ! cart[index].checked
    // 把购物车数据重新设置回data中和缓存
    this.setCart(cart)
  },
  // 设置购物车状态 同时重新计算底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    // 计算全选
    // 遍历数组的方法every 接收一个回调函数 只有当每一个回调函数的返回值都为true时 every的返回值才为true
    // const allChecked = cart.length?cart.every(v=>v.checked):false
    let allChecked = true
    // 总价格 总数量
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if(v.checked) {
        totalPrice = v.num*v.goods_price
        totalNum += v.num
      }else{
        allChecked = false
      }
    })
    // 判断数组是否为空
    allChecked = cart.length?allChecked:false  
    // 2 给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync('cart', cart)
  },
  // 商品全选功能
  handleItemAllChecked() {
    // 1 获取data中的数据
    let {cart,allChecked} = this.data
    // 2 修改
    allChecked = !allChecked
    // 循环修改cart数组中的商品选中状态
    cart.forEach(v=>v.checked=allChecked)
    this.setCart(cart)
  },
  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    // 获取传递过来的参数
    const {operation,id} = e.currentTarget.dataset
    // 获取购物车数组
    let {cart} = this.data
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v=>v.goods_id===id)
    // 判断是否要执行删除
    if(cart[index].num===1&&operation===-1){
      // 弹框提示
      // wx.showModal({
      //   title: '提示',
      //   content: '您是否要删除?',
      //   success: (res) => {
      //     if (res.confirm) {
      //       cart.splice(index,1)
      //       this.setCart(cart)
      //     }else if (res.cancel) {
      //       console.log("用户点击取消")
      //     }
      //   }
      // })
      const res = await showModal({content:"您是否要删除?"})
      if (res.confirm) {
        cart.splice(index,1)
        this.setCart(cart)
      }
    }else {
      // 进行修改数量的操作
      cart[index].num+=operation
      this.setCart(cart)
    }
  },
  // 点击结算
  async handlePay() {
    // 1 判断收货地址
    const {address,totalNum} = this.data
    console.log(address)
    if(!address.userName) {
      await showToast({title: '您还没有选择收货地址'})
      return
    }
    // 判断用户有没有选购商品
    if(totalNum===0) {
      await showToast({title: '您还没有选购商品'})
      return
    }
    // 跳转到 支付页面
    wx.navigateTo({
     url: '/pages/pay/pay'
    })
  }
})