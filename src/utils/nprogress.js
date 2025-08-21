import NProgress from "nprogress"
import 'nprogress/nprogress.css'

//全局进度条的配置
NProgress.configure({
    // 动画方式
    easing: 'ease',
    // 递增进度条的速度
    speed: 300,
    // 是否显示加载ico
    showSpinner: false,
    // 自动递增间隔
    trickleSpeed: 200,
    // 更改启动时使用的最小百分比
    minimum: 0.3,
    //指定进度条的父容器
    parent: 'body'
});

// 打开进度条
export const start = () => {
    NProgress.start();
}

// 关闭进度条
export const done = () => {
    NProgress.done();
}