import { defineStore } from "pinia"
import { getTools } from '@/tools'
import { ref } from "vue"

const FAVORITE_TOOL_KEY = 'favoriteTools'
const useToolStore = defineStore('Tool', () => {
    let favoriteTools = ref(JSON.parse(localStorage.getItem(FAVORITE_TOOL_KEY)) || [])

    const mergeTools = () => {
        const regularTools = getTools().filter((item) => item.children)

        if (favoriteTools.value.length > 0) {
            let favoriteTool = {
                title: '我的收藏',
                icon: 'icon-shoucang',
                path: '/favorite',
                children: favoriteTools.value
            }
            regularTools.unshift(favoriteTool)

            regularTools.forEach((item1) => {
                item1.children.forEach((item2) => {
                    let index = favoriteTools.value.findIndex((item3) => item3.path === item2.path)
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

    let tools = ref(mergeTools())

    const addFavorite = (tool) => {
        favoriteTools.value.push(tool)
        localStorage.setItem(FAVORITE_TOOL_KEY, JSON.stringify(favoriteTools.value))
        tools.value = mergeTools()
    }

    const removeFavorite = (tool) => {
        const index = favoriteTools.value.findIndex((item) => item.path === tool.path)
        if (index > -1) {
            favoriteTools.value.splice(index, 1)
            localStorage.setItem(FAVORITE_TOOL_KEY, JSON.stringify(favoriteTools.value))
        }
        tools.value = mergeTools()
    }

    return {
        tools,
        // favoriteTools,
        // mergeTools,
        addFavorite,
        removeFavorite
    }
})

export default useToolStore