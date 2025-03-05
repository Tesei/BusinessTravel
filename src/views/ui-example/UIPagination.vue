<template>
	<h2>Пагинация</h2>
        <div>   
            количество записей: <input 
                                    style="padding: 5px; border: 1px solid #000;"
                                    placeholder="Количество записей"
                                    v-model="countRecords"
                                /> 
        </div>
        <br>
        <div>   
            количество записей на странице: <input 
                                    style="padding: 5px; border: 1px solid #000;"
                                    placeholder="Количество записей"
                                    v-model="limit"
                                /> 
        </div>
         
          
		<the-pagination
            :activePage="activePage"
            @setActivePage="setActivePage"
            :countRecords="countRecords"
            :limit="limit"
        />
</template>

<script setup>
import { ref } from 'vue'
import ThePagination from '@/components/ThePagination.vue'

 
const activePage = ref(1)
const  countRecords = ref(100)
const  limit = ref(30)
const setActivePage = (page) => {
    console.log('setActivePage =>', page)
    
    activePage.value = page
}
</script>

<style scoped lang="scss">
    .title {
        margin-bottom: 16px;
    }
</style>
