import React, { useEffect, useState } from "react";
import KanbanCard from "../component/KanbanCard";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";
import { getBatch, updateBatch } from "@/lib/features/batch/batchSlice";

const BatchKanban = () => {
  const [tasks, setTasks] = useState<any>([]);
  const { batchData } = useAppSelector((state) => state?.batch);
  const dispatch = useAppDispatch();
  const pathName = usePathname();

  useEffect(() => {
    setTasks(batchData);
  }, [batchData]);

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

  const onDrop = (evt: React.DragEvent<HTMLDivElement>, batchStatus: string) => {
    evt.preventDefault();
    evt.currentTarget.classList.remove("dragged-over");
    const id = evt.dataTransfer.getData("text/plain");

    const task = tasks.find(
      (task: { id: { toString: () => string } }) =>
        task.id.toString() === id.toString()
    );

    const data = {
      // batchName: task?.batchName,
      // learnerIds:
      //   task?.leads?.length > 0
      //     ? task?.leads?.map((item: any) => {
      //       return item?.BatchLead?.LeadId;
      //     })
      //     : null,
      // location: task?.location,
      // stack: task?.stack,
      // slot: task?.slot,
      // startDate: task?.startDate,
      // trainerId: task?.trainerId,
      // tentativeEndDate: task?.tentativeEndDate,
      batchStatus: batchStatus,
      // classMode: task?.classMode,
      // topicStatus: task?.topicStatus ? task?.topicStatus : null,
      // stage: task?.stage ? task?.stage : null,
      // noOfStudents: task?.noOfStudents ? task?.noOfStudents : null,
      // comment: task?.comment,
    };
    dispatch(updateBatch({ id: task?.id, data: data }))
      .unwrap()
      .then((res: any) => {
        if (res) {
          toast.success(
            res?.message ? res?.message : "Batch Updated Successfully"
          );
          dispatch(getBatch());
        }
      })
      .catch((err: any) => {
        const error = JSON.parse(err?.message);
        toast.error(error?.message ? error?.message : "Something went wrong");
      });

    if (task && task.batchStatus !== batchStatus) {
      const updatedTasks = tasks.map(
        (task: { id: { toString: () => string } }) => {
          if (task.id.toString() === id.toString()) {
            return { ...task, batchStatus };
          }
          return task;
        }
      );
      setTasks(updatedTasks);
    }
  };

  let newOrder = tasks?.filter(
    (data: { batchStatus: string }) => data?.batchStatus === "Upcoming"
  );
  let waiting = tasks?.filter(
    (data: { batchStatus: string }) => data?.batchStatus === "Ongoing"
  );
  let pending = tasks?.filter(
    (data: { batchStatus: string }) => data?.batchStatus === "Completed"
  );
  let done = tasks?.filter(
    (data: { batchStatus: string }) => data?.batchStatus === "On Hold"
  );

  return (
    <div className="w-[100%] overflow-auto px-5 h-full">
      <div className="flex gap-3 2xl:justify-center">
        <KanbanCard
          headerName="Upcoming"
          name="Upcoming"
          title="Batches"
          onDragLeave={onDragLeave}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragStart={onDragStart}
          onDrop={onDrop}
          data={newOrder}
          designStatus={2}
          />
        <KanbanCard
          headerName="Ongoing"
          name="Ongoing"
          title="Batches"
          onDragLeave={onDragLeave}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragStart={onDragStart}
          onDrop={onDrop}
          data={waiting}
          designStatus={2}
          />
        <KanbanCard
          headerName="On Hold"
          name="On Hold"
          title="Batches"
          onDragLeave={onDragLeave}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragStart={onDragStart}
          onDrop={onDrop}
          data={done}
          designStatus={2}
          />
        <KanbanCard
          headerName="Completed"
          name="Completed"
          title="Batches"
          onDragLeave={onDragLeave}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragStart={onDragStart}
          onDrop={onDrop}
          data={pending}
          designStatus={2}
        />
      </div>
    </div>
  );
};

export default BatchKanban;
