import React from 'react'
import ProfileLogo from "../../assets/profileLogo.png";
import Image from 'next/image';
import { MdInfoOutline } from 'react-icons/md';
import { useWindowDimensions } from '@/CommonData';
import InputField from '../component/InputField';

const MessageRightSide = () => {
    const { height, width } = useWindowDimensions();
    return (
        <div>
            <div className="flex justify-between items-center mt-2.5 px-7 shadow-2xl border bg-[#FFF] rounded-lg">
                <div className='flex items-center gap-5'>
                    <Image
                        src={ProfileLogo}
                        alt="Profile Logo"
                        className="w-14 h-14 text-red-600 mt-1.5 mb-3" // Add cursor-pointer for better UX
                    />
                    <p className='text-xl'>T. Krishna</p>
                    <span className='text-base bg-indigo-50 px-2 w-auto rounded-md mr-auto'>Lead</span>
                </div>
                <MdInfoOutline size={29} />
            </div>
            <div className="my-2.5 py-2.5 shadow-lg bg-[#FFF] border rounded-xl" style={{ height: height - 210 }}>
                <div className="text-sm mx-4 font-medium text-center text-gray-500 border-b border-indigo-200">
                    <ul className="flex flex-wrap -mb-px">
                        <li className="me-1">
                            <a
                                href="#"
                                // onClick={() => handleTabChange("Details")}
                                className={`inline-block p-1 border-b-2 rounded-t-lg text-lg font-semibold ${true
                                    ? "text-black border-blue-600"
                                    : "hover:text-gray-600 hover:border-gray-300 text-neutral-500 border-transparent "
                                    }`}
                            >
                                Message
                            </a>
                        </li>

                    </ul>
                </div>
                <div className='px-3 pt-4' style={{ height: height - 330 }}>
                    <div className='flex items-center gap-2'>
                        <Image
                            src={ProfileLogo}
                            alt="Profile Logo"
                            className="w-10 h-10 text-red-600 mt-1.5 mb-3" // Add cursor-pointer for better UX
                        />
                        <p className='text-lg p-0'>T. Krishna</p>
                    </div>
                    <div className='grid gap-2 pl-12 relative top-[-10px]'>
                        <span className='text-base bg-indigo-50 px-2 py-1 w-auto rounded-lg mr-auto'>Hi Bharath</span>
                        <span className='text-base bg-indigo-50 px-2 py-1 w-auto rounded-lg mr-auto'>Any update on Digital Edify</span>
                    </div>
                </div>
                <InputField />
            </div>
        </div>
    )
}

export default MessageRightSide