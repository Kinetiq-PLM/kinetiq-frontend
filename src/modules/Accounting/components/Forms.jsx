import React from 'react'
import './Forms.css'

const Forms = ({ type, formName, placeholder, value, onChange }) => { // add onchange
    return (
        <div className='accounting-forms'>
            <div class="input-container">
                <label for={formName}>{formName}</label>
                <input className='input-component' type={type} id={formName} placeholder={placeholder} value={value} onChange={onChange} />
            </div>
        </div>
    )
}

export default Forms
