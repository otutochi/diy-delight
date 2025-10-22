import { pool } from '../config/database.js'

const getColorOptions = async (req, res) => {
    const { type } = req.query
    const valid_types = ['exterior', 'interior', 'roof', 'wheels']
    if(type && !valid_types.includes(type)) {
        return res.status(400).json({ error: 'Invalid type' })
    }

    const query = type 
    ? `
        SELECT id, type, name, hex, price 
        FROM color_options
        WHERE type = $1
        ORDER BY name
    `
    : `
        SELECT id, type, name, hex, price 
        FROM color_options
        ORDER BY type, name
    `

    try {
        const { rows } = await pool.query(query, type ? [type] : [])
        return res.status(200).json(rows)
    } catch(error) {
        console.error('Error fetching options\n', error)
        return res.status(500).json({ error: 'Error fetching options' })
    }
}

const getColorOptionById = async (req, res) => {
    const { id } = req.params

    const query = `
        SELECT id, type, name, hex, price 
        FROM color_options
        WHERE id = $1
    `

    try {
        const { rows } = await pool.query(query, [id])
        if(rows.length === 0) {
            return res.status(404).json({ error: 'Option not found' })
        }
        return res.status(200).json(rows[0])
    } catch (error) {
        console.error('Error fetching option\n', error)
        return res.status(500).json({ error: 'Error fetching option' })
    }
}

export { getColorOptions, getColorOptionById }