<template>
    <div
        class="accordion"
        :id="props.contract.id"
    >
        <details
            :open="isOpen"
            class="accordion__details"
        >
            <summary class="accordion__summary">
                <div class="accordion__summary_info body_S">
                    <div class="service">
                        <BaseCheckbox
                            v-model="selectedContracts"
                            :value="props.contract"
                        />
                    </div>
                    <div>
                        <span class="Heading_5">№{{ props.contract.number }}</span>
                        <span class="name body_S">{{ props.contract.name }}</span>
                    </div>
                    <div>до {{ date }}</div>
                    <div>
                        <span class="Heading_5">{{ props.contract.counterpartyShortName }}</span>
                        <span class="name">ИНН — {{ props.contract.counterpartyItn }}</span>
                    </div>
                </div>
                <div class="accordion__summary_edit">
                    <div
                        class="edit-icon"
                        @click.prevent=""
                    >
                        <IconSprite
                            name="edit"
                            class="icon__svg"
                        />
                    </div>
                    <div
                        class="service flex body_S pointer"
                        @click.prevent="openDetails"
                    >
                        <span>Услуги</span>
                        <IconSprite
                            name="arrow-down"
                            class="icon__svg arrow-icon"
                        />
                    </div>
                </div>
            </summary>
            <article>
                <InfoTable
                    :services="propsContentServices"
                    :header="header"
                    :classNames="'mt-24'"
                />
            </article>
        </details>
    </div>
</template>

<script setup>
import BaseCheckbox from '@ui/BaseCheckbox.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import InfoTable from '@ui/table/InfoTable.vue'
import { computed, ref } from 'vue'

import { useContractsStore } from '@/store/contracts'
import { storeToRefs } from 'pinia'

const store = useContractsStore()
const { openContracts, selectedContracts } = storeToRefs(store)

const props = defineProps({
    classNames: { type: String, required: false }, // для пользовательской стилизации компонента
    contract: { type: Object, required: true }, // body таблицы
})

const isOpen = ref(false)
const openDetails = async () => {
    await store.fetchContract(props.contract.id)
    isOpen.value = !isOpen.value
}

const header = ref(['Услуга', 'Операция', 'Маршрут', 'Тип операции', 'Сумма сбора'])

const date = computed(() => {
    const expiration = new Date(props.contract.expirationDate)
    return expiration.toLocaleString('ru', { year: 'numeric', month: 'numeric', day: 'numeric' })
})

const propsContentServices = computed(() => {
    if (openContracts.value.find((item) => item.id === props.contract.id)) {
        return store
            .getContractById(props.contract.id)
            .data.map((service) => [
                service?.expenseType,
                service?.type,
                service?.routeType,
                service?.operationType,
                service?.feeAmount?.toLocaleString('ru'),
            ])
    } else return []
})
</script>

<style lang="scss" scoped>
.accordion {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: nowrap;
    padding: 16px 24px;
    margin-top: 24px;
    border-radius: 8px;
    background-color: $color-gray-6;
    // .accordion__details
    &__details {
        pointer-events: none;
        width: 100%;

        article {
            opacity: 0;
        }
        &[open] {
            article {
                animation: fadeIn 0.75s linear forwards;
            }
            .arrow-icon {
                transform: rotate(180deg);
            }
        }
    }
    // .accordion__summary
    &__summary {
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
        flex-wrap: nowrap;
        width: 100%;

        &::-webkit-details-marker {
            display: none;
        }
        // .accordion__summary_info
        &_info {
            display: grid;
            align-items: center;
            grid-template-columns: 24px 5fr 2fr 5fr;
            width: 850px;
            padding: 0;
            gap: 32px;
        }
        // .accordion__summary_edit
        &_edit {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 26px;
        }
    }
}

.arrow-icon {
    margin-right: 0px;
    margin-left: 4px;
    transition-duration: 0.5s;
    transition-property: transform;
}
.edit-icon {
    pointer-events: auto;
    cursor: pointer;
    margin-right: 0;
}
.service {
    pointer-events: auto;
}
.name::before {
    content: '';
    background: $color-black;
    border-radius: 50%;
    display: inline-block;
    height: 4px;
    position: relative;
    margin: 4px;
    width: 4px;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>
