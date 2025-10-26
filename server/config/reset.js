import { pool } from './database.js'
import colorOptionsData from '../data/color_options.js'

const createColorOptionsTable = async () => {
    const query = `
        DROP TABLE IF EXISTS custom_cars;
        DROP TABLE IF EXISTS color_options;

        CREATE EXTENSION IF NOT EXISTS pgcrypto;

        CREATE TABLE IF NOT EXISTS color_options (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            type TEXT NOT NULL,
            name TEXT NOT NULL,
            hex TEXT NOT NULL,
            price FLOAT NOT NULL,
            UNIQUE (type, name)
        );
    `

    try {
        const res = await pool.query(query)
        console.log('Color options table created successfully')
    } catch (error) {
        console.error('Error creating color options table\n', error)
    }
}

const seedColorOptionsTable = async () => {
    await createColorOptionsTable()

    for (const option of colorOptionsData) {
        const query = `
            INSERT INTO color_options (type, name, hex, price)
            VALUES ($1, $2, $3, $4)
        `
        const values = [option.type, option.name, option.hex, option.price]

        try {
            const res = await pool.query(query, values)
        } catch (error) {
            console.error('Error adding option to table', error)
        }
    }
}
await seedColorOptionsTable()

const createCustomCarsTable = async () => {
    const query = `
        DROP TABLE IF EXISTS custom_cars;

        CREATE TABLE IF NOT EXISTS custom_cars (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            exterior UUID REFERENCES color_options(id) NOT NULL,
            interior UUID REFERENCES color_options(id) NOT NULL,
            roof UUID REFERENCES color_options(id) NOT NULL,
            wheels UUID REFERENCES color_options(id) NOT NULL,
            convertible BOOLEAN NOT NULL DEFAULT false,
            price FLOAT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `

    try {
        const res = await pool.query(query)
        console.log('Custom cars table created successfully')
    } catch (error) {
        console.error('Error creating custom cars table\n', error)
    }
}
await createCustomCarsTable()