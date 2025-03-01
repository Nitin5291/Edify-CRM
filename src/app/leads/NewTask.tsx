"use client";
import CustomInput from "@/app/component/CustomInput";
import React, { useEffect, useState } from "react";
import {
  ActivityAccordionTaskData,
  HostItem,
  NewTaskRowData,
  NewTaskView,
} from "@/app/component/Type";
import SingleSelece from "@/app/component/SingleSelece";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { toast } from "react-toastify";
import { addTask } from "@/lib/features/lead/leadSlice";
import { Prioritydata } from "@/CommonData";
import { getTaskIdData } from "@/lib/features/task/taskSlice";
import CustomModel from "../component/CustomModel";
import SingleBtn from "../component/SingleBtn";
import Table from "../component/Table";
import { ColDef } from "ag-grid-community";
import moment from "moment";
import New_Task from "../../assets/new_task.svg";

const datas: ActivityAccordionTaskData[] = [
  {
    id: 1,
    title: "Upcoming & Overdue",
    data: [
      {
        new_task: {
          title: "Test",
          description: "You have an upcoming Task You have an upcoming Task",
        },
      },
      {
        new_meeting: {
          title: "Test",
          description: "You have an upcoming Task You have an upcoming Task",
        },
      },
      {
        email: {
          title: "Test",
          description: "You have an upcoming Task You have an upcoming Task",
        },
      },
    ],
  },
];

const NewTask = () => {
  const [newTaskData, setNewTaskData] = useState<NewTaskRowData>(NewTaskView);
  const [error, setError] = useState<NewTaskRowData>(NewTaskView);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModel, setIsModel] = useState<boolean>(false);
  const { SingleLead, LeadData } = useAppSelector((state) => state?.lead);
  const { allUser } = useAppSelector((state) => state?.auth);
  const dispatch = useAppDispatch();
  const { taskData, isLoader } = useAppSelector((state) => state?.task);

  const OwnerData: HostItem[] = allUser?.users?.map(
    (item: { name: any; id: any }) => {
      return { lable: item?.name, value: item?.id };
    }
  );
  console.log("🚀 ~ NewTask ~ allUser:", allUser)

  useEffect(() => {
    dispatch(getTaskIdData(SingleLead?.id));
  }, [SingleLead]);

  const handelOnChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setNewTaskData({ ...newTaskData, [`${name}`]: value });
    setError({ ...error, [`${name}`]: "" });
  };

  const initialColumnDefs: ColDef[] = [
    {
      field: "subject",
      headerName: "Subject",
      minWidth: 215,
      maxWidth: 450,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      minWidth: 215,
      maxWidth: 450,
      cellRenderer: (params: { data: any }) => {
        const data = params.data;
        return (
          <div className="flex items-center gap-2 capitalize ">
            {data?.dueDate
              ? moment.utc(data?.dueDate).format("DD MMM, YYYY, h:mm A")
              : "-"}
          </div>
        );
      },
    },
    {
      field: "priority",
      headerName: "Priority",
      minWidth: 215,
      maxWidth: 450,
    },
    {
      field: "userId",
      headerName: "Owner",
      minWidth: 210,
      maxWidth: 450,
      cellRenderer: (params: { data: any }) => {
        return (
          <div className="flex items-center gap-2">{params?.data?.user?.name}</div>
        );
      },
    },
  ];

  const vaidation = () => {
    let formValid = true;
    const newError: any = {};
    const currentDate = new Date();

    if (!newTaskData?.dueDate?.trim()) {
      formValid = false;
      newError["dueDate"] = "Please select due date";
    }
    else if (new Date(newTaskData.dueDate) < currentDate) {
      formValid = false;
      newError["dueDate"] = "Due date cannot be in the past";
    }
    if (!newTaskData?.subject?.trim()) {
      formValid = false;
      newError["subject"] = "Please enter subject";
    }
    if (!newTaskData?.priority?.trim()) {
      formValid = false;
      newError["priority"] = "Please select priority";
    }

    setError(newError);
    return formValid;
  };

  const handelOnSave = () => {
    if (vaidation()) {
      setIsLoading(true);
      const data = {
        leadId: SingleLead?.id,
        subject: newTaskData?.subject,
        dueDate: newTaskData?.dueDate,
        priority: newTaskData?.priority,
        userId: newTaskData?.userId,
      };
      dispatch(addTask(data))
        .unwrap()
        .then((res: any) => {
          if (res?.status === 201) {
            toast.success(
              res?.data?.message
                ? res?.data?.message
                : "Task created successfully"
            );
            handelOnCancel();
            dispatch(getTaskIdData(SingleLead?.id));
          }
        })
        .catch((err: any) => {
          toast.error(err?.message ? err?.message : "Something went wrong");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const handelOnCancel = () => {
    setNewTaskData(NewTaskView);
    setError(NewTaskView);
    setIsModel(!isModel);
  };

  return (
    <div className="px-5 py-11">
      {isModel && (
        <CustomModel
          lable="Create Task"
          onCancel={handelOnCancel}
          onSave={handelOnSave}
          isLoading={isLoading}
          headerImg={New_Task}
        >
          <div className="grid gap-8 mb-8 md:grid-cols-2">
            <CustomInput
              name="subject"
              error={error?.subject}
              onChange={handelOnChange}
              value={newTaskData?.subject}
              lableValue="Subject"
              placeholder="Subject"
              typeValue="text"
            />
            <CustomInput
              name="dueDate"
              error={error?.dueDate}
              onChange={handelOnChange}
              value={newTaskData?.dueDate}
              lableValue="Due Date"
              placeholder="Due Date"
              typeValue="datetime-local"
            />
            <SingleSelece
              name="priority"
              error={error?.priority}
              onChange={handelOnChange}
              value={newTaskData?.priority}
              lableValue="Priority"
              data={Prioritydata}
            />
            <SingleSelece
              name="userId"
              error={error?.userId}
              onChange={handelOnChange}
              value={newTaskData?.userId}
              lableValue="Owner"
              data={OwnerData}
            />
          </div>
        </CustomModel>
      )}
      <div className="grid gap-2">
        <div className="flex px-1">
          {/* <h2 className="text-black text-lg font-semibold me-4 ">New Task</h2> */}
          <SingleBtn
            name="+ New Task"
            bgcolor="sky"
            onClick={() => {
              setIsModel(!isModel);
            }}
          />
        </div>
        <Table
          noDataFoundMsg="Task data no found"
          isLoader={isLoader}
          initialColumnDefs={initialColumnDefs}
          datas={taskData?.tasks}
        />
      </div>
      {/* {taskData?.tasks?.length > 0 &&
                <div className="border-t border-t-neutral-300 mt-10">
                    {datas?.map((item) => {
                    return <ActivityAccordion key={item?.id} item={item} />
                })} 
                    <ActivityAccordion item={taskData?.tasks} />
                </div>
            } */}
    </div>
  );
};

export default NewTask;
