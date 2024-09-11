import { defineStore } from "pinia"

const useSettingStore = defineStore('Setting', {
    state: () => {
        return {
            collapsed: false
        }
    },

    actions: {
       collapseMenu: function () {
            this.collapsed = !this.collapsed
       } 
    }
})

export default useSettingStore