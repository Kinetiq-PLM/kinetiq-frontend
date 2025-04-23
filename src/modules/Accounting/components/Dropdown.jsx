import React from 'react';
import './Dropdown.css';

const Dropdown = ({ options, style, onChange, value }) => { // Add onChange and value
    return (
        <div className='accounting-dropdown'>
            <select className={`dropdown dropdown-${style}`} value={value} onChange={(e) => onChange(e.target.value)}>
                {options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;