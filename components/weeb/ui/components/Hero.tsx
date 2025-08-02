import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

const HeroPages = () => {
  return (
    <div className='mt-28 flex flex-col justify-center items-center'>
    <h1 className="max-sm:hidden block text-4xl md:text-6xl font-extrabold text-center text-gray-200">
  Collaboration <br/>
  <span className="underline decoration-purple-500">Effective</span> <span className="text-purple-700">&</span> <span className="overline decoration-purple-500">Efficient</span>
</h1>
<h1 className="max-sm:block hidden text-5xl md:text-6xl font-extrabold text-center text-gray-200">
  Collaboration <br/> <span>Faster</span> <br/> <span className="text-purple-700">&</span> <span className="overline decoration-purple-500 ">Better</span>
</h1>

    <p className='text-gray-300 text-center mt-4 mx-auto max-w-2xl'>
       Treeloo is a collaborative project management app designed for multi-user teams, enabling effective execution and efficient workflows. It fosters real-time collaboration by providing a unified workspace where members can simultaneously view, edit tasks, share files, and communicate within project contexts, ensuring shared visibility of goals and responsibilities. 
    </p>
    <div className='flex flex-row justify-center items-center gap-4 mt-8'>
        <Link href="/register">
            <span className="group text-md relative inline-flex items-center  text-white bg-purple-600 px-6 py-2 rounded-sm  shadow pointer-events-none group-hover:pointer-events-auto">
                Join Now
            </span>
        </Link>
        <Link href="/demo">
            <span className="group text-md relative inline-flex items-center border-2   text-white  px-6 py-2 rounded-xl  shadow pointer-events-none group-hover:pointer-events-auto">
                View Demo
            </span>
        </Link>
    </div>

        <div className='flex flex-col justify-center items-center mt-8'>
            <Image src="/weeb/Desktop.svg" alt="hero" width={1000} height={500} className='w-full max-w-4xl h-[59vh]' />
        </div>
     </div>
  )
}

export default HeroPages
