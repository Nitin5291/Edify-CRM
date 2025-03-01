"use client";
import React, { useMemo, useState } from "react";
import Contact from "../../assets/employee_contact.svg";
import Image from "next/image";
import { LeadeData } from "@/app/component/Type";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { getUser } from "@/lib/features/auth/authSlice";
import AskAI from "../leads/AskAI";
import CampaignDetail from "./CampaignDetail";
import { getSingleCampaign } from "@/lib/features/campaign/campaignSlice";
import Activity from "./Activity";
import moment from "moment";
import Note from "./Note";

const EditCampaign = ({
  handelOnSet,
  campaign,
}: {
  campaign?: any;
  handelOnSet: (id: number, data: LeadeData[]) => void;
}) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<String>("Details");
  const { singleCampaignData } = useAppSelector((state) => state?.campaign);
  console.log("🚀 ~ singleCampaignData:", singleCampaignData)

  useMemo(() => {
    if (campaign?.[0]?.id) {
      dispatch(getSingleCampaign(campaign?.[0]?.id));
      dispatch(getUser());
    }
  }, [campaign?.[0]?.id]);


  const handleTabChange = (tabName: String) => {
    setActiveTab(tabName);
  };

  return (
    <div className="w-[fit-content] lg:w-full">
      <div className="m-5 rounded-lg sborder-4 border-zinc-100 shadow-lg">
        <div className="flex justify-between items-center border-b border-b-neutral-400 px-5">
          <div className="flex gap-3 items-center  py-2 ">
            <div
              onClick={() => handelOnSet(-1, [])}
              className="flex gap-1 cursor-pointer"
            >
              <MdOutlineArrowBackIosNew size={25} /> Back
            </div>
            <div className="flex gap-3 items-center">
              <Image src={Contact} alt="Contact icon" />
              <h2 className="text-black text-lg font-semibold">
                {singleCampaignData?.campaigns?.[0]?.name}
              </h2>
            </div>
          </div>
        </div>
        <div className="py-2 px-14 flex flex-wrap justify-between">
          <div className="min-w-48 mb-2">
            <p className="text-black mb-1 text-lg font-medium">Type</p>
            <span className="text-sky-600 text-sm font-semibold flex gap-1.5">
              {singleCampaignData?.campaigns?.[0]?.type}
            </span>
          </div>
          <div className="min-w-48 mb-2">
            <p className="text-black mb-1 text-lg font-medium">Status</p>
            <span className="text-sky-600 text-sm font-semibold flex gap-1.5">
              {singleCampaignData?.campaigns?.[0]?.status}
            </span>
          </div>
          <div className="min-w-48 mb-2">
            <p className="text-black mb-1 text-lg font-medium">Start Date</p>
            <span className="text-sky-600 text-sm font-semibold flex gap-1.5">
              {moment(singleCampaignData?.campaigns?.[0]?.campaignDate).format("DD/MM/YYYY")}
            </span>
          </div>
          <div className="min-w-48 mb-2">
            <p className="text-black mb-1 text-lg font-medium">End Date</p>
            <span className="text-red-600 text-sm font-semibold flex gap-1.5">
              {moment(singleCampaignData?.campaigns?.[0]?.endDate).format("DD/MM/YYYY")}
            </span>
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
                className={`inline-block p-4 border-b-2 rounded-t-lg text-sm font-semibold ${activeTab === "Details"
                  ? "text-black border-blue-600"
                  : "hover:text-gray-600 hover:border-gray-300 text-neutral-500 border-transparent"
                  }`}
              >
                Details
              </a>
            </li>
            <li className="me-2">
              <a
                href="#"
                onClick={() => handleTabChange("Activities")}
                className={`inline-block p-4 border-b-2 rounded-t-lg text-sm font-semibold ${activeTab === "Activities"
                  ? "text-black border-blue-600"
                  : "hover:text-gray-600 hover:border-gray-300 text-neutral-500 border-transparent"
                  }`}
                aria-current="page"
              >
                Activities
              </a>
            </li>
            <li className="me-2">
              <a
                href="#"
                onClick={() => handleTabChange("note")}
                className={`inline-block p-4 border-b-2 rounded-t-lg text-sm font-semibold ${activeTab === "note"
                  ? "text-black border-blue-600"
                  : "hover:text-gray-600 hover:border-gray-300 text-neutral-500 border-transparent"
                  }`}
                aria-current="page"
              >
                Notes
              </a>
            </li>
            <li className="me-2">
              <a
                href="#"
                onClick={() => handleTabChange("ask_ai")}
                className={`inline-block p-4 border-b-2 rounded-t-lg text-sm font-semibold ${activeTab === "ask_ai"
                  ? "text-black border-blue-600"
                  : "hover:text-gray-600 hover:border-gray-300 text-neutral-500 border-transparent"
                  }`}
                aria-current="page"
              >
                Ask AI
              </a>
            </li>

          </ul>
        </div>

        <div className="py-5">
          {activeTab === "Details" ? (
            <CampaignDetail handelOnSet={handelOnSet} />
          ) : activeTab === "Activities" ? (
            <Activity />
          ) : activeTab === "ask_ai" ? (
            <AskAI />
          ) : activeTab === "note" ? (
            <Note name="campaignId" id={singleCampaignData?.campaigns?.[0]?.id} />
          ) :
            null}
        </div>
      </div>
    </div>
  );
};

export default EditCampaign;
