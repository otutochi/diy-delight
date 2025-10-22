const createCustomCar = async (custom_car) => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(custom_car)
    }

    try {
        const result = await fetch('/api/custom_cars', options)
        const data = await result.json()
        console.log(data)
        return data
    } catch(error) {
        console.error('Failed to create custom car\n', error)
    }
}

const getAllCustomCars = async () => {
    try {
        const result = await fetch('/api/custom_cars')
        const data = await result.json()
        console.log(data)
        return data
    } catch(error) {
        console.error('Failed to fetch custom cars\n', error)
    }
}

const getCustomCarById = async (id) => {
    try {
        const result = await fetch(`/api/custom_cars/${id}`)
        const data = await result.json()
        console.log(data)
        return data
    } catch(error) {
        console.error(`Failed to fetch custom car with id ${id}\n`, error)
    }
}

const editCustomCar = async (id, updates = {}) => {
    const options = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    }

    try {
        const result = await fetch(`/api/custom_cars/${id}`, options)
        const data = await result.json()
        console.log(data)
        return data
    } catch(error) {
        console.error('Failed to update custom car\n', error)
    }
}

const deleteCustomCar = async (id) => {
    const options = {
        method: 'DELETE'
    }

    try {
        const result = await fetch(`/api/custom_cars/${id}`, options)
        const data = await result.json()
        console.log(data)
        return data
    } catch(error) {
        console.error('Failed to delete custom car\n', error)
    }
}

export { createCustomCar, getAllCustomCars, getCustomCarById, editCustomCar, deleteCustomCar }