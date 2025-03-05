import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ReceivingCompaniesItem from './ReceivingCompaniesItem.vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'
import IconSprite from '@/components/interface/IconSprite.vue'

describe('CompaniesItem', () => {
    const mockCompany = {
        id: 1,
        name: 'Test Company',
        direction: { name: 'IT' },
    }
    let wrapper
    beforeEach(() => {
        wrapper = mount(ReceivingCompaniesItem, {
            props: { company: mockCompany },
        })
    })

    it('рендерит данные компании корректно', () => {
        expect(wrapper.text()).toContain('Test Company')
        expect(wrapper.text()).toContain('IT')
    })

    it('отображает чекбокс', () => {
        const checkbox = wrapper.findComponent(BaseCheckbox)
        expect(checkbox.exists()).toBe(true)
    })

    it('корректно взаимодействует с чекбоксом', async () => {
        const checkbox = wrapper.findComponent(BaseCheckbox)

        // Проверка двустороннего связывания
        await checkbox.setValue(true)
        expect(wrapper.vm.isChecked).toBe(true)
    })

    it('отображает иконку редактирования', () => {
        const icon = wrapper.findComponent(IconSprite)

        expect(icon.exists()).toBe(true)
    })

    it('имеет правильную структуру классов', () => {
        const container = wrapper.find('.companies-container')

        expect(container.classes()).toContain('bg-gray-6')
        expect(container.classes()).toContain('radius-8')
    })
})
