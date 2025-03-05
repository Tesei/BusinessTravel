import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from './index'
import apiClient from '@/services/apiClient'

import flushPromises from 'flush-promises'
import waitForExpect from 'wait-for-expect'

describe('useUserStore', () => {
    beforeEach(() => {
        // создаем новый экземпляр pinia и делаем его активным,
        // чтобы он автоматически подхватывается любым вызовом useStore()
        // без необходимости его передачи: `useStore(pinia)`
        setActivePinia(createPinia())
        // vi.mock('@/services/apiClient', () => ({
        //     __esModule: true,
        //     post: vi.fn(),
        // }))
    })

    afterEach(() => {
        // очищаем моки
        vi.resetAllMocks()
    })

    it('imports without error', () => {
        expect(useUserStore).toBeDefined()
        expect(useUserStore).toMatchSnapshot()
    })
    it('наличие всех начальных переменных state', () => {
        expect(useUserStore().isLoggedIn).toBeDefined()
        expect(useUserStore().changePasswordAlerts).toBeDefined()
        expect(useUserStore().isUserFound).toBeDefined()
        expect(useUserStore().directions).toBeDefined()
        expect(useUserStore().user).toBeDefined()
        expect(useUserStore().incomingTokens).toBeDefined()
        expect(useUserStore().counterpartiesFromID).toBeDefined()
    })

    // it('defaultGoods array has items', () => {
    //     const goodsStore = useUserStore()
    //     expect(goodsStore.defaultGoods).toHaveLength(8)
    // })

    it('запрос токена, проверка fetchLogIn', async () => {
        // ! Arrange
        const userStore = useUserStore()
        // eslint-disable-next-line no-import-assign
        apiClient = vi.fn().mockResolvedValue({
            status: 200,
            data: { 
                accessToken: 'eyJhbGciOiJIUzI1NiIsI',
                refreshToken: 'NjM4NzU3MjQxODgyMzU',
                refreshTokenExpiresIn: '2025-02-21T10:43:08.2350858Z',
            },
        })        
        // ! Act
        await userStore.fetchLogIn({
            login: 'some@mail.ru',
            password: '1231232532',
        })
        // ! Assert
        await flushPromises()         
        await waitForExpect(() => {
            expect(userStore.incomingTokens.accessToken).toBe('eyJhbGciOiJIUzI1NiIsI')
            expect(userStore.isLoggedIn).toBe(true)
        })
    })
    it('проверка выхода, logout', async () => {
        const userStore = useUserStore()
        // eslint-disable-next-line no-import-assign
        apiClient = vi.fn().mockResolvedValue({
            status: 200,
            data: {},
        })        

        await userStore.logout()
        await flushPromises()         
        await waitForExpect(() => {
            expect(userStore.isLoggedIn).toBe(false)
        })
    })
})