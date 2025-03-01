import React, { useEffect, useState } from "react";
import KanbanCard from "../component/KanbanCard";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { getKanban, getLeadData, updateLeadData } from "@/lib/features/lead/leadSlice";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";

const LeadsKanban = () => {
  const [tasks, setTasks] = useState<any>([]);
  const { LeadData, kanbanAllData } = useAppSelector((state) => state?.lead);
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  // const kanbanList = kanbanAllData?.data || [];
  // const filteredItems = kanbanList?.filter((item: any) => item?.kanbanName === "lead");
  // console.log("🚀 ~ LeadsKanban ~ filteredItems:", filteredItems)

  useEffect(() => {
    setTasks(LeadData?.leads);
    dispatch(getKanban())
  }, [LeadData]);

  const getFieldListByHeader = (
    items?: any,
    header?: string
  ): string[] | undefined => {
    if (header) {
      return items
        ?.filter((data: { kanbanHeaders: string }) => data.kanbanHeaders === header)?.[0]
        ?.fieldList?.split(",")?.filter((j: any) => j);
    }
    else {
      return items?.fieldList?.split(",")?.filter((j: any) => j);
    }
  };

  const onDragStart = (evt: {
    currentTarget: {
      [x: string]: any;
      id: any;
    };
    dataTransfer: {
      setData: (arg0: string, arg1: any) => void;
      effectAllowed: string;
    };
  }) => {
    let element = evt.currentTarget;
    element.classList.add("dragged");
    evt.dataTransfer.setData("text/plain", evt.currentTarget.id);
    evt.dataTransfer.effectAllowed = "move";
  };

  const onDragEnd = (evt: {
    currentTarget: { classList: { remove: (arg0: string) => void } };
  }) => {
    evt.currentTarget.classList.remove("dragged");
  };

  const onDragEnter = (evt: {
    preventDefault: () => void;
    currentTarget: any;
    dataTransfer: { dropEffect: string };
  }) => {
    evt.preventDefault();
    let element = evt.currentTarget;
    element.classList.add("dragged-over");
    evt.dataTransfer.dropEffect = "move";
  };

  const onDragLeave = (evt: {
    currentTarget: any;
    relatedTarget: any;
    preventDefault: () => void;
  }) => {
    let currentTarget = evt.currentTarget;
    let newTarget = evt.relatedTarget;
    if (newTarget.parentNode === currentTarget || newTarget === currentTarget)
      return;
    evt.preventDefault();
    let element = evt.currentTarget;
    element.classList.remove("dragged-over");
  };

  const onDragOver = (evt: {
    preventDefault: () => void;
    dataTransfer: { dropEffect: string };
  }) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  };

  const onDrop = (evt: React.DragEvent<HTMLDivElement>, leadStatus: string) => {
    evt.preventDefault();
    evt.currentTarget.classList.remove("dragged-over");
    const id = evt.dataTransfer.getData("text/plain");

    const task = tasks.find(
      (task: { id: { toString: () => string } }) =>
        task.id.toString() === id.toString()
    );

    const data = {
      // name: task?.name,
      // leadSource: task?.leadSource,
      // techStack: task?.techStack,
      // countryCode: task?.countryCode,
      // phone: task?.phone,
      // courseId: task?.courseId,
      // email: task?.email,
      // classMode: task?.classMode,
      // feeQuoted: task?.feeQuoted,
      // batchTiming: task?.batchTiming,
      leadStatus: leadStatus,
      // description: task?.description,
      // nextFollowUp: task?.nextFollowUp,
      // userId: getUserID(),
    };
    dispatch(updateLeadData({ id: task?.id, data: data }))
      .unwrap()
      .then((res: any) => {
        if (res) {
          toast.success(
            res?.message ? res?.message : "Lead Updated Successfully"
          );
          dispatch(getLeadData(pathName === "/leads" ? "lead" : "opportunity"));
        }
      })
      .catch((err: any) => {
        const error = JSON.parse(err?.message);
        toast.error(error?.message ? error?.message : "Something went wrong");
      });

    if (task && task.leadStatus !== leadStatus) {
      const updatedTasks = tasks.map(
        (task: { id: { toString: () => string } }) => {
          if (task.id.toString() === id.toString()) {
            return { ...task, leadStatus };
          }
          return task;
        }
      );
      setTasks(updatedTasks);
    }
  };

  let handelOngetLeadData = (status: string) => {
    return tasks?.filter(
      (data: { leadStatus: string }) => data?.leadStatus === status
    );

  }

  let newOrder = tasks?.filter(
    (data: { leadStatus: string }) => data?.leadStatus === "Not Contacted"
  );
  let waiting = tasks?.filter(
    (data: { leadStatus: string }) => data?.leadStatus === "Attempted"
  );
  let pending = tasks?.filter(
    (data: { leadStatus: string }) => data?.leadStatus === (pathName === "/leads" ? "Warm Lead" : "Opportunity")
  );
  let done = tasks?.filter(
    (data: { leadStatus: string }) => data?.leadStatus === "Cold Lead"
  );

  return (
    <div className="w-[100%] overflow-auto px-5 h-full">
      <div className="flex gap-3">
        {/* {filteredItems?.map((data: any) => {
          return (
            <KanbanCard
              key={data?.id}
              headerName={data?.kanbanHeaders}
              name={data?.id?.toString()}
              onDragLeave={onDragLeave}
              onDragEnter={onDragEnter}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              onDragStart={onDragStart}
              onDrop={onDrop}
              // data={newOrder}
              data={handelOngetLeadData(data?.id?.toString())}
              filterData={getFieldListByHeader(data)}
            />
          )
        })} */}
        <KanbanCard
          headerName="Not Contacted"
          name="Not Contacted"
          onDragLeave={onDragLeave}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragStart={onDragStart}
          onDrop={onDrop}
          data={newOrder}
          // filterData={getFieldListByHeader(filteredItems, "Not Contacted")}
        />
        <KanbanCard
          headerName="Attempted"
          name="Attempted"
          onDragLeave={onDragLeave}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragStart={onDragStart}
          onDrop={onDrop}
          data={waiting}
          // filterData={getFieldListByHeader(filteredItems, "Attempted")}
        />
        <KanbanCard
          headerName={pathName === "/leads" ? "Warm Lead" : "Opportunity"}
          name={pathName === "/leads" ? "Warm Lead" : "Opportunity"}
          onDragLeave={onDragLeave}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragStart={onDragStart}
          onDrop={onDrop}
          data={pending}
          // filterData={getFieldListByHeader(filteredItems, "Warm Lead")}
        />
        <KanbanCard
          headerName="Cold Lead"
          name="Cold Lead"
          onDragLeave={onDragLeave}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragStart={onDragStart}
          onDrop={onDrop}
          data={done}
          // filterData={getFieldListByHeader(filteredItems, "Cold Lead")}
        />
      </div>
    </div>
  );
};

export default LeadsKanban;
