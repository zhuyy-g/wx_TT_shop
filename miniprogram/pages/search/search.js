import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  // 输入框绑定 值改变事件 input事件
  // 获取到输入框的值
  // 合法性判断
  // 检验通过 把输入框的值 发送到后台
  // 返回的数据打印到页面上
  data: {
    goods:[],
    // 取消 按钮 是否显示
    isFocus:false,
    // 输入框的值
    inpValue:""
  },
  // 防抖的实现
  TimeId:-1,
  // 输入框的值改变 就会触发的事件
  handleInput(e) {
    // 1 获取输入框的值
    const {value} = e.detail
    // 2 检验合法性
    if (!value.trim()) {
      this.setData({
        goods:[],
        isFocus:false
      })
      return
    }
    // 3 准备发送请求 获取数据
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId)
    this.TimeId = setTimeout(() => {
      this.qsearch(value)
    },1000)
  },
   // 发送请求获取数据
  async qsearch(query) {
    const goods = await request({url:"/goods/qsearch",data:{query}})
    console.log(goods)
    this.setData({
      goods
    })
  },
  handleCancle() {
    this.setData({
      inpValue:"",
      goods:[],
      isFocus:false
    })
  }
})