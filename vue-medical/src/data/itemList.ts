export const menuItem = [
    {
      name: "首页",
      id: 1,
      url: "/home",
      icon: "HomeFilled",
    },
    {
      name: "个人中心",
      id: 2,
      url: "/user",
      icon: "UserFilled",
    },
    {
      name: "信息管理",
      id: 3,
      url: "/information",
      icon: "List",
    },
    {
      name: "邮件管理",
      id: 4,
      url: "/email",
      icon: "Comment",
    },
    {
      name: "统计分析",
      id: 5,
      url: "/analysis",
      icon: "Histogram",
    },

    {
      name: "院内导航",
      id: 6,
      url: "/map",
      icon: "LocationFilled",
    },
    {
      name: "系统设置",
      id: 7,
      url: "/setting",
      icon: "Tools",
    },
    {
      name: "测试模块",
      id: 8,
      url: "/test",
      icon: "Grid",
    },
  ]

export const activityItem = [
  {
    content: "项目更新",
    timestamp: "2024-05-07",
    type: "success",
    icon: "Check",
  },
  {
    content: "项目更新",
    timestamp: "2024-04-20",
    type: "success",
    icon: "Check",
  },
  {
    content: "项目上线",
    timestamp: "2024-03-28",
    type: "success",
    icon: "Check",
  },
  {
    content: "项目完工",
    timestamp: "2023-12-27",
    type: "success",
    icon: "Check",
  },
  {
    content: "项目启动",
    timestamp: "2023-11-23",
    type: "success",
    icon: "Check",
  },
]

export const progressItem = [
  {
    id: 1,
    title: '首页',
    implement: '水平、垂直导航栏，模块总览，个人信息，图表，轮播图，开发进度，开发日志，布局自适应',
    unimplement: '',
    icon: 'HomeFilled',
    percentage: 100,
    status:'success'
  },
  {
    id: 2,
    title: '个人中心',
    implement: '个人信息修改，头像上传，布局自适应',
    unimplement: '',
    icon: 'UserFilled',
    percentage: 100,
    status:'success'
  },
  {
    id: 3,
    title: '信息管理',
    implement: '表格封装，增删改查，分页，关键字搜索，身份验证，布局自适应',
    unimplement: '',
    icon: 'List',
    percentage: 100,
    status:'success'
  },
  {
    id: 4,
    title: '邮件管理',
    implement: '全选，取消，删除，写信发送功能，布局自适应',
    unimplement: '恢复垃圾邮件，撤回发送邮件，编辑草稿邮件，发送草稿邮件，模糊搜索邮件，标记已读未读邮件',
    icon: 'Comment',
    percentage: 50,
    status:''
  },
  {
    id: 5,
    title: '统计分析',
    implement: '全屏，下载图片，布局自适应',
    unimplement: '标题文字自适应',
    icon: 'Histogram',
    percentage: 100,
    status:'success'
  },
  {
    id: 6,
    title: '院内导航',
    implement: '切换主题，路线规划，布局自适应',
    unimplement: '',
    icon: 'LocationFilled',
    percentage: 100,
    status:'success'
  },
  {
    id: 7,
    title: '系统设置',
    implement: '权限管理',
    unimplement: '权限管理逻辑优化，系统监控',
    icon: 'Tools',
    percentage: 60,
    status:''
  },
  {
    id: 8,
    title: '登录注册',
    implement: '注册，登录，验证码，表单验证，切换过渡，路由守卫',
    unimplement: '忘记密码',
    icon: 'Promotion',
    percentage: 100,
    status:'success'
  },
  {
    id: 9,
    title: '项目结构',
    implement: 'Vue3写法，服务器结构划分',
    unimplement: '前端结构划分，接口文档编写',
    icon: 'Grid',
    percentage: 70,
    status:''
  },
]

export const emailMenuItem = [
  {
    name: "收件箱",
    id: 1,
    index: "1",
    icon: "Message",
  },
  {
    name: "未读邮件",
    id: 2,
    index: "2",
    icon: "Reading",
  },
  {
    name: "草稿箱",
    id: 3,
    index: "3",
    icon: "MessageBox",
  },
  {
    name: "已发送",
    id: 4,
    index: "4",
    icon: "Position",
  },
  {
    name: "垃圾箱",
    id: 5,
    index: "5",
    icon: "Delete",
  },
];