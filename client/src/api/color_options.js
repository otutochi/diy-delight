const getAllColorOptions = async () => {
    try {
        const result = await fetch('/api/color_options')
        const data = await result.json()
        console.log(data)
        return data
    } catch(error) {
        console.error('Failed to fetch options\n', error)
    }
}

const getColorOptionsByType = async (type) => {
    try {
        const result = await fetch(`/api/color_options?type=${type}`)
        const data = await result.json()
        console.log(data)
        return data
    } catch(error) {
        console.error('Failed to fetch options\n', error)
    }
}

const getColorOptionById = async (id) => {
    try {
        const result = await fetch(`/api/color_options/${id}`)
        const data = await result.json()
        console.log(data)
        return data
    } catch(error) {
        console.error(`Failed to fetch option with id ${id}\n`, error)
    }
}

export { getAllColorOptions, getColorOptionsByType, getColorOptionById }

