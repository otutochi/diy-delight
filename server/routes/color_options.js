import express from 'express'
import { getColorOptions, getColorOptionById } from '../controllers/color_options.js'

const router = express.Router()

router.get('/', getColorOptions)
router.get('/:id', getColorOptionById)

export default router