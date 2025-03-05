import { computed } from 'vue'
import { useUserStore } from '@/store/user'

export function useAvailableOptions() {
    const user = useUserStore()

    const accessOptionsVariants = {
        // для PlatformAdminUI  v1/obtmanagement/profile
        // 'Management:counterparties.read': {
        //     label: 'Контрагенты',
        //     value: 'tab1',
        //     route: '/settings/contragents',
        // },
        // 'Management:contracts.read': {
        //     label: 'Договоры',
        //     value: 'tab2',
        //     route: '/settings/contracts',
        // },
        // 'Management:providers.read': {
        //     label: 'Поставщики',
        //     value: 'tab3',
        //     route: '/settings/providers',
        // },
        // 'Management:roles.read': {
        //     label: 'Роли',
        //     value: 'tab4',
        //     route: '/settings/roles',
        // },

        // для BusinessTravelUI v1/btmanagement/profile

        'BusinessTravelManagement:departments.read': {
            label: 'Оргструктура',
            value: 'tab5',
            route: '/departments',
        },
        'BusinessTravelManagement:positions.read': {
            label: 'Должности',
            value: 'tab6',
            route: '/positions',
        },
        'BusinessTravelManagement:employees.read': {
            label: 'Сотрудники',
            value: 'tab7',
            route: '/settings/employees',
        },
        'BusinessTravelManagement:daily-allowances.read': {
            label: 'Суточные',
            value: 'tab8',
            route: '/settings/daily-allowances',
        },
        'BusinessTravelManagement:limits.read': {
            label: 'Лимиты',
            value: 'tab9',
            route: '/limits',
        },
        'BusinessTravelManagement:approval-rules.read': {
            label: 'Правила согласования',
            value: 'tab10',
            route: '/settings/approval-rules',
        },
        'BusinessTravelManagement:companies.read': {
            label: 'Принимающие организации',
            value: 'tab11',
            route: '/receiving-companies',
        },
        'BusinessTravelManagement:additionalExpenseTypes.read': {
            label: 'Дополнительные расходы',
            value: 'tab12',
            route: '/settings/additional-expense-types',
        },
        'BusinessTravelManagement:users.read': {
            label: 'Пользователи',
            value: 'tab13',
            route: '/settings/users',
        },
        'BusinessTravelManagement:roles.read': {
            label: 'Роли',
            value: 'tab14',
            route: '/settings/roles',
        },
    }

    const availableOptions = computed(() => {
        const finalOptions = []
        Object.keys(accessOptionsVariants).forEach((key) => {
            if (user.user?.permissions?.includes(key)) {
                finalOptions.push(accessOptionsVariants[key])
            }
        })
        return finalOptions
    })

    return {
        availableOptions,
    }
}
