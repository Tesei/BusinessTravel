<template>
    <nav
        role="navigation"
        aria-label="Pagination"
        class="pagination"
    >
        <ul class="flex gap_8">
            <li>
                <button
                    :class="['pagination__box rotate_180', currentPage === 1 ? 'disabled' : '']"
                    @click="handlePrev"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M10.2474 7L9 8.2487L12.505 12L9 15.7513L10.2474 17L15 12L10.2474 7Z"
                            fill="current"
                        ></path>
                    </svg>
                </button>
            </li>
            <template
                v-for="page in pagesArray"
                :key="page"
            >
                <li>
                    <button
                        v-if="page"
                        :class="['pagination__box Heading_5', page === currentPage ? 'pagination__box_active' : '']"
                        @click="handleClickPage(page)"
                    >
                        {{ page }}
                    </button>
                    <div
                        v-else
                        class="flex gap_8 dot_bottom"
                    >
                        <div class="dot dot_4 dot_selected_turnOff"></div>
                        <div class="dot dot_4 dot_selected_turnOff"></div>
                        <div class="dot dot_4 dot_selected_turnOff"></div>
                    </div>
                </li>
            </template>
            <button
                :class="[
                    'pagination__box',
                    currentPage === pagesArray[pagesArray.length - 1] ? 'disabled' : '',
                ]"
                @click="handleNext"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10.2474 7L9 8.2487L12.505 12L9 15.7513L10.2474 17L15 12L10.2474 7Z"
                        fill="current"
                    ></path>
                </svg>
            </button>
        </ul>
    </nav>
</template>

<script setup>
import {  defineProps, defineEmits, computed } from 'vue'

/**
 * Компонент отображает пагинацию страниц исходя из полученных данных (количество записей, активная страница, лимит).
 * Первая и последняя страница отображаются всегда, также всегда отображаются соседние с активной  страницы и кнопки навигации (<, >).
 * Если между активной страницой и последней/первой страницой больше  2-х страниц, то вместо номеров отображаются точки
 * например если ативная страница 4 то отображатся будут 1 ... 3 <4> 5 ... 10,
 *          если ативная страница 3 то отображатся будут 1 2 <3> 4  ... 10.
 * 
 *
 * @property {Number} props.countRecords  общее количество записей
 * @property {Number} props.activePage активная страница
 * @property {Number} props.limit  количество записей отображаемых на странице (по умолчанию 30)
 */

const props = defineProps({
    countRecords: {
        type: Number,
        required: true,
    },
    activePage: {
        type: Number,
        required: true,
        default: 1,
    },
    limit: {
        type: Number,
        required: true,
        default: 30,
    },
})

const emit = defineEmits(['setActivePage'])

const currentPage = computed(() => {
    return props.activePage
})

const getPageCount = (countRecords, limit = 10) => {
    return Math.ceil((Number(countRecords) || 1) / limit) // даже если записей нет, в пагинации должна отображаться 1 страница
}

const getPagesArray = (length, activePage) => {
    const indent = 1 //отступ от активной страницы

    let left = Math.max(activePage - indent, 1)
    let right = Math.min(left + indent * 2, length)
    // Корректировка когда страница в конце
    left = Math.max(right - indent * 2, 1)

    // Массив номеров, чтобы удобней рендерить
    let items = []
    // Первая страница всегда нужна
    if (left > 1) items.push(1)
    // Пропуск
    if (left > 2) items.push(null)
    // Последовательность страниц
    for (let page = left; page <= right; page++) items.push(page)
    // Пропуск
    if (right < length - 1) items.push(null)
    // Последняя страница
    if (right < length) items.push(length)

    return items
}

const handleNext = () => {

    if (currentPage.value < getPageCount(props.countRecords, props.limit)) {
        emit('setActivePage', currentPage.value + 1)
    }
}

const handlePrev = () => {
    if (currentPage.value > 1) {
        emit('setActivePage', currentPage.value - 1)
    }
}

const handleClickPage = (page) => {
    if (page !== currentPage.value) {
        emit('setActivePage', page)
    }
}

const pagesArray = computed(() => {
    return getPagesArray(getPageCount(props.countRecords, props.limit), currentPage.value)
})

</script>

<style scoped lang="scss">
li {
    display: flex;
}
.pagination {
    margin: 0;
    align-self: flex-start;
}

.pagination__box {
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s;
}

.pagination__box:hover:not(.pagination__box_active) {
    border-color: $color-cornflower;
    color: $color-cornflower;
    transition: border-color 0.2s, color 0.2s;
}

.pagination__box.disabled {
    pointer-events: none;
}
.pagination__box > svg {
    fill: $color-black;
    transition: fill 0.2s;
}

.pagination__box:hover > svg {
    fill: $color-cornflower;
    transition: fill 0.2s;
}

.pagination__box.disabled > svg {
    fill: $color-gray-4;
}
</style>
