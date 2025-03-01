"use client";
import React, { useEffect, useState } from "react";
import {
  TrainerForm,
  HostItem,
  LeadeData,
  TaskDataView,
  CommonInterFace,
} from "@/app/component/Type";
import JointBtn from "@/app/component/JointBtn";
import InputEdit from "../component/InputEdit";
import SingleSelece from "../component/SingleSelece";
import { createTaskForm, FilterLableAndValue } from "@/CommonData";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { getUserID } from "@/assets/utils/auth.util";
import MultiSelectDropdown from "../component/MultiSelectDropdown";
import { getUser } from "@/lib/features/auth/authSlice";
import { updateTrainer } from "@/lib/features/trainer/trainerSlice";
import ToggleSwitch from "../component/ToggleSwitch";
import { getLearner } from "@/lib/features/learner/learnerSlice";
import { updateMainTask } from "@/lib/features/mainTask/mainTaskSlice";

const TaskDetail = ({
  handelOnSet,
}: {
  handelOnSet: (id: number, data: LeadeData[]) => void;
}) => {
  const dispatch = useAppDispatch();
  const [disableData, setDisableData] = useState<CommonInterFace>(TaskDataView);
  const [trainerData, setTrainerData] = useState<CommonInterFace>(TrainerForm);
  const [error, setError] = useState<CommonInterFace>(TrainerForm);
  const [changeContactData, setChangeContactData] = useState<CommonInterFace>(TrainerForm);
  const [changeStatus, setChangeStatus] = useState<Boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handelOnStatus = (name: String, value: Boolean) => {
    setDisableData((prevData) => ({ ...prevData, [`${name}`]: value }));
  };
  const { allUser } = useAppSelector((state) => state?.auth);
  const { singleMainTaskData } = useAppSelector((state) => state?.mainTask);
  const { learnerData } = useAppSelector((state) => state?.learner);

  const AssignToData: HostItem[] = allUser?.users?.map((item: any) => {
    return { lable: item?.name, value: item?.id };
  });

  const learner: HostItem[] = learnerData?.map((item: any) => {
    return { lable: item?.name, value: item?.id };
  });
  useEffect(() => {
    dispatch(getLearner());
    // dispatch(getUser("trainer"));
  }, []);

  const handelOnChange = (e: any, name1?: any) => {
    if (name1) {
      setTrainerData({ ...trainerData, [`${name1}`]: e });
      setError({ ...error, [`${name1}`]: "" });
    } else {
      const { name, value, files, checked } = e.target;
      if (name === "idProof") {
        setTrainerData({ ...trainerData, [`${name}`]: files?.[0] });
        setError({ ...error, [`${name}`]: "" });
      } else {
        setTrainerData({ ...trainerData, [`${name}`]: name === "reminder" ? checked : value });
        setError({ ...error, [`${name}`]: "" });
      }
    }
  };
  useEffect(() => {
    if (singleMainTaskData) {
      handelonClear();
    }
  }, [singleMainTaskData]);

  useEffect(() => {
    if (trainerData) {
      const value =
        JSON.stringify(changeContactData) === JSON.stringify(trainerData);
      setChangeStatus(value);
    }
  }, [trainerData]);

  const handelOnCancel = () => {
    setDisableData(TaskDataView);
    setTrainerData(trainerData);
    setError(TrainerForm);
    handelOnSet(-1, []);
  };

  const handelonClear = () => {
    setTrainerData(singleMainTaskData);
    setChangeContactData(singleMainTaskData);
    // setChangeContactData({
    //   ...SingleLead,
    //   courseId:
    //     SingleLead?.Courses?.length > 0 &&
    //     SingleLead?.Courses?.map((item: any) => {
    //       return {
    //         lable: item?.name,
    //         value: item?.LeadCourse?.courseId,
    //       };
    //     }),
    // });
  };

  const vaidation = () => {
    let formValid = true;
    const regex = /^[\w-]+(\.[\w-]+)*@([a-z\d]+(-[a-z\d]+)*\.)+[a-z]{2,}$/i;
    const newError: any = {};

    // if (!trainerData?.email?.trim()) {
    //   formValid = false;
    //   newError["email"] = "Please enter email";
    // } else if (!regex.test(trainerData?.email)) {
    //   formValid = false;
    //   newError["email"] = "Please enter a valid email address";
    // }

    if (!trainerData?.taskOwner) {
      formValid = false;
      newError["taskOwner"] = "Please enter task Owner";
    }
    if (!trainerData?.assignTo) {
      formValid = false;
      newError["assignTo"] = "Please select assign To";
    }
    // if (!trainerData?.trainerID?.trim()) {
    //   formValid = false;
    //   newError["trainerID"] = "Please enter trainer id";
    // }
    // if (!trainerData?.phone?.trim()) {
    //   formValid = false;
    //   newError["phone"] = "Please enter phone number";
    // } else if (!(trainerData?.phone?.length === 10)) {
    //   formValid = false;
    //   newError["phone"] = "Please enter valid phone number";
    // }

    {
      /*
         if (!trainerData?.leadSource?.trim()) {
            formValid = false
            newError["leadSource"] = "Please select lead source"
        }
        if (!trainerData?.techStack?.trim()) {
            formValid = false
            newError["techStack"] = "Please select tech stack"
        }
        if (!(trainerData?.courseId?.length > 0)) {
            formValid = false
            newError["courseId"] = "Please select course"
        }
        if (!trainerData?.feeQuoted) {
            formValid = false
            newError["feeQuoted"] = "Please enter fee quoted"
        }
        if (!trainerData?.classMode) {
            formValid = false
            newError["classMode"] = "Please select classMode"
        }
        if (!trainerData?.batchTiming) {
            formValid = false
            newError["batchTiming"] = "Please select batch timimng"
        }
        if (!trainerData?.description?.trim()) {
            formValid = false
            newError["description"] = "Please enter description"
        }
        if (!trainerData?.leadStatus) {
            formValid = false
            newError["leadStatus"] = "Please select lead status"
        }
        if (!trainerData?.nextFollowUp) {
            formValid = false
            newError["nextFollowUp"] = "Please select next followUp"
        }
        */
    }

    setError(newError);
    return formValid;
  };

  const handelOnSave = () => {
    if (vaidation()) {
      setIsLoading(true);
      const formData = new FormData();

      const data = {
        taskOwner: trainerData?.taskOwner ? parseInt(trainerData?.taskOwner) : null,
        assignTo: trainerData?.assignTo ? parseInt(trainerData?.assignTo) : null,
        dueDate: trainerData?.dueDate ? trainerData?.dueDate : null,
        subject: trainerData?.subject ? trainerData?.subject : null,
        source: trainerData?.source ? trainerData?.source : null,
        note: trainerData?.note ? trainerData?.note : null,
        learnerId: trainerData?.learnerId ? trainerData?.learnerId : null,
        batch: trainerData?.batch ? trainerData?.batch : null,
        priority: trainerData?.priority ? trainerData?.priority : null,
        status: trainerData?.status ? trainerData?.status : null,
        location: trainerData?.location ? trainerData?.location : null,
        slackStage: trainerData?.slackStage ? trainerData?.slackStage : null,
        trainerId: trainerData?.trainerId ? trainerData?.trainerId : null,
        taskType: trainerData?.taskType ? trainerData?.taskType : null,
        description: trainerData?.description ? trainerData?.description : null,
        reminder: trainerData?.reminder ? trainerData?.reminder : null,
      }

      dispatch(updateMainTask({ id: singleMainTaskData?.id, data: data }))
        .unwrap()
        .then((res: any) => {
          if (res) {
            toast.success(
              res?.message ? res?.message : "Task Update Successfully"
            );
            setError(TrainerForm);
            handelOnCancel();
          }
        })
        .catch((err: any) => {
          const error = JSON.parse(err?.message);
          toast.error(error?.message ? error?.message : "Something went wrong");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      <div>
        <div className="p-4 md:p-5">
          <h3 className="font-bold text-lg mb-4">
            Task Information
          </h3>
          <div className="grid gap-10 mb-8 md:grid-cols-2">
            {createTaskForm?.map((item: any) => {
              return item?.type === "input" ? (
                <div
                  key={item.name}
                  onClick={() => handelOnStatus(item.name, false)}
                  className="cursor-pointer"
                >
                  <InputEdit
                    lable={item?.lableValue}
                    disable={disableData?.[item?.name]}
                    name={item?.name}
                    error={error?.[item?.name]}
                    type={item?.typeValue}
                    value={item?.name === "idProof" ? trainerData[item?.name]?.name ? trainerData[item?.name]?.name : trainerData[item?.name]?.name : trainerData?.[item?.name]}
                    onChange={handelOnChange}
                    handelOnStatus={handelOnStatus}

                  />
                </div>
              ) : item?.type === "select" ? (
                <div
                  key={item.name}
                  onClick={() => handelOnStatus(item.name, false)}
                  className="cursor-pointer"
                >
                  {disableData?.[item?.name] ? (
                    <InputEdit
                      lable={item?.lableValue}
                      disable={disableData?.[item?.name]}
                      name={item?.name}
                      error={error?.[item?.name]}
                      type="text"
                      value={
                        trainerData?.[item?.name]
                          ? (item?.name === "assignTo" || item?.name === "taskOwner" ? AssignToData : trainerData?.[item?.name] === "learnerId" ? learner : item?.data)?.filter(
                            (i: any) => i?.value == trainerData?.[item?.name]
                          )?.[0]?.lable
                          : ""
                      }
                      onChange={handelOnChange}
                      handelOnStatus={handelOnStatus}
                    />
                  ) : (
                    <SingleSelece
                      onChange={handelOnChange}
                      value={trainerData?.[item?.name]}
                      error={error?.[item?.name]}
                      name={item?.name}
                      lableValue={item?.lableValue}
                      data={item?.name === "assignTo" || item?.name === "taskOwner" ? AssignToData : item?.name === "learnerId" ? learner : item?.data}
                    />
                  )}
                </div>
              ) : item?.type === "multiSelect" ? (
                <div
                  key={item.name}
                  onClick={() => handelOnStatus(item.name, false)}
                  className="cursor-pointer"
                >
                  {disableData?.[item?.name] ? (
                    <InputEdit
                      lable={item?.lableValue}
                      disable={disableData?.[item?.name]}
                      name={item?.name}
                      error={error?.[item?.name]}
                      type="text"
                      value={
                        item?.name === "courseId"
                          ? trainerData?.courseId
                            ? trainerData?.courseId
                              ?.map((item: any) => {
                                return item?.lable;
                              })
                              ?.join(",")
                            : ""
                          : typeof trainerData?.[item?.name] === "object" &&
                          trainerData?.[item?.name]?.length > 0 &&
                          trainerData?.[item?.name]
                            ?.map((item: any) => {
                              return item?.lable ? item?.lable : item;
                            })
                            ?.join(",")
                      }
                      onChange={handelOnChange}
                      handelOnStatus={handelOnStatus}
                    />
                  ) : (
                    <MultiSelectDropdown
                      onChange={(e) => handelOnChange(e, item?.name)}
                      value={
                        item?.name === "courseId"
                          ? trainerData?.[item?.name]
                          : trainerData?.[item?.name]?.[0]?.lable
                            ? typeof trainerData?.[item?.name] === "object" &&
                            trainerData?.[item?.name]?.length > 0 &&
                            trainerData?.[item?.name]
                            : typeof trainerData?.[item?.name] === "object" &&
                            FilterLableAndValue(trainerData?.[item?.name])
                      }
                      error={error?.[item?.name]}
                      name={item?.name}
                      lableValue={item?.lableValue}
                      data={item?.data}
                    />
                  )}
                </div>
              ) : null;
            })}
            <ToggleSwitch value={trainerData?.reminder} onChange={handelOnChange} />
          </div>
          <h3 className="font-bold text-lg mb-4">
            Description Information
          </h3>
          <div className="grid gap-5 mb-8 md:grid-cols-2">
            <div className="w-full min-w-[200px]">
              <label
                className="font-medium text-base flex gap-1 mb-2">
                Task Type {error?.taskType && <span className="text-red-500 text-sm mt-1 pl-1">{error?.taskType}</span>}
              </label>
              <textarea
                name="taskType"
                value={trainerData?.taskType}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                onChange={handelOnChange}
              // placeholder="Enter your text here..."
              />
            </div><div className="w-full min-w-[200px] ">
              <label
                className="font-medium text-base flex gap-1 mb-2">
                Description {error?.description && <span className="text-red-500 text-sm mt-1 pl-1">{error?.description}</span>}
              </label>
              <textarea
                name="description"
                value={trainerData?.description}
                onChange={handelOnChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              // placeholder="Enter your text here..."
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-center h-32 py-14  mt-7">
          {!changeStatus && (
            <JointBtn
              button1="Cancel"
              button2="Save"
              onClick1={handelonClear}
              isLoading={isLoading}
              onClick2={handelOnSave}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TaskDetail;

