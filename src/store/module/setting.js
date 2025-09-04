import { defineStore } from "pinia"
import { useMobile } from '@/hook/global'
const isMobile = useMobile()

const useSettingStore = defineStore('Setting', {
    state: () => {
        return {
            // collapsed: false
            collapsed: isMobile
        }
    },

    actions: {
       collapseMenu: function () {
            this.collapsed = !this.collapsed
       } 
    }
})

export default useSettingStore