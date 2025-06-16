# 刮刮乐游戏 (Scratch Card Game)

一个用C# ASP.NET Core和HTML5 Canvas开发的Web版刮刮乐游戏，具有真实的刮奖体验。

## 功能特点

- 🎨 **真实刮奖体验**: 用鼠标拖拽刮开银色涂层，支持触摸设备
- 🎁 **多种奖品**: 包含一等奖、二等奖、三等奖等8种不同奖品
- ✨ **精美界面**: 渐变背景、装饰星星、动画效果
- 📊 **进度显示**: 实时显示刮开进度，达到30%自动揭晓
- 🔄 **重新开始**: 点击按钮可以重新生成新的刮刮卡
- 🎯 **随机奖品**: 每次重新开始都会随机生成不同的奖品和颜色
- 🎉 **庆祝动画**: 揭晓奖品时播放彩带动画效果
- 📱 **响应式设计**: 支持桌面和移动设备

## 系统要求

- .NET 6.0 或更高版本
- 现代Web浏览器（支持HTML5 Canvas）
- Visual Studio 2022 或 .NET CLI

## 运行方法

### 方法1: 使用 .NET CLI
```bash
# 进入项目目录
cd ScratchCardGame

# 运行项目
dotnet run
```

### 方法2: 使用 Visual Studio
1. 用 Visual Studio 打开 `ScratchCardGame.csproj` 文件
2. 按 F5 或点击"开始调试"按钮运行

### 访问游戏
运行后在浏览器中访问: `http://localhost:12000`

## 游戏玩法

1. 启动游戏后，你会看到一个银色的刮刮卡
2. 用鼠标左键按住并拖拽来刮开涂层
3. 刮开后可以看到隐藏的奖品
4. 点击"重新开始"按钮可以生成新的刮刮卡

## 项目结构

```
ScratchCardGame/
├── Controllers/
│   └── HomeController.cs       # 主控制器，处理奖品逻辑
├── Models/
│   └── PrizeResult.cs         # 奖品结果模型
├── Views/
│   ├── Home/
│   │   └── Index.cshtml       # 主页面视图
│   ├── Shared/
│   │   └── _Layout.cshtml     # 布局模板
│   └── _ViewStart.cshtml      # 视图启动配置
├── wwwroot/
│   ├── css/
│   │   └── site.css           # 样式文件
│   └── js/
│       └── scratch-card.js    # 刮刮卡JavaScript逻辑
├── Program.cs                 # 程序入口点
├── ScratchCardGame.csproj     # 项目文件
└── README.md                  # 说明文档
```

## 技术实现

- **ASP.NET Core MVC**: Web应用程序框架
- **HTML5 Canvas**: 用于绘制刮刮卡界面和实现刮除效果
- **JavaScript**: 处理用户交互和动画效果
- **CSS3**: 现代样式设计，包括渐变、动画和响应式布局
- **AJAX**: 异步获取奖品数据
- **图层合成**: 使用Canvas的globalCompositeOperation实现刮除效果

## 主要特性

### 视觉效果
- 渐变背景色和纹理效果
- 装饰星星和圆点图案
- 文字阴影和动画效果
- 金色边框装饰
- 彩带庆祝动画

### 交互体验
- 鼠标拖拽刮奖（支持触摸）
- 实时刮除反馈和进度显示
- 平滑的刮除轨迹
- 自动揭晓功能
- 响应式设计适配移动设备

### 奖品系统
- 8种不同奖品等级
- 随机奖品生成算法
- 不同奖品对应不同颜色主题
- 服务端奖品逻辑处理

## 扩展建议

可以考虑添加以下功能：
- 音效支持
- 动画效果
- 奖品概率设置
- 历史记录
- 更多奖品类型
- 网络排行榜

## 许可证

本项目仅供学习和娱乐使用。