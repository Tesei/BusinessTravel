<template>
    <div class="p-24 pt-12 pb-12 bg-gray-6 radius-8 mt-24 trip">
        <div class="body_S trip__content">
            <div
                @click="handleClick"
                class="flex ai-c jc-fs footnote_L pointer"
            >
                <IconSprite
                    :name="statusInfo?.iconName"
                    @click="handleToggleDropdown"
                    class="icon-svg mr-8"
                    :class="[statusInfo?.className, statusInfo?.iconClassName]"
                />
                <span
                    class="elipsis"
                    :class="statusInfo?.className"
                    >{{ statusInfo?.title }}</span
                >
            </div>

            <div
                @click="handleClick"
                class="Heading_5 pointer cut-text"
            >
                №{{ trip.tripNumber }}
            </div>
            <div
                @click="handleClick"
                class="pointer cut-text"
            >
                {{ dateInterval }}
            </div>
            <div>
                <base-tooltip
                    :type="'basic'"
                    :text="[fullName]"
                    :font="'footnote_M'"
                    :range="1"
                >
                    <div
                        @click="handleClick"
                        class="elipsis pointer"
                    >
                        {{ shortName }}
                    </div>
                </base-tooltip>
            </div>

            <div
                @click="handleClick"
                class="pointer cut-text"
            >
                {{ trip.startDirectionName }} — {{ trip.finishDirectionName }}
            </div>

            <div
                v-if="trip.actions?.length"
                class="flex ai-c jc-fe"
            >
                <base-button
                    v-if="showBtn"
                    classNames="font-button_S button button_tiny button_transparent trip__button"
                    @click="emit('handleAction', 'Approve', trip.id)"
                    >Согласовать</base-button
                >
                <div class="flex ml-40 mr-12 pointer service">
                    <IconSprite
                        name="common--more"
                        @click="handleToggleDropdown"
                        class="icon-svg c-cornflower icon-more"
                    />
                    <base-droplist
                        v-if="openDropdown"
                        position-x="right"
                        position-y="bottom"
                        :list="awailableActions"
                        v-model:isActive="openDropdown"
                        v-model:activeItem="actionsModel"
                        type="basic"
                    ></base-droplist>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import BaseButton from '@ui/buttons/BaseButton.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseDroplist from '@ui/select/BaseDroplist.vue'
import BaseTooltip from '@ui/BaseTooltip.vue'
import { ref, computed } from 'vue'
import { formatResponseDate } from '@/helpers/helpers'
import { actionsMap, statusMap } from '@/helpers/translate'
import { useRouter } from 'vue-router'
import { getShortName } from '@/helpers/helpers'

const props = defineProps({
    trip: {
        type: Object,
    },
})

const router = useRouter()

const openDropdown = ref(false)

const handleToggleDropdown = () => {
    openDropdown.value = !openDropdown.value
}
const fullName = computed(() => props.trip.employee?.fullName || '')

const shortName = computed(() => {
    return getShortName(props.trip.employee)  
})

const statusInfo = computed(() => {
    if (!props.trip.status) return {iconName: '', title: '', className: '', iconClassName: ''}  
    return statusMap[props.trip.status]
})

const awailableActions = computed(() => {
    return props.trip.actions?.map((action) => actionsMap[action]) || []
})

const showBtn = computed(() => {
    return props.trip.actions?.includes('Approve')
})

const dateInterval = computed(() => {
    if (!props.trip.startDate || !props.trip.endDate) return ''
    const { startDate, endDate } = props.trip
    return `${formatResponseDate(startDate)} - ${formatResponseDate(endDate)}`
})

const getKeyByValue = (object, value) => Object.keys(object).find((key) => object[key] === value)

const emit = defineEmits(['handleAction'])

const actionsModel = computed({
    get: () => '',
    set: (value) => {
        emit('handleAction', getKeyByValue(actionsMap, value), props.trip.id)
    },
})

const handleClick = () => {
    router.push(`/trips/${props.trip.id}`)
}
</script>

<style scoped lang="scss">
.trip {
    width: 100%;
    //.trip__content
    &__content {
        display: grid;
        grid-template-columns: 161px 81px 177px 205px 202px 1fr;
        column-gap: 16px;
        width: 100%;
        height: 40px;
        align-items: center;

        .cut-text {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .elipsis {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .service {
            position: relative;
        }
        .icon-svg {
            width: 16px;
            height: 16px;
        }
        .icon-more {
            transform: rotate(90deg);
        }

        .trip__button {
            height: 40px;
        }
        .rotate {
            transform: rotate(45deg);
        }
    }
}
</style>
