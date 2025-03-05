<template>
    <div class="bg-gray-6 radius-8 position hover-bg-gray-5 pointer">
        <div class="position__content">
            <div class="flex ai-c">
                <span class="Heading_5 ellipsis position__code">№{{ position.code }}</span>
                <span class="ml-8 mr-8">&#9679;</span>
            </div>
            <div>
                <base-tooltip
                    class="position__tooltip pointer"
                    :type="'basic'"
                    :text="[position.name]"
                    :font="'footnote_M'"
                    :range="1"
                >
                    <span class="body_S ellipsis">
                        {{ position.name }}
                    </span>
                </base-tooltip>
            </div>
            <div>
                <base-tooltip
                    v-if="position.description"
                    class="position__tooltip pointer"
                    :type="'basic'"
                    :text="[description]"
                    :font="'footnote_M'"
                    :range="1"
                >
                    <IconSprite
                        name="common--info"
                        class="icon__svg icon__info c-gray"
                    />
                </base-tooltip>
            </div>
            <div class="ml-32">
                <base-tooltip
                    class="position__tooltip pointer"
                    :type="'basic'"
                    :text="[position.department?.name]"
                    :font="'footnote_M'"
                    :range="1"
                >
                    <span class="body_S ellipsis">
                        {{ position.department?.name }}
                    </span>
                </base-tooltip>
            </div>
            <div
                :class="['pointer', { 'position__edit-disabled': disabledEdit }]"
                @click="emit('handleEdit', position)"
            >
                <IconSprite
                    name="edit"
                    class="icon__svg edit__svg"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseTooltip from '@ui/BaseTooltip.vue'
import { computed } from 'vue'

const props = defineProps({
    position: { type: Object, required: true },
    disabledEdit: { type: Boolean, required: false, default: false },
})

const emit = defineEmits(['handleEdit'])

const description = computed(() => {
    return props.position.description.length <= 256
        ? props.position.description
        : props.position.description.slice(0, 256) + '...'
})
</script>

<style lang="scss" scoped>
.position {
    width: 100%;
    padding: 20px;

    //.position:not(:last-child)
    &:not(:last-child) {
        margin-bottom: 24px;
    }
    // .position__content
    &__content {
        display: grid;
        align-items: center;
        grid-template-columns: max-content 500px 24px 1fr 24px;
        width: 100%;
    }

    .position__edit-disabled {
        pointer-events: none;
    }
    .icon__svg {
        margin-right: 0;
    }

    .position__tooltip {
        display: inline-block;
        max-width: 100%;
    }
    .position__code {
        width: 93px;
    }
}
</style>
