<template>
    <div class="ticket">
        <div class="direction mb-24">
            <span class="Heading_2 direction__title">Туда</span>
            <div class="icon__wrapper ml-24">
                <IconSprite
                    name="common--flight-ticket-there"
                    className="flight-ticket c-gray-2 mr-24 ml-24"
                />
            </div>
        </div>
        <div
            v-for="(direction, index) in tariffLegs"
            :key="index"
        >
            <!-- Дополнительный блок перед вторым компонентом -->
            <div v-if="index === 1">
                <div class="direction mb-24">
                    <span class="Heading_2 direction__title">Обратно</span>
                    <div class="icon__wrapper ml-24">
                        <IconSprite
                            name="common--flight-ticket-there"
                            className="flight-ticket flight-ticket-back c-gray-2 mr-24 ml-24"
                        />
                    </div>
                </div>
            </div>
            <air-ticket
                :class="{ 'mb-24': index !== tariffLegs.length && tariffLegs.length > 1 }"
                :direction="direction"
                :airlines="tariffs.airlines"
                :airports="tariffs.airports"
                :equipments="tariffs.equipments"
            />
        </div>
    </div>
</template>
<script setup>
import AirTicket from '@/components/airSearch/AirTicket.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import { computed } from 'vue'
const props = defineProps({
    tariffs: {
        type: Object,
        require: true,
    },
})
const tariffLegs = computed(() => {
    return props.tariffs.route?.legs
})
</script>
<style scoped lang="scss">
.flight-ticket {
    width: 32px;
    height: 32px;
}
.flight-ticket-back {
    transform: rotate(180deg);
}
.direction {
    width: 100%;
    text-align: center;
    display: flex;
}
.direction__title {
    max-width: 123px;
    width: 100%;
    text-align: start;
}
.icon__wrapper {
    width: 100%;
    position: relative;
    max-width: 565px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}
.icon__wrapper::before,
.icon__wrapper::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 50%;
    max-width: 242.5px;
    height: 1px;
    background: transparent;
    border-top: 1px dotted $color-gray-2;
}
.icon__wrapper::before {
    left: -24px;
}

.icon__wrapper::after {
    right: -24px;
}
</style>
