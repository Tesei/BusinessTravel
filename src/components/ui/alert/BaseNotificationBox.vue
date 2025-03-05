<template>
    <div
        v-if="isVisible"
        class="alert"
        :class="getColor"
    >
        <slot name="picture"></slot>
        <div class="flex flex-d-c footnote_L alert__text">
            <slot name="default"></slot>
        </div>        
    </div>
</template>

<!-- Обновлённый компонент. 
    Обновление:
    - Установлены дефолтные цвета
    - создана связь со стором
-->
/** * Компонент выводит на экран уведомление

* и автоматически скрывает их через 3 секунды после отображения если не задан параметр(removeTimeout), * чтобы сообщение не
скрывалось нужно задать свойство alwaysVisible: true,  * @typedef {Object}
* @property {number}
[removeTimeout] - Количество милисекунд через которое будет удалено уведомление (необязательный) 
* @property {boolean}
[alwaysVisible] - Сообщение не удаляется (необязательный) * 

<script setup>
import { ref, onMounted, computed } from 'vue'
const emits = defineEmits(['remove'])

const props = defineProps({
    alwaysVisible: {
        type: Boolean,
        default: false,
    },
    removeTimeout: {
        type: Number,
        required: false,
        default: 3000,
        validator(value) { return value >= 3000 }
    },
    color: {
        type: String,
        default: 'gray',
        validator(value) {
            return ['red', 'green', 'blue', 'yellow', 'gray'].includes(value)
        }
    }
})
const isVisible = ref(true)
onMounted(() => {
    if (!props.alwaysVisible) {
        setTimeout(() => {
            isVisible.value = false
            emits('remove')
        }, props.removeTimeout)
    }
})

const getColor = computed(() => {   
    switch (props.color) {
        case 'red': return 'alert__attention'
        case 'green': return 'alert__success'
        case 'blue': return 'alert__cancelled'
        case 'yellow': return 'alert__warning'
        default : return 'alert__default'
    }
})
</script>

<style scoped lang="scss">
.alert {
    color: $color-black;
    align-items: center;
    text-align: left;
}
</style>
