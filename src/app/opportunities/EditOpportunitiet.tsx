"use client";
import React, { useMemo, useState } from "react";
import Contact from "../../assets/employee_contact.svg";
import Image from "next/image";
import OpportunitieDetail from "./OpportunitieDetail";
import { LeadeData } from "@/app/component/Type";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  callsConnect,
  getSingleLead,
  updateLeadData,
} from "@/lib/features/lead/leadSlice";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import Activity from "../leads/Activity";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import SingleBtn from "../component/SingleBtn";
import { GreetingStatus } from "@/lib/features/navbar/navbarSlice";
import { FaPhoneAlt } from "react-icons/fa";
import { getSingleUser } from "@/lib/features/auth/authSlice";
import AskAI from "./AskAI";
import { createLearner } from "@/lib/features/learner/learnerSlice";
import Note from "../campaign/Note";

const EditOpportunitiet = ({
  handelOnSet,  
  opportunity,
}: {
  opportunity?: any;
  handelOnSet: (id: number, data: LeadeData[]) => void;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<String>("Details");
  let { SingleLead } = useAppSelector((state) => state?.lead);
  SingleLead = SingleLead?.leads
  console.log("🚀 ~ SingleLead:", SingleLead)
  const { singleUser } = useAppSelector((state) => state?.auth);
  useMemo(() => {
    if (opportunity?.[0]?.id) {
      dispatch(getSingleLead(opportunity?.[0]?.id));
    }
  }, [opportunity?.[0]?.id]);

  useMemo(() => {
    if (SingleLead?.userId) {
      dispatch(getSingleUser(SingleLead?.userId));
    }
  }, [SingleLead?.userId]);

  const handleTabChange = (tabName: String) => {
    setActiveTab(tabName);
  };

  // const handelOnConvert = () => {
  //   const data = {
  //     ...SingleLead,
  //     leadStage: "learner",
  //   };
  //   dispatch(updateLeadData({ id: SingleLead?.id, data: data }))
  //     .unwrap()
  //     .then((res: any) => {
  //       if (res) {
  //         toast.success("Successfully converted to Learner");
  //         router.push("/learner");
  //         dispatch(GreetingStatus(true));
  //       }
  //     })
  //     .catch((err: any) => {
  //       const error = JSON.parse(err?.message);
  //       toast.error(error?.message ? error?.message : "Something went wrong");
  //     });
  // };

  const handelOnConvert = () => {
    // Transform SingleLead data into learner format
    const learnerData = {
      name: SingleLead?.name ? SingleLead?.name : null,
      phone: SingleLead?.phone || "",
      email: SingleLead?.email || "",
      source: SingleLead?.leadSource || 'Direct',
      idProof: SingleLead?.idProof || '',
      registeredDate: SingleLead?.expRegistrationDate || null,
      description: SingleLead?.description || '',
      learnerOwner: singleUser?.leadOwner || null,
      status: "Upcoming",
      batchId: [],
      // courses: [
      //   {
      //     courseId: SingleLead?.courseId?.[0] || 1,
      //     techStack: SingleLead?.techStack || '',
      //     courseComments: SingleLead?.courseComments || '',
      //     slackAccess: "No",
      //     lmsAccess: "No",
      //     preferableTime: SingleLead?.perferabletime || 'Morning',
      //     batchTiming: SingleLead?.batchTiming || '9-11 AM',
      //     modeOfClass: SingleLead?.classMode || 'Online',
      //     comment: SingleLead?.comment || ''
      //   }
      // ]
    };

    dispatch(createLearner(learnerData))
      .unwrap()
      .then((res: any) => {
        if (res) {
          const data1 = {
            leadStage: "learner",
          }
          dispatch(updateLeadData({ id: SingleLead?.id, data: data1 }))
          toast.success("Successfully converted to Learner");
          router.push("/learner");
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
          // router.push('/opportunities')
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
            <span className="text-sky-600 text-sm font-semibold">
              {SingleLead?.email}
            </span>
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
            <p className="text-black mb-1 text-base font-medium">
              Opportunity Stage
            </p>
            <span className="text-sky-600 text-sm font-semibold">
              {SingleLead?.opportunityStage
                ? SingleLead?.opportunityStage
                : "-"}
            </span>
          </div>

          <div className="min-w-48 mb-2">
            <p className="text-black mb-1 text-base font-medium">
              Opportunity Status
            </p>
            <span className="text-green-500 text-sm font-semibold ">
              {SingleLead?.opportunityStatus}
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
            <OpportunitieDetail handelOnSet={handelOnSet} />
          ) : activeTab === "Activity" ? (
            <Activity name="leadId" id={SingleLead?.id} />
          ) : activeTab === "ask_ai" ? (
            <AskAI />
          ) : activeTab === "note" ? (
            <Note name="leadId" id={SingleLead?.id} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EditOpportunitiet;
