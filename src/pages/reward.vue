<template>
    <a-card>
        <tool-header></tool-header>
        <p>网站维护不易，客官如有条件，能否打赏个铜板~</p>
        <a-avatar :src="imgUrl" />
    </a-card>
</template>

<script setup>
import { createAvatar } from '@dicebear/core'
import { lorelei } from '@dicebear/collection'
import { onMounted, ref } from 'vue'

const avatar = createAvatar(lorelei, {
    seed: 'John Doe',
    // ... other options
})

const imgUrl = ref('https://www.antdv.com/assets/logo.1ef800a8.svg')

onMounted(() => {
    const svg = avatar.toString()
    imgUrl.value = avatar.toDataUri()
    console.log(svg)
})
</script>