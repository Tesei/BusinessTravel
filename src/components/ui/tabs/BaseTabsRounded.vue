<template>
    <div class="contragent">
        <div class="contragent__left">
            <div class="Heading_5 contragent__name">{{ shortName }}</div>
            <div class="body_S contragent__info">ИНН — {{ itn }}</div>
            <div class="body_S contragent__info">КПП — {{ iec }}</div>
        </div>
        <div class="contragent__right">
            <div class="contragent__control">
                <div class="switch-lebel__item">
                    <BaseSwitcherLabel
                        :default-detected="isActive"
                        :disabled="!managementCounterpartiesWrite"
                        @handleChange="emit('toggleActive', id)"
                    >
                        <span
                            class="footnote_L switch-lebel__text"
                            :class="[isActive ? 'c-green' : 'c-gray']"
                            >Активен &nbsp;
                        </span></BaseSwitcherLabel
                    >
                </div>
            </div>
            <div class="contragent__control">
                <BaseSwitcherLabel
                    :default-detected="isBlocked"
                    :disabled="!managementCounterpartiesWrite"
                    @handleChange="emit('toggleBlocked', id)"
                >
                    <span
                        class="footnote_L switch-lebel__text"
                        :class="{ 'c-red': isBlocked }"
                    >
                        Блокировка &nbsp;</span
                    ></BaseSwitcherLabel
                >
            </div>
            <div class="contragent__control">
                <IconSprite
                    @click="emit('editContragent', id)"
                    name="common--edit"
                    className="icon__svg button__icon_mr0 c-gray pointer"
                />
            </div>
        </div>
    </div>
</template>
/** Компонент отображает элемент списка контрагентов принимает пропсами id, shortName, itn, iec, isActive, isBlocked,
managementCounterpartiesWrite, а также емитит события editContragent, toggleBlocked, toggleActive. В случае, если
managementCounterpartiesWrite = true, то есть доступ переключению активности и блокировки   */
<script setup>
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseSwitcherLabel from '@ui/switcher/BaseSwitcherLabel.vue'

const props = defineProps({
    id: {
        type: String,
        required: true,
    },

    shortName: {
        type: String,
        required: true,
    },

    itn: {
        type: String,
        required: true,
    },

    iec: {
        type: String,
        required: false,
        default: null,
    },

    isActive: {
        type: Boolean,
        required: false,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        required: false,
        default: false,
    },
    managementCounterpartiesWrite: {
        type: Boolean,
        required: false,
        default: false,
    },
})

const emit = defineEmits(['editContragent', 'toggleActive', 'toggleBlocked'])
</script>

<style scoped lang="scss">
.contragent {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto;
    width: 100%;
    padding: 21px 24px;
    background-color: $color-gray-6;
    border-radius: $border-radius-8;
    gap: 24px;
}

.contragent:not(:last-child) {
    margin-bottom: 24px;
}

.contragent__left {
    display: grid;
    grid-template-columns: repeat(3, 200px);
    gap: 32px;
}

.contragent__name {
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}

.contragent__right {
    display: grid;
    grid-template-columns: repeat(3, auto);
    gap: 32px;
}
</style>
