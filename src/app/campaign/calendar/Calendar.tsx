"use client";
import React from 'react'
import CalendarComponent from './CalendarComponent';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

const Calendar = ({ setCalendar }: { setCalendar?: any }) => {
    return (
        <div className="lg:w-full">
            <div className="mx-5 my-2.5 px-5 pb-5 pt-3 shadow-lg border-2 bg-[#FFF] rounded-lg">
                <div onClick={() => setCalendar(false)}
                    className="flex gap-1 cursor-pointer mb-2"
                >
                    <MdOutlineArrowBackIosNew size={25} /> Back
                </div>
                <CalendarComponent />
            </div>
        </div>
    )
}

export default Calendar