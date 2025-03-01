import React from 'react';
import { MdAttachFile } from 'react-icons/md';
import { CgSmileMouthOpen } from "react-icons/cg";

const InputField: React.FC = () => {
    return (
        <div className="flex mx-4 items-center border border-gray-300 rounded-2xl pl-4">
            <input
                type="text"
                placeholder="Type a message..."
                className="flex-grow outline-none px-2"
            />
            <div className="flex items-center gap-2.5">
                {/* Emoji Icon */}
                <CgSmileMouthOpen size={25} className='cursor-pointer' />
                {/* Attachment Icon */}
                <MdAttachFile size={25} className='cursor-pointer' />
                {/* Send Button */}
                <button
                    type="button"
                    className="bg-blue-500 px-4 py-3 rounded-xl"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="white"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 19.5L19.5 12 4.5 4.5v6.75l7.5 1.5-7.5 1.5v6.75z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default InputField;
