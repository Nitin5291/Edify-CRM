import React, { useEffect, useState } from "react";
import KanbanCard from "../component/KanbanCard";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { getLeadData, updateLeadData } from "@/lib/features/lead/leadSlice";
import { toast } from "react-toastify";
import { getUserID } from "@/assets/utils/auth.util";
import { usePathname } from "next/navigation";

const OpportunityKanban = () => {
  const [tasks, setTasks] = useState<any>([]);
  const { LeadData } = useAppSelector((state) => state?.lead);
  const dispatch = useAppDispatch();
  const pathName = usePathname();

  useEffect(() => {
    setTasks(LeadData?.leads);
  }, [LeadData]);

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
      // name: task?.name ? task?.name : null,
      opportunityStatus: leadStatus,
      // phone: task?.phone ? task?.phone : null,
      // countryCode: task?.countryCode
      //   ? task?.countryCode
      //   : null,
      // opportunityStage: task?.opportunityStage
      //   ? task?.opportunityStage
      //   : null,
      // email: task?.email ? task?.email : null,
      // demoAttendedStage: task?.demoAttendedStage
      //   ? task?.demoAttendedStage
      //   : null,
      // feeQuoted: task?.feeQuoted
      //   ? task?.feeQuoted
      //   : null,
      // visitedStage: task?.visitedStage
      //   ? task?.visitedStage
      //   : null,
      // batchTiming:
      //   typeof task?.batchTiming === "object" &&
      //   task?.batchTiming?.length > 0
      //     ? task?.batchTiming?.map((item: any) => {
      //         return item?.value;
      //       })
      //     : null,
      // coldLeadReason: task?.coldLeadReason
      //   ? task?.coldLeadReason
      //   : null,
      // description: task?.description
      //   ? task?.description
      //   : null,
      // leadSource: task?.leadSource,
      // techStack: task?.techStack,
      // courseIds:
      //   typeof task?.Courses === "object" &&
      //   task?.Courses?.length > 0
      //     ? task?.Courses?.map((item: any) => {
      //         return item?.LeadCourse?.courseId ? item?.LeadCourse?.courseId : item;
      //       })
      //     : null,
      // classMode: task?.classMode,
      // leadStatus: task?.leadStatus,
      // nextFollowUp: task?.nextFollowUp,
      // userId: getUserID(),
      // leadStage: task?.leadStage,
    };
    dispatch(updateLeadData({ id: task?.id, data: data }))
      .unwrap()
      .then((res: any) => {
        if (res) {
          toast.success(
            res?.message ? res?.message : "Opportunity Updated Successfully"
          );
          dispatch(getLeadData("opportunity"));
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

  let newOrder = tasks?.filter(
    (data: { opportunityStatus: string }) => data?.opportunityStatus === "Visiting"
  );
  let waiting = tasks?.filter(
    (data: { opportunityStatus: string }) => data?.opportunityStatus === "Visited"
  );
  let pending = tasks?.filter(
    (data: { opportunityStatus: string }) => data?.opportunityStatus === "Demo attended"
  );
  let done = tasks?.filter(
    (data: { opportunityStatus: string }) => data?.opportunityStatus === "Lost Opportunity"
  );

  return (
    <div className="w-[100%] overflow-auto px-5 h-full">
      <div className="flex gap-3 2xl:justify-center">
        <KanbanCard
          headerName="Visiting"
          name="Visiting"
          title="Opportunities"
          onDragLeave={onDragLeave}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragStart={onDragStart}
          onDrop={onDrop}
          data={newOrder}
          />
        <KanbanCard
          headerName="Visited"
          name="Visited"
          title="Opportunities"
          onDragLeave={onDragLeave}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragStart={onDragStart}
          onDrop={onDrop}
          data={waiting}
          />
        <KanbanCard
          headerName="Demo attended"
          name="Demo attended"
          title="Opportunities"
          onDragLeave={onDragLeave}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragStart={onDragStart}
          onDrop={onDrop}
          data={pending}
          />
        <KanbanCard
          headerName="Lost Opportunity"
          name="Lost Opportunity"
          title="Opportunities"
          onDragLeave={onDragLeave}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragStart={onDragStart}
          onDrop={onDrop}
          data={done}
        />
      </div>
    </div>
  );
};

export default OpportunityKanban;
