import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import ReceivingCompaniesList from './ReceivingCompaniesList.vue'
import BaseContentWrapper from '@/components/ui/wrapper/BaseContentWrapper.vue'
import BaseButton from '@/components/ui/buttons/BaseButton.vue'
import BaseSearchSimple from '@/components/ui/search/BaseSearchSimple.vue'
import ReceivingCompaniesItem from '@/components/companies/ReceivingCompaniesItem.vue'
import ThePaginstionControll from '@ui/ThePaginstionControll.vue'
import BaseDataNotAvailable from '@ui/BaseDataNotAvailable.vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'
import { useCompaniesStore } from '@/store/companies'
import { useUserStore } from '@/store/user'

// Мокаем API клиент
vi.mock('@/services/apiClient', () => ({
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(),
}))

describe('Companies', () => {
    let wrapper
    let companiesStore
    let userStore

    const mockCompanies = [
        { id: 1, name: 'Company 1' },
        { id: 2, name: 'Company 2' },
    ]

    beforeEach(async () => {
        const pinia = createTestingPinia({
            createSpy: vi.fn,
            stubActions: true,
        })

        // Инициализация хранилищ
        companiesStore = useCompaniesStore(pinia)
        userStore = useUserStore(pinia)

        // Мокирование компаний
        companiesStore.$patch({
            companies: {
                countRecords: 2,
                advancedSearch: false,
            },
            getCompaniesItems: mockCompanies,
            preloader: false,
            searchParams: {
                page: 1,
                pageSize: 30,
                search: '',
            },
        })

        // Мокирование пользователя
        userStore.$patch({
            getUserPermissions: ['BusinessTravelManagement:companies.new'],
        })
        // Мокируем действия хранилища
        companiesStore.fetchCompanies = vi.fn().mockResolvedValue({})

        // Монтирование компонента
        wrapper = mount(ReceivingCompaniesList, {
            global: {
                plugins: [pinia],
                stubs: {
                    BaseContentWrapper,
                    ThePaginstionControll: ThePaginstionControll,
                    BaseDataNotAvailable,
                    BaseSkeleton,
                    ReceivingCompaniesItem,
                },
            },
        })

        await nextTick()
    })

    afterEach(() => {
        wrapper.unmount()
    })

    it('рендерится корректно', () => {
        expect(wrapper.findComponent(BaseContentWrapper).exists()).toBe(true)
        expect(wrapper.findComponent(BaseButton).exists()).toBe(true)
        expect(wrapper.findComponent(BaseSearchSimple).exists()).toBe(true)
    })

    it('вызывает fetchCompanies при монтировании', () => {
        expect(companiesStore.fetchCompanies).toHaveBeenCalled()
    })

    it('отображает скелетоны при загрузке', async () => {
        companiesStore.preloader = true
        await nextTick()

        expect(wrapper.findAllComponents(BaseSkeleton)).toHaveLength(7)
        expect(wrapper.findComponent(ReceivingCompaniesItem).exists()).toBe(false)
    })

    it('отображает сообщение о пустом списке при отсутствии данных', async () => {
        companiesStore.$patch({
            getCompaniesItems: [],
            companies: { ...companiesStore.companies, advancedSearch: true },
        })
        await nextTick()

        const emptyState = wrapper.findComponent(BaseDataNotAvailable)
        expect(emptyState.exists()).toBe(true)
        expect(emptyState.props('title')).toBe('Ни одной организации не найдено')
    })

    it('отображает сообщение `Нет созданных организаций`', async () => {
        companiesStore.$patch({
            getCompaniesItems: [],
            companies: { ...companiesStore.companies, advancedSearch: false },
        })
        await nextTick()

        const emptyState = wrapper.findComponent(BaseDataNotAvailable)
        expect(emptyState.exists()).toBe(true)
        expect(emptyState.props('title')).toBe('Нет созданных организаций')
    })

    it('обрабатывает поисковый запрос', async () => {
        const searchComponent = wrapper.findComponent(BaseSearchSimple)
        await searchComponent.vm.$emit('update:modelValue', 'test')
        await searchComponent.vm.$emit('handleSearch')

        expect(companiesStore.searchParams.search).toBe('test')
        expect(companiesStore.fetchCompanies).toHaveBeenCalled()
    })

    it('блокирует кнопку создания при отсутствии прав', async () => {
        userStore.getUserPermissions = []
        await nextTick()

        expect(wrapper.findComponent(BaseButton).attributes('disabled')).toBeDefined()
    })
})
