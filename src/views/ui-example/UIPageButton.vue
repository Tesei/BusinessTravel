<template>
    <div class="flex flex-d-c ai-fs">
        <BaseButton classNames="font-button_M button button_yellow">Кнопка с текстом</BaseButton>
        <br /><br /><br />
        <BaseButton
            classNames="font-button_M button button_yellow"
            :toShowLoading="true"
        ></BaseButton>
        <br /><br /><br />
        <BaseButton
            classNames="font-button_M button button_blue"
            link="https://fstravel.com"
            linkTarget="_blank"
            :disabled="true"
            >Ссылка на fstravel.com</BaseButton
        >
        <br /><br /><br />
        <BaseButton
            classNames="font-button_M button button_blue"
            link="https://fstravel.com"
            linkTarget="_blank"
            :toShowLoading="true"
        ></BaseButton>
        <br /><br /><br />
        <BaseButton
            :disabled="true"
            :toShowLoading="true"
            >Кнопка disabled</BaseButton
        >
        <br /><br /><br />
        <BaseButton
            classNames="font-button_M button button_blue button_loader button_loader_square"
            :toShowLoading="true"
        >
        </BaseButton>
        <br /><br /><br />
        <BaseButton
            classNames="font-button_M button button_transparent"
            @handleClick="handleClick"
            >Кнопка с текстом и кликом</BaseButton
        >
        <br /><br /><br />
        <BaseButton
            classNames="font-button_M button button_transparent"
            @handleClick="handleClick"
            :disabled="true"
            >Кнопка с текстом и кликом но disabled</BaseButton
        >
        <br /><br /><br />
        <BaseButton
            classNames="font-button_M button button_transparent"
            @handleClick="handleClick"
            :toShowLoading="true"
        ></BaseButton>
    </div>
</template>
<script setup>
import BaseButton from '@ui/buttons/BaseButton.vue'

const handleClick = () => {
    alert('Кликнули')
}
</script>
<style></style>
