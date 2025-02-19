import ReactECharts from 'echarts-for-react';

/**
 * 图表预览组件
 * 用于显示 ECharts 图表
 * 
 * @param {Object} props
 * @param {React.RefObject} props.echartsRef - ECharts 实例的引用
 */
// eslint-disable-next-line react/prop-types
function ChartView({ echartsRef }) {
  return (
    <div style={{ flex: 1, padding: '20px' }}>
      <ReactECharts
        ref={echartsRef}
        option={{}} // 初始为空配置，会通过代码动态设置
        style={{ height: '100%' }}
      />
    </div>
  );
}

export default ChartView; 