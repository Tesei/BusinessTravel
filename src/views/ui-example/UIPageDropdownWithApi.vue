<template>
    <header><h1>Dropdown with API</h1></header>
    <div
        class="flex ai-fs jc-fs"
        style="width: 100%; height: 100vh"
    >
        <div
            class="flex flex-d-c ai-fs"
            style="gap: 8px; width: 100%"
        >
            <div
                class="ml-24"
                style="width: 100%; height: 56px; margin-top: 50px"
            >
                <base-select
                    type="big"
                    label="Город вылета"
                    with-dropdown
                    :value="selectState.activeItems.length ? selectState.activeItems.map((el) => el.nameRus).join(', ') : ''"
                    v-model="selectState.isActive"
                >
                    <base-dropdown-with-api
                        v-if="selectState.isActive"
                        position-y="bottom"
                        v-model:active-items="selectState.activeItems"
                        v-model:is-active="selectState.isActive"
                        placeholder="Город вылета"
                        search-type="directions"
                        not-data-title="Города вылета не найдены"
                        multiple-selection
                        only-cyrillic
                        :line-count="10"
                    ></base-dropdown-with-api>
                </base-select>
            </div>
            <div
                class="ml-24"
                style="width: 100%; height: 56px; margin-top: 50px"
            >
                <base-select
                    type="big"
                    label="Контрагент"
                    with-dropdown
                    :value="selectState2.activeItems.length ? selectState2.activeItems[0].shortName : ''"
                    v-model="selectState2.isActive"
                >
                    <base-dropdown-with-api
                        v-if="selectState2.isActive"
                        position-y="bottom"
                        v-model:active-items="selectState2.activeItems"
                        v-model:is-active="selectState2.isActive"
                        placeholder="Контрагент"
                        search-type="counterparties"
                        not-data-title="Контрагенты не найдены"
                    ></base-dropdown-with-api>
                </base-select>
            </div>
        </div>
    </div>
</template>
<script setup>
import BaseSelect from '@ui/select/BaseSelect.vue'
import BaseDropdownWithApi from '@ui/select/BaseDropdownWithApi.vue'
import { reactive } from 'vue'

const selectState = reactive({ isActive: false, activeItems: [] })
const selectState2 = reactive({ isActive: false, activeItems: [] })
</script>
<style></style>
