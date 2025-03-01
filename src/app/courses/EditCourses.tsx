"use client";
import React, { useMemo, useState } from "react";
import { LeadeData } from "@/app/component/Type";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  getSingleLead,
} from "@/lib/features/lead/leadSlice";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import CourseDetail from "./CourseDetail";


const EditCourses = ({
  handelOnSet,
  courses,
}: {
  courses?: any;
  handelOnSet: (id: number, data: LeadeData[]) => void;
}) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<String>("Details");
  useMemo(() => {
    if (courses?.[0]?.id) {
      dispatch(getSingleLead(courses?.[0]?.id));
    }
  }, [courses?.[0]?.id]);


  const handleTabChange = (tabName: String) => {
    setActiveTab(tabName);
  };


  return (
    <div className="w-[fit-content] lg:w-full">
      <div className="m-5 rounded-lg sborder-4 border-zinc-100 shadow-lg">
        <div className="flex justify-between items-center  px-5">
          <div className="flex gap-3 items-center  py-4 ">
            <div
              onClick={() => handelOnSet(-1, [])}
              className="flex gap-1 cursor-pointer"
            >
              <MdOutlineArrowBackIosNew size={25} /> Back
            </div>
          </div>
        </div>
      
      </div>
      <div className="bg-white rounded-sm border-4 border-zinc-100 shadow-lg px-3 mx-5">
        <div className="text-sm font-medium text-center text-gray-500 border-b border-neutral-400">
          <ul className="flex flex-wrap -mb-px">
            <li className="me-2">
              <a
                href="#"
                onClick={() => handleTabChange("Details")}
                className={`inline-block p-4 border-b-2 rounded-t-lg text-sm font-semibold ${
                  activeTab === "Details"
                    ? "text-black border-blue-600"
                    : "hover:text-gray-600 hover:border-gray-300 text-neutral-500 border-transparent"
                }`}
              >
                Details
              </a>
            </li>
            {/* <li className="me-2">
              <a
                href="#"
                onClick={() => handleTabChange("Activity")}
                className={`inline-block p-4 border-b-2 rounded-t-lg text-sm font-semibold ${
                  activeTab === "Activity"
                    ? "text-black border-blue-600"
                    : "hover:text-gray-600 hover:border-gray-300 text-neutral-500 border-transparent"
                }`}
                aria-current="page"
              >
                Activity
              </a>
            </li> */}
          </ul>
        </div>

        <div className="py-5">
          {activeTab === "Details" ? 
            <CourseDetail handelOnSet={handelOnSet} />
          : null}
        </div>
      </div>
    </div>
  );
};

export default EditCourses;
