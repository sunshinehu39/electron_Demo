import { app, BrowserWindow } from 'electron'

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

// 开发模式的话走webpack-dev-server的url
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

let mainWindow

// 创建窗口
function createWindow() {

  // 创建主窗口的配置信息
  const options = {
    useContentSize: true,
    height: 563,
    width: 1000,
    minWidth: 800,  //宽最小值
    minHeight: 400, //高最小值
    // fullscreenable: true, // 是否允许全屏
    center: true, // 是否出现在屏幕居中的位置
    frame: true,  //是否显示边框、标题栏和菜单栏;默认为true
    show: true,  //隐藏页面(程序只在后台运行); 默认为true
    // backgroundColor: '#fff', // 背景色，用于transparent和frameless窗口
    titleBarStyle: 'hidden', // 标题栏的样式，有hidden、hiddenInset、customButtonsOnHover等,为hidden时隐藏系统默认的titlebar
    resizable: true, // 是否允许拉伸大小,为false时，最大化按钮会被禁用
    transparent: false, // 是否是透明窗口（仅macOS）
    vibrancy: 'ultra-dark', // 窗口模糊的样式（仅macOS）
    webPreferences: {
      nodeIntegration: true, //在网页中集成Node
      enableRemoteModule: true, // 打开remote模块
      webSecurity: false,
      backgroundThrottling: false, // 当页面被置于非激活窗口的时候是否停止动画和计时器
    }
  }

  // 针对windows平台做出不同的配置
  if (process.platform === 'win32') {
    options.show = true // 创建即展示
    options.frame = true // 创建一个frameless窗口
    options.backgroundColor = 'white' // 背景色
  }

  // 创建主窗口
  mainWindow = new BrowserWindow(options)

  var electron = require('electron')
  // 注册全局快捷键 ctrl+e  
  electron.globalShortcut.register('ctrl+e', () => {
    // 在主窗口中，加载网页 'https://jspang.com'
    mainWindow.loadURL('https://jspang.com')
  })

  // 开启devTool
  // mainWindow.webContents.openDevTools()

  // 加载窗口的URL -> 来自renderer进程的页面
  mainWindow.loadURL(winURL)
  // mainWindow.loadURL("http://106.12.123.173/#/dic")
  // mainWindow.maximize()

  // 关闭devTool
  mainWindow.webContents.closeDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// 加载自定义菜单
const menuTemplate = [{
  label: '主页',
  click() {
    // 页面跳转方式一（推荐）
    mainWindow.webContents.send('href', '/index');
    // 页面跳转方式二
    // mainWindow.loadURL(winURL+'#/index')
  }
},
{
  label: '测试页',
  submenu: [
    {
      label: '第1页',
      click() {
        mainWindow.webContents.send('href', '/page1');
      }
    },
    {
      label: '第2页',
      click() {
        mainWindow.webContents.send('href', '/page2');
      }
    }
  ]
}
];

var Menu = require('electron').Menu;
Menu.setApplicationMenu( Menu.buildFromTemplate([]));

// 当electron完成初始化后触发
app.on('ready', createWindow)

// 所有窗口都关闭的时候触发，在windows和linux里，所有窗口都退出的时候通常是应用退出的时候
app.on('window-all-closed', () => {
  // 当操作系统不是darwin（macOS）时
  if (process.platform !== 'darwin') {
    // 退出应用
    app.quit()
  }
})

// （仅macOS）当应用处于激活状态时
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
