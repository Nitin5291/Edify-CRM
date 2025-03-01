"use client";
import { HostItem, LogCallRowData, LogCallView } from "@/app/component/Type";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  addCall,
  getLogCall,
} from "@/lib/features/lead/leadSlice";
import Table from "../component/Table";
import moment from "moment";
import { ColDef } from "ag-grid-community";
import { downloadExcel } from "@/CommonData";
import Image from "next/image";
import Download from "../../assets/download.svg";
import SingleBtn from "../component/SingleBtn";
import Log_call from "../../assets/log_call.svg";
import { toast } from "react-toastify";
import { getUserID } from "@/assets/utils/auth.util";
import CustomModel from "../component/CustomModel";
import SingleSelece from "../component/SingleSelece";
import CustomInput from "../component/CustomInput";

const CallTypeData: HostItem[] = [{ lable: "Lead", value: "Lead" }];

const LogCall = () => {
    const [logCall, setLogCall] = useState<LogCallRowData>(LogCallView);
    const [error, setError] = useState<LogCallRowData>(LogCallView);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModel, setIsModel] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<any>([]);

  const dispatch = useAppDispatch();
  const { SingleLead, call, isLoader } = useAppSelector((state) => state?.lead);

  useEffect(() => {
    dispatch(getLogCall(SingleLead?.phone));
  }, []);

  const initialColumnDefs: ColDef[] = [
    {
      field: "filename",
      headerName: "File Name",
      minWidth: 350,
      maxWidth: 700,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      cellRenderer: (params: { data: any }) => {
        const data = params.data;
        return (
          <a
            href={`${process.env.NEXT_PUBLIC_API_BASE_URL+'calls/download?fileName='+data?.filename}`}
            target="_self"
            className="flex items-center gap-2 text-sky-600 cursor-pointer "
          >
            {data?.filename ? data?.filename : "-"}
          </a>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created on",
      minWidth: 210,
      maxWidth: 300,
      cellRenderer: (params: { data: any }) => {
        const data = params.data;
        return (
          <div className="flex items-center gap-2 capitalize ">
            {data?.createdAt
              ? moment(data?.createdAt).format("DD/MM/YYYY, h:mm A")
              : "-"}
          </div>
        );
      },
    },
    {
      field: "callerId",
      headerName: "Caller Id",
      minWidth: 150,
      maxWidth: 250,
    },
    {
      field: "answeredSeconds",
      headerName: "Answered Seconds",
      minWidth: 150,
      maxWidth: 280,
    },
    {
      field: "userNo",
      headerName: "Agent No",
      minWidth: 150,
      maxWidth: 280,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      maxWidth: 280,
    },
    {
      field: "direction",
      headerName: "Direction",
      minWidth: 150,
      maxWidth: 280,
    },
  ];

    const handelOnChange = (e: {
      target: { name: any; value: any; files: any };
    }) => {
      const { name, value, files } = e.target;
      if (name === "voiceRecording") {
        setLogCall({ ...logCall, [`${name}`]: files?.[0] });
        setError({ ...error, [`${name}`]: "" });
      } else {
        setLogCall({ ...logCall, [`${name}`]: value });
        setError({ ...error, [`${name}`]: "" });
      }
    };

    const vaidation = () => {
      let formValid = true;
      const newError: any = {};

      if (!logCall?.callTo) {
        formValid = false;
        newError["callTo"] = "Please select call to";
      }
      if (!logCall?.callType?.trim()) {
        formValid = false;
        newError["callType"] = "Please enter call type";
      }
      if (!logCall?.outgoingCallStatus?.trim()) {
        formValid = false;
        newError["outgoingCallStatus"] = "Please enter outgoing call status";
      }
      if (!logCall?.callStartTime) {
        formValid = false;
        newError["callStartTime"] = "Please select call start time";
      }
      if (!logCall?.callEndTime) {
        formValid = false;
        newError["callEndTime"] = "Please enter call durration";
      }
      if (!logCall?.subject?.trim()) {
        formValid = false;
        newError["subject"] = "Please enter subject";
      }
      if (!logCall?.voiceRecording) {
        formValid = false;
        newError["voiceRecording"] = "Please select voice recording";
      }

      setError(newError);
      return formValid;
    };

    const handelOnCreate = () => {
      //if (vaidation()) {
      setIsLoading(true);

      let data = new FormData();
      data.append("voiceRecording", logCall?.voiceRecording);
      data.append("leadId", SingleLead?.id);
      data.append("userId", getUserID());
      data.append("callType", logCall?.callType);
      data.append("subject", logCall?.subject);
      //data.append('outgoingCallStatus', logCall?.outgoingCallStatus);
      data.append("callStartTime", logCall?.callStartTime);
      data.append("callEndTime", logCall?.callEndTime);
      dispatch(addCall(data))
        .unwrap()
        .then((res: any) => {
          if (res) {
            handelOnCancel();
            dispatch(getLogCall(SingleLead?.id));
            toast.success(
              res?.message ? res?.message : "Call created successfully"
            );
          }
        })
        .catch((err: any) => {
          const error = JSON.parse(err?.message);
          toast.error(error?.message ? error?.message : "Something went wrong");
        })
        .finally(() => {
          setIsLoading(false);
        });
      //}
    };

    const handelOnCancel = () => {
      setLogCall(LogCallView);
      setError(LogCallView);
      setIsModel(!isModel);
    };

  const handelOnDownload = () => {
    const dataFilter = selectedCell?.map((item: any) => {
      return {
        "File Name": item?.filename,
        "Date & Time": moment(item?.createdAt).format("DD/MM/YYYY h:mm A"),
        "Agent Id": item?.agentId,
        "Answered Seconds": item?.answeredSeconds,
        "Caller Id": item?.callerId,
        Direction: item?.direction,
        Status: item?.status,
        To: item?.to,
        "Agent No": item?.userNo,
        Recorded: item?.isRecorded,
      };
    });
    if (dataFilter?.length > 0) {
      downloadExcel(dataFilter, "Call Log");
    }
  };
  return (
    <div className="px-5 py-11">
      {isModel && (
        <CustomModel
          lable="Log Call"
          onCancel={handelOnCancel}
          onSave={handelOnCreate}
          isLoading={isLoading}
          headerImg={Log_call}
        >
          <div className="grid gap-8 mb-8 md:grid-cols-2">
            <SingleSelece
              lableValue="Call To"
              name="callTo"
              value={logCall?.callTo}
              error={error?.callTo}
              data={CallTypeData}
              onChange={handelOnChange}
            />
            <SingleSelece
              lableValue="Call Type"
              name="callType"
              value={logCall?.callType}
              error={error?.callType}
              data={CallTypeData}
              onChange={handelOnChange}
            />
            <CustomInput
              lableValue="Outgoing Call Status"
              name="callStartTime"
              error={error?.callStartTime}
              value={logCall?.callStartTime}
              // placeholder="Call Start Time"
              onChange={handelOnChange}
              typeValue="text"
            />
            <CustomInput
              lableValue="Call Start Time"
              name="callStartTime"
              error={error?.callStartTime}
              value={logCall?.callStartTime}
              placeholder="Call Start Time"
              onChange={handelOnChange}
              typeValue="datetime-local"
            />
            {/* <CustomInput
              lableValue="Call End Time"
              name="callEndTime"
              error={error?.callEndTime}
              value={logCall?.callEndTime}
              placeholder="Call End Time"
              onChange={handelOnChange}
              typeValue="datetime-local"
            /> */}
             <CustomInput
              lableValue="Call Duration"
              name="callStartTime"
              error={error?.callStartTime}
              value={logCall?.callStartTime}
              // placeholder="Call Start Time"
              onChange={handelOnChange}
              typeValue="text"
            />
            <CustomInput
              lableValue="Subject"
              name="subject"
              value={logCall?.subject}
              error={error?.subject}
              // placeholder="Subject"
              onChange={handelOnChange}
              typeValue="text"
            />
            <CustomInput
              lableValue="Voice Recording"
              name="voiceRecording"
              error={error?.voiceRecording}
              value={
                logCall?.voiceRecording?.name
                  ? logCall?.voiceRecording?.name
                  : logCall?.voiceRecording
              }
              // placeholder="Voice Recording"
              onChange={handelOnChange}
              typeValue="file"
              accept="audio/*"
            />
          </div>
        </CustomModel>
      )}

      <div className="grid gap-2 ">
        <div className="flex px-2">
          {/* <h2 className="text-black text-lg font-semibold">Log Call</h2> */}
          <SingleBtn
            name="+ New Call"
            bgcolor="sky"
            onClick={() => {
              setIsModel(!isModel);
            }}
          />
          <button
            type="button"
            disabled={selectedCell?.length > 0 ? false : true}
            onClick={handelOnDownload}
            className="inline-flex gap-3 items-center ms-3  py-2 text-base font-normal text-[#181818] bg-transparent "
          >
            <Image src={Download} alt="download icon" />
            Download
          </button>
        </div>
        <Table
          noDataFoundMsg="Log Call data no found"
          isLoader={isLoader}
          initialColumnDefs={initialColumnDefs}
          datas={call?.calls}
          setSelectedCell={setSelectedCell}
        />
      </div>
    </div>
  );
};

export default LogCall;
