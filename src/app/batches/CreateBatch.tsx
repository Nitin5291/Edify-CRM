"use client";
import React, { useEffect, useState } from "react";
import CustomInput from "../component/CustomInput";
import SingleSelece from "../component/SingleSelece";
import { HostItem, BatchData } from '../component/Type';
import CustomModel from "../component/CustomModel";
import Contact from "../../assets/employee_contact.svg";
import { toast } from "react-toastify";
import { createBatchForm } from "@/CommonData";
import { useAppDispatch, useAppSelector } from "../../lib/store";
import MultiSelectDropdown from "../component/MultiSelectDropdown";
import SingleBtn from "../component/SingleBtn";
import { ImBin } from "react-icons/im";
import { createBatch, createBatchTopic } from "@/lib/features/batch/batchSlice";
import { getLeadData } from "@/lib/features/lead/leadSlice";
import { getTrainer } from "@/lib/features/trainer/trainerSlice";
import { getUserID } from "@/assets/utils/auth.util";


const CreateBatch = ({
  handelOnContactModel,
  handelOnSave,
}: {
  handelOnSave: () => void;
  handelOnContactModel: () => void;
}) => {
  const [batch, setBatch] = useState<BatchData>({});
  const [error, setError] = useState<BatchData>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { trainerData } = useAppSelector((state) => state?.trainer);
  const { LeadData } = useAppSelector((state) => state?.lead);

  const TrainerData: HostItem[] = trainerData?.data?.map((item: any) => {
    return { lable: item?.trainerName, value: item?.id };
  });
  const LeadeDatas: HostItem[] = LeadData?.leads?.map((item: any) => {
    return { lable: item?.name, value: item?.id };
  });

  useEffect(() => {
    dispatch(getTrainer());
    dispatch(getLeadData("learner"));
    handelOnStaticData();
  }, []);

  const handelOnChang = (e: any, name1?: any, name2?: string) => {
    const keys = Object.keys(batch)
    if (name2 && keys?.includes(name2)) {
      const filterData = batch?.[name2]?.map((item: any, i: number) => {
        const { name, value, checked } = e.target;
        if (name1 === i) {
          return { ...item, [`${name}`]: name === "isVideoUploaded" ? checked : value }
        } else {
          return item
        }
      })
      setBatch({ ...batch, [name2]: filterData })
    }
    else if (name1) {
      setBatch({ ...batch, [`${name1}`]: e });
      setError({ ...error, [`${name1}`]: "" });
    } else {
      const { name, value } = e.target;
      setBatch({ ...batch, [`${name}`]: value });
      setError({ ...error, [`${name}`]: "" });
    }
  };

  const vaidation = () => {
    let formValid = true;
    const newError: any = {};

    if (!batch?.batchName?.trim()) {
      formValid = false;
      newError["batchName"] = "Please enter batch name";
    }

    setError(newError);
    return formValid;
  };

  const handelOnSubmit = () => {
    if (vaidation()) {
      setIsLoading(true);
      const data = {
        batchName: batch?.batchName ? batch?.batchName : null,
        // learnerIds:
        //   batch?.learnerIds?.length > 0
        //     ? batch?.learnerIds?.map((item: any) => {
        //       return item?.value;
        //     })
        //     : null,
        stack: batch?.stack ? batch?.stack : null,
        location: batch?.location ? batch?.location : null,
        startDate: batch?.startDate ? batch?.startDate : null,
        slot: batch?.slot ? batch?.slot : null,
        trainerId: batch?.trainerId,
        tentativeEndDate: batch?.tentativeEndDate ? batch?.tentativeEndDate : null,
        description: batch?.description ? batch?.description : null,
        userId: getUserID()
        // batchStatus: batch?.batchStatus ? batch?.batchStatus : null,
        // classMode: batch?.classMode,
        // topicStatus: batch?.topicStatus ? batch?.topicStatus : null,
        // stage: batch?.stage ? batch?.stage : null,
        // noOfStudents: batch?.noOfStudents ? batch?.noOfStudents : null,
        // note: batch?.note,
      };
      dispatch(createBatch(data))
        .unwrap()
        .then((res: any) => {
          debugger
          if (res?.status === 200) {
            toast.success(
              res?.data?.message
                ? res?.data?.message
                : "Batch Created Successfully"
            );
                setBatch({});
                setError({});
                handelOnSave();
                handelOnStaticData();
            // dispatch(createBatchTopic({ id: res?.data?.data?.id, data: [...batch?.first_month, ...batch?.second_month, ...batch?.third_month] })).unwrap().then((res1: any) => {
            //   if (res1?.status === 200) {
            //     toast.success(
            //       res1?.data?.message
            //         ? res1?.data?.message
            //         : "Batch topics processed successfully"
            //     );
            //     setBatch({});
            //     setError({});
            //     handelOnSave();
            //     handelOnStaticData();
            //   }
            // }).catch((err1) => {
            //   const error = JSON.parse(err1.message);
            //   toast.error(error?.error ? error?.error : "Something went wrong");
            // })
            //   .finally(() => {
            //     setIsLoading(false);
            //   });
          }
        })
        .catch((err) => {
          const error = JSON.parse(err.message);
          toast.error(error?.error ? error?.error : "Something went wrong");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handelOnStaticData = () => {
    setBatch({
      ...batch,
      ['first_month']: [{ date: null, topic: "", startTime: null, endTime: null, attendance: "", isVideoUploaded: false }],
      ['second_month']: [{ date: null, topic: "", startTime: null, endTime: null, attendance: "", isVideoUploaded: false }],
      ['third_month']: [{ date: null, topic: "", startTime: null, endTime: null, attendance: "", isVideoUploaded: false }],
    });
  };

  const handelOnCancel = () => {
    setError({});
    handelOnContactModel();
    handelOnStaticData();
  };

  const handelOnAddRow = (name: string) => {
    setBatch({
      ...batch, [name]: [...batch?.[name], { date: null, topic: "", startTime: null, endTime: null, attendance: "", isVideoUploaded: false }]
    })
  }

  const handelOnRemoveRow = (name: string, index: number) => {
    setBatch({
      ...batch, [name]: batch?.[name]?.filter((item: any, i: number) => i !== index)
    })
  }

  return (
    <>
      <CustomModel
        headerImg={Contact}
        lable="Create Batches"
        onCancel={handelOnCancel}
        onSave={handelOnSubmit}
        isLoading={isLoading}
        // large={true}
        button2="Save"
      >
        {/* <h1 className="text-xl font-medium mb-3">Batch Information</h1> */}
        <div className="grid gap-6 mb-6 md:grid-cols-2 ">
          {createBatchForm?.map((item: any) => {
            return item?.type === "input" ? (
              <CustomInput
                onChange={handelOnChang}
                lableValue={item?.lableValue}
                value={batch[item?.name]}
                error={error[item?.name]}
                name={item?.name}
                placeholder={item?.placeholder}
                typeValue={item?.typeValue}
                mandatory={item?.mandatory}
              />
            ) : item?.type === "select" ? (
              <SingleSelece
                onChange={handelOnChang}
                value={batch?.[item?.name]}
                name={item?.name}
                lableValue={item?.lableValue}
                data={item?.name === "trainerId" ? TrainerData : item?.data}
              />
            ) : item?.type === "multiSelect" ? (
              <MultiSelectDropdown
                onChange={(e) => handelOnChang(e, item?.name)}
                value={batch?.[item?.name]}
                name={item?.name}
                lableValue={item?.lableValue}
                data={item?.name === "learnerIds" ? LeadeDatas : item?.data}
              />
            ) : null;
          })}
        </div>
        <div className="w-full min-w-[200px] mb-2">
          <label
            className="font-medium text-base flex gap-1 mb-2">
            Description {error?.description && <span className="text-red-500 text-sm mt-1 pl-1">{error?.description}</span>}
          </label>
          <textarea
            name="description"
            value={batch?.description}
            onChange={handelOnChang}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          // placeholder="Enter your text here..."
          />
        </div>
        {/* {["first_month", "second_month", "third_month"]?.map((data: any, i: number) => {
          return (
            <div className="grid gap-5  mt-14">
              <h1 className="text-xl font-medium">Month {i + 1}</h1>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border rounded-full border-gray-200">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-normal bg-gray-100">Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-normal bg-gray-100">Topic</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-normal bg-gray-100">Start Time</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-normal bg-gray-100">End Time</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-normal bg-gray-100">Attendance</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-normal bg-gray-100">Video Upload</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-normal bg-gray-100">Duration</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-normal bg-gray-100">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batch?.[data]?.map((item: any, index: number) => {
                      return (
                        <tr key={index}>
                          <td className="border border-gray-300 px-4 py-2">
                            <input type="date" name="date" value={item?.date} placeholder="DD/MM/YY" onChange={(e) => handelOnChang(e, index, data)} className="w-full p-2 border rounded" />
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <input type="text" placeholder="Topic" name="topic" value={item?.topic} onChange={(e) => handelOnChang(e, index, data)} className="w-full min-w-44 p-2 border rounded" />
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <div className="flex items-center space-x-2">
                              <input type="time" placeholder="DD/MM/YY" name="startTime" value={item?.startTime} onChange={(e) => handelOnChang(e, index, data)} className="w-full p-2 border rounded" />
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <div className="flex items-center space-x-2">
                              <input type="time" placeholder="DD/MM/YY" name="endTime" value={item?.endTime} onChange={(e) => handelOnChang(e, index, data)} className="w-full p-2 border rounded" />
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <input type="text" placeholder="Attendance" name="attendance" value={item?.attendance} onChange={(e) => handelOnChang(e, index, data)} className="w-full min-w-44 p-2 border rounded" />
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            <input type="checkbox" name="isVideoUploaded" checked={item?.isVideoUploaded} onChange={(e) => handelOnChang(e, index, data)} className="h-5 w-5" />
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                          </td>
                          <td className="border flex justify-center border-gray-300 h-[3.75rem] items-center">
                            <ImBin size={20} className="text-red-500 cursor-pointer" onClick={() => handelOnRemoveRow(data, index)} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <SingleBtn name="Add Row" color="sky" icon="Plus" onClick={() => handelOnAddRow(data)} />
            </div>
          )
        })} */}
      </CustomModel>
    </>
  );
};

export default CreateBatch;
