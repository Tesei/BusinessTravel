<template>
    <header><h1>Selects and Droplists</h1></header>
    <div
        class="flex ai-fs jc-fs"
        style="width: 100%; height: 100vh"
    >
        <div
            class="flex flex-d-c ai-с jc-c"
            style="gap: 8px; width: fit-content"
        >
            <div
                class="ml-24"
                style="width: 24px; height: 24px"
            >
                <base-select
                    type="mini"
                    v-model="miniSelectIsActive"
                    :with-dropdown="false"
                ></base-select>
            </div>
            <div class="ml-24">{{ miniSelectIsActive }}</div>
            <div
                class="ml-24"
                style="width: 24px; height: 24px"
            >
                <base-select
                    type="mini"
                    v-model="miniSelectDisabledIsActive"
                    :with-dropdown="false"
                    disabled
                ></base-select>
            </div>
            <div class="ml-24">{{ miniSelectDisabledIsActive }}</div>
            <div
                class="ml-24"
                style="width: 120px; height: 24px"
            >
                <base-select
                    type="mini"
                    value="Сортировать"
                    :with-dropdown="false"
                    v-model="miniSelectSortIsActive"
                ></base-select>
            </div>
            <div class="ml-24">{{ miniSelectSortIsActive }}</div>
            <div
                class="ml-24"
                style="width: 120px; height: 24px"
            >
                <base-select
                    type="mini"
                    value="Сортировать"
                    :with-dropdown="false"
                    v-model="miniSelectSortDisabledIsActive"
                    disabled
                ></base-select>
            </div>
            <div class="ml-24">{{ miniSelectSortDisabledIsActive }}</div>
            <div
                class="ml-24"
                style="width: 181px; height: 44px"
            >
                <base-select
                    type="basic"
                    value="Показывать по 30"
                    :with-dropdown="false"
                    v-model="basicSelectIsActive"
                ></base-select>
            </div>
            <div class="ml-24">{{ basicSelectIsActive }}</div>
            <div
                class="ml-24"
                style="width: 181px; height: 44px"
            >
                <base-select
                    type="basic"
                    value="Показывать по 30"
                    :with-dropdown="false"
                    disabled
                    v-model="basicSelectDisabledIsActive"
                ></base-select>
            </div>
            <div class="ml-24">{{ basicSelectDisabledIsActive }}</div>
            <div
                class="ml-24"
                style="width: 181px; height: 44px"
            >
                <base-select
                    type="basic"
                    label="Тип номера"
                    :with-dropdown="false"
                    value=""
                    v-model="basicSelectWithLabelWithoutValueIsActive"
                ></base-select>
            </div>
            <div class="ml-24">{{ basicSelectWithLabelWithoutValueIsActive }}</div>
            <div
                class="ml-24"
                style="width: 181px; height: 44px"
            >
                <base-select
                    type="basic"
                    label="Тип номера"
                    :with-dropdown="false"
                    disabled
                    value=""
                    v-model="basicSelectWithLabelWithoutValueDisabledIsActive"
                ></base-select>
            </div>
            <div class="ml-24">{{ basicSelectWithLabelWithoutValueDisabledIsActive }}</div>
            <div
                class="ml-24"
                style="width: 181px; height: 44px"
            >
                <base-select
                    type="basic"
                    label="Тип номера"
                    :with-dropdown="false"
                    value="Standart"
                    v-model="basicSelectWithLabelWithValueIsActive"
                ></base-select>
            </div>
            <div class="ml-24">{{ basicSelectWithLabelWithValueIsActive }}</div>
            <div
                class="ml-24"
                style="width: 181px; height: 44px"
            >
                <base-select
                    type="basic"
                    label="Тип номера"
                    :with-dropdown="false"
                    value="Standart"
                    disabled
                    v-model="basicSelectWithLabelWithValueDisabledIsActive"
                ></base-select>
            </div>
            <div class="ml-24">{{ basicSelectWithLabelWithValueDisabledIsActive }}</div>
            <div
                class="ml-24"
                style="width: 181px; height: 44px"
            >
                <base-select
                    type="basic"
                    label="Тип номера"
                    :with-dropdown="false"
                    value=""
                    error="Выберите номер"
                    v-model="basicSelectWithErrorIsActive"
                ></base-select>
            </div>
            <div class="ml-24 mt-12">{{ basicSelectWithErrorIsActive }}</div>
            <div
                class="ml-24"
                style="width: 215px; height: 56px"
            >
                <base-select
                    type="big"
                    value="Показывать по 30"
                    :with-dropdown="false"
                    v-model="bigSelectWithoutLabelIsActive"
                ></base-select>
            </div>
            <div class="ml-24">{{ bigSelectWithoutLabelIsActive }}</div>
            <div
                class="ml-24"
                style="width: 215px; height: 56px"
            >
                <base-select
                    type="big"
                    value="Показывать по 30"
                    :with-dropdown="false"
                    disabled
                    v-model="bigSelectWithoutLabelDisabledIsActive"
                ></base-select>
            </div>
            <div class="ml-24">{{ bigSelectWithoutLabelDisabledIsActive }}</div>
            <div
                class="ml-24"
                style="width: 215px; height: 56px"
            >
                <base-select
                    type="big"
                    label="Тип номера"
                    :with-dropdown="false"
                    value=""
                    v-model="bigSelectIsActive"
                ></base-select>
            </div>
            <div class="ml-24">{{ bigSelectIsActive }}</div>
            <div
                class="ml-24"
                style="width: 215px; height: 56px"
            >
                <base-select
                    type="big"
                    label="Тип номера"
                    :with-dropdown="false"
                    disabled
                    value=""
                    v-model="bigSelectDisabledIsActive"
                ></base-select>
            </div>
            <div class="ml-24">{{ bigSelectDisabledIsActive }}</div>
            <div
                class="ml-24"
                style="width: 215px; height: 56px"
            >
                <base-select
                    type="big"
                    label="Тип номера"
                    :with-dropdown="false"
                    value="Standart"
                    v-model="bigSelectWithValueWithLabelIsActive"
                ></base-select>
            </div>
            <div class="ml-24">{{ bigSelectWithValueWithLabelIsActive }}</div>
            <div
                class="ml-24"
                style="width: 215px; height: 56px"
            >
                <base-select
                    type="big"
                    label="Тип номера"
                    :with-dropdown="false"
                    disabled
                    value="Standart"
                    v-model="bigSelectWithValueWithLabelDisabledIsActive"
                ></base-select>
            </div>
            <div class="ml-24">{{ bigSelectWithValueWithLabelDisabledIsActive }}</div>
            <div
                class="ml-24"
                style="width: 215px; height: 56px"
            >
                <base-select
                    type="big"
                    label="Тип номера"
                    error="Выберите номер"
                    :with-dropdown="false"
                    value=""
                    v-model="bigSelectErrorIsActive"
                ></base-select>
            </div>
            <div class="ml-24 mt-24">{{ bigSelectErrorIsActive }}</div>
        </div>
        <div
            class="flex flex-d-c ai-fs"
            style="gap: 8px; width: fit-content"
        >
            <div
                class="ml-24"
                style="width: 185px; height: 24px"
            >
                <base-select
                    type="mini"
                    :value="selectState.activeItem"
                    v-model="selectState.isActive"
                    with-dropdown
                >
                    <base-droplist
                        v-if="selectState.isActive"
                        position-x="left"
                        position-y="bottom"
                        :list="simpleList"
                        v-model:isActive="selectState.isActive"
                        v-model:activeItem="selectState.activeItem"
                        type="basic"
                    ></base-droplist>
                </base-select>
            </div>
            <div
                class="ml-24"
                style="width: 215px; height: 56px; margin-top: 100px"
            >
                <base-select
                    type="big"
                    :value="selectState2.activeItem"
                    v-model="selectState2.isActive"
                    with-dropdown
                >
                    <base-droplist
                        v-if="selectState2.isActive"
                        position-x="center"
                        position-y="top"
                        :list="simpleList2"
                        v-model:isActive="selectState2.isActive"
                        v-model:activeItem="selectState2.activeItem"
                        type="basic"
                    ></base-droplist>
                </base-select>
            </div>
            <div
                class="ml-24"
                style="width: 215px; height: 56px; margin-top: 100px"
            >
                <base-select
                    type="big"
                    label="Город вылета"
                    with-dropdown
                    :value="selectState3.activeItem"
                    v-model="selectState3.isActive"
                >
                    <base-droplist
                        v-if="selectState3.isActive"
                        position-x="right"
                        position-y="bottom"
                        :list="simpleList3"
                        v-model:isActive="selectState3.isActive"
                        v-model:activeItem="selectState3.activeItem"
                        type="search"
                        placeholder="Город вылета"
                    ></base-droplist>
                </base-select>
            </div>
        </div>
    </div>
</template>
<script setup>
import BaseSelect from '@ui/select/BaseSelect.vue'
import BaseDroplist from '@ui/select/BaseDroplist.vue'
import { reactive, ref } from 'vue'

const miniSelectIsActive = ref(false)

const miniSelectDisabledIsActive = ref(false)

const miniSelectSortIsActive = ref(false)

const miniSelectSortDisabledIsActive = ref(false)

const basicSelectIsActive = ref(false)

const basicSelectDisabledIsActive = ref(false)

const basicSelectWithLabelWithoutValueIsActive = ref(false)

const basicSelectWithLabelWithoutValueDisabledIsActive = ref(false)

const basicSelectWithLabelWithValueIsActive = ref(false)

const basicSelectWithLabelWithValueDisabledIsActive = ref(false)

const basicSelectWithErrorIsActive = ref(false)

const bigSelectWithoutLabelIsActive = ref(false)

const bigSelectWithoutLabelDisabledIsActive = ref(false)

const bigSelectIsActive = ref(false)

const bigSelectDisabledIsActive = ref(false)

const bigSelectWithValueWithLabelIsActive = ref(false)

const bigSelectWithValueWithLabelDisabledIsActive = ref(false)

const bigSelectErrorIsActive = ref(false)

const simpleList = reactive([
    'По возрастанию цены',
    'По убыванию цены',
    'По возрастанию даты',
    'По убыванию даты',
    'По убыванию даты 2',
])

const simpleList2 = reactive(['Показывать по 30', 'Показывать по 60', 'Показывать по 90'])

const simpleList3 = reactive(['Москва', 'Санкт-Петербург', 'Барнаул', 'Казань', 'Смоленск', 'Тверь', 'Ростов', 'Краснодар'])

const selectState = reactive({ isActive: false, activeItem: 'По возрастанию цены' })

const selectState2 = reactive({ isActive: false, activeItem: 'Показывать по 30' })

const selectState3 = reactive({ isActive: false, activeItem: '' })
</script>
<style></style>
