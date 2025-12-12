// 我的收藏
export const LOCAL_STORAGE_FAVORITE_TOOL_KEY = 'favoriteTools'

// 流程图
export const LOCAL_STORAGE_LOGIC_FLOW_GRAOH_DATA_KEY = 'logicFlowGraphData'

// 代码编辑器
export const LOCAL_STORAGE_CODE_EDITOR_VALUE_KEY = 'codeEditorValue'

// 思维导图快捷键
export const MIND_MAP_SHORTCUTS = [
  {
    type: '节点操作',
    list: [
      {
        name: '插入下级节点',
        value: 'Tab'
      },
      {
        name: '插入同级节点',
        value: 'Enter'
      },
      {
        name: '插入父节点',
        value: 'Shift + Tab'
      },
      {
        name: '上移节点',
        value: 'Ctrl + ↑'
      },
      {
        name: '下移节点',
        value: 'Ctrl + ↓'
      },
      {
        name: '插入概要',
        value: 'Ctrl + S'// v0.6.8+改为Ctrl + G
      },
      {
        name: '展开/收起节点',
        value: '/'
      },
      {
        name: '删除节点',
        value: 'Delete | Backspace'
      },
      {
        name: '仅删除当前节点',
        value: 'Shift + Backspace'
      },
      {
        name: '复制节点',
        value: 'Ctrl + C'
      },
      {
        name: '剪切节点',
        value: 'Ctrl + X'
      },
      {
        name: '粘贴节点',
        value: 'Ctrl + V'
      },
      {
        name: '编辑节点',
        value: 'F2'
      },
      {
        name: '文本换行',
        value: 'Shift + Enter'
      },
      {
        name: '回退',
        value: 'Ctrl + Z'
      },
      {
        name: '前进',
        value: 'Ctrl + Y'
      },
      {
        name: '全选',
        value: 'Ctrl + A'
      },
      {
        name: '多选',
        value: '右键 / Ctrl + 左键'
      },
      {
        name: '一键整理布局',
        value: 'Ctrl + L'
      }
    ]
  },
  {
    type: '画布操作',
    list: [
      {
        name: '放大',
        value: 'Ctrl + +'
      },
      {
        name: '缩小',
        value: 'Ctrl + -'
      },
      {
        name: '放大缩小',
        value: 'Ctrl + 鼠标滚动'
      },
      {
        name: '回到根节点',
        value: 'Ctrl + Enter'
      },
      {
        name: '适应画布',
        value: 'Ctrl + i'
      }
    ]
  }
]