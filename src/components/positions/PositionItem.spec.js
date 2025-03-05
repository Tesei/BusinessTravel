import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PositionItem from './PositionItem.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseTooltip from '@ui/BaseTooltip.vue'

describe('PositionItem', () => {
    let wrapper

    const positionMock = {
        code: '123',
        name: 'Test Position',
        description: 'This is a test description for the position.',
        department: { name: 'Test Department' },
    }

    beforeEach(() => {
        wrapper = mount(PositionItem, {
            props: {
                position: positionMock,
                disabledEdit: false,
            },
            global: {
                components: {
                    IconSprite,
                    BaseTooltip,
                },
            },
        })
    })

    afterEach(() => {
        wrapper.unmount()
    })

    it('должен вызывать событие handleEdit при клике на иконку редактирования', async () => {
        const editIcon = wrapper.find('.edit__svg')
        await editIcon.trigger('click')
        expect(wrapper.emitted('handleEdit')).toBeTruthy()
    })

    it('должен иметь отключенную иконку редактирования, если disabledEdit  true', async () => {
        const editIcon = wrapper.find('.edit__svg')
        await editIcon.trigger('click')
        expect(wrapper.emitted('handleEdit')).toBeFalsy
    })
})
