import React from 'react'
import './Table.css'
import numeral from 'numeral'


function Table({countriesData}) {
    return (
        <div className='table'>
            
                {countriesData.map(({country , cases}) => (
                    <tr>
                        <td>{country}</td>
                        <td><strong>{numeral(cases).format('0,0')}</strong></td>
                    </tr>
                ))}
           
        </div>
    )
}

export default Table
