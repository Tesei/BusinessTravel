<template>
    <div class="flex jc-fe buttons-block">
        <template
            v-for="(btn, index) in buttonsList"
            :key="index"
        >
            <base-button
                v-if="btn === 'Delete'"
                @click="emit('openPopup', btn)"
                class="button_transparent button_small mr-16 button_red"
            >
                Удалить командировку
            </base-button>
            <base-button
                v-if="btn === 'Revoke'"
                @click="emit('openPopup', btn)"
                class="bd dg-tp c-red bd-red tr-all-3 button_small mr-16"
            >
                Отозвать
            </base-button>

            <base-button
                v-if="btn === 'Reject'"
                @click="emit('openPopup', btn)"
                class="button_transparent button_small mr-16"
            >
                Отклонить
            </base-button>

            <base-button
                v-if="btn === 'Cancel'"
                @click="emit('openPopup', btn)"
                class="button_transparent button_small mr-16"
            >
                Отменить
            </base-button>

            <base-button
                v-if="btn === 'Approve'"
                @click="emit('openPopup', btn)"
                class="button_blue button_small mr-16"
            >
                Согласовать
            </base-button>

            <base-button
                v-if="btn === 'SendForApproval'"
                @click="emit('sendForApproval')"
                class="button_blue button_small mr-16"
            >
                Отправить на согласование
            </base-button>
            <base-button
                v-if="btn === 'SendForApprovalBack'"
                @click="emit('sendForApproval')"
                class="button_blue button_small mr-16"
            >
                Вернуть на согласование
            </base-button>
        </template>
    </div>
</template>

<script setup>
import BaseButton from '@ui/buttons/BaseButton.vue'

const emit = defineEmits(['sendForApproval', 'openPopup'])

defineProps({
    buttonsList: {
        type: Array,
        default: () => [],
        //     [
        //   "History",
        //   "Revoke",
        //   "Approve",
        //   "Reject"
        // ]
    },
})
</script>

<style scoped lang="scss">
.buttons-block {
    width: 100%;
    flex-wrap: wrap;

    *:last-child {
        margin: 0px 0px 0px 0px;
    }
}
</style>
