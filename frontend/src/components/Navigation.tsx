import React from 'react'
import Button from './Button'

const Navigation = () => {
  return (
    <div className='p-3 min-w-[100vw] w-full h-max flex bg-[#1f1f1f] gap-4'>
      <Button name="Analysis" active={true} />
      <Button name="Export" active={false} />
      <Button name="Help" active={false} />
    </div>
  )
}

export default Navigation
