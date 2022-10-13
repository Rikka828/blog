import { defineStore } from 'pinia'

export const Store = defineStore("admin", {

    state: () => {
        return {
            token: localStorage.getItem("token") || "",
        }
    },
    actions: {},
    getters: {}

})
