<template>
    <Transition name="fade">
        <div v-if="!!contracts.length && !loading">
            <div class="flex jc-sb ai-c mb-40 mt-10">
                <div>
                    <BaseCheckbox
                        :label="'Выбрать все договоры'"
                        v-model="allChecked"
                        :indeterminate="indeterminate"
                    />
                </div>

                <base-button
                    class="delete__button font-button_S"
                    :class="{ delete__button_active: !!selectedContracts.length }"
                    :disabled="!selectedContracts.length"
                >
                    <IconSprite
                        name="common--delete"
                        class="icon__svg icon__delete"
                        :class="{ icon__delete_active: !!selectedContracts.length }"
                    />
                    <span v-if="!!selectedContracts.length">
                        Удалить {{ selectedContracts.length === 1 ? 'выбранный договор' : 'выбранные договоры' }}
                    </span>
                </base-button>
            </div>

            <template
                v-for="contract in contracts"
                :key="contract.id"
            >
                <ContractItem :contract="contract" />
            </template>
        </div>
    </Transition>
    <div v-if="loading">
        <base-skeleton
            v-for="index in 5"
            :key="index"
            class="mb-24"
        />
    </div>
</template>

<script setup>
import BaseCheckbox from '@ui/BaseCheckbox.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import ContractItem from '@/components/contracts/ContractItem.vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import { watch } from 'vue'

import { useContractsStore } from '@/store/contracts'
import { storeToRefs } from 'pinia'

const store = useContractsStore()
const { contracts, selectedContracts, allChecked, indeterminate, loading } = storeToRefs(store)

watch(allChecked, () => store.isAllChecked(allChecked.value))
watch(selectedContracts, () => store.controlSelectedContracts())
</script>

<style lang="scss" scoped>
.icon__delete {
    margin-right: 0;
    color: $color-gray-2;
    // .icon__delete_activ
    &_active {
        color: $color-red;
    }
}

.bd {
    border: 1px solid $color-gray-4;
}

.delete__button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    line-height: 24px;
    border: 1px solid $color-gray-4;
    background: none;
    padding: 7px;
    // .delete__button_active
    &_active {
        padding: 7px 20px;
        color: $color-red;
        border: 1px solid $color-red;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.75s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
