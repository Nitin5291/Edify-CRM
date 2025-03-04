"use client";
import React, { useMemo, useState } from "react";
import Contact from "../../assets/employee_contact.svg";
import Image from "next/image";
import { LeadeData } from "@/app/component/Type";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { getUser } from "@/lib/features/auth/authSlice";
import AskAI from "../ask_aI/AskAI";
import Note from "../leads/Note";
import BatchDetail from "./BatchDetail";
import LearnerPage from "./LearnerPage";
import Activity from "./Activity";
import Topic from "./Topic";
import { getBatchByLearner, getSingleBatch } from "@/lib/features/batch/batchSlice";

const EditBatch = ({
  handelOnSet,
  batche,
}: {
  batche?: any;
  handelOnSet: (id: number, data: LeadeData[]) => void;
}) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<String>("Details");
  let { SingleBatch } = useAppSelector((state) => state?.batch);
  SingleBatch = SingleBatch?.data
  console.log("🚀 ~ SingleBatch:", SingleBatch)

  useMemo(() => {
    if (batche?.[0]?.id) {
      dispatch(getSingleBatch(batche?.[0]?.id));
      dispatch(getBatchByLearner(batche?.[0]?.id));
      // dispatch(getUser("salesperson"));
    }
  }, [batche?.[0]?.id]);

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
              <MdOutlineArrowBackIosNew size={25} />
            </div>
            <div className="flex gap-3 items-center">
              <Image src={Contact} alt="Contact icon" />
              <h2 className="text-black text-lg font-semibold">
                {SingleBatch?.batchName}
              </h2>
            </div>
          </div>
        </div>
        <div className="py-2 px-14 flex flex-wrap justify-between">
          <div className="min-w-48 mb-2">
            <p className="text-black mb-1 text-lg font-medium">Trainer</p>
            <span className="text-sky-600 text-sm font-semibold flex gap-1.5">
              {SingleBatch?.trainerName}
            </span>
          </div>
          <div className="min-w-48 mb-2">
            <p className="text-black mb-1 text-lg font-medium">Email</p>
            <span className="text-sky-600 text-sm font-semibold flex gap-1.5">
              {SingleBatch?.email ? SingleBatch?.email : "-"}
            </span>
          </div>
          <div className="min-w-48 mb-2">
            <p className="text-black mb-1 text-lg font-medium">Mobile Number</p>
            <span className="text-sky-600 text-sm font-semibold flex gap-1.5">
              {SingleBatch?.mobileNumber}
            </span>
          </div>
          <div className="min-w-48 mb-2">
            <p className="text-black mb-1 text-lg font-medium">Batch Status</p>
            <span className="text-sky-600 text-sm font-semibold flex gap-1.5">
              {SingleBatch?.batchStatus}
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
                onClick={() => handleTabChange("Learners")}
                className={`inline-block p-4 border-b-2 rounded-t-lg text-sm font-semibold ${activeTab === "Learners"
                  ? "text-black border-blue-600"
                  : "hover:text-gray-600 hover:border-gray-300 text-neutral-500 border-transparent"
                  }`}
              >
                Learners
              </a>
            </li>
            <li className="me-2">
              <a
                href="#"
                onClick={() => handleTabChange("Topic")}
                className={`inline-block p-4 border-b-2 rounded-t-lg text-sm font-semibold ${activeTab === "Topic"
                  ? "text-black border-blue-600"
                  : "hover:text-gray-600 hover:border-gray-300 text-neutral-500 border-transparent"
                  }`}
                aria-current="page"
              >
                Topic
              </a>
            </li>
            <li className="me-2">
              <a
                href="#"
                onClick={() => handleTabChange("Activity")}
                className={`inline-block p-4 border-b-2 rounded-t-lg text-sm font-semibold ${activeTab === "Activity"
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
            <BatchDetail handelOnSet={handelOnSet} />
          ) : activeTab === "Learners" ?
            <LearnerPage />
            : activeTab === "Activity" ? (
              <Activity />
            ) : activeTab === "Topic" ? (
              <Topic />
            ) : activeTab === "ask_ai" ? (
              <AskAI />
            ) : activeTab === "note" ? (
              <Note name="batchId" id={SingleBatch?.id} />
            ) :
              null}
        </div>
      </div>
    </div>
  );
};

export default EditBatch;
