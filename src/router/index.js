import { createRouter, createWebHistory } from 'vue-router'
import { uiRouts } from '@/router/ui-exmples'
import VueCookies from 'vue-cookies'
import { useUserStore } from '@/store/user'
import { useAirSearchStore } from '@/store/airSearch'
import { useNotificationStore } from '@/store/notification'
import { storeToRefs } from 'pinia'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        uiRouts,
        {
            path: '/',
            alias: '/auth',
            name: 'AuthPage',
            meta: { canEnterUnauthorized: true },
            component: () => import('@/components/auth/TheAuthForm.vue'),
            beforeEnter: (to, from, next) => {
                if (to.query.isRedirectFromRestore === 'true') {
                    const { setNotification } = useNotificationStore()
                    setNotification('Письмо о восстановлении пароля отправлено на E-mail')
                }
                if (to.fullPath.includes('kind=Registration')) {
                    next({ path: `create-password${to.fullPath}` })
                }
                next()
            },
        },
        {
            path: '/obt-soglasie-na-obrabotku-person-data',
            name: 'ThePrivacyPolicy',
            meta: { canEnterUnauthorized: true },
            component: () => import('@/components/ThePrivacyPolicy.vue'),
        },
        {
            path: '/create-password',
            name: 'SetPasswordPage',
            meta: { canEnterUnauthorized: true },
            component: () => import('@/components/TheSetPasswordForm.vue'),
        },
        {
            path: '/incorrect-profile',
            name: 'IncorrectProfilePage',
            component: () => import('@/components/auth/TheIncorrectProfile.vue'),
        },
        {
            path: '/restore-password',
            name: 'TheRestorePassword',
            meta: { canEnterUnauthorized: true },
            component: () => import('@/components/auth/TheRestorePassword.vue'),
        },
        {
            path: '/settings',
            name: '/settings',
            component: () => import('@/views/settingsPage/SettingsPage.vue'),
            children: [
                {
                    path: ':subPage', // Динамический параметр для всех дочерних маршрутов
                    name: 'settings-subpage',
                    component: () => import('@/views/settingsPage/SettingsPage.vue'),
                },
            ],
        },
        {
            path: '/daily-allowances/form-create',
            name: 'daily-allowance-form-create',
            beforeEnter: () => {
                const { getUserPermissions } = useUserStore()
                if (!getUserPermissions.includes('BusinessTravelManagement:daily-allowances.new')) {
                    return false
                }
            },
            component: () => import('@/components/dailyAllowances/DailyAllowancesFormCreate.vue'),
        },
        {
            path: '/daily-allowances/form-edit/:id',
            name: 'daily-allowance-form-form-edit',
            component: () => import('@/components/dailyAllowances/DailyAllowanceFormEdit.vue'),
            props: true,
        },
        {
            path: '/limits/form-edit/:id',
            name: 'limits-form-edit',
            component: () => import('@/views/limits/LimitsEdit.vue'),
            props: true,
        },
        {
            path: '/counterparties',
            name: '/counterparties',
            children: [
                {
                    path: 'admin-create',
                    name: 'AdminCreate',
                    component: () => import('@/components/contractor/TheCreatePanelOfAdmin.vue'),
                },
            ],
        },
        {
            path: '/welcome',
            name: 'WelcomePage',
            component: () => import('@/components/auth/TheWelcomePage.vue'),
        },
        {
            path: '/trips',
            children: [
                {
                    path: '',
                    name: 'trips',
                    component: () => import('@/views/trips/TripsPage.vue'),
                    beforeEnter: (next) => {
                        const { getUserPermissions } = useUserStore()
                        if (!getUserPermissions.includes('BusinessTravel:trip.read')) return next({ name: 'WelcomePage' })
                    },
                },
                {
                    path: 'create',
                    name: 'trips-create',
                    beforeEnter: () => {
                        const { getUserPermissions } = useUserStore()
                        if (!getUserPermissions.includes('BusinessTravel:trip.new')) return false
                    },
                    component: () => import('@/components/trips/CreateTrip.vue'),
                },
                {
                    path: ':tripNumber',
                    name: 'trips-card',
                    component: () => import('@/views/trips/TripCard.vue'),
                    props: true,
                    children: [
                        {
                            path: 'history',
                            name: 'trips-card-history',
                            component: () => import('@/views/trips/TripCard.vue'),
                        },
                        {
                            path: 'tickets',
                            name: 'trips-card-tickets',
                            component: () => import('@/views/trips/TripCard.vue'),
                        },
                    ],
                },
                {
                    path: ':tripNumber/edit',
                    name: 'trips-card-edit',
                    component: () => import('@/views/trips/TripEdit.vue'),
                },
                {
                    path: ':tripNumber/planning-expense',
                    name: 'planning-expense',
                    component: () => import('@/components/trips/planningExpense/PlanningExpense.vue'),
                },
            ],
        },
        {
            path: '/:tripNumber/air/search/:tripServiceId',
            name: 'air-search',
            beforeEnter: (to) => {
                const { prepareDataToFetch } = useAirSearchStore()
                prepareDataToFetch(to.params.tripNumber, to.params.tripServiceId)
            },
            component: () => import('@/views/airSearch/TheAirSearchPage.vue'),
        },
        {
            path: '/:tripNumber/air/price',
            name: 'air-price',
            component: () => import('@/views/airSearch/TheTariffSelector.vue'),
        },
        {
            path: '/:tripNumber/air/order-create',
            name: 'order-create',
            beforeEnter: async () => {
                const store = useAirSearchStore()
                const { trip } = storeToRefs(store)
                await store.fetchEmployeeData(trip.value.employee.id)
            },
            component: () => import('@/views/airSearch/OrderCreate.vue'),
        },
        {
            path: '/:tripNumber/air/:orderId/order-confirm',
            name: 'order-confirm',
            beforeEnter: async (to) => {
                const { fetchServiceOrder } = useAirSearchStore()
                await fetchServiceOrder(to.params.orderId)
            },
            component: () => import('@/views/airSearch/OrderConfirm.vue'),
        },
        {
            path: '/departments',
            name: 'departments',
            beforeEnter: async () => {
                const { getUserPermissions } = useUserStore()
                if (!getUserPermissions.includes('BusinessTravelManagement:departments.read')) {
                    return false
                }
            },
            component: () => import('@/views/departmentsPage/DepartmentsPage.vue'),
        },
        {
            path: '/limits/form-create',
            name: 'limits-form-create',
            component: () => import('@/views/limits/LimitsCreate.vue'),
        },
        {
            path: '/limits',
            name: 'limits',
            beforeEnter: async () => {
                const { getUserPermissions } = useUserStore()
                if (!getUserPermissions.includes('BusinessTravelManagement:limits.read')) {
                    return false
                }
            },
            component: () => import('@/views/limitsPage/LimitsPage.vue'),
        },
        {
            path: '/positions',
            name: 'positions',
            beforeEnter: async () => {
                const { getUserPermissions } = useUserStore()
                if (!getUserPermissions.includes('BusinessTravelManagement:positions.read')) {
                    return false
                }
            },
            component: () => import('@/views/positions/PositionsPage.vue'),
        },
        {
            path: '/receiving-companies',
            name: 'receiving-companies',
            beforeEnter: async () => {
                const { getUserPermissions } = useUserStore()
                if (!getUserPermissions.includes('BusinessTravelManagement:companies.read')) {
                    return false
                }
            },
            component: () => import('@/components/companies/ReceivingCompaniesList.vue'),
        },
    ],

    // scrollBehavior(to, from, savedPosition)
    scrollBehavior() {
        return { top: 0 }
    },
})
router.beforeEach((to, from, next) => {
    if (!VueCookies.get('accessToken') && !to.meta.canEnterUnauthorized) return next({ name: 'AuthPage' })
    return next()
})

export default router
