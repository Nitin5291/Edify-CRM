import React from 'react'
import { GoPlus } from 'react-icons/go'

const Dropzone = ({ handelOnCahnge }: { handelOnCahnge: (e: any) => void }) => {
    return (
        <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-36 lg:h-48 xl:h-64 border-2 border-dashed cursor-pointer bg-zinc-100 rounded-xl border-black border-opacity-40">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <GoPlus className="w-14 h-14 text-neutral-500" />
                    <span className="text-black text-base font-normal">Add Image</span>
                    <p className="text-stone-800 text-opacity-60 text-sm font-normal">Less then 1mb, png,jpeg</p>
                </div>
                <input id="dropzone-file" name='file' accept='image/*' onChange={(e) => handelOnCahnge(e?.target?.files)} multiple type="file" className="hidden" />
            </label>
        </div>
    )
}

export default Dropzone