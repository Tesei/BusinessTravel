<template>
	<div class="search">
        <base-input
            class="search__input"
            :placeholder="placeholder"
            v-model="model"
            :maxlen="maxlen"
        />
		<base-button
            classNames="font-button_M button button_transparent search__button"
            @click="emit('handleSearch')"
            >Поиск
        </base-button>
	</div>
</template>

<script setup>
 
import { ref } from 'vue'
import BaseInput from '@ui/inputs/BaseInput.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'

const props = defineProps({
    placeholder: {
        type: String,
        required: false,
        default: 'Поиск'
    },
    maxlen: {
        type: String,
        required: false,
    }
})

const model = defineModel()
const emit = defineEmits([
    'handleSearch',
])
 
</script>

<style scoped lang="scss">

.search {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 32px;
    width: 100%;
}
.search__input{
    width: 1024px;
}
.search__button{
    width: 114px;
    height: 56px;
}
 
</style>
