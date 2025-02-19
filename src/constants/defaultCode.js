export const defaultCode = `// myChart 是当前图表实例，可以直接调用 ECharts 的实例方法
// echarts 是 ECharts 库的引用，可以访问其所有静态方法和对象

// 创建图表配置项
var option = {
  // 标题配置
  title: {
    text: 'ECharts 示例',
    subtext: '演示 myChart 和 echarts 的使用'
  },
  // 提示框配置
  tooltip: {
    trigger: 'axis'
  },
  // X轴配置
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  // Y轴配置
  yAxis: {
    type: 'value'
  },
  // 系列列表
  series: [{
    data: [120, 200, 150, 80, 70, 110, 130],
    type: 'bar',
    showBackground: true,
    backgroundStyle: {
      color: 'rgba(180, 180, 180, 0.2)'
    }
  }]
};

// 使用 setOption 设置图表配置
myChart.setOption(option);

// 示例：使用 myChart 添加点击事件监听
myChart.on('click', function(params) {
  // params 包含了点击位置的数据信息
  console.log('点击了数据：', params.data);
});

// 示例：使用 echarts 的内置颜色主题
console.log('内置颜色主题：', echarts.color);

/* 
更多 myChart 实例方法：
- myChart.setOption(option): 设置图表配置项
- myChart.resize(): 重置图表大小
- myChart.showLoading(): 显示加载动画
- myChart.hideLoading(): 隐藏加载动画
- myChart.clear(): 清空图表内容
- myChart.getDataURL(): 获取图表的图片URL

更多 echarts 全局方法：
- echarts.init(dom): 初始化图表
- echarts.registerTheme(): 注册主题
- echarts.registerMap(): 注册地图数据
- echarts.connect(): 关联多个图表
*/
`; 