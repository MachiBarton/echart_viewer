import { useState, useCallback, useRef, useEffect } from 'react';
import { Layout, Tabs, Button, message, Tooltip } from 'antd';
import { Editor } from '@monaco-editor/react';
import ReactECharts from 'echarts-for-react';
import { debounce } from 'lodash';
import * as echarts from 'echarts';
import {
  CopyOutlined,
  ReloadOutlined,
  PictureOutlined,
} from '@ant-design/icons';

const { Content } = Layout;


// 默认示例代码
const defaultCode = `// myChart 是当前图表实例，可以直接调用 ECharts 的实例方法
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

function App() {
  const [code, setCode] = useState(defaultCode);
  const echartsRef = useRef(null);

  const debouncedRunCode = useRef(
    debounce((codeToRun) => {
      try {
        const myChart = echartsRef.current?.getEchartsInstance();
        if (!myChart) {
          throw new Error('图表实例未初始化');
        }

        const runCode = new Function('myChart', 'echarts', codeToRun);
        runCode(myChart, echarts);
      } catch (error) {
        message.error(`代码执行错误: ${error.message}`);
      }
    }, 300)
  ).current;

  const handleEditorChange = useCallback((value) => {
    setCode(value);
    debouncedRunCode(value);
  }, []);

  const handleRerun = useCallback(() => {
    debouncedRunCode(code);
    message.success('代码已重新运行');
  }, [code]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      message.success('代码已复制到剪贴板');
    });
  }, [code]);

  const handleSaveImage = useCallback(() => {
    try {
      const myChart = echartsRef.current?.getEchartsInstance();
      if (!myChart) {
        throw new Error('图表实例未初始化');
      }

      const url = myChart.getDataURL({
        type: 'jpeg',
        pixelRatio: 2,
        backgroundColor: '#fff'
      });

      const link = document.createElement('a');
      link.download = `echarts-${new Date().getTime()}.jpg`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success('图片已保存');
    } catch (error) {
      message.error('保存图片失败：' + error.message);
    }
  }, []);

  useEffect(() => {
    // 初始运行代码
    debouncedRunCode(defaultCode);
    
    return () => {
      debouncedRunCode.cancel();
    };
  }, []);

  return (
    <Layout style={{ height: '100vh', background: '#fff' }}>
      <div style={{ 
        padding: '12px 20px', 
        borderBottom: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0,color: '#000' }} title="ECharts 沙盒">ECharts 沙盒</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Tooltip title="重新运行">
            <Button icon={<ReloadOutlined />} onClick={handleRerun} />
          </Tooltip>
          <Tooltip title="复制代码">
            <Button icon={<CopyOutlined />} onClick={handleCopyCode} />
          </Tooltip>
          <Tooltip title="保存为图片">
            <Button icon={<PictureOutlined />} onClick={handleSaveImage} />
          </Tooltip>
        </div>
      </div>
      <Content style={{ display: 'flex', height: 'calc(100vh - 57px)' }}>
        <div style={{ width: '50%', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
          <Tabs 
            defaultActiveKey="code" 
            style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
            tabBarStyle={{
              margin: 0,
              padding: '0 16px',
              background: '#f5f5f5',
              borderBottom: '1px solid #ddd'
            }}
            items={[
              {
                key: 'code',
                label: '代码编辑',
                children: (
                  <div style={{ 
                    flex: 1, 
                    height: 'calc(100vh - 110px)',
                    position: 'relative'
                  }}>
                    <Editor
                      height="100%"
                      defaultLanguage="javascript"
                      value={code}
                      onChange={handleEditorChange}
                      theme="light"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 10 }
                      }}
                    />
                  </div>
                ),
              }
            ]}
          />
        </div>
        <div style={{ flex: 1, padding: '20px' }}>
          <ReactECharts
            ref={echartsRef}
            option={{}}
            style={{ height: '100%' }}
          />
        </div>
      </Content>
    </Layout>
  );
}

export default App;
