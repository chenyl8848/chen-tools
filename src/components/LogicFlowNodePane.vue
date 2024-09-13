<template>
  <div v-for="(item, key) in approveNodes" :key="key" class="approve-node">
    <div class="node-shape" :class="'node-' + item.type" :style="item.style" @mousedown="dragNode(item)"></div>
    <div class="node-label">{{ item.label }}</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const $props = defineProps({
  logicFlow: Object
})

const dragNode = (item) => {
  $props.logicFlow.dnd.startDrag({
    type: item.type,
    text: item.label,
  });
}

const approveNodes = [
  {
    type: 'circle',
    label: '开始',
    style: {
      width: '50px',
      height: '50px',
      borderRadius: '25px',
      border: '2px solid #FF6347',
    },
    property: {
      username: '',
      time: '',
      startTime: '',
      endTime: '',
    }
  },
  {
    type: 'rect',
    label: '任务',
    style: {
      width: '50px',
      height: '40px',
      borderRadius: '4px',
      border: '2px solid #3CB371',
    }
  },
  // {
  //   type: 'approver',
  //   label: '审批',
  //   style: {
  //     width: '50px',
  //     height: '40px',
  //     borderRadius: '4px',
  //     border: '2px solid #3CB371',
  //   }
  // },
  {
    type: 'diamond',
    label: '判断',
    style: {
      width: '40px',
      height: '40px',
      border: '2px solid #6495ED',
      transform: 'rotate(45deg)',
    }
  },
  {
    type: 'circle',
    label: '结束',
    style: {
      width: '50px',
      height: '50px',
      borderRadius: '25px',
      border: '2px solid red',
    }
  },
]
</script>

<style scoped>
.approve-node {
  display: inline-block;
  box-sizing: border-box;
  padding: 10px;
  margin: 5px;
  color: #fff;
}

.approve-node .node-shape {
  width: 64px;
  height: 64px;
  cursor: pointer;
  /* border-radius: 50%; */
  /* background-color: #1890ff; */
}

.approve-node .node-label {
  font-size: 14px;
  color: #000000;
  margin-top: 8px;
  text-align: center;
}

.node-end {
  position: relative;
}

.node-end:after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  background: red;
  top: 10px;
  left: 10px;
  cursor: pointer;
}
</style>