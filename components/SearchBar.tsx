"use client";
import { ScapeAndStoreProduct } from '@/lib/actions';
import { hostname } from 'os';
import React, { FormEvent, useState } from 'react'

const SearchBar = () => {
  const isValidUrl = (url: string) =>{
    try {
      const parsedUrl = new URL(url);
      const hostName = parsedUrl.hostname;

      if(
        hostName.includes('amazon.com') ||
        hostName.includes('amazon.') ||
        hostName.includes('amazon')
      ){
        return true
      }
    }catch(err){
      return false
    }
    return false
  }
  const [searchPrompt,setSearchPrompt] = useState('');
  const [isLoading, setisLoading] = useState(false)
  const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidUrl(searchPrompt);
    if(!isValidLink)return alert(isValidLink ? 'Valid Link' : 'Invalid Link');

    try {
      setisLoading(true)
      const product = await ScapeAndStoreProduct(searchPrompt)
    }catch(err){
      console.log(err)
    }finally {
      setisLoading(false)
    }
  }
  return (
    <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}>
        <input
         type='text' 
         value={searchPrompt}
         onChange={(e)=> setSearchPrompt(e.target.value)} 
         placeholder='Enter Product Link' 
         className='searchbar-input'
        />
        <button type='submit' className='searchbar-btn' disabled = {searchPrompt === ''} >
            {isLoading ? 'Searching....' : 'Search'}
        </button>
    </form>
  )
}

export default SearchBar