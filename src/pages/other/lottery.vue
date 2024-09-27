<template>
    <a-card>
        <p class="title">抽奖</p>
        <div class="lotteryContainer">
            <div class="left">
                <a-form :model="lotteryForm">
                    <a-form-item label="类型">
                        <a-radio-group v-model:value="lotteryForm.type">
                            <a-radio value="LuckyWheel">大转盘</a-radio>
                            <a-radio value="LuckyGrid">九宫格</a-radio>
                            <a-radio value="SlotMachine">老虎机</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="大小">
                        <a-slider v-model:value="lotteryForm.size" :tooltip-open="false" />
                    </a-form-item>
                    <a-collapse v-model:activeKey="activeKey" ghost>
                        <a-collapse-panel key="1" header="背景">
                            <a-form-item label="页边距">
                                <a-slider v-model:value="paddingSize" :tooltip-open="false" :min="1" :max="100" />
                                <!-- <a-input-number id="inputNumber" v-model:value="paddingSize"
                                            :min="1" :max="100" addon-after="px" />  -->

                            </a-form-item>

                            {{ lotteryForm.blocks }}
                        </a-collapse-panel>
                        <a-collapse-panel key="2" header="奖品">
                        </a-collapse-panel>
                        <a-collapse-panel key="3" header="抽奖按钮">
                        </a-collapse-panel>
                    </a-collapse>
                    <a-form-item label="Instant delivery">
                        <a-switch v-model:checked="lotteryForm.delivery" />
                    </a-form-item>
                    <a-form-item label="Instant delivery">
                        <a-switch v-model:checked="lotteryForm.delivery" />
                    </a-form-item>
                    <a-form-item label="Instant delivery">
                        <a-switch v-model:checked="lotteryForm.delivery" />
                    </a-form-item>
                    <a-form-item label="Instant delivery">
                        <a-switch v-model:checked="lotteryForm.delivery" />
                    </a-form-item>
                    <a-form-item label="Instant delivery">
                        <a-switch v-model:checked="lotteryForm.delivery" />
                    </a-form-item>
                    <a-form-item label="Instant delivery">
                        <a-switch v-model:checked="lotteryForm.delivery" />
                    </a-form-item>
                    <a-form-item label="Instant delivery">
                        <a-switch v-model:checked="lotteryForm.delivery" />
                    </a-form-item>
                    <!-- <a-form-item label="Activity type">
                        <a-checkbox-group v-model:value="lotteryForm.type">
                            <a-checkbox value="1" name="type">Online</a-checkbox>
                            <a-checkbox value="2" name="type">Promotion</a-checkbox>
                            <a-checkbox value="3" name="type">Offline</a-checkbox>
                        </a-checkbox-group>
                    </a-form-item> -->
                    <a-form-item label="Resources">
                        <a-radio-group v-model:value="lotteryForm.resource">
                            <a-radio value="1">Sponsor</a-radio>
                            <a-radio value="2">Venue</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="Activity form">
                        <a-textarea v-model:value="lotteryForm.desc" />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                        <!-- <a-button type="primary" @click="onSubmit">保存</a-button> -->
                    </a-form-item>
                </a-form>
            </div>
            <a-divider type="vertical" style="height: 100%"></a-divider>
            <div class="right">
                <LuckyWheel ref="luckyWheelRef" :width="lotteryForm.size * 10" :height="lotteryForm.size * 10"
                    :prizes="prizes" :blocks="lotteryForm.blocks" :buttons="buttons" @start="startCallback"
                    @end="endCallback" v-if="lotteryForm.type === 'LuckyWheel'" />
            </div>
            <!-- <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="1" tab="大转盘">
                    <LuckyWheel ref="luckyWheelRef" width="300px" height="300px" :prizes="prizes" :blocks="blocks"
                        :buttons="buttons" @start="startCallback" @end="endCallback">
                    </LuckyWheel>
                </a-tab-pane>
                <a-tab-pane key="2" tab="九宫格" force-render>
                    <LuckyGrid width="300px" height="300px" :prizes="prizes" :blocks="blocks" :buttons="buttons"
                        @start="startCallback" @end="endCallback">
                    </LuckyGrid>
                </a-tab-pane>
                <a-tab-pane key="3" tab="老虎机">
                    <SlotMachine width="300px" height="300px" :prizes="prizes" :blocks="blocks" :buttons="buttons"
                        @start="startCallback" @end="endCallback"></SlotMachine>
                </a-tab-pane>
            </a-tabs> -->
        </div>
    </a-card>
</template>

<script setup>
import { LuckyGrid, LuckyWheel, SlotMachine } from '@lucky-canvas/vue'
import { reactive, ref, watch } from 'vue'

const activeKey = ref('1')

const luckyWheelRef = ref()
const blocks = [{ padding: '13px', background: '#617df2' }]
const prizes = [
    { fonts: [{ text: '0', top: '10%' }], background: '#e9e8fe' },
    { fonts: [{ text: '1', top: '10%' }], background: '#b8c5f2' },
    { fonts: [{ text: '2', top: '10%' }], background: '#e9e8fe' },
    { fonts: [{ text: '3', top: '10%' }], background: '#b8c5f2' },
    { fonts: [{ text: '4', top: '10%' }], background: '#e9e8fe' },
    { fonts: [{ text: '5', top: '10%' }], background: '#b8c5f2' },
]
const buttons = [{
    radius: '35%',
    background: '#8a9bf3',
    pointer: true,
    fonts: [{ text: '开始', top: '-10px' }]
}]

// 点击抽奖按钮会触发star回调
const startCallback = () => {
    // 调用抽奖组件的play方法开始游戏
    luckyWheelRef.value.play()
    // 模拟调用接口异步抽奖
    setTimeout(() => {
        // 假设后端返回的中奖索引是0
        const index = 4
        // 调用stop停止旋转并传递中奖索引
        luckyWheelRef.value.stop()
    }, 3000)
}

// 抽奖结束会触发end回调
const endCallback = (prize) => {
    console.log(prize)
}

const paddingSize = ref(10)
const lotteryForm = reactive({
    type: 'LuckyWheel',
    size: 30,
    blocks: [
        {
            padding: paddingSize.value + "px",
            background: '#117df2'
        },
        {
            padding: "30px",
            background: '#717df2'
        },
        {
            padding: "20px",
            background: '#917df2'
        }
    ]
})

watch(() => paddingSize.value, (newValue) => {
    lotteryForm.blocks[0].padding = newValue + "px"
})

</script>

<style lang="scss">
.title {
    font-size: 16px;
    font-weight: 600;
}

.lotteryContainer {
    margin: 0;
    padding: 0;
    width: 100%;
    height: calc(100vh - 270px);
    display: flex;

    .left {
        width: 40%;
        height: 100%;
        padding: 0px 6px;
        overflow-y: auto;
    }

    .right {
        width: 100%;
        display: grid;
        place-items: center;
        /* 水平垂直居中 */
    }
}

.ant-collapse>.ant-collapse-item>.ant-collapse-header {
    padding: 12px 0px;
}
</style>