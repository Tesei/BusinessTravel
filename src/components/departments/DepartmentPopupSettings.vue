<template>
    <base-wrapper-popup-animated
        :show="showCreateModal"
        @close="closePopup"
    >
        <template #header>{{ title }}</template>
        <template #body>
            <Transition
                name="fade"
                mode="out-in"
            >
                <div v-if="currentPopup === 'DepartmentCreate'">
                    <div class="form-container">
                        <base-input
                            placeholder="Наименование подразделения"
                            :isRequired="true"
                            v-model="name"
                            :maxlen="'256'"
                        />
                        <base-input
                            placeholder="Родительское подразделение"
                            :isRequired="false"
                            :modelValue="department.name"
                            :disabled="true"
                        />
                    </div>
                </div>
                <div v-else-if="currentPopup === 'DepartmentEdit'">
                    <div class="form-container">
                        <base-input
                            placeholder="Наименование подразделения"
                            :isRequired="true"
                            v-model="nameDepartament"
                            :disabled="isDepartmentsLoading"
                            :maxlen="'256'"
                        />
                        <base-select
                            type="big"
                            label="Родительское подразделение"
                            with-dropdown
                            isRequired
                            :value="departmentsIdValue"
                            v-model="departmentsIsActive"
                        >
                            <base-dropdown-with-api
                                v-if="departmentsIsActive"
                                position-y="bottom"
                                position-x="center"
                                location-type="country"
                                v-model:active-items="departmentId"
                                v-model:is-active="departmentsIsActive"
                                placeholder="Родительское подразделение"
                                search-type="departments"
                                not-data-title="Подразделения не найдены"
                                :line-count="3"
                            />
                        </base-select>
                        <Transition
                            name="fade"
                            mode="out-in"
                        >
                            <div v-if="pointManager">
                                <base-button
                                    class="sender-popup__btn button_transparent w-100p"
                                    @click="() => changePopup('HeadAssign')"
                                >
                                    Назначить руководителя
                                </base-button>
                            </div>
                            <div
                                v-else
                                class="grid-wrapper"
                            >
                                <base-input
                                    placeholder="Руководитель подразделения"
                                    :isRequired="true"
                                    :modelValue="boss"
                                    :disabled="true"
                                />
                                <IconSprite
                                    @click="openConfirmPopup"
                                    name="common--delete"
                                    class="icon__svg icon__delete pointer"
                                />
                            </div>
                        </Transition>
                    </div>
                </div>
                <div v-else-if="currentPopup === 'HeadAssign'">
                    <base-select
                        type="big"
                        label="ФИО руководителя"
                        with-dropdown
                        v-model="isActiveEmployee"
                        :value="employeeValue"
                        :isRequired="true"
                    >
                        <base-dropdown-with-api
                            v-if="isActiveEmployee"
                            position-y="bottom"
                            placeholder="ФИО руководителя"
                            search-type="employees"
                            not-data-title="Сотрудники не найдены"
                            v-model:isActive="isActiveEmployee"
                            v-model:activeItems="employee"
                            :multipleSelection="false"
                            :line-count="3"
                        ></base-dropdown-with-api>
                    </base-select>
                </div>
            </Transition>
        </template>
        <template #footer>
            <base-button
                class="sender-popup__btn button_blue w-100p"
                :toShowLoading="isDepartmentsLoading"
                @click="handler"
                :disabled="disableButton"
            >
                {{ buttonTitle }}
            </base-button></template
        >
    </base-wrapper-popup-animated>
    <base-wrapper-popup-animated
        :show="showConfirmPopup"
        @close="closeConfirmPopupPopup"
    >
        <template #header>Удаление руководителя</template>
        <template #body>
            <div class="form-container">
                <h4 class="body_S">Удалить руководителя текущего подразделения? Отменить это действие будет невозможно</h4>
            </div>
        </template>
        <template #footer>
            <div class="flex ai-c jc-c w-100p">
                <base-button
                    class="bd c-red mr-32 form-container__btn"
                    :toShowLoading="isDepartmentsLoading"
                    @click="removeHeadEmployee"
                >
                    Удалить
                </base-button>
                <base-button
                    class="button_blue"
                    @click="closeConfirmPopupPopup"
                >
                    Отмена
                </base-button>
            </div>
        </template>
    </base-wrapper-popup-animated>
</template>

<script setup>
import BaseButton from '@ui/buttons/BaseButton.vue'
import BaseWrapperPopupAnimated from '@ui/wrapper/BaseWrapperPopupAnimated.vue'
import BaseInput from '@ui/inputs/BaseInput.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseSelect from '@/components/ui/select/BaseSelect.vue'
import BaseDropdownWithApi from '@/components/ui/select/BaseDropdownWithApi.vue'

import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useDepartmentsStore } from '@/store/departments'
import { v4 as uuidv4 } from 'uuid'

const store = useDepartmentsStore()
const { isDepartmentsLoading, showCreateModal, department, currentPopup, head } = storeToRefs(store)

const name = ref('')
const newDepartmentId = ref(null)
const nameDepartament = ref('')
const employee = ref([])
const isActiveEmployee = ref(false)
const showConfirmPopup = ref(false)
const departmentsIsActive = ref(false)
const departmentId = ref([])

const departmentsIdValue = computed(() => {
    return departmentId.value.length ? departmentId.value.map((el) => el.name).join(', ') : ''
})
const title = computed(() => {
    return currentPopup.value === 'DepartmentCreate'
        ? 'Создание подразделения'
        : currentPopup.value === 'DepartmentEdit'
            ? 'Редактирование подразделения'
            : 'Назначение руководителя'
})
const handler = computed(() => {
    return currentPopup.value === 'DepartmentCreate'
        ? saveDeparment
        : currentPopup.value === 'DepartmentEdit'
            ? editDepartment
            : appointHead
})
const buttonTitle = computed(() => {
    return currentPopup.value === 'HeadAssign' ? 'Назначить руководителя' : 'Сохранить'
})
const disableButton = computed(() => {
    return currentPopup.value === 'DepartmentCreate'
        ? !name.value
        : currentPopup.value === 'DepartmentEdit'
            ? !nameDepartament.value ||
            (nameDepartament.value === department.value?.name && departmentId.value?.[0]?.id === department.value?.parent?.id)
            : !employee.value[0]?.id
})
const boss = computed(() => {
    return head.value?.firstName ? `${head.value?.lastName} ${head.value?.firstName} ${head.value?.middleName}` : ''
})
const pointManager = computed(() => {
    return !department.value?.headEmployeeId
})
const employeeValue = computed(() =>
    employee.value.length ? employee.value.map((el) => `${el.lastName} ${el.firstName} ${el.middleName}`).join(', ') : '',
)

const removeHeadEmployee = async () => {
    await store.removeHeadEmployee(department.value?.id)
    closeConfirmPopupPopup()
}
const appointHead = async () => {
    const request = {
        departmentId: newDepartmentId.value || department.value?.id,
        employeeId: employee.value[0]?.id,
    }
    await store.appointHead(request)
    changePopup('DepartmentEdit')
}
const saveDeparment = async () => {
    const request = {
        name: name.value,
        code: uuidv4(),
        parentId: department.value?.id,
    }
    const res = await store.createNewDepartment(request)
    if (res) {
        newDepartmentId.value = res
        changePopup('HeadAssign')
    }
}
const editDepartment = async () => {
    const request = {
        name: nameDepartament.value,
        code: uuidv4(),
        parentId: departmentId.value?.[0].id,
    }
    const res = await store.editDepartment(request, department.value?.id)
    if (res) {
        closePopup()
    }
}
const changePopup = (value) => {
    store.setCurrentPopup(value)
}
const closeConfirmPopupPopup = () => {
    showConfirmPopup.value = false
}
const openConfirmPopup = () => {
    showConfirmPopup.value = true
}
const closePopup = () => {
    store.handleClosePopup()
    name.value = ''
    nameDepartament.value = ''
    employee.value = []
    departmentId.value = []
    isActiveEmployee.value = false
    departmentsIsActive.value = false
    store.fetchDepartmentsTree()
}

watch(department, async () => {
    if (currentPopup.value !== 'DepartmentEdit') return
    if (department.value?.name) {
        nameDepartament.value = department.value.name
        department.value.parent?.id && departmentId.value.push(department.value.parent)
    }
})
</script>

<style lang="scss" scoped>
@use '@/style/animation.scss';

.form-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
}
.icon__delete {
    margin-right: 0;
    color: $color-red;
}

.grid-wrapper {
    display: grid;
    grid-template-columns: 1fr 24px;
    gap: 8px;

    align-items: center;
}

.form-container__btn {
    min-width: 133px;
}
</style>
