"use client";
import { HostItem, MeetingRowData, MeetingView } from "@/app/component/Type";
import CustomInput from "@/app/component/CustomInput";
import SingleSelece from "@/app/component/SingleSelece";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { addMeeting, getMeeting, getMeetingData } from "@/lib/features/lead/leadSlice";
import { getUserID } from "@/assets/utils/auth.util";
import SingleBtn from "../component/SingleBtn";
import Table from "../component/Table";
import moment from "moment";
import { ColDef } from "ag-grid-community";
import CustomModel from "../component/CustomModel";
import MultiSelectDropdown from "../component/MultiSelectDropdown";
import New_Meeting from "../../assets/new_meeting.svg";

const NewMeeting = ({ name, id }: { name?: string, id?: number }) => {
  const [meetingData, setMeetingData] = useState<MeetingRowData>(MeetingView);
  const [error, setError] = useState<MeetingRowData>(MeetingView);
  const [isModel, setIsModel] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { meeting, isLoader } = useAppSelector(
    (state) => state?.lead
  );
  console.log("🚀 ~ NewMeeting ~ meeting:", meeting)
  const { allUser } = useAppSelector((state) => state?.auth);
  const dispatch = useAppDispatch();

  // Log the allUser data

  const Hostdata: HostItem[] = allUser?.users?.map((item: any) => {
    return { lable: item?.user_metadata?.name, value: item?.user_metadata?.email };
  });

  // Log the Hostdata

  const Participants: HostItem[] = allUser?.users?.map((item: any) => {
    return { lable: item?.user_metadata?.name, value: item?.user_metadata?.email };
  });

  // Log the Participants data

  useEffect(() => {
    dispatch(getMeeting(`${name}=${id}`));
  }, []);

  const initialColumnDefs: ColDef[] = [
    {
      field: "meetingName",
      headerName: "New Meeting",
      minWidth: 215,
      maxWidth: 380,
    },
    {
      field: "location",
      headerName: "Location",
      minWidth: 215,
      maxWidth: 380,
    },
    {
      field: "startTime",
      headerName: "From",
      minWidth: 215,
      maxWidth: 380,
      cellRenderer: (params: { data: any }) => {
        const data = params.data;
        return (
          <div className="flex items-center gap-2 capitalize ">
            {data?.startTime
              ? moment.utc(data?.startTime).format("DD MMM, YYYY, h:mm A")
              : "-"}
          </div>
        );
      },
    },
    {
      field: "dueDate",
      headerName: "To",
      minWidth: 215,
      maxWidth: 380,
      cellRenderer: (params: { data: any }) => {
        const data = params.data;
        return (
          <div className="flex items-center gap-2 capitalize ">
            {data?.endTime
              ? moment.utc(data?.endTime).format("DD MMM, YYYY, h:mm A")
              : "-"}
          </div>
        );
      },
    },
    {
      field: "hostId",
      headerName: "Host",
      minWidth: 115,
      maxWidth: 280,
      cellRenderer: (params: { data: any }) => {
        const data = params.data;
        return (
          <div className="flex items-center gap-2">{data?.hostId}</div>
          // <div className="flex items-center gap-2">{data?.host?.name}</div>
        );
      },
    },
    {
      field: "participants",
      headerName: "Participants",
      minWidth: 210,
      maxWidth: 380,
      cellRenderer: (params: { data: any }) => {
        const data = params.data;
        console.log("🚀 ~ NewMeeting ~ data:", data)
        return (
          <div className="flex items-center gap-2">{data?.participants?.join(', ')}</div>
        );
      },
    },
  ];

  const handelOnChange = (
    e: { target: { name: any; value: any } },
    name1?: any
  ) => {
    if (name1) {
      setMeetingData({ ...meetingData, [`${name1}`]: e });
      setError({ ...error, [`${name1}`]: "" });
    } else {
      const { name, value } = e.target;
      setMeetingData({ ...meetingData, [`${name}`]: value });
      setError({ ...error, [`${name}`]: "" });
    }
  };

  const handelOnData = (name?: string, data?: any[]) => {
    setMeetingData({ ...meetingData, [`${name}`]: data });
    setError({ ...error, [`${name}`]: "" });
  };

  const vaidation = () => {
    let formValid = true;
    const newError: any = {};

    if (!(meetingData?.participants?.length > 0)) {
      formValid = false;
      newError["participants"] = "Please enter participants";
    }
    if (!meetingData?.meetingName?.trim()) {
      formValid = false;
      newError["meetingName"] = "Please enter meetingName";
    }
    if (!meetingData?.location?.trim()) {
      formValid = false;
      newError["location"] = "Please enter location";
    }
    if (!meetingData?.startTime?.trim()) {
      formValid = false;
      newError["startTime"] = "Please select from";
    }
    if (!meetingData?.endTime?.trim()) {
      formValid = false;
      newError["endTime"] = "Please select to";
    }
    if (!meetingData?.hostId) {
      formValid = false;
      newError["hostId"] = "Please select host";
    }

    setError(newError);
    return formValid;
  };

  const handelOnCreate = () => {
    //if (vaidation()) {
    setIsLoading(true);
    const email: string[] = meetingData?.participants?.map((item: any) => {
      return item?.value;
    })
    const uniqueArray: string[] = email?.filter((item, index) => email?.indexOf(item) === index);


    const data = name === "batchId" ? {
      hostId: meetingData?.hostId ? meetingData?.hostId : null,
      participants:
        meetingData?.participants?.length > 0
          ? uniqueArray
          : null,
      meetingName: meetingData?.meetingName,
      location: meetingData?.location,
      startTime: meetingData?.startTime,
      endTime: meetingData?.endTime,
      batchId: id,
      userId: getUserID(),
    } : name === "trainerId" ? {
      hostId: meetingData?.hostId ? meetingData?.hostId : null,
      participants:
        meetingData?.participants?.length > 0
          ? uniqueArray
          : null,
      meetingName: meetingData?.meetingName,
      location: meetingData?.location,
      startTime: meetingData?.startTime,
      endTime: meetingData?.endTime,
      trainerId: id,
      userId: getUserID(),
    } : name === "campaignId" ? {
      hostId: meetingData?.hostId ? meetingData?.hostId : null,
      participants:
        meetingData?.participants?.length > 0
          ? uniqueArray
          : null,
      meetingName: meetingData?.meetingName,
      location: meetingData?.location,
      startTime: meetingData?.startTime,
      endTime: meetingData?.endTime,
      campaignId: id,
      userId: getUserID(),
    } : name === "learnerId" ? {
      hostId: meetingData?.hostId ? meetingData?.hostId : null,
      participants:
        meetingData?.participants?.length > 0
          ? uniqueArray
          : null,
      meetingName: meetingData?.meetingName,
      location: meetingData?.location,
      startTime: meetingData?.startTime,
      endTime: meetingData?.endTime,
      learnerId: id,
      userId: getUserID(),
    } : name === "mainTaskId" ? {
      hostId: meetingData?.hostId ? meetingData?.hostId : null,
      participants:
        meetingData?.participants?.length > 0
          ? uniqueArray
          : null,
      meetingName: meetingData?.meetingName,
      location: meetingData?.location,
      startTime: meetingData?.startTime,
      endTime: meetingData?.endTime,
      mainTaskId: id,
      userId: getUserID(),
    } : name && {
      hostId: meetingData?.hostId ? meetingData?.hostId : null,
      participants:
        meetingData?.participants?.length > 0
          ? uniqueArray
          : null,
      meetingName: meetingData?.meetingName,
      location: meetingData?.location,
      startTime: meetingData?.startTime,
      endTime: meetingData?.endTime,
      [name]: id,
      userId: getUserID(),
    };
    dispatch(addMeeting(data))
      .unwrap()
      .then((res: any) => {
        if (res?.status === 201) {
          toast.success(
            res?.data?.message
              ? res?.data?.message
              : "Meeting created successfully"
          );
          handelOnCancel();
          dispatch(getMeeting(`${name}=${id}`));
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
    setError(MeetingView);
    setMeetingData(MeetingView);
    setIsModel(!isModel);
  };

  return (
    <div className="px-5 py-11">
      {isModel && (
        <CustomModel
          lable="Create Meeting"
          onCancel={handelOnCancel}
          onSave={handelOnCreate}
          isLoading={isLoading}
          headerImg={New_Meeting}
        >
          <div className="grid gap-8 mb-8 md:grid-cols-2">
            <CustomInput
              name="meetingName"
              value={meetingData?.meetingName}
              error={error?.meetingName}
              onChange={handelOnChange}
              lableValue="New Meeting"
              placeholder="New Meeting"
              typeValue="text"
            />
            <CustomInput
              name="location"
              value={meetingData?.location}
              error={error?.location}
              onChange={handelOnChange}
              lableValue="Location"
              placeholder="Location"
              typeValue="text"
            />
          </div>
          <div className="grid gap-8 mb-8 md:grid-cols-2">
            <CustomInput
              name="startTime"
              value={meetingData?.startTime}
              error={error?.startTime}
              onChange={handelOnChange}
              lableValue="From"
              placeholder="From"
              typeValue="datetime-local"
            />
            <CustomInput
              name="endTime"
              value={meetingData?.endTime}
              error={error?.endTime}
              onChange={handelOnChange}
              lableValue="To"
              placeholder="To"
              typeValue="datetime-local"
            />
          </div>
          <div className="grid gap-8 mb-8 md:grid-cols-2">
            <SingleSelece
              name="hostId"
              value={meetingData?.hostId}
              error={error?.hostId}
              onChange={handelOnChange}
              lableValue="Host"
              data={Hostdata}
            />
            <MultiSelectDropdown
              onChange={(e) => handelOnChange(e, "participants")}
              value={meetingData?.participants}
              name="participants"
              lableValue="Participants"
              data={Participants}
            />
          </div>
        </CustomModel>
      )}
      <div className="grid gap-2">
        <div className="flex justify-between px-1">
          <SingleBtn
            name="+ New Meeting"
            bgcolor="sky"
            onClick={() => {
              setIsModel(!isModel);
            }}
          />
        </div>
        <Table
          noDataFoundMsg="Meeting data no found"
          isLoader={isLoader}
          initialColumnDefs={initialColumnDefs}
          datas={meeting?.meetings}
        />
      </div>
    </div>
  );
};

export default NewMeeting;
