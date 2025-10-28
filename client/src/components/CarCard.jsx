import React from 'react'
import '../App.css'
import { useState, useEffect } from 'react'
import { getColorOptionById } from '../api/color_options'
import { Link } from 'react-router-dom'

const CarCard = ({id, name, exterior, interior, roof, wheels, convertible, price }) => {

    const [names, setNames] = useState({
        exterior: '',
        interior: '',
        roof: '',
        wheels: ''
    })

    useEffect(() => {
        const getNames = async () => {
                        const [extOpt, intOpt, roofOpt, wheelsOpt] = await Promise.all([
                            getColorOptionById(exterior),
                            getColorOptionById(interior),
                            getColorOptionById(roof),
                            getColorOptionById(wheels)
                        ])
            
                        setNames({
                            exterior: extOpt.name,
                            interior: intOpt.name,
                            roof: roofOpt.name,
                            wheels: wheelsOpt.name
                        })
                    }
                    getNames()
    }, [exterior, interior, roof, wheels])
    
    return (
        <div style={{display:'flex', flexDirection:'column', backgroundColor:'rgba(0, 0, 0, 0.85)', padding:'12px', borderRadius:'8px', width:'1000px'}} >
            <h2>{name}</h2>
            <div style={{display:'flex', flexDirection:'row', gap:'50px', justifyContent:'space-around', alignItems:'center', alignSelf:'center'}} >
                <div style={{display:'flex', flexDirection:'column'}} >
                    <p><strong>Exterior: </strong>{names.exterior}</p>
                    <p><strong>Interior: </strong>{names.interior}</p>
                </div>
                <div style={{display:'flex', flexDirection:'column'}} >
                    <p><strong>Roof: </strong>{names.roof}</p>
                    <p><strong>Wheels: </strong>{names.wheels}</p>
                </div>
                <div style={{display:'flex', flexDirection:'column'}} >
                    <h4 style={{color: 'white'}}>${price}</h4>
                    <Link
                        to={`/customcars/${id}`}
                        style={{textDecoration:'none'}}
                    ><button>DETAILS</button></Link>
                </div>
            </div>
            
        </div>
    )
}

export default CarCard