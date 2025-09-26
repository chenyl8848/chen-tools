<template>
    <a-card>
        <tool-header></tool-header>
        <canvas ref="confettiRef" class="confetti-container"></canvas>
    </a-card>
</template>

<script setup>
import confetti from 'canvas-confetti'
import { onMounted, ref } from 'vue'

const confettiRef = ref()
const customConfetti = ref()

const initConfetti = () => {
    customConfetti.value = confetti.create(confettiRef.value, {
        resize: true,
        useWorker: true
    })
}

onMounted(() => {
    initConfetti()
    customConfetti.value({
        angle: 90,
        spread: 360,
        startVelocity: 45,
        particleCount: 150,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#bb0000', '#ffffff', '#00bb00']
    })
})
</script>