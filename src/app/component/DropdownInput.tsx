import React, { useState } from 'react'

const DropdownInput = () => {
    const [status, setStatus] = useState(false)
    return (
        <div>
            <div className="relative h-11 w-full min-w-[200px] mb-2">
                <label
                    className="font-medium text-base text-[#A8C6DF]">
                    {"Call To"}
                </label>
                <div className="flex -mt-2">
                    <select className="h-full text-neutral-800 text-lg w-1/4 border-b border-[#0003] bg-transparent pt-3.5 pb-1.5 font-sans font-semibold outline outline-0 transition-all placeholder-shown:border-blue-gray-200 ">
                        <option value="">Select</option>
                        {/* {data?.map((item) => (
                            <option className='text-neutral-800' key={item.value} value={item?.value}>
                                {item?.lable}
                            </option>
                        ))} */}
                    </select>
                    <div className="relative w-full">
                        <input type="text" id="search-dropdown" className="h-full text-lg w-full border-b border-[#0003]  bg-transparent pt-4 pb-1.5 ps-3 pr-8 font-sans font-semibold text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" placeholder="Call To" required />


                        <button type="submit" className="absolute top-0 end-0 p-2.5 h-full text-sm font-medium text-black "><svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DropdownInput