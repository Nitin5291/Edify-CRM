"use client";
import React, { useEffect } from "react";
import LineCharts from "../component/LineCharts";
import PieChart from "../component/PieChart";
import { getHome } from "@/lib/features/home/homeSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import Loader from "../component/Loader";
import { formatHour, useWindowDimensions } from "@/CommonData";
import { BsFillPersonCheckFill, BsFillPersonXFill } from "react-icons/bs";
import { MdLeaderboard, MdOutlineLeaderboard } from "react-icons/md";
import { FaStairs } from "react-icons/fa6";
import { PiHandshakeFill } from "react-icons/pi";
import { IoPerson } from "react-icons/io5";
import Navbar from "../Navbar/page";

const page = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getHome());
  }, []);

  const { homeData, isLoader } = useAppSelector((state) => state?.home);
  console.log("🚀 ~ page ~ homeData:", homeData)

  const Top3Services = homeData?.hourlyLeadsCount?.map(
    (item: { hour: number; count: any }) => ({
      ratingreceived: formatHour(item.hour),
      spatreatments: item.count,
    })
  );
  const { width } = useWindowDimensions();

  return (
    <>
      <Navbar />
      {isLoader ? (
        <div className="h-full min-h-[90vh] content-center">
          <Loader size={10} />
        </div>
      ) : (
        <div className="bg-[#F4F6F9] h-full px-10 py-4">
          <div>
            {/* <p className='text-sm font-bold'>Hey Mariana - <span className='font-normal'>here’s what’s happening with your store today</span></p> */}
          </div>
          <div className="flex gap-5 mt-7 mx-5 flex-wrap">
            {homeData?.leadsCountByLeadStatus?.map((item: any) => {
              return (
                <div className="bg-white gap-5 h-24 w-64 rounded-2xl shadow flex items-center px-4 py-5">
                  {item?.leadStatus === "Not Contacted" || item?.leadStatus === "NotContacted" ? <div className="bg-[#F4F7FF] p-5 rounded-full"><BsFillPersonXFill className="text-[#3A18E8]" size={24} /></div> : item?.leadStatus === "Contacted" || item?.leadStatus === "contacted" ? <div className="bg-[#F4F7FF] p-5 rounded-full"><BsFillPersonCheckFill className="text-[#3A18E8]" size={24} /></div> : item?.leadStatus === "Warm Lead" ? <div className="bg-[#F4F7FF] p-5 rounded-full"><MdLeaderboard className="text-[#3A18E8]" size={24} /></div> : item?.leadStatus === "Opportunity" ? <div className="bg-[#F4F7FF] p-5 rounded-full"><FaStairs className="text-[#3A18E8]" size={24} /></div> : item?.leadStatus === "Cold Lead" ? <div className="bg-[#F4F7FF] p-5 rounded-full"><MdOutlineLeaderboard className="text-[#3A18E8]" size={24} /></div> : item?.leadStatus === "Attempted" ? <div className="bg-[#F4F7FF] p-5 rounded-full"><PiHandshakeFill className="text-[#3A18E8]" size={24} /></div> : <div className="bg-[#F4F7FF] p-5 rounded-full"><IoPerson size={24} /></div>}
                  <div>
                    <p className="text-sm text-[#A8C6DF] font-medium">

                      {item?.leadStatus ? item?.leadStatus : "-"}
                    </p>
                    <p className="text-2xl font-bold">{item?.count}</p>
                  </div>
                </div>
              );
            })}

            <div className="flex gap-7 w-full mt-8 flex-wrap xl:flex-nowrap">
              {Top3Services?.length > 0 && (
                <div style={{ width: `${width >= 1280 ? width - 500 : width}px` }}>
                  {/* <LineCharts Top3Services={Top3Services} /> */}
                  <LineCharts Top3Services={Top3Services} />
                </div>
              )}
              {/* <PieChart leadsCountByCourseId={homeData?.leadsCountByCourseId} /> */}
              <PieChart leadsCountByCourseId={homeData?.leadsCountByCourseId} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default page;
