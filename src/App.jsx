import { useState, useCallback, useRef, useEffect } from 'react';
import { Layout, Tabs, Button, message, Tooltip } from 'antd';
import { debounce } from 'lodash';
import * as echarts from 'echarts';
import {
  CopyOutlined,
  ReloadOutlined,
  PictureOutlined,
} from '@ant-design/icons';

import CodeEditor from './components/CodeEditor';
import ChartView from './components/ChartView';
import { defaultCode } from './constants/defaultCode';

const { Content } = Layout;

/**
 * ECharts 沙盒应用主组件
 * 集成了代码编辑器和图表预览功能
 */
function App() {
  // 存储当前编辑器代码
  const [code, setCode] = useState(defaultCode);
  // 存储 ECharts 实例的引用
  const echartsRef = useRef(null);

  /**
   * 防抖处理的代码执行函数
   * 将编辑器代码转换为可执行的函数并运行
   */
  const debouncedRunCode = useRef(
    debounce((codeToRun) => {
      try {
        const myChart = echartsRef.current?.getEchartsInstance();
        if (!myChart) {
          throw new Error('图表实例未初始化');
        }

        // 创建可执行函数，传入 myChart 和 echarts 实例
        const runCode = new Function('myChart', 'echarts', codeToRun);
        runCode(myChart, echarts);
      } catch (error) {
        message.error(`代码执行错误: ${error.message}`);
      }
    }, 300)
  ).current;

  /**
   * 处理编辑器内容变化
   * 更新代码状态并执行新代码
   */
  const handleEditorChange = useCallback((value) => {
    setCode(value);
    debouncedRunCode(value);
  }, []);

  /**
   * 重新执行当前代码
   */
  const handleRerun = useCallback(() => {
    debouncedRunCode(code);
    message.success('代码已重新运行');
  }, [code]);

  /**
   * 复制当前编辑器代码到剪贴板
   */
  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      message.success('代码已复制到剪贴板');
    });
  }, [code]);

  /**
   * 将当前图表保存为图片
   * 使用 ECharts 的 getDataURL 方法导出高质量图片
   */
  const handleSaveImage = useCallback(() => {
    try {
      const myChart = echartsRef.current?.getEchartsInstance();
      if (!myChart) {
        throw new Error('图表实例未初始化');
      }

      // 获取图表的 base64 图片 URL
      const url = myChart.getDataURL({
        type: 'jpeg',
        pixelRatio: 2, // 设置 2 倍分辨率
        backgroundColor: '#fff'
      });

      // 创建并触发下载
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

  /**
   * 组件挂载时执行默认代码
   * 组件卸载时取消未执行的防抖函数
   */
  useEffect(() => {
    debouncedRunCode(defaultCode);
    return () => {
      debouncedRunCode.cancel();
    };
  }, []);

  return (
    <Layout style={{ height: '100vh', background: '#fff' }}>
      {/* 顶部工具栏 */}
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
      {/* 主要内容区域 */}
      <Content style={{ display: 'flex', height: 'calc(100vh - 57px)' }}>
        {/* 左侧编辑器区域 */}
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
                children: <CodeEditor code={code} onChange={handleEditorChange} />
              }
            ]}
          />
        </div>
        {/* 右侧图表预览区域 */}
        <ChartView echartsRef={echartsRef} />
      </Content>
    </Layout>
  );
}

export default App;
