import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PositionsForm from './PositionsForm.vue'
import BaseInput from '@ui/inputs/BaseInput.vue'
import BaseTextarea from '@ui/inputs/BaseTextarea.vue'
import BaseButton from '@/components/ui/buttons/BaseButton.vue'
import BaseSelect from '@/components/ui/select/BaseSelect.vue'
import vClickOutside from 'click-outside-vue3'

describe('PositionsForm', () => {
    it('форма рендерится корректно с переданными начальными значениями', () => {
        const wrapper = mount(PositionsForm, {
            props: {
                initialData: {
                    code: '123',
                    name: 'Developer',
                    description: 'Develops stuff',
                    departments: [],
                },
            },
            global: {
                directives: {
                    'click-outside': vClickOutside,
                },
            },
        })

        // Проверка существования компонентов
        const [codeInput, nameInput] = wrapper.findAllComponents(BaseInput)
        const textarea = wrapper.findComponent(BaseTextarea)
        const select = wrapper.findComponent(BaseSelect)
        const button = wrapper.findComponent(BaseButton)

        expect(codeInput.exists()).toBe(true)
        expect(nameInput.exists()).toBe(true)
        expect(textarea.exists()).toBe(true)
        expect(select.exists()).toBe(true)
        expect(button.exists()).toBe(true)

        // Проверка значений
        expect(codeInput.find('input').element.value).toBe('123')
        expect(nameInput.find('input').element.value).toBe('Developer')
        expect(textarea.find('textarea').element.value).toBe('Develops stuff')
    })

    it('обновляется значение в formData при изменении input', async () => {
        const wrapper = mount(PositionsForm, {
            global: {
                directives: {
                    'click-outside': vClickOutside,
                },
            },
        })
        const input = wrapper.findComponent(BaseInput)
        await input.setValue('New Code')
        expect(wrapper.vm.formData.code).toBe('New Code')
    })

    it('проверка валидации, при начальных данных кнопка сохранить заблокирована и разблокируется когда поле name заполнено', async () => {
        const wrapper = mount(PositionsForm, {
            props: {
                initialData: {
                    code: '',
                    name: '',
                    description: '',
                    departments: [],
                },
            },
            global: {
                directives: {
                    'click-outside': vClickOutside,
                },
            },
        })
        // Проверяем, что кнопка disabled при начальном значении формы
        expect(wrapper.find('button').element.disabled).toBe(true)
        const [, nameInput] = wrapper.findAllComponents(BaseInput)

        await nameInput.setValue('New Name')
        // Проверяем, что кнопка не disabled при заполненном поле name
        expect(wrapper.find('button').element.disabled).toBe(false)
    })

    it('проверка, что все введённые данные отправлены по эмиту', async () => {
        const wrapper = mount(PositionsForm, {
            props: {
                initialData: {
                    code: '',
                    name: '',
                    description: '',
                    departments: [],
                },
            },
            global: {
                directives: {
                    'click-outside': vClickOutside,
                },
            },
        })

        const [codeInput, nameInput] = wrapper.findAllComponents(BaseInput)
        const textarea = wrapper.findComponent(BaseTextarea)

        await codeInput.setValue('New Code')
        await nameInput.setValue('New Name')
        await textarea.setValue('New Description')

        await wrapper.find('form').trigger('submit.prevent')
        expect(wrapper.emitted()).toHaveProperty('submit')

        const emittedData = wrapper.emitted().submit[0][0]
        expect(emittedData).toEqual({
            code: 'New Code',
            name: 'New Name',
            description: 'New Description',
            departments: [],
        })
    })
})
