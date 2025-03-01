"use client"
import { useAppDispatch } from '@/lib/store';
import moment from 'moment';
import React, { useState } from 'react'
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import UserDetail from './UserDetail';

const EditUser = ({ handelOnSet, user }: { user?: any; handelOnSet: (id: number, data: any) => void; }) => {
    return (
        <div className="w-[fit-content] lg:w-full">
            <div className="m-5 rounded-lg sborder-4  shadow-lg">
                <div className="flex justify-between items-center  px-5">
                    <div className="flex gap-3 items-center  py-2 ">
                        <div
                            onClick={() => handelOnSet(-1, [])}
                            className="flex gap-1 cursor-pointer"
                        >
                            <MdOutlineArrowBackIosNew size={25} />
                        </div>
                        <div className="flex gap-3 items-center">
                            <h2 className="text-black text-lg font-semibold">
                                Back
                            </h2>
                        </div>
                    </div>
                </div>

            </div>
            <div className="bg-white rounded-sm border-4 border-zinc-100 shadow-lg px-3 mx-5">
                <UserDetail handelOnSet={handelOnSet} user={user} />
            </div>
        </div>
    )
}

export default EditUser