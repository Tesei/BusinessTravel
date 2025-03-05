<template>
    <header><h1>Textarea</h1></header>
    <div
        class="flex ai-fs jc-fs"
        style="width: 100%; height: calc(100vh - 78px)"
    >
        <div
            class="flex flex-d-c ai-fs"
            style="gap: 8px; width: 100%; height: 100%"
        >
            <div
                class="ml-24 mr-24"
                style="width: 100%; height: 15%; margin-top: 50px"
            >
                <base-textarea
                    placeholder="Комментарий"
                    v-model="value1"
                    disabled
                ></base-textarea>
            </div>
            <div
                class="flex ai-c jc-sb ml-24 mr-24"
                style="width: 100%; height: 50%; gap: 8px"
            >
                <div style="width: 50%; height: 100%">
                    <base-textarea
                        placeholder="Комментарий"
                        v-model="value2"
                    ></base-textarea>
                </div>
                <div style="width: 50%; height: 100%">
                    <base-textarea
                        placeholder="Текст обращения"
                        v-model="value3"
                        error="Укажите почту, чтобы мы могли с вами связаться"
                    ></base-textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import BaseTextarea from '@ui/inputs/BaseTextarea.vue'
import { ref } from 'vue'

const value1 = ref('')
const value2 = ref('')
const value3 = ref('')
</script>

<style scoped lang="scss"></style>
