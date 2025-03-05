// companies.store.test.js
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCompaniesStore } from '@/store/companies'
import apiClient from '@/services/apiClient'
import waitForExpect from 'wait-for-expect'
import flushPromises from 'flush-promises'

describe('Companies Store', () => {
    let store
    const mockData = {
        items: [
            { id: 1, name: 'Company 1' },
            { id: 2, name: 'Company 2' },
        ],
        totalCount: 2,
    }
    beforeEach(() => {
        setActivePinia(createPinia())
        store = useCompaniesStore()
    })

    describe('Инициализация стора', () => {
        it('Проверка корректной инициализации стора', () => {
            expect(store.preloader).toBe(false)
            expect(store.getCompaniesItems).toEqual([])
            expect(store.searchParams).toEqual({
                page: 1,
                pageSize: 30,
                search: '',
            })
            expect(store.companies).toEqual({
                items: [],
                countRecords: 0,
                advancedSearch: false,
            })
        })
    })

    describe('fetchCompanies', () => {
        it('запрос комапний, проверка fetchCompanies', async () => {
            // eslint-disable-next-line no-import-assign
            apiClient = vi.fn().mockResolvedValue({
                status: 200,
                data: mockData,
            })
            // ! Act
            await store.fetchCompanies({
                page: 1,
                pageSize: 30,
                search: '',
            })
            // ! Assert
            await flushPromises()
            await waitForExpect(() => {
                expect(store.companies.items).toEqual(mockData.items)
                expect(store.companies.countRecords).toBe(mockData.totalCount)
            })
        })
    })

    describe('Getters', () => {
        it('Геттер getCompaniesItems возвращает массив компаний', async () => {
            store.companies.items = [{ id: 1, name: 'Test' }]

            await waitForExpect(() => {
                expect(store.getCompaniesItems).toEqual([{ id: 1, name: 'Test' }])
            })
        })
    })
})
