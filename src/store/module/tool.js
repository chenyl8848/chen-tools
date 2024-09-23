import { defineStore } from "pinia"
import { getTools, getMyFavoriteTool } from '@/utils/tools'
import { LOCAL_STORAGE_FAVORITE_TOOL_KEY } from "@/utils/enum"
import { ref } from "vue"

const useToolStore = defineStore('Tool', () => {
    let favoriteTools = ref(JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITE_TOOL_KEY)) || [])

    const mergeTools = () => {
        const regularTools = getTools().filter((item) => item.children)

        if (favoriteTools.value.length > 0) {
            let favoriteTool = getMyFavoriteTool()
            favoriteTool.children = favoriteTools.value
            
            regularTools.unshift(favoriteTool)

            regularTools.forEach((item1) => {
                item1.children.forEach((item2) => {
                    if (favoriteTools.value.findIndex((item3) => item3.path === item2.path) > -1) {
                        item2.favorite = true
                    } else {
                        item2.favorite = false
                    }
                })
            })

        } else {
            regularTools.forEach((item1) => {
                item1.children.forEach((item2) => {
                    item2.favorite = false
                })
            })
        }

        return regularTools
    }

    const mergeMenus = () => {
        return [...mergeTools(), ...getTools().filter((item) => !item.children)]
    }

    let tools = ref(mergeTools())

    let menus = ref(mergeMenus())

    const addFavorite = (tool) => {
        favoriteTools.value.push(tool)
        localStorage.setItem(LOCAL_STORAGE_FAVORITE_TOOL_KEY, JSON.stringify(favoriteTools.value))
        tools.value = mergeTools()
        menus.value = mergeMenus()
    }

    const removeFavorite = (tool) => {
        const index = favoriteTools.value.findIndex((item) => item.path === tool.path)
        if (index > -1) {
            favoriteTools.value.splice(index, 1)
            localStorage.setItem(LOCAL_STORAGE_FAVORITE_TOOL_KEY, JSON.stringify(favoriteTools.value))
        }
        tools.value = mergeTools()
        menus.value = mergeMenus()
    }

    return {
        tools,
        menus,
        // favoriteTools,
        // mergeTools,
        addFavorite,
        removeFavorite
    }
})

export default useToolStore