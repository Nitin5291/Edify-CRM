import React from "react";
import JointBtn from "./JointBtn";
import Image from "next/image";

const SearchCustomModel = ({
    children,
    onClose,
    close = false,
    isLoading = false,
    large = false
}: {
    isLoading?: Boolean;
    children: any;
    onClose?: () => void;
    close?: boolean;
    large?: boolean;
}) => {
    return (
        <>
            <div
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
            >
                <div
                    className={`relative p-4 w-full max-w-3xl xl:max-w-7xl`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal content */}
                    <div className="relative md:px-8 bg-white rounded-lg shadow">
                        {/* Modal header */}
                        <div className="flex items-center absolute justify-between  rounded-full -top-5 -end-3 bg-white p-2 ">
                            <button
                                disabled={isLoading ? true : false}
                                onClick={onClose}
                                type="button"
                                className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        {/* Modal body */}
                        <div className="p-4 px-8 md:px-6 md:p-5 overflow-auto h-[80vh]">
                            {/* <div className="grid gap-6 mb-8 md:grid-cols-2"> */}
                            {children}
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchCustomModel;
