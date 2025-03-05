<template>
    <div class="base-tabs-tab-bar">
        <div :class="[classNames, { 'mobile-hide': hideMobile, 'mobile-show': showMobile }]">
            <button
                v-for="(tab, index) in tabArr"
                type="button"
                :key="index"
                @click="onTabClick(tab.value)"
                :class="[
                    'Heading_5 tab-bar__item',
                    tab.value === activeTabValue ? 'tab-bar__item_active tab-bar__item_hover' : '',
                ]"
            >
                <div class="">{{ tab.label }}</div>
                <span
                    v-if="tab.count || tab.count === 0"
                    :class="['font-button_S', 'tab-bar__number', { 'tab-bar__number_disabled': tab.value !== activeTabValue }]"
                    >{{ tab.count }}</span
                >
            </button>
        </div>
        <slot :name="activeTabValue"></slot>
    </div>
</template>

<script setup>
/**
    Компонент отображает меню табов в виде овальных кнопок в один ряд.
    Принимает пропсами массив табов и активный таб (если не задан, то первый);
    через именнованные слоты отображает контент таба
        label - название таба
        value - идентификатор таба, для передачи в template
        route - маршрут на который будет переход при клике на таб (необязательный)
        count - число в кружке рядом с названием таба (необязательный)

    @property {Array} props.tabArr  массив табов, обязательное свойство

    @property {String} props.activeTabValue  активный таб, необязательное свойство

    @property {String} props.classNames Пользовательские классы для стилизации компонента. Передается как строка аналогично class
                                        Необязательное свойство, по умолчанию `tab-bar tab-bar-numbers`.
    @property {Boolean} props.hideMobile Флаг,  добавляет в случае true класс 'mobile-hide'
                                        Необязательное свойство, по умолчанию `false`.
    @property {Boolean} props.showMobile Флаг, добавляет в случае true класс 'mobile-show'
                                        Необязательное свойство, по умолчанию `false`.
    Пример использования:
        <base-tabs-tab-bar
            :tabArr="[
                {
                label: 'Контрагенты',
                value: 'tab1',
                route: '/settings/tab1',
                count: 0
                },
                {
                label: 'Договоры',
                value: 'tab2',
                route: '/settings/tab2'
                },]"
           	:activeTabValue="activeTabValue"
            @setActiveTab="setActiveTab"
            >
            <template #tab1>
                <h1>Hello  World</h1>
                <HelloWorld msg="Vite + Vue" />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos eligendi reprehenderit, inventore laudantium quod quidem nesciunt molestiae dicta eos debitis sed distinctio repudiandae obcaecati consequatur consequuntur, neque labore, rerum magni.</p>
            </template>
            <template #tab2>
                <h1>IconSprite</h1>
                <IconSprite name="additional-services--Name=Baloon" className="a1 a2 a3" />
            </template>
        </base-tabs-tab-bar>
// в setup//
        const activeTabValue = ref('tab1')
        const setActiveTab = (tab) => {
                activeTabValue.value = tab.value
        }
}
*/
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
    activeTabValue: {
        type: String,
        required: false,
    },

    tabArr: {
        type: Array,
        default: () => [],
    },

    classNames: {
        type: String,
        required: false,
        default: 'tab-bar tab-bar-numbers',
    },
    hideMobile: {
        type: Boolean,
        required: false,
        default: false,
    },
    showMobile: {
        type: Boolean,
        required: false,
        default: false,
    },
})

const emit = defineEmits(['setActiveTab'])
const router = useRouter()
const onTabClick = (value) => {
    const tab = props.tabArr.find((tab) => tab.value === value)
    if (tab && tab.route) {
        router.push(tab.route)
    }
    emit('setActiveTab', tab)
}
</script>

<style scoped lang="scss">
.base-tabs-tab-bar {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
}
.tab-bar {
    max-width: 1170px;
    /* в верстке 772px */
    &__item {
        max-width: 500px;
    }
}
.tab-bar-limits {
    .tab-bar__item {
        max-width: 504px;
        width: 100%;
    }
}

.tab-bar__item_active {
    animation-name: wide-width;
    animation-duration: 0.3s;
    animation-timing-function: ease-out; // Задаёт сценарий развития анимации между ключевыми кадрами.
    animation-delay: 0s;
    animation-fill-mode: forwards; //Определяет какие значения анимируемых css свойств применятся к объекту после завершения анимации.

    @keyframes wide-width {
        from {
            transform: scale(0.9);
        }
        to {
            transform: scale(1);
        }
    }
}
</style>
