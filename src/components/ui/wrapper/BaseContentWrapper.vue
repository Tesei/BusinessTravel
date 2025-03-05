<template>
    <div class="base-content-wrapper flex-d-c flex-jcfs-aic mt-32">
        <div class="base-content-wrapper__header">
            <slot name="header"></slot>
        </div>
        <div class="base-content-wrapper__middle">
            <slot name="middle"></slot>
        </div>
        <div class="base-content-wrapper__body flex flex-d-c jc-sb">
            <slot name="body"></slot>
            <div class="base-content-wrapper__sticky-footer pb-32">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script setup></script>

<style scoped lang="scss">
.base-content-wrapper {
    min-height: calc(100vh - 103px);
    height: max-content;

    // .base-content-wrapper__header
    &__header {
        width: 100%;
    }

    // .base-content-wrapper__middle
    &__middle {
        width: 100%;
    }

    // .base-content-wrapper__body
    &__body {
        width: 100%;
        /* flex-grow: 1; */
        position: relative;
    }

    // .base-content-wrapper__sticky-footer
    &__sticky-footer {
        position: sticky;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: $color-white;
    }
}
</style>
