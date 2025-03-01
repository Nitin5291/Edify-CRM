'use client'
import Image from 'next/image';
import React from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import ProfileLogo from "../../assets/profileLogo.png";
import { useWindowDimensions } from '@/CommonData';
import MessageRightSide from './MessageRightSide';

const Page = () => {
    const { height, width } = useWindowDimensions();

    return (
        <div className="flex gap-3 py-3">
            <div style={{ height: height - 125 }} className="w-1/4 my-2.5 pt-2.5 shadow-lg border bg-[#FFF]">
                <div className='flex justify-between px-7 items-center mb-4'>
                    <h2 className='font-medium text-2xl'>All Message</h2>
                    <IoSearchSharp size={26} className="cursor-pointer" />
                </div>
                {[0, 1, 2, 3, 4,5]?.map((i) => {
                    return (
                        <div className='flex px-7 pt-5 pb-3 justify-between border-b-2 border-indigo-50 cursor-pointer hover:bg-indigo-50'>
                            <div className='flex gap-3'>
                                <Image
                                    src={ProfileLogo}
                                    alt="Profile Logo"
                                    className="w-14 h-14 text-red-600" // Add cursor-pointer for better UX
                                />
                                <div className='grid gap-2'>
                                    <p className='text-xl'>T. Krishna</p>
                                    <span className='text-base bg-indigo-50 px-2 w-auto rounded-md mr-auto'>Lead</span>
                                    <p className='text-xs'>Hi Bharath</p>
                                </div>
                            </div>
                            <p>10:30AM</p>
                        </div>
                    )
                })}

            </div>
            <div className='w-[73%]'>
                <MessageRightSide />
            </div>

        </div>
    );
};

export default Page;
