<template>
    <div
        v-if="departmentsTree?.name"
        class="mt-40 pt-16 pb-16 pr-24 pl-24 bg-gray-6 w-100p radius-8"
    >
        <ul class="tree">
            <span class="node__main block Heading_5">{{ departmentsTree.name }}</span>
            <TreeNode
                v-for="child in departmentsTree.children"
                :key="child.id"
                :node="child"
            />
        </ul>
    </div>
    <div
        class="mt-40 w-100p"
        v-if="!isDepartmentsLoading && !departmentsTree?.name"
    >
        <base-data-not-available
            class="mt-32 w-100p"
            title="Нет созданных подразделений"
            description="Создайте подразделение и задайте его параметры"
            buttonText="Создать подразделение"
        ></base-data-not-available>
    </div>
    <base-skeleton
        v-if="isDepartmentsLoading"
        skeleton-height="56px"
        class="mb-16 mt-16"
    />
    <DepartmentPopupSettings />
    <DepartmentPopupDelete />
</template>

<script setup>
import BaseDataNotAvailable from '@/components/ui/BaseDataNotAvailable.vue'
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
import { useDepartmentsStore } from '@/store/departments'
import { useUserStore } from '@/store/user'
import { onMounted, defineComponent, h, ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import IconSprite from '@/components/interface/IconSprite.vue'
import DepartmentPopupSettings from '@/components/departments/DepartmentPopupSettings.vue'
import DepartmentPopupDelete from '@/components/departments/DepartmentPopupDelete.vue'

const { fetchDepartmentsTree, handleOpenPopup, handleOpenDeletePopup } = useDepartmentsStore()
const { departmentsTree, isDepartmentsLoading, foundDepartments } = storeToRefs(useDepartmentsStore())

const { getUserPermissions } = useUserStore()

onMounted(() => {
    fetchDepartmentsTree()
})
const TreeNode = defineComponent({
    props: {
        node: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const isHovered = ref(false)
        const isHighlighted = ref(true)

        const handleButtonDelete = (node) => {
            handleOpenDeletePopup(node)
        }

        function isDepartmentInTree(nodeId) {
            return foundDepartments.value.some((el) => el.id === nodeId)
        }

        const isEditAccess = computed(() => {
            return getUserPermissions.some((el) => el === 'BusinessTravelManagement:departments.write')
        })
        const isCreateAccess = computed(() => {
            return getUserPermissions.some((el) => el === 'BusinessTravelManagement:departments.new')
        })
        const isDeleteAccess = computed(() => {
            return getUserPermissions.some((el) => el === 'BusinessTravelManagement:departments.delete')
        })
        watch(foundDepartments, () => {
            isHighlighted.value = isDepartmentInTree(props.node.id)
        })

        return {
            isHovered,
            handleButtonDelete,
            isHighlighted,
            isEditAccess,
            isCreateAccess,
            isDeleteAccess,
        }
    },
    render() {
        return h('li', [
            h(
                'span',
                {
                    onMouseenter: () => (this.isHovered = true),
                    onMouseleave: () => (this.isHovered = false),
                    class: `node footnote_L pointer w-100p flex jc-sb ${this.isHovered ? 'c-cornflower' : ''} ${this.isHighlighted ? 'c-black' : 'c-text-disabled'}`,
                },
                this.node.name,
                this.isHovered
                    ? h('div', { class: 'button-group flex' }, [
                        this.isEditAccess
                            ? h(
                                'button',
                                {
                                    onClick: () => handleOpenPopup(this.node, 'DepartmentEdit'),
                                    class: 'node-button c-cornflower font-button_S pr-40 flex ai-c',
                                },
                                [
                                    h(IconSprite, { name: 'common--edit', className: 'icon__svg c-cornflower' }),
                                    ' Редактировать',
                                ],
                            )
                            : null,
                        this.isCreateAccess
                            ? h(
                                'button',
                                {
                                    onClick: () => handleOpenPopup(this.node, 'DepartmentCreate'),
                                    class: 'node-button c-cornflower font-button_S pr-40 flex ai-c',
                                },
                                [
                                    h(IconSprite, { name: 'common--plus', className: 'icon__svg c-cornflower' }),
                                    'Создать подразделение',
                                ],
                            )
                            : null,
                        !this.node.children.length && this.isDeleteAccess
                            ? h(
                                'button',
                                {
                                    onClick: () => this.handleButtonDelete(this.node),
                                    class: 'node-button c-red font-button_S pr-40 flex ai-c',
                                },
                                [h(IconSprite, { name: 'common--delete', className: 'icon__svg c-red' }), 'Удалить'],
                            )
                            : null,
                    ])
                    : null,
            ),
            this.node.children && this.node.children.length > 0
                ? h(
                    'ul',
                    this.node.children.map((child) => h(TreeNode, { key: child.id, node: child })),
                )
                : null,
        ])
    },
})
</script>

<style lang="scss" scoped>
.node__main {
    margin-bottom: 4px;
}
:deep(ul.tree, ul.tree ul) {
    list-style: none;
    margin: 0;
    padding: 0;
}
:deep(ul.tree ul) {
    margin-left: 32px;
    margin-top: -10px;
}
:deep(ul.tree li) {
    margin: 0;
    padding: 0 0px;
    border-left: 2px solid $color-gray-3;
    margin-left: 12px;
}
:deep(ul.tree li:last-child) {
    border-left: none;
}
:deep(ul.tree li:before) {
    position: relative;
    top: -0.3em;
    height: 27px;
    width: 32px;
    color: $color-white;
    border-bottom: 2px solid $color-gray-3;
    content: '';
    display: inline-block;
    left: 0px;
}
:deep(ul.tree li:last-child:before) {
    border-left: 2px solid $color-gray-3;
}
:deep(.node) {
    top: -15px;
    left: 31px;
    height: max-content;
    position: relative;
}
:deep(.icon__svg) {
    width: 16px;
    height: 16px;
}
:deep(.button-group) {
    height: 20px;
}
</style>
