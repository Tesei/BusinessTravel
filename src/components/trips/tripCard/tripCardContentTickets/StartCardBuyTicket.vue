<template>
    <div class="bd-dashed radius-16 bd-gray-2 card-buy-ticket">
        <div class="flex m-24 jc-sb ai-c">
            <div class="flex jc-c ai-c radius-12 bg-gray-5 mr-12 card-buy-ticket__icon-wrapper">
                <!-- todo Хардкод Указать иконки динамически -->
                <IconSprite                    
                    class="c-cornflower card-buy-ticket__icon"
                    name="common--flight-ticket-there"
                />
            </div>
            <div class="nr-24 card-buy-ticket__text">
                <!-- todo Указать необходимый транспорт динамически -->
                <p class="Heading_4">Билет на самолет</p>
                <p class="body_S c-gray">{{ from }} — {{ to }}, до&nbsp;{{ limit.toLocaleString('ru-RU') }}&nbsp;₽</p>
            </div>
            <base-button 
                class="button_blue"
                :disabled="disabled"
                @click="$emit('click')"
            >
                Купить
            </base-button>
        </div>
    </div>
</template>

<script setup>
import BaseButton from '@ui/buttons/BaseButton.vue'
import IconSprite from '@/components/interface/IconSprite.vue'

defineProps({
    typeTicket: {
        type: String,
        default: 'Plane'
        // todo дописать валидацию пропса
    },
    limit: {
        type: Number,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false
    }
})
defineEmits(['click'])

</script>

<style lang="scss" scoped>

.card-buy-ticket {
    width: 100%;

		// .card-buy-ticket__icon-wrapper
		&__icon-wrapper {
            width: 56px;
            height: 56px;
		}
		// .card-buy-ticket__icon
		&__icon {
            width: 24px;
            height: 24px;
		}

		// .card-buy-ticket__text
		&__text {
            flex: 1 1 auto;
		}
}

</style>