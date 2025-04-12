import React from 'react'
import './Button.css'

const Button = ({name, variant, onclick}) => {

  return (
    <div className='buttons'>
      <button onClick={onclick} className={`btn btn-${variant}`}>{name}</button>
    </div>
  )
};

export default Button
