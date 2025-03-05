<template>
	<div
		v-if="countRecords > 0"
		class="flex jc-sb ai-c mt-40 mb-32"
	>
		<div style="width: 320px; height: 56px">
			<base-select
				type="big"
				:value="activeItem"
				v-model="isActive"
				with-dropdown
				:disabled="isLoading"
			>
				<base-droplist
					v-if="isActive"
					position-x="center"
					position-y="top"
					:list="simpleList2"
					v-model:isActive="isActive"
					v-model:activeItem="activeItem"
					type="basic"
				></base-droplist>
			</base-select>
		</div>
		<ThePagination
			v-show="!isLoading"
			:activePage="activePage"
			@setActivePage="(page) => emit('changeActivePage', page)"
			:countRecords="countRecords"
			:limit="limit"
		/>
	</div>
</template>

<script setup>
/**
* Компонент-контроллер для отображения пагинации. 
* Выводит селект с выбором количества записей на странице и пагинацию.

### Принимаемые параметры:

- `activePage` (Number): Активная страница пагинации.
    - Пример: `1`

- `countRecords` (Number): Общее количество записей.
    - Пример: `100`

- `limit` (Number): Количество записей на странице.

- `isLoading` (Boolean): Флаг, указывающий на загрузку контента.
*/
import { computed, reactive, ref } from 'vue'
import BaseDroplist from '@ui/select/BaseDroplist.vue'
import ThePagination from '@/components/ThePagination.vue'
import BaseSelect from '@ui/select/BaseSelect.vue'

const props = defineProps({
    activePage: {
        type: Number,
    },
    countRecords: {
        type: Number,
    },
    limit: {
        type: Number,
    },
    isLoading: {
        type: Boolean,
    },
})

const emit = defineEmits([ 'changeActivePage', 'changeLimit'])

const simpleList2 = reactive(['Показывать по 30', 'Показывать по 60', 'Показывать по 90'])
const isActive = ref(false)

const activeItem = computed({
    get() {
        return `Показывать по ${props.limit}`
    },
    set(val) {
        emit('changeLimit', Number(val.split(' ')[2]))
    },
})
</script>

<style scoped lang="scss">
</style>
