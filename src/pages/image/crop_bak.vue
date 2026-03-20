<template>
    <div class="cropper-container" />
    <a-button @click="btnCrop">裁剪</a-button>
</template>

<script lang="ts">
import Cropper from 'cropperjs'

export default {
    name: 'CropperExample',
    data() {
        return {
            src: `/public/images/tools.png`,
            cropper: '',
        };
    },
    mounted() {
        const image = new Image()

        image.src = this.src
        image.alt = 'Picture'

        this.cropper = new Cropper(image, {
            container: '.cropper-container',
        });

        // eslint-disable-next-line no-console
        console.log(this.cropper)
    },

    methods: {
        btnCrop() {
            const cropper = new Cropper(new Image(), {
                container: '.cropper-container',
            });

            cropper.crop()
        },
    },
};
</script>

<style lang="scss" scoped>
.cropper-container {
    border: 1px solid var(--vp-c-divider);
    border-radius: 0.375rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
    padding: 1.25rem 1.5rem;

    :deep(cropper-canvas) {
        height: 360px;
    }
}
</style>