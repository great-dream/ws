import Vuex from 'vuex'
const store = new Vuex.Store({
    state: {
        token: null
    },
    getters: {
        getToken (state) {
            return state.token
        }
    },
    mutations: {
        SetToken (state, token) {
            state.token = token
        }
    },
    actions: {
        SetToken (context, token) {
            context.commit('SetToken', token)
        }
    }

})

export default store