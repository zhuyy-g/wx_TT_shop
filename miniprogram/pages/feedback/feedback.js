// 点击"+"触发tap点击事件
//   1 调用小程序内置的 选择图片的 api
//   2 获取到 图片的路径 数组
//   3 把图片路径 存到 data的变量中
//   4 页面根据图片数组 循环显示 自定义组件 

// 2 点击自定义图片 组件
//   1 获取被点击的元素的索引
//   2 获取data中的图片数组
//   3 根据索引 数组中删除对应的元素
//   4 把数组重新设置回data中

// 3 点击"提交"
//   1 获取文本域的内容
//   2 对这些内容 合法性验证
//   3 验证通过 用户选择的图片 上传到专门的图片的服务器 返回图片外网的链接
//   4 文本域 和 外网的链接  一起提交到服务器
//   5 清空当前页面
//   6 返回上一页
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 0,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    chooseImgs: [],
    textVal: ""
  },
  // 外网的图片的路径数组
  UpLoadImgs:[],
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const {index} = e.detail
    // 2 修改原数组
    let {tabs} = this.data
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    this.setData({
      tabs
    })
  },
  // 点击加号 选择图片
  handleChooseImg() {
    // 调用小程序内置的选择图片api
    wx.chooseImage({
      // 同时选中的图片的数量
      count: 9,
      // 图片的格式 原图 压缩
      sizeType: ['original', 'compressed'],
      success: (result) => {
        this.setData({
          // 图片数组 进行拼接
          chooseImgs: [...this.data.chooseImgs,...result.tempFilePaths]
        })
      }
    })
  },
  // 点击 自定义图片组件
  handleRemoveImg(e) {
    const {index} = e.currentTarget.dataset
    let {chooseImgs} = this.data
    chooseImgs.splice(index,1)
    this.setData({
      chooseImgs
    })
  },
  // 文本域输入的事件
  handleTextInput(e) {
    console.log(e.detail.value)
    this.setData({
      textVal: e.detail.value
    })
  },
  // 点击提交按钮触发的事件
  commit() {
    const {textVal, chooseImgs} = this.data
    if(!textVal.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      })
      return
    }
    wx.showLoading({
      title: "正在上传中",
      mask: true
    })
    // 准备上传图片 到专门的图片服务器
    // 上传文件api不支持多个文件同时上传 遍历数组 挨个上传
    if(chooseImgs.length !== 0) {
      chooseImgs.forEach((v,i) => {
        wx.uploadFile({
          // 被上传的文件的路径
          filePath: 'filePath',
          // 上传的文件的名称
          name: 'file',
          // 图片要被上传到哪里
          url: 'url',
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            console.log(result)
            let url = JSON.parse(result.data)
            this.UpLoadImgs.push(url)
            // 所有的图片都上传完了才触发
            if(i == chooseImgs-1) {
              this.setData({
                textVal:"",
                chooseImgs:[]
              })
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      })
    }else {
      wx.hideLoading()
      console.log("只是提交了文本")
      wx.navigateBack({
        delta:1
      })
    }
  }
})