<template>
    <slot name="header"></slot>
    <div class="planning-expense-body">
        <slot name="left"></slot>
        <slot name="right"></slot>
    </div>
</template>
<script setup></script>

<style scoped lang="scss">
.planning-expense-body {
    display: grid;
    grid-template-columns: 370px 776px;
    column-gap: 24px;
}
</style>
