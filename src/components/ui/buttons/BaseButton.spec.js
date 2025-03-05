import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import component from './BaseButton.vue'

describe('BaseButton component', () => {
    const buildWrapper = (disabled = false, toShowLoading = false) => {
        const propsData = {
            disabled,
            classNames: 'test-class',
            toShowLoading,
        }
        return mount(component, {
            propsData,
            slots: {
                default: 'Окно ввода',
            },
        })
    }
    it('mounts without error', () => {
        const wrapper = buildWrapper()
        expect(wrapper.exists).toBeTruthy()
        expect(wrapper.html()).toMatchSnapshot()
    })
    it('don have data - disabled button', () => {
        const wrapper = buildWrapper(true)
        expect(wrapper.find('button').attributes().disabled).toBe('')
    })
    it('if we have all data button - active', () => {
        const wrapper = buildWrapper(false)
        expect(wrapper.find('button').attributes().class).includes('test-class')
    })
    it('button has attribute submit', () => {
        const wrapper = buildWrapper(false)
        expect(wrapper.find('button').attributes().type).includes('submit')
    })
    it('button has attribute submit', () => {
        const wrapper = buildWrapper(false, true)
        expect(wrapper.find('button').text()).not.toContain('Окно ввода')
    })
    it('button slot has text', () => {
        const wrapper = buildWrapper()
        expect(wrapper.find('button').text()).toContain('Окно ввода')
    })
})
