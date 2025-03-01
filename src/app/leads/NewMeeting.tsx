"use client";
import { HostItem, MeetingRowData, MeetingView } from "@/app/component/Type";
import CustomInput from "@/app/component/CustomInput";
import SingleSelece from "@/app/component/SingleSelece";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { addMeeting, getMeetingData } from "@/lib/features/lead/leadSlice";
import { getUserID } from "@/assets/utils/auth.util";
import SingleBtn from "../component/SingleBtn";
import Table from "../component/Table";
import moment from "moment";
import { ColDef } from "ag-grid-community";
import CustomModel from "../component/CustomModel";
import MultiSelectDropdown from "../component/MultiSelectDropdown";
import New_Meeting from "../../assets/new_meeting.svg";

export const initialColumnDefsMeeting: ColDef[] = [
  {
    field: "meetingName",
    headerName: "New Meeting",
    minWidth: 215,
    maxWidth: 350,
  },
  {
    field: "location",
    headerName: "Location",
    minWidth: 215,
    maxWidth: 300,
  },
  {
    field: "startTime",
    headerName: "From",
    minWidth: 215,
    maxWidth: 300,
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
    maxWidth: 300,
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
        <div className="flex items-center gap-2">
          {data?.host?.name
            ? data?.host?.name
            : "-"}
        </div>
      );
    },
  },
  {
    field: "participants",
    headerName: "Participants",
    minWidth: 300,
    maxWidth: 580,
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (data?.participants?.map((item: any) => {
        return <div className="flex items-center">{item},</div>
      }))
    },
  },
];


const NewMeeting = () => {
  const [meetingData, setMeetingData] = useState<MeetingRowData>(MeetingView);
  const [error, setError] = useState<MeetingRowData>(MeetingView);
  const [isModel, setIsModel] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { SingleLead, meeting, isLoader, LeadData } = useAppSelector(
    (state) => state?.lead
  );
  console.log("🚀 ~ NewMeeting ~ SingleLead:", SingleLead)
  const { allUser } = useAppSelector((state) => state?.auth);
  const dispatch = useAppDispatch();

  // Log the allUser data

  const Hostdata: HostItem[] = allUser?.users?.map(
    (item: { name: any; id: any }) => {
      return { lable: item?.name, value: item?.id };
    }
  );

  // Log the Hostdata

  // const Participants: HostItem[] = allUser?.users?.map(
  //   (item: { name: any; email: any }) => {
  //     return { lable: item?.name, value: item?.email };
  //   }
  // );
  const Participants: HostItem[] = LeadData?.leads?.map(
    (item: { name: any; email: any; id: any }) => {
      // return { lable: item?.name, value: item?.email };
      return { lable: `${item?.name}-${item?.id}`, value: item?.email };
    }
  );

  // Log the Participants data

  useEffect(() => {
    dispatch(getMeetingData(SingleLead?.id));
  }, []);

  useEffect(() => {
    if (isModel) {
      const participantsData = Participants?.filter((participant) => participant?.lable?.split('-')?.[1] == SingleLead?.id)
      setMeetingData({ ...meetingData, participants: participantsData })
    }
  }, [isModel]);


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


    const data = {
      hostId: meetingData?.hostId ? parseInt(meetingData?.hostId) : null,
      participants:
        meetingData?.participants?.length > 0
          ? uniqueArray
          : null,
      meetingName: meetingData?.meetingName,
      location: meetingData?.location,
      startTime: meetingData?.startTime,
      endTime: meetingData?.endTime,
      leadId: SingleLead?.id,
      userId: getUserID(),
    };
    dispatch(addMeeting(data))
      .unwrap()
      .then((res: any) => {
        if (res?.status === 200) {
          toast.success(
            res?.data?.message
              ? res?.data?.message
              : "Meeting created successfully"
          );
          handelOnCancel();
          dispatch(getMeetingData(SingleLead?.id));
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
          {/* <h2 className="text-black text-lg font-semibold">Meeting</h2> */}
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
          initialColumnDefs={initialColumnDefsMeeting}
          datas={meeting?.meetings}
        />
      </div>
    </div>
  );
};

export default NewMeeting;
