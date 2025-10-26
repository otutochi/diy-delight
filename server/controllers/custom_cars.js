import { pool } from "../config/database.js"

const createCustomCar = async (req, res) => {
    const { name, exterior, interior, roof, wheels, convertible, price } = req.body
    if (!name || !exterior || !interior || !roof || !wheels || isNaN(price)) {
        return res.status(400).json({ error: 'One or more invalid fields' })
    }

    const query = `
        INSERT INTO custom_cars (name, exterior, interior, roof, wheels, convertible, price)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, exterior, interior, roof, wheels, convertible, price, created_at
    `
    const values = [name, exterior, interior, roof, wheels, convertible === true, Number(price)]

    try {
        const { rows } = await pool.query(query, values)
        return res.status(201).json(rows[0])
    } catch(error) {
        console.error('Error creating custom car\n', error)
        return res.status(500).json({ error: 'Error creating custom car' })
    }
}

const getAllCustomCars = async (req, res) => {
    const query = `
        SELECT id, name, exterior, interior, roof, wheels, convertible, price, created_at 
        FROM custom_cars
        ORDER BY created_at DESC
    `

    try {
        const { rows } = await pool.query(query)
        return res.status(200).json(rows)
    } catch(error) {
        console.error('Error fetching custom cars\n', error)
        return res.status(500).json({ error: 'Error fetching custom cars' })
    }
}

const getCustomCarById = async (req, res) => {
    const { id } = req.params

    const query = `
        SELECT id, name, exterior, interior, roof, wheels, convertible, price, created_at 
        FROM custom_cars
        WHERE id = $1
    `
    try{
        const { rows } = await pool.query(query, [id])
        if(rows.length === 0) {
            return res.status(404).json({ error: 'Custom car not found' })
        }
        return res.status(200).json(rows[0])
    } catch(error) {
        console.error('Error fetching custom car\n', error)
        return res.status(500).json({ error: 'Error fetching custom car' })
    }
    
}

const editCustomCarById = async (req, res) => {
    const { id } = req.params

    const { name, exterior, interior, roof, wheels, convertible, price } = req.body
    const fields = []
    const values = []
    let idx = 1

    if (name) { fields.push(`name = $${idx++}`); values.push(name) }
    if (exterior) { fields.push(`exterior = $${idx++}`); values.push(exterior) }
    if (interior) { fields.push(`interior = $${idx++}`); values.push(interior) }
    if (roof) { fields.push(`roof = $${idx++}`); values.push(roof) }
    if (wheels) { fields.push(`wheels = $${idx++}`); values.push(wheels) }
    if (convertible !== undefined) { fields.push(`convertible = $${idx++}`); values.push(convertible === true) }
    if(!isNaN(price)) { fields.push(`price = $${idx++}`); values.push(Number(price)) }
    values.push(id)

    if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields provided' })
    }

    const query = `
        UPDATE custom_cars
        SET ${fields.join(', ')}
        WHERE id = $${idx}
        RETURNING id, name, exterior, interior, roof, wheels, convertible, price, created_at
    `

    try {
        const { rows } = await pool.query(query, values)
        if(rows.length === 0) {
            return res.status(404).json({ error: 'Custom car not found' })
        }
        return res.status(200).json(rows[0])
    } catch(error) {
        console.error('Failed to update custom car\n', error)
        return res.status(500).json({ error: 'Failed to update custom car' })
    }
}

const deleteCustomCarById = async (req, res) => {
    const { id } = req.params

    const query = `
        DELETE FROM custom_cars
        WHERE id =$1
        RETURNING id, name, exterior, interior, roof, wheels, convertible, price, created_at
    `

    try {
        const { rows } = await pool.query(query, [id])
        if(rows.length === 0) {
            return res.status(404).json({ error: 'Custom car not found' })
        }
        return res.status(200).json(rows[0])
    } catch(error) {
        console.error('Failed to delete custom car\n', error)
        return res.status(500).json({ error: 'Failed to delete custom car' })
    }
}

export { createCustomCar, getAllCustomCars, getCustomCarById, editCustomCarById, deleteCustomCarById }