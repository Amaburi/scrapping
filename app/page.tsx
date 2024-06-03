import HeroCarousel from '@/components/HeroCarousel'
import SearchBar from '@/components/SearchBar'
import Image from 'next/image'
import React from 'react'

const Home = () => {
  return (
    <>
      <section className='px-6 border-2 md:px-20 py-24'>
          <div className='flex max-xl:flex-col gap-16'>
              <div className='flex flex-col justify-center'>
                <p className='small-text '>
                  Sic Mundus Creatus Est
                  <Image
                    src="/assets/icons/arrow-right.svg"
                    width={16}
                    height={16}
                    alt='arrow right'
                  />
                </p>

                <h1 className='head-text'>
                  Unleash the Power of 
                  <span className='text-primary'> PriceScrapping</span>
                </h1>

                <p className='mt-6 text-[13px]'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>

                <SearchBar/>
              </div>

              <HeroCarousel/>
          </div>
      </section>

      <section className='trending-section'>
          <h2 className='seciton-text'>Trending</h2>
          <div className='flex flex-wrap gap-x-8 gap-y-16'>
            {['Apple 15','Watch','Android'].map((product)=>(
              <div>{product}</div>
            ))}
          </div>
      </section>
    </>
  )
}

export default Home