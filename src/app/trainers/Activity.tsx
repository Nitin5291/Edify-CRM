"use client";
import Image from "next/image";
import React, { useState } from "react";
import New_Task from "../../assets/new_task.svg";
import New_Meeting from "../../assets/new_meeting.svg";
import Email from "../../assets/email.svg";
import Log_call from "../../assets/log_call.svg";
import Whatsapp from "../../assets/whatsapp.svg";
import Message_Img from "../../assets/message.svg";
import Slack_Img from "../../assets/slack.png";
import ActivityAccordion from "../leads/ActivityAccordion";
import { useAppSelector } from "@/lib/store";
import NewTask from "../batches/NewTask";
import NewMeeting from "../batches/NewMeeting";
import EmailPage from "../batches/EmailPage";
import LogCall from "../batches/LogCall";
import WhatsApp from "../batches/WhatsApp";
import Message from "../batches/Message";
import Slack from "../batches/Slack";

const Activity = () => {
  const [activityStatus, setActivityStatus] = useState<String>("new_task");
  let { singleTrainerData } = useAppSelector((state) => state?.trainer);
  singleTrainerData = singleTrainerData?.data
  const handelOnStatusChange = (name: String) => {
    setActivityStatus(name);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 lg:gap-4 border-b border-b-neutral-300 pb-5">
        <button
          type="button"
          onClick={() => handelOnStatusChange("activity")}
          className={`inline-flex gap-2 lg:gap-4 items-center px-3 lg:px-4 py-2 bg-transparent border rounded text-base font-medium ${activityStatus === "activity"
            ? "text-sky-600 border-sky-600"
            : "border-neutral-500 text-black hover:border-sky-600 hover:text-sky-600"
            }`}
        >
          {/* <Image src={New_Task} alt="new task icon" /> */}
          Activity
        </button>
        <button
          type="button"
          onClick={() => handelOnStatusChange("new_task")}
          className={`inline-flex gap-2 lg:gap-4 items-center px-3 lg:px-4 py-2 bg-transparent border rounded text-base font-medium ${activityStatus === "new_task"
            ? "text-sky-600 border-sky-600"
            : "border-neutral-500 text-black hover:border-sky-600 hover:text-sky-600"
            }`}
        >
          <Image src={New_Task} alt="new task icon" />
          New Task
        </button>
        <button
          type="button"
          onClick={() => handelOnStatusChange("new_meeting")}
          className={`inline-flex gap-2 lg:gap-4 items-center px-3 lg:px-4 py-2 bg-transparent border rounded text-base font-medium ${activityStatus === "new_meeting"
            ? "text-sky-600 border-sky-600"
            : "border-neutral-500 text-black hover:border-sky-600 hover:text-sky-600"
            }`}
        >
          <Image src={New_Meeting} alt="new event icon" />
          Meeting
        </button>
        <button
          type="button"
          onClick={() => handelOnStatusChange("email")}
          className={`inline-flex gap-2 lg:gap-4 items-center px-3 lg:px-4 py-2 bg-transparent border rounded text-base font-medium ${activityStatus === "email"
            ? "text-sky-600 border-sky-600"
            : "border-neutral-500 text-black hover:border-sky-600 hover:text-sky-600"
            }`}
        >
          <Image src={Email} alt="email icon" />
          Email
        </button>
        <button
          type="button"
          onClick={() => handelOnStatusChange("log_call")}
          className={`inline-flex gap-2 lg:gap-4 items-center px-3 lg:px-4 py-2 bg-transparent border rounded text-base font-medium ${activityStatus === "log_call"
            ? "text-sky-600 border-sky-600"
            : "border-neutral-500 text-black hover:border-sky-600 hover:text-sky-600"
            }`}
        >
          <Image src={Log_call} alt="email icon" />
          Log Call
        </button>
        <button
          type="button"
          onClick={() => handelOnStatusChange("whatsApp")}
          className={`inline-flex gap-2 lg:gap-4 items-center px-3 lg:px-4 py-2 bg-transparent border rounded text-base font-medium ${activityStatus === "whatsApp"
            ? "text-sky-600 border-sky-600"
            : "border-neutral-500 text-black hover:border-sky-600 hover:text-sky-600"
            }`}
        >
          <Image src={Whatsapp} alt="email icon" />
          WhatsApp
        </button>
        <button
          type="button"
          onClick={() => handelOnStatusChange("message")}
          className={`inline-flex gap-2 lg:gap-4 items-center px-3 lg:px-4 py-2 bg-transparent border rounded text-base font-medium ${activityStatus === "message"
            ? "text-sky-600 border-sky-600"
            : "border-neutral-500 text-black hover:border-sky-600 hover:text-sky-600"
            }`}
        >
          <Image src={Message_Img} alt="email icon" />
          Message
        </button>
        {/* <button
          type="button"
          onClick={() => handelOnStatusChange("Slack")}
          className={`inline-flex gap-2 lg:gap-4 items-center px-3 lg:px-4 py-2 bg-transparent border rounded text-base font-medium ${activityStatus === "Slack"
            ? "text-sky-600 border-sky-600"
            : "border-neutral-500 text-black hover:border-sky-600 hover:text-sky-600"
            }`}
        >
          <Image src={Slack_Img} className="h-6 w-6" alt="email icon" />
          Slack
        </button> */}

      </div>

      {activityStatus === "activity" ? (
        <ActivityAccordion name="trainerId" id={singleTrainerData?.id}/>
      ) : activityStatus === "new_task" ? (
        <NewTask name="trainerId" id={singleTrainerData?.id} />
      ) : activityStatus === "new_meeting" ? (
        <NewMeeting name="trainerId" id={singleTrainerData?.id} />
      ) : activityStatus === "email" ? (
        <EmailPage name="trainerId" id={singleTrainerData?.id} />
      ) : activityStatus === "log_call" ? (
        <LogCall />
      ) : activityStatus === "whatsApp" ? (
        <WhatsApp name="trainerId" id={singleTrainerData?.id} />
      ) : activityStatus === "message" ? (
        <Message name="trainerId" id={singleTrainerData?.id} />
      ) : activityStatus === "Slack" ? (
        <Slack />
      ) : null}
    </div>
  );
};

export default Activity;
