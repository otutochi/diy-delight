import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import '../App.css'
import { getAllColorOptions, getColorOptionsByType, getColorOptionById } from '../api/color_options'
import { createCustomCar, getAllCustomCars, getCustomCarById, editCustomCar, deleteCustomCar  } from '../api/custom_cars'

const CarDetails = () => {

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
        let mounted = true
        const getCustomCar = async () => {
            try {
                const fetchedCar = await getCustomCarById(id)
                if (!mounted) return
                if (fetchedCar) setCustomCar(fetchedCar)
            } catch (err) {
                console.error('Failed to load custom car', err)
            }
        }
        if (id) getCustomCar()
        return () => { mounted = false }
    }, [id])

    const [options, setOptions] = useState({
        exterior: null,
        interior: null,
        roof: null,
        wheels: null
    })

    useEffect(() => {
        let mounted = true
        const getOptions = async () => {
            try {
                // don't call API if no ids yet
                const ids = [customCar.exterior, customCar.interior, customCar.roof, customCar.wheels]
                if (!ids.some(Boolean)) {
                    if (mounted) setOptions({ exterior: null, interior: null, roof: null, wheels: null })
                    return
                }

                const [extOpt, intOpt, roofOpt, wheelsOpt] = await Promise.all(
                    ids.map(id => id ? getColorOptionById(id).catch(() => null) : Promise.resolve(null))
                )

                if (!mounted) return
                setOptions({
                    exterior: extOpt,
                    interior: intOpt,
                    roof: roofOpt,
                    wheels: wheelsOpt
                })
            } catch (err) {
                console.error('Failed to load options', err)
            }
        }
        getOptions()
        return () => { mounted = false }
    }, [customCar.exterior, customCar.interior, customCar.roof, customCar.wheels])

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
        <div style={{display:'flex', flexDirection:'column', margin:'50px', backgroundColor:'rgba(0, 0, 0, 0.8)', padding:'30px', borderRadius:'8px'}}>
            <h2 style={{color:'white', marginBottom:'30px'}}>{customCar.name}</h2>
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
                    backgroundColor: options.exterior?.hex || '#333',
                    padding:'20px',
                    borderRadius:'8px',
                    border:'2px solid rgba(255,255,255,0.2)',
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center'
                }}>
                    <h4 style={{margin:'0 0 10px 0', fontSize:'12px', textTransform:'uppercase', opacity:0.8}}>Exterior</h4>
                    <h3 style={{margin:0}}>{options.exterior?.name || '—'}</h3>
                </div>

                {/* Interior */}
                <div style={{
                    backgroundColor: options.interior?.hex || '#333',
                    padding:'20px',
                    borderRadius:'8px',
                    border:'2px solid rgba(255,255,255,0.2)',
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center'
                }}>
                    <h4 style={{margin:'0 0 10px 0', fontSize:'12px', textTransform:'uppercase', opacity:0.8}}>Interior</h4>
                    <h3 style={{margin:0}}>{options.interior?.name || '—'}</h3>
                </div>

                {/* Edit & Delete Buttons */}
                <div style={{
                    backgroundColor:'rgba(255, 255, 255, 0.1)',
                    padding:'20px',
                    borderRadius:'8px',
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center',
                    gap:'10px'
                }}>
                    <Link
                        to={`/edit/${id}`}
                        style={{textDecoration:'none'}}
                    >
                        <button style={{padding:'10px', cursor:'pointer', width:'100%'}}>EDIT</button>
                    </Link>
                    <button 
                        onClick={handleDelete}
                        style={{padding:'10px', cursor:'pointer', backgroundColor:'#dc2626', color:'white', border:'none', borderRadius:'4px'}}
                    >
                        DELETE
                    </button>
                </div>

                {/* Roof */}
                <div style={{
                    backgroundColor: options.roof?.hex || '#333',
                    padding:'20px',
                    borderRadius:'8px',
                    border:'2px solid rgba(255,255,255,0.2)',
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center'
                }}>
                    <h4 style={{margin:'0 0 10px 0', fontSize:'12px', textTransform:'uppercase', opacity:0.8}}>Roof</h4>
                    <h3 style={{margin:0}}>{options.roof?.name || '—'}</h3>
                </div>

                {/* Wheels */}
                <div style={{
                    backgroundColor: options.wheels?.hex || '#333',
                    padding:'20px',
                    borderRadius:'8px',
                    border:'2px solid rgba(255,255,255,0.2)',
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center'
                }}>
                    <h4 style={{margin:'0 0 10px 0', fontSize:'12px', textTransform:'uppercase', opacity:0.8}}>Wheels</h4>
                    <h3 style={{margin:0}}>{options.wheels?.name || '—'}</h3>
                </div>

            </div>

        </div>
    )
}

export default CarDetails