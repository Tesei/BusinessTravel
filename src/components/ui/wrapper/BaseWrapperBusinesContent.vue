<template>
    <div class="ui-wrapper">
        <div class="ui-wrapper__header mt-40 mb-40">
            <h2 class="Heading_2 title">{{ title }}</h2>
        </div>
        <div class="ui-wrapper__body">
            <BaseSearchSimple
                placeholder="Название или ИНН контрагента"
                v-model="model"
                class="mb-40"
                @handleSearch="handleSearch"
            >
            </BaseSearchSimple>
            <div
                v-if="tabArray"
                class="flex-jcsb-aifs mb-40 row-bar"
            >
                <base-tabs-tab-bar
                    :tabArr="tabArray"
                    :activeTabValue="activeTab"
                    @setActiveTab="setActiveTab"
                >
                </base-tabs-tab-bar>
                <base-button
                    v-if="textBtnCreate"
                    classNames="font-button_M button button_transparent ml-32"
                    @click="emit('handleCreateContragent')"
                    >{{ textBtnCreate }}
                </base-button>
            </div>
            <div v-show="!isLoading">
                <slot></slot>
            </div>
            <div v-show="isLoading">
                <BaseSkeleton
                    v-for="index in 7"
                    :key="index"
                    class="mb-24"
                ></BaseSkeleton>
            </div>
        </div>
        <div class="ui-wrapper__footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script setup>
/**
* Компонент-оболочка для создания бизнес-контента.
* Используется для отображения секции с поиском, вкладками и кнопкой для создания контрагента.
* Наполнение через слоты.
* На время загрузки вместо основного слота отображается скелетон, select с выбором страниц задизейблен, пагинация скрыта.

### Принимаемые параметры:

- `title` (String): Заголовок компонента, отображаемый в шапке.
    - Пример: `"Мои контрагенты"`

- `tabArray` (Array): Массив объектов для вкладок. Каждый объект должен содержать информацию о вкладке, например, её название и идентификатор.
    - Пример: `[{ label: "Вкладка 1", value: "tab1", count: 2 }, { label: "Вкладка 2", value: "tab2", count: 0 }]`

- `activeTab` (String): Значение активной вкладки, используемое для управления текущей активной вкладкой.
    - Пример: `"tab1"`

- `setActiveTab` (Function): Функция для обновления активной вкладки. Принимает значение новой активной вкладки.
    - Пример: `(tabValue) => { console.log(tabValue); }`

- `handleSearch` (Function): Функция для обработки поиска. Вызывается при изменении значения в поле поиска.
    - Пример: `(searchTerm) => { console.log(searchTerm); }`

- `textBtnCreate` (String): Текст на кнопке для создания контрагента.
    если не указан, кнопка не будет отображаться. Эмитит событие handleCreateContragent

- `activePage` (Number): Активная страница пагинации.
    - Пример: `1`

- `countRecords` (Number): Общее количество записей.
    - Пример: `100`

- `limit` (Number): Количество записей на странице.

- `setActivePage` (Function): Функция для обновления активной страницы пагинации.
    - Пример: `(page) => { console.log(page); }`

- `isLoading` (Boolean): Флаг, указывающий на загрузку контента.
*/
import BaseSearchSimple from '@ui/search/BaseSearchSimple.vue'
import BaseTabsTabBar from '@ui/tabs/BaseTabsTabBar.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'

const props = defineProps({
    title: {
        type: String,
    },

    tabArray: {
        type: Array,
    },

    activeTab: {
        type: String,
    },
    setActiveTab: {
        type: Function,
    },
    handleSearch: {
        type: Function,
    },
    textBtnCreate: {
        type: String,
    },
    activePage: {
        type: Number,
    },
    countRecords: {
        type: Number,
    },
    limit: {
        type: Number,
    },
    setActivePage: {
        type: Function,
    },
    isLoading: {
        type: Boolean,
    },
})

const model = defineModel()

const emit = defineEmits(['handleCreateContragent'])
</script>

<style scoped lang="scss">
.ui-wrapper {
    width: 100%;

    // .ui-wrapper__header
    &__header {
    }

    // .ui-wrapper__body
    &__body {
        width: 100%;
        // .ui-wrapper__body.font-button_M.button.button_transparent
        .font-button_M.button.button_transparent {
            white-space: nowrap;
        }
    }

    // .ui-wrapper__footer
    &__footer {
    }
}
</style>
