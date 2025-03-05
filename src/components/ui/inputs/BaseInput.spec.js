import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import component from './BaseInput.vue'

describe('BaseInput component', () => {
    const buildWrapper = (disabled = false) => {
        const propsData = {
            errorText: 'Error Message',
            isRequired: true,
            disabled,
            placeholder: 'Введите текст',
            type: 'text',
            maxlen: '10'
        }
        return mount(component, {
            propsData,
        })
    }
    it('mounts without error', () => {
        const wrapper = buildWrapper()
        expect(wrapper.exists).toBeTruthy()
        expect(wrapper.html()).toMatchSnapshot()
    })
    it('check error text', () => {
        const wrapper = buildWrapper()
        expect(wrapper.get('.input__error-text').text()).toContain('Error Message')
    })
    it('check placeholder', () => {
        const wrapper = buildWrapper()
        expect(wrapper.find('label').text()).toContain('Введите текст')
    })
    it('check Required class', () => {
        const wrapper = buildWrapper()
        expect(wrapper.find('label').attributes().class).includes('required')
    })
    it('input type', () => {
        const wrapper = buildWrapper()        
        expect(wrapper.find('input').attributes().type).toBe('text')
    })
    it('check .active class', async () => {
        const wrapper = buildWrapper()
        const label = wrapper.find('label')
        const input = wrapper.find('input')
        await input.setValue('hello!')
        expect(label.attributes().class).includes('active')
    })
    it('check v-modal event', async () => {
        const wrapper = buildWrapper()
        const input = wrapper.find('input')
        await input.setValue('hello!')        
        expect(wrapper.emitted()['update:modelValue'][0]).includes('hello!')
    })
    it('check disabled props', () => {
        const wrapper = buildWrapper(true)
        expect(wrapper.find('input').attributes().disabled).toBe('')
    })
})
