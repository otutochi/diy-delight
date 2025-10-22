import express from 'express'
import { createCustomCar, getAllCustomCars, getCustomCarById, editCustomCarById, deleteCustomCarById } from '../controllers/custom_cars.js'

const router = express.Router()

router.post('/', createCustomCar)
router.get('/', getAllCustomCars)
router.get('/:id', getCustomCarById)
router.patch('/:id', editCustomCarById)
router.delete('/:id', deleteCustomCarById)

export default router