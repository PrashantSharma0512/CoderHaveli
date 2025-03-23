import React from 'react'
import loading from '../assets/loading_man.gif'
function Loading() {
  return (
    <div>
        <div className='w-screen h-screen flex justify-center items-center bg-gray-900' >
            <img src={loading} alt="" />
        </div>
        <div></div>
    </div>
  )
}

export default Loading