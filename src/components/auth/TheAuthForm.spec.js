import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import flushPromises from 'flush-promises'
import waitForExpect from 'wait-for-expect'
import { useUserStore } from '@/store/user/index.js'
import component from './TheAuthForm.vue'
import { useRouter } from 'vue-router'

vi.mock('vue-router', () => ({
    useRoute: vi.fn(),
    useRouter: vi.fn(() => ({
        push: () => {},
    })),
}))

describe('TheAuthForm component', () => {
    // ? stubActions - будeт ли компонент подключён (true/false) к стору
    const buildWrapper = (stubActions = false) => {
        return mount(component, {
            global: {
                stubs: ['router-link', 'router-view'], // Stubs for router-link and router-view in case they're rendered in your template
                plugins: [createTestingPinia({ stubActions })],
            },
        })
    }

    it('mounts without error', () => {
        const wrapper = buildWrapper()
        expect(wrapper.exists).toBeTruthy()
        expect(wrapper.html()).toMatchSnapshot()
    })
    it('проверка заблокированной кнопки при отсутствии данных ввода', async () => {
        const wrapper = buildWrapper()
        const loginInput = wrapper.find('input[type="text"]')
        const passwordInput = wrapper.find('input[type="password"]')

        await loginInput.setValue('')
        await passwordInput.setValue('')
        expect(wrapper.find('button').attributes().disabled).toBe('')
    })
    it('наличие ссылки на /restore-password', async () => {
        const wrapper = buildWrapper()        
        expect(wrapper.find('.auth__forgot-password').attributes('href')).toBe('/restore-password')

    })

    // Пример тестирования с замоканым роутом
    it('проверка перехода на WelcomePage', async () => {
        //   useRoute.mockImplementationOnce(() => ({
        //     params: {
        //       id: 1
        //     }
        //   }))
        const push = vi.fn()
        useRouter.mockImplementationOnce(() => ({
            push,
        }))
        const wrapper = buildWrapper(true)
        const store = useUserStore() // ? должно стоять после wrapper

        store.userAuthorized = true
        store.fetchLogIn.mockResolvedValue({ accessToken: '23112312' })
        store.uploadProfile.mockResolvedValue({ permissions: ['1', '2'] })

        const loginInput = wrapper.find('input[type="text"]')
        const passwordInput = wrapper.find('input[type="password"]')

        await loginInput.setValue('')
        await passwordInput.setValue('')
        await loginInput.setValue('testad1@mail.ru')
        await passwordInput.setValue('1342Df!352353532532')
        await wrapper.get('form').trigger('submit') // working !

        await flushPromises()
        await waitForExpect(() => {
            // ? Проверка вызова функций:
            expect(store.fetchLogIn).toHaveBeenCalledTimes(1)
            expect(store.fetchLogIn).toHaveBeenCalledWith({
                login: 'testad1@mail.ru',
                password: '1342Df!352353532532',
            })
            expect(store.uploadProfile).toHaveBeenCalledTimes(1)
            
            // ? Проверка перехода по верному роуту:
            expect(push).toHaveBeenCalledTimes(1)
            expect(push).toHaveBeenCalledWith({ name: 'WelcomePage' })
        })
    })

    it('проверка перехода на /incorrect-profile', async () => {
        const push = vi.fn()
        useRouter.mockImplementationOnce(() => ({
            push,
        }))
        const wrapper = buildWrapper(true)
        const store = useUserStore() // ? должно стоять после wrapper
        store.userAuthorized = true
        store.fetchLogIn.mockResolvedValue({ accessToken: '23112312' })
        store.uploadProfile.mockResolvedValue({ permissions: [] })

        const loginInput = wrapper.find('input[type="text"]')
        const passwordInput = wrapper.find('input[type="password"]')

        await loginInput.setValue('')
        await passwordInput.setValue('')
        await loginInput.setValue('testad1@mail.ru')
        await passwordInput.setValue('1342Df!352353532532')
        await wrapper.get('form').trigger('submit') // working !

        await flushPromises()
        await waitForExpect(() => {
            // ? Проверка вызова функций:
            expect(store.fetchLogIn).toHaveBeenCalledTimes(1)
            expect(store.fetchLogIn).toHaveBeenCalledWith({
                login: 'testad1@mail.ru',
                password: '1342Df!352353532532',
            })
            expect(store.uploadProfile).toHaveBeenCalledTimes(1)
            
            // ? Проверка перехода по верному роуту:
            expect(push).toHaveBeenCalledTimes(1)
            expect(push).toHaveBeenCalledWith('/incorrect-profile')
        })
    })
})
