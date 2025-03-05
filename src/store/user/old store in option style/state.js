// state.js
export default function () {
    return {
        isLoggedIn: true, // Статус авторизации
        changePasswordAlerts: [],
        isUserFound: null,
        directions: {},
        user: {},
        incomingTokens: {
            accessToken: null,
            refreshToken: null,
            refreshTokenExpiresIn: null,
            type: null,
        },
        counterpartiesFromID: null,
    }
}
