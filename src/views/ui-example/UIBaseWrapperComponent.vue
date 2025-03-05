<template>
    <div>
        <base-wrapper-component
            @submit="handleClick"
            :isDisabledButton="false"
        >
            <!-- Заголовок страницы и кнопка (например: Возврат к списку контрагентов) -->
            <template #title>Заголовок</template>
            <template #button>
                <div
                    class="flex f-center"
                    @click="handleClick()"
                >
                    <IconSprite
                        name="common--arrow_back"
                        className="icon__svg c-cornflower"
                    />
                    Возврат к списку контрагентов
                </div>
            </template>

            <!-- Основной контент страницы, BaseWrapperGrayBorder передаем numOfRows-количество рядов инпутов в блоке,
             например, в блоке руководитель все инпуты в макете расположены в одну линию, значит передаем 1 и тд,
            нужно для отображения высоты скелетона -->
            <template #content>
                <BaseWrapperGrayBorder
                    numOfRows="4"
                    className="full-width"
                >
                    <template #header><h4 class="Heading_4 mb-24">Название блока</h4></template>
                    <BaseInputPassword
                        class="mb-24"
                        placeholder="Новый пароль"
                        :isRequired="true"
                    />
                    <BaseInputPassword
                        class="mb-24"
                        placeholder="Новый пароль"
                        :isRequired="true"
                    />
                    <BaseInputPassword
                        class="mb-24"
                        placeholder="Новый пароль"
                        :isRequired="true"
                    />
                </BaseWrapperGrayBorder>

                <!-- Скелетон отображается в случае отсутствия значений слота, ПРИМЕР: -->
                <BaseWrapperGrayBorder
                    numOfRows="2"
                    className="full-width"
                >
                    <template #header><h4 class="Heading_4 mb-24">Название блока</h4></template>
                </BaseWrapperGrayBorder>
            </template>

            <!--
             #footer - кнопки, по дефолту
             -->
            <template #footer>
                <!-- <BaseButton classNames="font-button_S button button_blue mb-24">Доп кнопка</BaseButton> -->
            </template>
        </base-wrapper-component>
    </div>
</template>
<script setup>
import BaseWrapperComponent from '@ui/wrapper/BaseWrapperComponent.vue'
import BaseInputPassword from '@ui/inputs/BaseInputPassword.vue'
import BaseWrapperGrayBorder from '@ui/wrapper/BaseWrapperGrayBorder.vue'
import IconSprite from '@/components/interface/IconSprite.vue'

const handleClick = () => {
    console.log('click')
}
</script>
