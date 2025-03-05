import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PositionsList from './PositionsList.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import BaseDataNotAvailable from '@ui/BaseDataNotAvailable.vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'
import ThePaginstionControll from '@ui/ThePaginstionControll.vue'
import PositionItem from '@/components/positions/PositionItem.vue'
import { createTestingPinia } from '@pinia/testing'
import { usePositionsStore } from '@/store/positions'
import PositionsPopupCreate from '@/components/positions/PositionsPopupCreate.vue'

describe('PositionsList', () => {
    let wrapper

    beforeEach(() => {
        const pinia = createTestingPinia({
            createSpy: vi.fn, // Используем vi.fn для создания шпионов
            stubActions: false, // Отключаем заглушки для действий стора
        })
        wrapper = mount(PositionsList, {
            global: {
                plugins: [pinia],
                stubs: {
                    BaseButton,
                    BaseDataNotAvailable,
                    BaseSkeleton,
                    ThePaginstionControll,
                    PositionItem,
                },
            },
        })
    })
    afterEach(() => {
        wrapper.unmount()
        vi.resetAllMocks()
    })
    it('рендерится корректно', async () => {
        expect(wrapper.findComponent(BaseButton).exists()).toBe(true)
        expect(wrapper.findComponent(BaseSkeleton).exists()).toBe(true)
    })

    it('рендерится корректно при отсутствии должностей', async () => {
        let positionsStore = usePositionsStore()
        positionsStore.preloader = false
        positionsStore.positions = {}

        await wrapper.vm.$nextTick()

        expect(positionsStore.fetchPositions).toHaveBeenCalled()
        expect(wrapper.findComponent(PositionItem).exists()).toBe(false)
        expect(wrapper.findComponent(BaseDataNotAvailable).exists()).toBe(true)
    })
    it('попап создания должности открывается', async () => {
        let positionsStore = usePositionsStore()
        positionsStore.preloader = false

        const button = wrapper.findComponent(BaseButton)
        button.attributes().disabled = false
        button.trigger('click')

        expect(wrapper.findComponent(PositionsPopupCreate).exists()).toBe(true)
    })
})
