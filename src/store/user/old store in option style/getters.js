// getters.js
export default {
    getUserPermissions: (state) => {
        return Object.keys(state.user).length ? state.user.permissions : []
    },
    getUserId: (state) => {
        return Object.keys(state.user).length ? state.user.id : ''
    },
    getUserEmployeeId: (state) => {
        return Object.keys(state.user).length ? state.user.employee?.id : ''
    }
}
