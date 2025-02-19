import { Editor } from '@monaco-editor/react';

/**
 * 代码编辑器组件
 * 基于 Monaco Editor 实现的代码编辑器
 * 
 * @param {Object} props
 * @param {string} props.code - 编辑器当前代码
 * @param {Function} props.onChange - 代码变更回调函数
 */
// eslint-disable-next-line react/prop-types
function CodeEditor({ code, onChange }) {
  return (
    <div style={{ 
      flex: 1, 
      height: 'calc(100vh - 110px)',
      position: 'relative'
    }}>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={code}
        onChange={onChange}
        theme="light"
        options={{
          minimap: { enabled: false }, // 禁用小地图
          fontSize: 14,
          scrollBeyondLastLine: false, // 禁止滚动超过最后一行
          automaticLayout: true, // 自动调整布局
          padding: { top: 10 }
        }}
      />
    </div>
  );
}

export default CodeEditor; 