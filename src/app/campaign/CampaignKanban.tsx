import React, { useEffect, useState } from "react";
import KanbanCard from "../component/KanbanCard";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { toast } from "react-toastify";
import { getCampaign, updateCampaign } from "@/lib/features/campaign/campaignSlice";

const CampaignKanban = () => {
  const [tasks, setTasks] = useState<any>([]);
  const { campaignData } = useAppSelector((state) => state?.campaign);
  console.log("🚀 ~ CampaignKanban ~ campaignData:", campaignData)
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTasks(campaignData?.campaigns);
  }, [campaignData]);

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

  const onDrop = (evt: React.DragEvent<HTMLDivElement>, status: string) => {
    evt.preventDefault();
    evt.currentTarget.classList.remove("dragged-over");
    const id = evt.dataTransfer.getData("text/plain");

    const task = tasks.find(
      (task: { id: { toString: () => string } }) =>
        task.id.toString() === id.toString()
    );
    console.log("🚀 ~ onDrop ~ task:", task)
    console.log("🚀 ~ onDrop ~ status:", status)

    const data = {
      name: task?.name,
      type: task?.type,
      campaignDate: task?.campaignDate,
      endDate: task?.endDate,
      status: status,
    };
    dispatch(updateCampaign({ id: task?.id, data: data }))
      .unwrap()
      .then((res: any) => {
        if (res) {
          toast.success(
            res?.message ? res?.message : "Campaign Updated Successfully"
          );
          dispatch(getCampaign());
        }
      })
      .catch((err: any) => {
        const error = JSON.parse(err?.message);
        toast.error(error?.message ? error?.message : "Something went wrong");
      });

    if (task && task.status !== status) {
      const updatedTasks = tasks.map(
        (task: { id: { toString: () => string } }) => {
          if (task.id.toString() === id.toString()) {
            return { ...task, status };
          }
          return task;
        }
      );
      setTasks(updatedTasks);
    }
  };

  let newOrder = tasks?.filter(
    (data: { status: string }) => data?.status === "Upcoming"
  );
  let waiting = tasks?.filter(
    (data: { status: string }) => data?.status === "Ongoing"
  );
  let pending = tasks?.filter(
    (data: { status: string }) => data?.status === "Completed"
  );
  let done = tasks?.filter(
    (data: { status: string }) => data?.status === "On Hold"
  );

  return (
    <div className="w-[100%] overflow-auto px-5 h-full">
      <div className="flex gap-3 2xl:justify-center">
        <KanbanCard
          headerName="Upcoming"
          name="Upcoming"
          title="Campaigns"
          onDragLeave={onDragLeave}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragStart={onDragStart}
          onDrop={onDrop}
          data={newOrder}
          />
        <KanbanCard
          headerName="Ongoing"
          name="Ongoing"
          title="Campaigns"
          onDragLeave={onDragLeave}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragStart={onDragStart}
          onDrop={onDrop}
          data={waiting}
          />
        <KanbanCard
          headerName="On Hold"
          name="On Hold"
          title="Campaigns"
          onDragLeave={onDragLeave}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragStart={onDragStart}
          onDrop={onDrop}
          data={done}
          />
        <KanbanCard
          headerName="Completed"
          name="Completed"
          title="Campaigns"
          onDragLeave={onDragLeave}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragStart={onDragStart}
          onDrop={onDrop}
          data={pending}
        />
      </div>
    </div>
  );
};

export default CampaignKanban;
