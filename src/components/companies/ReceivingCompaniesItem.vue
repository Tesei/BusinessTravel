<template>
    <div
        class="bg-gray-6 radius-8 companies-container"
        id="my-input"
    >
        <div><base-checkbox v-model="isChecked" /></div>
        <div>
            <span class="Heading_5">{{ company.name }}</span>
        </div>
        <div>
            <span class="body_S">{{ company.direction.name }}</span>
        </div>
        <div>
            <IconSprite
                name="edit"
                class="icon__svg"
            />
        </div>
    </div>
</template>

<script setup>
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import { ref } from 'vue'

const props = defineProps({
    company: { type: Object, required: true },
})
const isChecked = ref(false)
</script>

<style lang="scss" scoped>
.companies-container {
    width: 100%;
    padding: 20px;

    display: grid;
    align-items: center;
    grid-template-columns: 24px 1fr 1fr 24px;

    gap: 52px;

    &:not(:last-child) {
        margin-bottom: 32px;
    }
}

.icon__svg {
    margin-right: 0;
}
.pr-21 {
    padding-right: 21px;
}
</style>
