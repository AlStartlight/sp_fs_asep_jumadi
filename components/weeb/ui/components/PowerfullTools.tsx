import React from 'react'
import Image from 'next/image'
const PowerfullTools = () => {
  return (
    <div className='grid grid-cols-[40%_60%] max-w-5xl mx-20'>
      <div className='flex flex-col justify-center gap-4 items-start mt-40 mb-20'>
        <p className='text-white text-sm'>POWERFULL</p>
        <h1 className='text-white text-5xl'>All the tools you can imagine</h1>
        <p className='text-gray-300 text-sm w-[75%]'>Scelerisque auctor dolor diam tortor, fames faucibus non interdum nunc.
          Ultrices nibh sapien elit gravida ac, rutrum molestie adipiscing lacinia.</p>
      </div>
      <Image alt='...' src="/weeb/Desktop.svg" className='relative top-20' width={1000} height={500}/>
    </div>
  )
}

export default PowerfullTools
