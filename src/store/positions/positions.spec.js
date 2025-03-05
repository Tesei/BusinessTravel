import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { usePositionsStore } from './index'
import { setActivePinia, createPinia } from 'pinia'
import apiClient from '@/services/apiClient'
import { flushPromises } from '@vue/test-utils'
import waitForExpect from 'wait-for-expect'

describe('usePositionsStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    afterEach(() => {
        vi.resetAllMocks()
    })

    it('fetchPositions с параметрами поиска', async () => {
        const positionsStore = usePositionsStore(createPinia())
        positionsStore.searchParams.search = 'тест'

        // eslint-disable-next-line no-import-assign
        apiClient = vi.fn().mockResolvedValue({
            status: 200,
            data: {
                items: [
                    {
                        id: '111111111',
                        counterpartyId: '2222222',
                        name: 'тест',
                        description: 'Тест описание',
                        code: '555555555',
                        department: {
                            id: '00000000',
                            name: 'ООО Департамент1',
                            code: '777777777452',
                            headEmployeeId: null,
                        },
                    },
                ],
                totalCount: 1,
            },
        })

        await positionsStore.fetchPositions()

        await flushPromises()
        await waitForExpect(() => {
            expect(positionsStore.positions).toEqual([
                {
                    id: '111111111',
                    counterpartyId: '2222222',
                    name: 'тест',
                    description: 'Тест описание',
                    code: '555555555',
                    department: {
                        id: '00000000',
                        name: 'ООО Департамент1',
                        code: '777777777452',
                        headEmployeeId: null,
                    },
                    isChecked: false,
                },
            ])
            expect(positionsStore.positionsTotalCount).toBe(1)
            expect(positionsStore.preloader).toBe(false)
        })
    }, 10000)
})
