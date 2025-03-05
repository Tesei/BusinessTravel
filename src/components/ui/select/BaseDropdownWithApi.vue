<template>
    <div
        class="base-dropdown-with-api shadow-5dp radius-16"
        :style="position"
        @click.stop
    >
        <base-input
            :placeholder="placeholder"
            v-maska="options"
            v-model="inputValue"
        ></base-input>
        <div
            class="base-dropdown-with-api__items custom-scroll"
            @scroll="changePage"
            ref="scrollElement"
        >
            <template v-if="!preloader">
                <template v-if="apiList.length">
                    <div
                        class="base-dropdown-with-api__item body_S"
                        v-for="item in activeItems"
                        @click="changeActiveItem(item)"
                        :key="item.id"
                    >
                        <div class="base-dropdown-with-api__item_name">{{ itemName(item) }}</div>
                        <IconSprite
                            name="common--checkmark"
                            className="icon"
                        />
                    </div>
                    <div
                        class="base-dropdown-with-api__item body_S"
                        v-for="item in list"
                        @click="changeActiveItem(item)"
                        :key="item.id"
                    >
                        <div class="base-dropdown-with-api__item_name">{{ itemName(item) }}</div>
                    </div>
                </template>
                <base-data-not-available
                    v-if="!apiList.length"
                    :title="notDataTitle"
                    description="Попробуйте изменить поисковый запрос"
                ></base-data-not-available>
            </template>
            <template v-else>
                <base-skeleton
                    v-for="count in lineCount"
                    :key="count"
                    skeleton-height="22px"
                    class="mb-16 mt-16"
                ></base-skeleton>
            </template>
        </div>
    </div>
</template>

<script setup>
import { computed, defineModel, defineProps, nextTick, onMounted, reactive, ref, useTemplateRef, watch } from 'vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseInput from '@ui/inputs/BaseInput.vue'
import BaseDataNotAvailable from '@ui/BaseDataNotAvailable.vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'
import { useUserStore } from '@/store/user/index.js'
import apiClient from '@/services/apiClient.js'
import { vMaska } from 'maska/vue'
import { useDebounce } from '@/composables/useDebounce.js'

/**
 * Dropdown-компонент позволяет совершать поиск элементов списка посредством API-запроса.
 * @property {String} searchType Тип поиска ('directions', 'counterparties', 'positions', 'departments'), можно расширить.
 * От данного prop зависит на какой breakpoint api будет ходить компонент для получения apiList.
 * При расширении добавляем новый тип url в computed searchPath.
 * @property {String} locationType Тип поиска локации (Для searchType - directions);
 * @property {String} positionY Расположение по оси Y ('top', 'bottom'), где отображается компонент сверху или снизу.
 * @property {String} placeholder Placeholder для инпута.
 * @property {String} notDataTitle title для base-data-not-available.
 * @property {Boolean} multipleSelection Возможность множественного выбора.
 * @property {Number} lineCount Количество строк для блока со scroll.
 * @property {Boolean} onlyCyrillic Ограничение на ввод только кириллицы.
 */
const props = defineProps({
    searchType: {
        type: String,
        required: true,
        validator(value) {
            return ['directions', 'counterparties', 'employees', 'companies', 'positions', 'departments'].includes(value)
        },
    },
    locationType: {
        type: String,
        default: 'city',
    },
    positionY: {
        type: String,
        required: true,
        validator(value) {
            return ['top', 'bottom'].includes(value)
        },
    },
    placeholder: {
        type: String,
    },
    notDataTitle: {
        type: String,
        required: true,
    },
    multipleSelection: {
        type: Boolean,
        default: false,
    },
    lineCount: {
        type: Number,
        default: 3,
    },
    onlyCyrillic: {
        type: Boolean,
        default: false,
    },
})

const userStore = useUserStore()

// Управление состоянием isActive и activeItems родителя
const isActive = defineModel('isActive', { required: true })
const activeItems = defineModel('activeItems', { required: true })

const inputValue = ref('')
const position = reactive({})
const apiList = ref([])
const page = ref(1)
const pageSize = ref(30)
const maxPages = ref(null)
const options = reactive({})
const preloader = ref(true)

const scrollElement = useTemplateRef('scrollElement')
const lastScrollTop = ref(0)

const list = computed(() => {
    const filteredApiList = apiList.value.filter((el) => !activeItems.value.some((item) => el.id === item.id))
    return activeItems.value.length ? filteredApiList : apiList.value
})

const heightDropdown = computed(() => {
    return props.lineCount * 54 + 48 + 72 + 'px'
})

// в зависимости от searchType формируется поисковый url
const searchPath = computed(() => {
    let url = '/v1/btmanagement/'
    let companies = '/v1/btservice/companies/receiving/find'
    switch (props.searchType) {
        case 'directions':
            url = url + `${props.searchType}?page=${page.value}&pageSize=${pageSize.value}&locationTypes=${props.locationType}`
            break
        case 'counterparties':
            url = url + `${props.searchType}?page=${page.value}&pageSize=${pageSize.value}&isActive=false`
            break
        case 'employees':
            url = url + `${props.searchType}?page=${page.value}&pageSize=${pageSize.value}&isActive=true`
            break
        case 'companies':
            url = companies + `?page=${page.value}&pageSize=${pageSize.value}&isActive=true`
            break
        case 'positions':
            url = url + `${props.searchType}?page=${page.value}&pageSize=${pageSize.value}`
            break
        case 'departments':
            url = url + `${props.searchType}?page=${page.value}&pageSize=${pageSize.value}`
            break
    }
    return url
})

// в зависимости от searchType выбираем поле (или то, что нужно) для отображения в item
const itemName = (item) => {
    switch (props.searchType) {
        case 'directions':
            return item.nameRus
        case 'positions':
            return item.name
        case 'departments':
            return item.name
        case 'counterparties':
            return item.shortName
        case 'employees':
            return `${item.lastName} ${item.firstName} • ${item.positionName} • ${item.departmentName}`
        case 'companies':
            return item.name
    }
}

const changeActiveItem = (item) => {
    if (!activeItems.value.some((el) => el.id === item.id)) {
        if (props.multipleSelection) {
            activeItems.value.push(item)
        } else {
            activeItems.value = [{ ...item }]
            isActive.value = false
        }
    } else {
        if (props.multipleSelection) {
            activeItems.value = [...activeItems.value.filter((el) => el.id !== item.id)]
        } else {
            activeItems.value = []
        }
    }
}

const setPosition = () => {
    props.positionY === 'bottom' ? (position.top = 'calc(100% + 8px)') : (position.bottom = 'calc(100% + 8px)')
    position.left = 0
}

const setMaskOptions = () => {
    if (props.onlyCyrillic) {
        options.mask = 'A'
        options.tokens = {
            A: { pattern: /[а-яА-ЯёЁ]/, repeated: true },
        }
    }
}

const fetchList = async (type) => {
    const authToken = userStore.incomingTokens.type + ' ' + userStore.incomingTokens.accessToken
    try {
        preloader.value = true
        const res = await apiClient({
            method: 'GET',
            url: inputValue.value ? searchPath.value + `&search=${inputValue.value}` : searchPath.value,
            headers: {
                Authorization: authToken,
            },
        })
        if (type === 'default') {
            apiList.value = [...res.data.items]
        } else if (type === 'pagination') {
            apiList.value = [...apiList.value, ...res.data.items]
        }
        maxPages.value = Math.ceil(res.data.totalCount / pageSize.value)
    } catch (error) {
        console.error('fetchList', error)
    } finally {
        preloader.value = false
        await nextTick()
        scrollElement.value.scrollTop = lastScrollTop.value
    }
}

const fetchDebounce = useDebounce(() => {
    fetchList('default')
})

const changePage = (event) => {
    if (
        event.target.scrollTop > event.target.scrollHeight - event.target.clientHeight - 5 &&
        page.value < maxPages.value &&
        apiList.value.length &&
        !preloader.value
    ) {
        lastScrollTop.value = event.target.scrollTop
        page.value++
    }
}

onMounted(() => {
    setPosition()
    setMaskOptions()
    fetchList('default')
})

watch(inputValue, () => {
    page.value = 1
    lastScrollTop.value = 0
    fetchDebounce()
})

watch(page, (value) => {
    if (value > 1) fetchList('pagination')
})
</script>

<style scoped lang="scss">
.base-dropdown-with-api {
    background-color: $color-white;
    position: absolute;
    z-index: 20;
    cursor: default;
    display: flex;
    flex-direction: column;
    padding: 24px;
    max-height: v-bind(heightDropdown);
    width: 100%;
    // base-dropdown-with-api__items
    &__items {
        display: flex;
        flex-direction: column;
        height: fit-content;
        max-height: calc(100% - 72px);
        margin-top: 16px;
        overflow-y: auto;
    }
    // base-dropdown-with-api__item
    &__item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        max-width: 100%;
        background-color: $color-white;
        min-height: 54px;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        .icon {
            width: 24px;
            height: 24px;
        }
        &:hover {
            background-color: $color-gray-6;
        }
    }
}

.custom-scroll {
    &::-webkit-scrollbar {
        width: 3px;
    }

    &::-webkit-scrollbar-track {
        background-color: transparent;
        -webkit-border-radius: $border-radius-4;
        -moz-border-radius: $border-radius-4;
        border-radius: $border-radius-4;
    }

    &::-webkit-scrollbar-thumb {
        background-color: $color-gray-4;
        -webkit-border-radius: $border-radius-4;
        -moz-border-radius: $border-radius-4;
        border-radius: $border-radius-4;
        transition: 0.3s;

        &:active,
        &:hover {
            transition: 0.3s;
            cursor: pointer;
        }
    }
}
</style>
