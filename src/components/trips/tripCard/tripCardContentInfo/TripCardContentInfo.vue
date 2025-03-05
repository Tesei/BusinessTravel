<template>
    <template v-if="!preloader && getModefiedTripActions">
        <base-notification-box-2
            v-if="getNotificationData"
            class="mb-24 mt-24"
            :style="{ width: '100%' }"
            :always-visible="true"
            :color="getNotificationData.color"
        >
            <template #picture>
                <IconSprite
                    v-if="getNotificationData.status === 'Approved'"
                    name="common--check-2"
                    className="icon__svg"
                />
            </template>
            <template #default>
                <p
                    class="font-button_S"
                    v-if="getNotificationData.title"
                >
                    {{ getNotificationData.title }}
                </p>
                <span v-if="getNotificationData.text"
                    >{{ getNotificationData.text }}
                    <button
                        v-if="getNotificationData.status === 'Approved'"
                        @click="$emit('changeTab', 'tab2')"
                        class="c-cornflower"
                    >
                        купить билеты
                    </button>
                </span>
            </template>
        </base-notification-box-2>

        <about-trip
            :trip="singleTrip"
            :actions="approveStore.getTripActions"
            class="mb-24"
            :class="{ 'mt-24': !getNotificationData }"
        />
        <expenses class="mb-24" />
        <daily-allowance
            :trip="singleTrip"
            class="mb-24"
        />
        <buttons
            class="mb-32"
            :buttons-list="getModefiedTripActions"
            @send-for-approval="handleSendForApproval"
            @open-popup="handleOpenPopup"
        />
    </template>
    <template v-else>
        <base-skeleton
            v-for="item in 3"
            skeleton-height="217px"
            :class="`mt-24`"
            :key="item"
        />
    </template>

    <template
        v-for="sendingPopup in listPopups"
        :key="sendingPopup.name"
    >
        <popup-sending-message
            v-if="sendingPopup.name !== `Delete` && sendingPopup.isShow"
            :placeholder="sendingPopup.textareaPlaceholder"
            :sending-function="sendingPopup.fetchFunction"
            @close="sendingPopup.isShow = false"
        >
            <template #title>{{ sendingPopup.title }}</template>
            <template #btn-text>{{ sendingPopup.btnText }}</template>
        </popup-sending-message>
        <popup-inform
            v-if="sendingPopup.name === `Delete` && sendingPopup.isShow"
            :sending-function="sendingPopup.fetchFunction"
            @close="sendingPopup.isShow = false"
        >
            <template #title>{{ sendingPopup.title }}</template>
            <template #default>{{ sendingPopup.text }}</template>
            <template #btn-text>{{ sendingPopup.btnText }}</template>
        </popup-inform>
    </template>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useApproveStore } from '@/store/approve/index.js'
import { useTripsStore } from '@/store/trips/index.js'

import IconSprite from '@/components/interface/IconSprite.vue'
import Buttons from '@/components/trips/tripCard/tripCardContentInfo/TripCardContentInfoButtons.vue'
import AboutTrip from '@/components/trips/tripCard/tripCardContentInfo/TripCardContentInfoAboutTrip.vue'
import DailyAllowance from '@/components/trips/tripCard/tripCardContentInfo/TripCardContentInfoDailyAllowance.vue'
import Expenses from '@/components/trips/tripCard/tripCardContentInfo/TripCardContentInfoExpenses.vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'
import BaseNotificationBox2 from '@ui/alert/BaseNotificationBox.vue'
import PopupSendingMessage from '@/components/popup/PopupSendingMessage.vue'
import PopupInform from '@/components/popup/PopupInform.vue'

const tripsStore = useTripsStore()
const approveStore = useApproveStore()
const { singleTrip, preloader } = storeToRefs(tripsStore)
const { getModefiedTripActions } = storeToRefs(approveStore)

defineEmits(['changeTab'])

async function handleOpenPopup(name) {
    if (name === 'Approve') await approveStore.fetchApproveSolution()
    else
        listPopups.forEach((item) => {
            if (name === item.name) item.isShow = true
        })
}
const listPopups = reactive([
    {
        name: 'Delete',
        isShow: false,
        fetchFunction: approveStore.fetchDeleteSolution,
        title: 'Удалить командировку',
        btnText: 'Удалить',
        text: 'Если вы удалите командировку, её необходимо будет оформить повторно.',
    },
    {
        name: 'Revoke',
        textareaPlaceholder: 'Причина отзыва командировки',
        isShow: false,
        fetchFunction: approveStore.fetchRevokeSolution,
        title: 'Отозвать для внесения изменений',
        btnText: 'Отозвать командировку',
    },
    {
        name: 'Reject',
        textareaPlaceholder: 'Причина отклонения командировки',
        isShow: false,
        fetchFunction: approveStore.fetchRejectSolution,
        title: 'Отклонить командировку',
        btnText: 'Отклонить командировку',
    },
    {
        name: 'Cancel',
        textareaPlaceholder: 'Причина отмены командировки',
        isShow: false,
        fetchFunction: approveStore.fetchCancelSolution,
        title: 'Отменить',
        btnText: 'Отменить командировку',
    },
])

const getNotificationData = computed(() => {
    let reason = singleTrip.value.comment == 'string' ? '...' : singleTrip.value.comment
    switch (singleTrip.value.status) {
        case 'Approved':
            return {
                color: 'blue',
                text: 'Командировка согласована. Можно ',
                title: null,
                status: 'Approved',
            }
        case 'Rejected':
            return {
                color: 'red',
                text: 'Причина: ' + reason,
                title: 'Командировка отклонена',
                status: 'Rejected',
            }
        case 'Revoked':
            return {
                color: 'red',
                text: 'Причина отзыва: ' + reason,
                title: 'Командировка отозвана',
                status: 'Revoked',
            }
        case 'Cancelled':
            return {
                color: 'red',
                text: 'Причина отмены: ' + reason,
                title: 'Командировка отменена',
                status: 'Cancelled',
            }
        default:
            return false
    }
})

const handleSendForApproval = async () => {
    await tripsStore.sendForApproval(singleTrip.value.id)
    tripsStore.fetchActionsOfTripSingle(singleTrip.value.id)
    tripsStore.fetchSingleTrip(singleTrip.value.id)
}
</script>

<style scoped lang="scss"></style>
