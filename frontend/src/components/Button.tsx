import React from 'react'

interface ButtonProps {
    name: string
    active: boolean
}

const Button = ({name, active}:ButtonProps) => {
  return (
    <button className={`py-2 px-5 ${active?'bg-gradient-to-r from-[rgba(254,73,0,0.63)] to-[#F78D2C] font-semibold':'bg-[#343434]'} rounded-xl`}>
        <p className='text-white text-xs'>{name}</p>
    </button>
  )
}

export default Button
