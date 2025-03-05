import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import waitForExpect from 'wait-for-expect'
import PositionsPopupEdit from '@/components/positions/PositionsPopupEdit.vue'
import BaseWrapperPopupAnimated from '@ui/wrapper/BaseWrapperPopupAnimated.vue'
import PositionsForm from '@/components/positions/PositionsForm.vue'
import { usePositionsStore } from '@/store/positions'
import vClickOutside from 'click-outside-vue3'

describe('PositionsPopupEdit', () => {
    let wrapper

    beforeEach(() => {
        // Создаем тестовый экземпляр Pinia
        const pinia = createTestingPinia({
            createSpy: vi.fn, // Используем vi.fn для создания шпионов
            stubActions: true, // Включаем заглушки для действий стора
        })

        // Монтируем компонент с использованием тестового Pinia
        wrapper = mount(PositionsPopupEdit, {
            props: {
                showModal: true,
                formData: {
                    id: '6797e257-935e-45ab-959b-ad67c7e79a60',
                    counterpartyId: 'a9994858-56f0-4bec-9f2a-9ce234ecd4a9',
                    name: 'тестовая должность',
                    description: 'описание должности',
                    code: '45654888855',
                    department: null,
                    isChecked: false,
                    departments: [{}],
                },
            },
            global: {
                plugins: [pinia], // Подключаем тестовый Pinia
                stubs: {
                    BaseWrapperPopupAnimated,
                    PositionsForm,
                },
                directives: {
                    'click-outside': vClickOutside,
                },
            },
        })
    })

    it('рендерится корректно', async () => {
        // Проверяем, что компонент отображается
        expect(wrapper.findComponent(BaseWrapperPopupAnimated).exists()).toBe(true)
        expect(wrapper.findComponent(PositionsForm).exists()).toBe(true)
        expect(wrapper.exists).toBeTruthy()
    })

    it('проверка, что модальное окно рендерится в body', () => {
        // Ищем модальное окно в body
        const modal = document.body.querySelector('.modal-mask')
        expect(modal).toBeTruthy()
        expect(modal.textContent).toContain('Редактирование должности')
    })

    it('закрывает модальное окно при вызове события close', async () => {
        // Имитируем событие close
        await wrapper.findComponent(BaseWrapperPopupAnimated).vm.$emit('close')
        // Проверяем, что событие close было эмитировано
        expect(wrapper.emitted('close')).toBeTruthy()

        const modal = document.body.querySelector('.modal-mask')
        waitForExpect(() => {
            expect(modal).toBeFalsy()
        })
    })

    it('обрабатывает отправку формы и закрывает модальное окно если putPosition прошел успешно и вернул status в диапазоне от 200 до 299', async () => {
        // Получаем экземпляр стора
        const positionsStore = usePositionsStore()

        // Мокируем успешный ответ putPosition
        positionsStore.putPosition.mockResolvedValueOnce({ status: 204 })

        // Имитируем отправку формы
        const formData = {
            id: '0307dfb6-9f4d-49b3-8c37-ec4577774fa0',
            departments: [{ id: '4e00516d-5c1f-40bb-b6d6-11f58de4b054' }],
            name: 'Developer',
            code: 'DEV',
            description: 'Develops stuff',
        }
        await wrapper.findComponent(PositionsForm).vm.$emit('submit', formData)

        // Проверяем, что putPosition был вызван с правильными данными
        expect(positionsStore.putPosition).toHaveBeenCalledWith(
            {
                departmentId: '4e00516d-5c1f-40bb-b6d6-11f58de4b054',
                name: 'Developer',
                code: 'DEV',
                description: 'Develops stuff',
            },
            '0307dfb6-9f4d-49b3-8c37-ec4577774fa0',
        )

        // Проверяем, что fetchPositions был вызван
        expect(positionsStore.fetchPositions).toHaveBeenCalled()

        // Проверяем, что модальное окно закрылось
        expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('не вызывает fetchPositions и не закрывает модальное окно при ошибке в putPosition', async () => {
        // Мокируем console.log, чтобы подавить вывод ошибки
        const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
        // Получаем экземпляр стора
        const positionsStore = usePositionsStore()

        // Мокируем ошибку createPosition
        positionsStore.putPosition.mockRejectedValueOnce(new Error('Ошибка'))

        // Имитируем отправку формы
        const formData = {
            id: '0307dfb6-9f4d-49b3-8c37-ec4577774fa0',
            departments: [{ id: '4e00516d-5c1f-40bb-b6d6-11f58de4b054' }],
            name: 'Developer',
            code: 'DEV',
            description: 'Develops stuff',
        }
        await wrapper.findComponent(PositionsForm).vm.$emit('submit', formData)

        // Проверяем, что putPosition был вызван с правильными данными
        expect(positionsStore.putPosition).toHaveBeenCalledWith(
            {
                departmentId: '4e00516d-5c1f-40bb-b6d6-11f58de4b054',
                name: 'Developer',
                code: 'DEV',
                description: 'Develops stuff',
            },
            '0307dfb6-9f4d-49b3-8c37-ec4577774fa0',
        )

        // Проверяем, что fetchPositions не был вызван
        expect(positionsStore.fetchPositions).not.toHaveBeenCalled()

        // Проверяем, что модальное окно не закрылось
        expect(wrapper.emitted('close')).toBeFalsy()

        // Проверяем, что console.log был вызван с ошибкой
        expect(consoleLogSpy).toHaveBeenCalledWith('Error in handleSubmit when changing position:', expect.any(Error))

        // Восстанавливаем оригинальный console.log
        consoleLogSpy.mockRestore()
    })

    it('передает состояние preloader в PositionsForm', async () => {
        // Получаем экземпляр стора
        const positionsStore = usePositionsStore()

        // Устанавливаем preloader в true
        positionsStore.preloader = true

        // Обновляем компонент, чтобы применить изменения
        await wrapper.setProps({})

        // Проверяем, что preloader передается в PositionsForm
        expect(wrapper.findComponent(PositionsForm).props('preloader')).toBe(true)
    })
})
