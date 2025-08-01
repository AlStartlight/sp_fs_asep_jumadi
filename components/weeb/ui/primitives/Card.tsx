import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import {  ArrowRight } from 'lucide-react';
interface CardProps {
    url: string;
    crumbTitle: string;
    subHeading: string;
    title: string;
    ctaLink: string;
}
const Card = ({ title, ctaLink, crumbTitle, subHeading, url }: CardProps) => {
  return (
    <div className='w-full h-96 relative'>
      <div className='w-full h-56 relative'>
      <Image
        alt='...'
        src={url}
        className='w-full h-full object-cover'
        fill
        priority
      />
      <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent' >
        <span className='text-fuchsia-600 bg-pink-100  absolute top-4 left-4'>
          <p className='text-fuchsia-500 px-2 text-[12px]'>{subHeading}</p>
        </span>
      </div>
      </div>
      <div className='flex flex-col py-10'>
          <p className='text-xl text-black'>{crumbTitle}</p>
          <h1 className='text-4xl font-bold text-black'>{title}</h1>
          <Link href={ctaLink} className='text-purple-600 text-sm hover:underline flex items-center mt-2'>
            Buy Ticket <ArrowRight className='inline text-purple-600 ml-2' size={30} />
          </Link>
      </div>
    </div>
  )
}

export default Card
