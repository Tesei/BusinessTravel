<template>
    

    <div class="_container">
		<h3>Табы</h3>

		<base-tabs-tab-bar
			:tabArr="tabArray"
			:activeTabValue="activeTabValue"
            @setActiveTab="setActiveTab"
		>
		<template #tab1>
                <h1>Hello  World</h1>
                
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos eligendi reprehenderit, inventore laudantium quod quidem nesciunt molestiae dicta eos debitis sed distinctio repudiandae obcaecati consequatur consequuntur, neque labore, rerum magni.</p>
            </template>
            <template #tab2>
                <h1>IconSprite</h1>
                <IconSprite name="additional-services--Name=Baloon" className="a1 a2 a3" />
            </template>
            <template #tab3>
                <h1>Tab-3</h1>
            </template>
		</base-tabs-tab-bar>
 

    </div> 

</template>

<script setup>
import { ref } from 'vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseTabsTabBar from '@ui/tabs/BaseTabsTabBar.vue'



const tabArray = ref([
    {
        label: 'Контрагенты',
        value: 'tab1',
        count: 4,

    // route: '/settings/tab1'
    },
    {
        label: 'Договоры',
        value: 'tab2',
        count: 2,
    // route: '/settings/tab2'
    },
    {
        label: 'Поставщики',
        value: 'tab3',
        count: 0,
    // route: '/settings/tab3'
    },
    {
        label: 'Cистемные роли',
        value: 'tab4',
    },
    {
        label: 'Tab-4',
        value: 'tab5',
    },
    // {
    // label: 'Tab-3',
    // value: 'tab6',
    // },
    // {
    // label: 'IconSprite2',
    // value: 'tab7',
    // },
    // {
    // label: 'Tab-4',
    // value: 'tab8',
    // },
    // {
    // label: 'Tab-3',
    // value: 'tab9',
    // },
    // {
    // label: 'IconSprite2',
    // value: 'tab10',
    // },
    // {
    // label: 'Tab-4',
    // value: 'tab11',
    // },
	
])

const activeTabValue = ref('tab1')
const setActiveTab = (tab) => {
    activeTabValue.value = tab.value
}

// const exampleData = {
//     user: {
//         id: '175e9928-9f2e-44d3-a5e0-008a64fa6876',
//         firstName: 'Алёна',
//         lastName: 'Ёжева',
//         middleName: 'Дмитриёвна',
//         counterparty: {
//             id: '644e35bb-4cf6-47d7-b18f-37beb812318c',
//             name: 'Общество с ограниченной ответственностью Коминефтеэнергомонтажавтоматика',
//             shortName: 'ООО Коминефтеэнергомонтажавтоматика',
//             itn: '4028147940',
//             iec: '647201634',
//             isActive: true,
//             isBlocked: false,
//             headFirstName: 'Алёна',
//             headLastName: 'Ёжева',
//             headMiddleName: 'Дмитриёвна',
//             headPosition: null,
//             mainAccountantFirstName: 'Алёна',
//             mainAccountantLastName: 'Рёманюк',
//             mainAccountantMiddleName: 'Дмитриёвна'
//         },
//         employee: null,
//         permissions: [
//             'Authentication:users.read',
//             'Authentication:users.write',
//             'Authentication:roles.read',
//             'Authentication:roles.delete',
//             'Authentication:users.new',
//             'Authentication:roles.new',
//             'Authentication:users.delete',
//             'Authentication:permissions.read',
//             'Authentication:virtualUsers.new',
//             'Authentication:roles.write',
//             'Authentication:virtualUsers.write',
//             'Authentication:scopes.read',
//             'Authentication:virtualUsers.read',
//             'Authentication:virtualUsers.delete',
//             'BusinessTravelManagement:companies.delete',
//             'BusinessTravelManagement:additionalExpenseTypes.new',
//             'BusinessTravelManagement:approval-rules.write',
//             'BusinessTravelManagement:additionalExpenseTypes.delete',
//             'BusinessTravelManagement:daily-allowances.read',
//             'BusinessTravelManagement:additionalExpenseTypes.read',
//             'BusinessTravelManagement:companies.read',
//             'BusinessTravelManagement:daily-allowances.new',
//             'BusinessTravelManagement:daily-allowances.write',
//             'BusinessTravelManagement:limits.new',
//             'BusinessTravelManagement:limits.write',
//             'BusinessTravelManagement:companies.new',
//             'BusinessTravelManagement:approval-rules.new',
//             'BusinessTravelManagement:daily-allowances.delete',
//             'BusinessTravelManagement:additionalExpenseTypes.write',
//             'BusinessTravelManagement:approval-rules.read',
//             'BusinessTravelManagement:companies.write',
//             'BusinessTravelManagement:approval-rules.delete',
//             'BusinessTravelManagement:limits.read',
//             'BusinessTravelManagement:limits.delete',
//             'Management:unit.positions.new',
//             'Management:counterparties.write',
//             'Management:positions.read',
//             'Management:providers.new',
//             'Management:serviceFee.new',
//             'Management:unit.positions.read',
//             'Management:providers.write',
//             'Management:positions.delete',
//             'Management:roles.new',
//             'Management:unit.employees.write',
//             'Management:contract.delete',
//             'Management:gds.write',
//             'Management:unit.counterparties.delete',
//             'Management:unit.counterparties.new',
//             'Management:employees.delete',
//             'Management:service.new',
//             'Management:unit.employees.read',
//             'Management:roles.delete',
//             'Management:unit.counterparties.write',
//             'Management:contract.write',
//             'Management:providers.read',
//             'Management:employees.write',
//             'Management:employees.new',
//             'Management:gds.new',
//             'Management:positions.new',
//             'Management:employees.read',
//             'Management:departments.delete',
//             'Management:departments.new',
//             'Management:directions.new',
//             'Management:unit.employees.delete',
//             'Management:unit.employees.new',
//             'Management:roles.write',
//             'Management:serviceFee.write',
//             'Management:contracts.read',
//             'Management:contract.new',
//             'Management:unit.positions.delete',
//             'Management:directions.write',
//             'Management:roles.read',
//             'Management:positions.write',
//             'Management:counterparties.read',
//             'Management:counterparties.new',
//             'Management:person.read',
//             'Management:service.write',
//             'Management:person.new',
//             'Management:directions.read',
//             'Management:gds.read',
//             'Management:departments.read',
//             'Management:departments.write',
//             'Management:providers.delete',
//             'Management:unit.counterparties.read',
//             'Management:gds.delete',
//             'Management:directions.delete',
//             'Management:counterparties.delete',
//             'BusinessTravel:trip.new',
//             'BusinessTravel:trip.additionalExpense.write',
//             'BusinessTravel:trip.additionalExpense.delete',
//             'BusinessTravel:trip.forExpenseApproval',
//             'BusinessTravel:trip.reject',
//             'BusinessTravel:trip.delete',
//             'BusinessTravel:trip.approve',
//             'BusinessTravel:trip.approval',
//             'BusinessTravel:trip.read',
//             'BusinessTravel:trip.revert',
//             'BusinessTravel:trip.revoke',
//             'BusinessTravel:trip.additionalExpense.new',
//             'BusinessTravel:trip.cancel',
//             'BusinessTravel:trip.write'
//         ]
//     }
// }

</script>

<style scoped lang="scss">
    .title {
        margin-bottom: 16px;
    }
</style>
