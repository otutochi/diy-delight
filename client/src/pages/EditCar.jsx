import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../App.css'
import { getAllColorOptions, getColorOptionsByType, getColorOptionById } from '../api/color_options'
import { createCustomCar, getAllCustomCars, getCustomCarById, editCustomCar, deleteCustomCar  } from '../api/custom_cars'

const TYPES = ['exterior', 'interior', 'roof', 'wheels']

const EditCar = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const [customCar, setCustomCar] = useState({
        name: '',
        exterior: null,
        interior: null,
        roof: null, 
        wheels: null,
        convertible: false,
        price: 0,
    })

    useEffect(() => {
        const getCustomCar = async () => {
            const fetchedCar = await getCustomCarById(id)
            setCustomCar(fetchedCar)
        }
        getCustomCar()
    }, [id])

    const [options, setOptions] = useState({
        exterior: [],
        interior: [],
        roof: [],
        wheels:[]
    })

    const [optionDetails, setOptionDetails] = useState({
        exterior: null,
        interior: null,
        roof: null,
        wheels: null
    })

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

    // Fetch full option details for display
    useEffect(() => {
        let mounted = true
        const getOptionDetails = async () => {
            try {
                const ids = [customCar.exterior, customCar.interior, customCar.roof, customCar.wheels]
                if (!ids.some(Boolean)) {
                    if (mounted) setOptionDetails({ exterior: null, interior: null, roof: null, wheels: null })
                    return
                }

                const [extOpt, intOpt, roofOpt, wheelsOpt] = await Promise.all(
                    ids.map(id => id ? getColorOptionById(id).catch(() => null) : Promise.resolve(null))
                )

                if (!mounted) return
                setOptionDetails({
                    exterior: extOpt,
                    interior: intOpt,
                    roof: roofOpt,
                    wheels: wheelsOpt
                })
            } catch (err) {
                console.error('Failed to load option details', err)
            }
        }
        getOptionDetails()
        return () => { mounted = false }
    }, [customCar.exterior, customCar.interior, customCar.roof, customCar.wheels])

    const [openType, setOpenType] = useState(null)

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

    const handleUpdate = async () => {
        if(!customCar.name || !customCar.exterior || !customCar.interior || !customCar.roof || !customCar.wheels || customCar.convertible === undefined || customCar.convertible === null || !customCar.price) {
            alert('Please select options for each part')
            return
        }

        const updated = await editCustomCar(id, customCar)
        if(updated) {
            alert('Updated Car')
        } else {
            alert('Failed to update car')
        }
    }

    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete "${customCar.name}"?`)) {
            try {
                const result = await deleteCustomCar(id)
                if (result) {
                    alert('Car deleted successfully')
                    navigate('/customcars')
                } else {
                    alert('Failed to delete car')
                }
            } catch (err) {
                console.error('Error deleting car', err)
                alert('Failed to delete car')
            }
        }
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', paddingLeft: '50px', paddingRight: '50px'}}>
            
            {/* Current Car Details Display */}
            <div style={{margin:'30px 0', backgroundColor:'rgba(0, 0, 0, 0.8)', padding:'30px', borderRadius:'8px'}}>
                <h2 style={{color:'white', marginBottom:'30px'}}>{customCar.name || 'Editing Car'}</h2>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', columnGap:'20px', rowGap:'20px'}} >
                    
                    {/* Price */}
                    <div style={{
                        backgroundColor:'rgba(255, 255, 255, 0.1)', 
                        padding:'20px', 
                        borderRadius:'8px',
                        display:'flex',
                        flexDirection:'column',
                        justifyContent:'center',
                        alignItems:'center'
                    }}>
                        <h3 style={{color:'white', margin:0}}>Total Price</h3>
                        <h2 style={{color:'var(--primary)', margin:'10px 0 0 0'}}>${customCar.price}</h2>
                        {customCar.convertible && <p style={{color:'white', fontSize:'12px', margin:'5px 0 0 0'}}>Convertible (+$1200)</p>}
                    </div>

                    {/* Exterior */}
                    <div style={{
                        backgroundColor: optionDetails.exterior?.hex || '#333',
                        padding:'20px',
                        borderRadius:'8px',
                        border:'2px solid rgba(255,255,255,0.2)',
                        display:'flex',
                        flexDirection:'column',
                        justifyContent:'center'
                    }}>
                        <h4 style={{margin:'0 0 10px 0', fontSize:'12px', textTransform:'uppercase', opacity:0.8}}>Exterior</h4>
                        <h3 style={{margin:0}}>{optionDetails.exterior?.name || '—'}</h3>
                    </div>

                    {/* Interior */}
                    <div style={{
                        backgroundColor: optionDetails.interior?.hex || '#333',
                        padding:'20px',
                        borderRadius:'8px',
                        border:'2px solid rgba(255,255,255,0.2)',
                        display:'flex',
                        flexDirection:'column',
                        justifyContent:'center'
                    }}>
                        <h4 style={{margin:'0 0 10px 0', fontSize:'12px', textTransform:'uppercase', opacity:0.8}}>Interior</h4>
                        <h3 style={{margin:0}}>{optionDetails.interior?.name || '—'}</h3>
                    </div>

                    {/* Spacer */}
                    <div></div>

                    {/* Roof */}
                    <div style={{
                        backgroundColor: optionDetails.roof?.hex || '#333',
                        padding:'20px',
                        borderRadius:'8px',
                        border:'2px solid rgba(255,255,255,0.2)',
                        display:'flex',
                        flexDirection:'column',
                        justifyContent:'center'
                    }}>
                        <h4 style={{margin:'0 0 10px 0', fontSize:'12px', textTransform:'uppercase', opacity:0.8}}>Roof</h4>
                        <h3 style={{margin:0}}>{optionDetails.roof?.name || '—'}</h3>
                    </div>

                    {/* Wheels */}
                    <div style={{
                        backgroundColor: optionDetails.wheels?.hex || '#333',
                        padding:'20px',
                        borderRadius:'8px',
                        border:'2px solid rgba(255,255,255,0.2)',
                        display:'flex',
                        flexDirection:'column',
                        justifyContent:'center'
                    }}>
                        <h4 style={{margin:'0 0 10px 0', fontSize:'12px', textTransform:'uppercase', opacity:0.8}}>Wheels</h4>
                        <h3 style={{margin:0}}>{optionDetails.wheels?.name || '—'}</h3>
                    </div>

                </div>
            </div>

            {/* Edit Controls */}
            <div style={{margin:'20px 0', padding:'20px', backgroundColor:'rgba(0, 0, 0, 0.6)', borderRadius:'8px'}}>
                <h3 style={{color:'white', marginBottom:'20px'}}>Edit Configuration</h3>
                
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
                            placeholder='My Car Name'
                            style={{margin:'10px'}}
                        />
                        <button onClick={() => handleUpdate(customCar)}>UPDATE</button>
                        <button onClick={handleDelete}>DELETE</button>
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
                                                border: customCar[openType] === option.id ? '3px solid green' : '1px solid #ddd',
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
            </div>


        </div>
    )
}

export default EditCar