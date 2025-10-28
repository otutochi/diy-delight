import React from 'react'
import { useState, useEffect } from 'react'
import '../App.css'
import { getAllColorOptions, getColorOptionsByType, getColorOptionById } from '../api/color_options'
import { createCustomCar, getAllCustomCars, getCustomCarById, editCustomCar, deleteCustomCar  } from '../api/custom_cars'

const TYPES = ['exterior', 'interior', 'roof', 'wheels']

const CreateCar = () => {

    const defaultCustomCar = {
        name: '',
        exterior: null,
        interior: null,
        roof: null, 
        wheels: null,
        convertible: false,
        price: 0,
    }

    const [customCar, setCustomCar] = useState(defaultCustomCar)

    const [options, setOptions] = useState({
        exterior: [],
        interior: [],
        roof: [],
        wheels:[]
    })

    const [openType, setOpenType] = useState(null)

    useEffect(() => {
        const getOptions = async () => {
            const [exterior, interior, roof, wheels] = await Promise.all([
                getColorOptionsByType('exterior'),
                getColorOptionsByType('interior'),
                getColorOptionsByType('roof'),
                getColorOptionsByType('wheels')
            ])
            setOptions({
                exterior: exterior || [],
                interior: interior || [],
                roof: roof || [],
                wheels: wheels || []
            })
        }
        getOptions()
    }, [])

    const calculatePrice = (customCar) => {
        let total = 0
        
        TYPES.forEach(type => {
            const selectedId = customCar[type]
            if (selectedId && options[type]) {
                const selectedOption = options[type].find(opt => opt.id === selectedId)
                if (selectedOption && typeof selectedOption.price === 'number') {
                    total += selectedOption.price
                }
            }
        })
        
        if (customCar.convertible) {
            total += 1200
        }
        
        return total
    }

    const handleChange = (type, value) => {
        const convertibleRoofs = ['Clear Sky', 'Aurora Clear', 'Moonlit Tint', 'Silverline']
        
        if (type === 'roof' && customCar.convertible) {
            const selectedRoof = options.roof.find(opt => opt.id === value)
            if (selectedRoof && !convertibleRoofs.includes(selectedRoof.name)) {
                alert("You can't put that roof on a convertible")
                const clearedCar = {...customCar, roof: null}
                const price = calculatePrice(clearedCar)
                setCustomCar({...clearedCar, price})
                return
            }
        }
        
        if (type === 'convertible' && value === true) {
            const currentRoof = customCar.roof
            if (currentRoof) {
                const roofOption = options.roof.find(opt => opt.id === currentRoof)
                if (roofOption && !convertibleRoofs.includes(roofOption.name)) {
                    alert("You can't put that roof on a convertible")
                    const updatedCar = {...customCar, [type]: value, roof: null}
                    const price = calculatePrice(updatedCar)
                    setCustomCar({...updatedCar, price})
                    return
                }
            }
        }
        
        const updatedCar = {...customCar, [type]: value}
        const price = calculatePrice(updatedCar)
        setCustomCar({...updatedCar, price})
    }

    const handleCreate = async () => {
        if(!customCar.name || !customCar.exterior || !customCar.interior || !customCar.roof || !customCar.wheels || customCar.convertible === undefined || customCar.convertible === null || !customCar.price) {
            alert('Please select options for each part')
            return
        }

        const created = await createCustomCar(customCar)
        if(created) {
            alert('Car created')
            setCustomCar(defaultCustomCar)
        } else {
            alert('Failed to create car')
        }
    } 

    return (
        <div style={{display: 'flex', flexDirection: 'column', paddingLeft: '50px', paddingRight: '50px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', alignItems: 'center'}} >
                    <label style={{ display: 'flex', alignItems: 'center', color: 'white'}}>
                        <input
                            type="checkbox"
                            checked={customCar.convertible}
                            onChange={e => handleChange('convertible', e.target.checked)}
                        />
                        Convertible
                    </label>
                    {TYPES.map(type => (
                        <button key={type} onClick={() => setOpenType(type)} >{type.toUpperCase()}</button>
                    ))}
                </div>

                <div style={{display: 'flex', alignItems: 'center'}} >
                    <input
                        type="text"
                        value={customCar.name}
                        onChange={e => handleChange('name', e.target.value)}
                        placeholder='My New Car'
                        style={{margin:'10px'}}
                    />
                    <button onClick={() => handleCreate(customCar)}>CREATE</button>
                </div>
            </div>

            <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {openType && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '50px', marginBottom: '50px', alignSelf: 'center', backgroundColor: 'black', width: '1000px', border: '3px solid var(--primary)', borderRadius: '8px', padding: '50px' }} >

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                {options[openType]?.map(option => (
                                    <div
                                        key={option.id}
                                        onClick={() => handleChange(openType, option.id)}
                                        style={{
                                            backgroundColor: option.hex,
                                            border: customCar[openType] === option.id ? '1px solid green' : '1px solid #ddd',
                                            borderRadius: '8px',
                                            padding: '15px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <div>
                                            <div style={{fontWeight: 'bold', fontSize: '14px'}}>{option.name}</div>
                                            <div style={{fontSize: '12px', color: '#666'}}>${option.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button onClick={() => setOpenType(null)} >DONE</button>
                    </div>
                )}
            </div>

            <button>${customCar.price}</button>


        </div>
    )
}

export default CreateCar