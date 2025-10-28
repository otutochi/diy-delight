import React from 'react'
import '../App.css'
import { useState, useEffect } from 'react'
import { getAllColorOptions, getColorOptionsByType, getColorOptionById } from '../api/color_options'
import { createCustomCar, getAllCustomCars, getCustomCarById, editCustomCar, deleteCustomCar  } from '../api/custom_cars'
import CarCard from '../components/CarCard'

const ViewCars = () => {

    const [cars, setCars] = useState([])

    useEffect(() => {
        const fetchCars = async () => {
            const fetchedCars = await getAllCustomCars()
            setCars(fetchedCars)
        }
        fetchCars()
    }, [])
    
    return (
        <div style={{display:'flex', flexDirection:'column', gap:'20px', alignItems:'center', marginTop:'50px'}} >
            {cars.map(car => 
                <div>
                    <CarCard id={car.id} name={car.name} exterior={car.exterior} interior={car.interior} roof={car.roof} wheels={car.wheels} price={car.price} convertible={car.convertible} />
                </div>
            )}
        </div>
    )
}

export default ViewCars