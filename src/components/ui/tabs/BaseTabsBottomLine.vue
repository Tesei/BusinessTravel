<template>
    <div class="tabs">
        <div class="tabs__row">
            <div
                v-for="(tab, index) in tabArr"
                :key="index"
                @click="onTabClick(tab.value)"
                class="font-button_M c-gray pointer tabs__item"
                :class="tab.value === activeTab ? 'tabs__item_active' : ''"
            >
                <div class="tabs__item-label">{{ tab.label }}</div>
            </div>
        </div>
        <slot :name="activeTab"></slot>
    </div>
</template>

<script setup>
/**
    Компонент отображает вкладки  с нижним подчёркиванием в дизайне
    принимает пропсами массив табов и активную вкладку (если активная не задана, то активная - первая вкладка);
    через именнованные слоты отображает контент вкладки
        label - название вкладки
        value - идентификатор вкладки
        route - маршрут на который будет переход при клике на вкладку (необязательный)
    Пример использования:
        <base-tabs-bottom-line
            :tabArr="[
                {
                label: 'Контрагенты',
                value: 'tab1',
                route: '/settings/tab1'
                },
                {
                label: 'Договоры',
                value: 'tab2',
                route: '/settings/tab2'
                },]"
            :activeTabValue="tabArray[2].value"
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
        </base-tabs-bottom-line >
*/
import { onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
    activeTabValue: {
        type: String,
        required: false,
    },

    tabArr: {
        type: Array,
        default: ()=>[],
    },
})
const activeTab = ref(props.activeTabValue || props.tabArr?.[0]?.value)
const router = useRouter()
const route = useRoute()
const onTabClick = (value) => {
    activeTab.value = value
    const tab = props.tabArr.find((tab) => tab.value === value)
    if (tab && tab.route) {
        router.push(tab.route)
    }
}
// Если у активного таба есть маршрут, то переходим на него
onMounted(() => {
    if (activeTab.value) {
        const tab = props.tabArr.find((tab) => tab.value === activeTab.value)
        if (tab && tab.route) {
            router.push(tab.route)
        }
    }
})

// Следим за изменением маршрута и обновляем активный таб
watch(
    () => route.path, // Следим за изменением текущего пути
    (newPath) => {
        const matchingTab = props.tabArr.find((tab) => tab.route === newPath) // Ищем таб, соответствующий текущему маршруту
        if (matchingTab) {
            activeTab.value = matchingTab.value
        }
    },
    { immediate: true } // Выполнить сразу при загрузке
)
</script>

<style scoped lang="scss">
.tabs {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;

    .tabs__row {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: flex-start;
        position: relative;

        .tabs__item {
            &::after {
                content: '';
                position: absolute;
                display: block;
                left: 0;
                right: 0;
                margin-top: -4px;
                height: 4px;
                z-index: -1;
                background-color: $color-gray-3;
                border-radius: $border-radius-2;
            }
            .tabs__item-label {
                position: relative;
                padding: 24px 24px 30px 24px;
            }
            /* .tabs__item_active .tabs__item-label  */
            &_active .tabs__item-label {
                color: $color-cornflower;

                &::after {
                    content: '';
                    position: absolute;
                    bottom: 0px;
                    right: 0;
                    height: 4px;
                    background-color: $color-cornflower;
                    border-radius: $border-radius-2;
                    z-index: 0;
                    animation-name: wide-width;
                    animation-duration: 0.3s;
                    animation-timing-function: ease-out; // Задаёт сценарий развития анимации между ключевыми кадрами.
                    animation-delay: 0s;
                    animation-fill-mode: forwards; //Определяет какие значения анимируемых css свойств применятся к объекту после завершения анимации.

                    @keyframes wide-width {
                        from {
                            width: 1%;
                            left: 50%;
                        }
                        to {
                            width: 100%;
                            left: 0%;
                        }
                    }
                }
            }
        }
    }
}
</style>
