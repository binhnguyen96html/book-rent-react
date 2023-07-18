import React from 'react'

export default function Button({children,...rest}) {
  return (
    <div>
      <button
      className='px-4 py-2
      rounded-md border 
      text-sm text-orange-900
      bg-orange-100
      shadow-md
      hover:bg-orange-200
      transition duration-150 ease-in-out'
      {...rest}
      >{children}</button>
    </div>
  )
}
