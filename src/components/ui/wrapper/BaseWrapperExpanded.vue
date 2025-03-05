<template>
    <div class="ui-expanded">
        <div class="bd radius-16 p-24 bg-white bd-gray-9 ui-expanded__content">
            <div class="ui-expanded__header">
                <div
                    class="Heading_4 ui-expanded__header_title pointer"
                    @click="isActive = !isActive"
                >
                    {{ placeholder }}
                </div>
                <div class="ui-expanded__header_arrow">
                    <base-select
                        type="mini"
                        :with-dropdown="false"
                        v-model="isActive"
                    >
                    </base-select>
                </div>
            </div>
            <div
                class="ui-expanded__hidden-block"
                :class="{ expanded: isActive }"
            >
                <div class="ui-expanded__body">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import BaseSelect from '@ui/select/BaseSelect.vue'

const props = defineProps({
    placeholder: {
        type: String,
        required: true,
    },
})

// Управление состоянием isActive родителя
const isActive = defineModel({ type: Boolean, required: true })
</script>

<style scoped lang="scss">
.ui-expanded {
    width: 100%;

    // .ui-expanded__header
    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        // .ui-expanded__header_title
        &_title {
            white-space: nowrap;
            width: calc(100% - 24px);
        }

        // .ui-expanded__header_arrow
        &_arrow {
            width: 24px;
        }
    }

    // .ui-expanded__body
    &__body {
        width: 100%;
    }

    // .ui-expanded__hidden-block
    &__hidden-block {
        transition: all 0.3s ease-in;
        max-height: 0;
        opacity: 0;

        // .ui-expanded__hidden-block.expanded
        &.expanded {
            opacity: 1;
            max-height: 100vh;
        }
    }
}
</style>
