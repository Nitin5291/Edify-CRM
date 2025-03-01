"use client";
import React, { useMemo, useState } from "react";
import Contact from "../../assets/employee_contact.svg";
import Image from "next/image";
import LeadeDetail from "./LeadeDetail";
import { LeadeData } from "@/app/component/Type";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  callsConnect,
  getSingleLead,
  updateLeadData,
} from "@/lib/features/lead/leadSlice";
import {
  MdEmail,
  MdLeaderboard,
  MdOutlineArrowBackIosNew,
  MdOutlineLeaderboard,
} from "react-icons/md";
import SingleBtn from "../component/SingleBtn";
import Activity from "./Activity";
import { getUserID } from "@/assets/utils/auth.util";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { GreetingStatus } from "@/lib/features/navbar/navbarSlice";
import { FaGraduationCap, FaPhoneAlt } from "react-icons/fa";
import { getSingleUser } from "@/lib/features/auth/authSlice";
import AskAI from "./AskAI";
import { BsFillPersonCheckFill, BsFillPersonXFill } from "react-icons/bs";
import { FaStairs } from "react-icons/fa6";
import { PiHandshakeFill } from "react-icons/pi";
import { IoPerson } from "react-icons/io5";
import Note from "../campaign/Note";

const EditContact = ({
  handelOnSet,
  leade,
}: {
  leade?: any;
  handelOnSet: (id: number, data: LeadeData[]) => void;
}) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<String>("Details");
  const router = useRouter();
  let { SingleLead, kanbanAllData } = useAppSelector((state) => state?.lead);
  SingleLead = SingleLead?.leads
  const { singleUser } = useAppSelector((state) => state?.auth);

  useMemo(() => {
    if (leade?.[0]?.id) {
      dispatch(getSingleLead(leade?.[0]?.id));
    }
  }, [leade?.[0]?.id]);

  useMemo(() => {
    if (SingleLead?.userId) {
      dispatch(getSingleUser(SingleLead?.userId));
    }
  }, [SingleLead?.userId]);

  const handleTabChange = (tabName: String) => {
    setActiveTab(tabName);
  };

  const handelOnConvert = () => {
    const data = {
      // name: SingleLead?.name,
      // leadSource: SingleLead?.leadSource,
      // techStack: SingleLead?.techStack,
      // countryCode: SingleLead?.countryCode?.replace("+", ""),
      // phone: SingleLead?.phone,
      // courseId:
      //   SingleLead?.courseId?.length > 0
      //     ? SingleLead?.courseId
      //         ?.map((item: any) => {
      //           return item?.value;
      //         })
      //         ?.join()
      //     : null,
      // email: SingleLead?.email,
      // classMode: SingleLead?.classMode,
      // feeQuoted: SingleLead?.feeQuoted ? SingleLead?.feeQuoted : null,
      // batchTiming: SingleLead?.batchTiming ? SingleLead?.batchTiming : null,
      // leadStatus: "Opportunity",
      // description: SingleLead?.description,
      // nextFollowUp: SingleLead?.nextFollowUp ? SingleLead?.nextFollowUp : null,
      // userId: getUserID(),
      leadStage: "opportunity",
    };
    dispatch(updateLeadData({ id: SingleLead?.id, data: data }))
      .unwrap()
      .then((res: any) => {
        if (res) {
          toast.success("Succesfully converted to Opportunity");
          router.push("/opportunities");
          dispatch(GreetingStatus(true));
        }
      })
      .catch((err: any) => {
        const error = JSON.parse(err?.message);
        toast.error(error?.message ? error?.message : "Something went wrong");
      });
  };
  const handelOnCall = () => {
    const data = {
      agentId: singleUser?.teleCMIAgentId,
      to: SingleLead?.phone,
    };
    dispatch(callsConnect(data))
      .unwrap()
      .then((res: any) => {
        if (res?.status === 200) {
          toast.success(res?.data?.message);
        }
      })
      .catch((err: any) => {
        const error = JSON.parse(err?.message);
        toast.error(error?.message ? error?.message : "Something went wrong");
      });
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
                {SingleLead?.name}
              </h2>
            </div>
          </div>
          <SingleBtn name="Convert" bgcolor="sky" onClick={handelOnConvert} />
        </div>
        <div className="py-2 px-14 flex flex-wrap justify-between">
          <div className="min-w-48 mb-2">
            <p className="text-black mb-1 text-base font-medium">Email</p>
            <div className="flex gap-1.5">
              <MdEmail size={20} className="cursor-pointer" />
              <span className="text-sm font-semibold flex gap-1.5">
                {SingleLead?.email}
              </span>
            </div>
          </div>
          <div className="min-w-48 mb-2">
            <p className="text-black mb-1 text-base font-medium">Phone</p>
            <span
              className="text-sky-600 text-sm font-semibold flex gap-1.5 cursor-pointer"
              onClick={() => handelOnCall()}
            >
              <FaPhoneAlt size={17} className="cursor-pointer" />+
              {SingleLead?.countryCode?.replace("+", "") +
                " " +
                SingleLead?.phone}
            </span>
          </div>
          <div className="min-w-48 mb-2">
            <p className="text-black mb-1 text-base font-medium">Tech Stack</p>
            <div className="flex gap-1.5">
              <span className="text-sm font-semibold flex gap-1.5">
                {SingleLead?.techStack}
              </span>
              {/* <FaGraduationCap size={20} className="cursor-pointer" />
              <span className="text-sm font-semibold">
                {SingleLead?.Courses?.length > 0
                  ? SingleLead?.Courses?.map((item: { name: any }) => {
                      return item?.name;
                    })?.join(", ")
                  : "-"}
              </span> */}
            </div>
          </div>
          <div className="min-w-48 mb-2">
            <p className="text-black mb-1 text-base font-medium">Lead Status</p>
            <div className="flex gap-1.5">
              {/* {SingleLead?.leadStatus === "Not Contacted" ||
              SingleLead?.leadStatus === "NotContacted" ? (
                <BsFillPersonXFill size={20} />
              ) : SingleLead?.leadStatus === "Contacted" ||
                SingleLead?.leadStatus === "contacted" ? (
                <BsFillPersonCheckFill size={20} />
              ) : SingleLead?.leadStatus === "Warm Lead" ? (
                <MdLeaderboard size={20} />
              ) : SingleLead?.leadStatus === "Opportunity" ? (
                <FaStairs size={20} />
              ) : SingleLead?.leadStatus === "Cold Lead" ? (
                <MdOutlineLeaderboard size={20} />
              ) : SingleLead?.leadStatus === "Attempted" ? (
                <PiHandshakeFill size={20} />
              ) : (
                <IoPerson size={20} />
              )} */}
              <span className="text-green-500 text-sm font-semibold ">
                {kanbanAllData?.data?.filter((item?: { id: number }) => item?.id == SingleLead?.leadStatus)?.[0]?.kanbanHeaders}
              </span>
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
            <LeadeDetail handelOnSet={handelOnSet} />
          ) : activeTab === "Activity" ? (
            <Activity name="leadId" id={leade?.[0]?.id} />
          ) : activeTab === "ask_ai" ? (
            <AskAI />
          ) : activeTab === "note" ? (
            <Note name="leadId" id={leade?.[0]?.id} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EditContact;
