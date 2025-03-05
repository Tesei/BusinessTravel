<template>
    <base-wrapper-popup
        @close="$emit('close')"
        class="p-24 sender-popup"
        style="width: 770px"
        :key="'popUp-transition'"
    >
        <template #header>
            <span class="Heading_3 sender-popup__title">
                <slot name="title">Отозвать для внесения изменений</slot>
            </span>
        </template>

        <template #default>
            <div class="mb-32 mt-32 body_M">
                <slot name="default"> Какое-то интересное сообщение </slot>
            </div>
        </template>

        <template #footer>
            <base-button
                class="sender-popup__btn button_blue"
                :toShowLoading="buttonLoading"
                @click="checkMessage"
            >
                <span
                    class="sender-popup__btn-text"
                    v-if="!buttonLoading"
                >
                    <slot name="btn-text">Отозвать</slot>
                </span>
            </base-button>
        </template>
    </base-wrapper-popup>
</template>

<script setup>
import BaseWrapperPopup from '@ui/wrapper/BaseWrapperPopup.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import { ref } from 'vue'

const props = defineProps({
    sendingFunction: {
        type: Function,
        required: true,
    },
})
const emit = defineEmits(['close'])

const buttonLoading = ref(false)

async function checkMessage() {
    buttonLoading.value = true
    try {
        await props.sendingFunction()
    } finally {
        emit('close')
    }
}
</script>

<style lang="scss" scoped>
.sender-popup {
    // .sender-popup__title
    &__title {
    }

    // .sender-popup__textarea
    &__textarea {
    }

    // .sender-popup__btn
    &__btn {
        width: 100%;
    }

    // .sender-popup__btn-text
    &__btn-text {
    }
}
</style>
