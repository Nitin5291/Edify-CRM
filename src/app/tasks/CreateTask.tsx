"use client";
import React, { useEffect, useState } from "react";
import CustomInput from "../component/CustomInput";
import SingleSelece from "../component/SingleSelece";
import { LeadeDataView, HostItem, BatchData } from "../component/Type";
import CustomModel from "../component/CustomModel";
import Contact from "../../assets/employee_contact.svg";
import { toast } from "react-toastify";
import { createTaskForm } from "@/CommonData";
import { addLeadData } from "@/lib/features/lead/leadSlice";
import { useAppDispatch, useAppSelector } from "../../lib/store";
import { getUserID } from "@/assets/utils/auth.util";
import MultiSelectDropdown from "../component/MultiSelectDropdown";
import { getUser } from "@/lib/features/auth/authSlice";
import { createTrainer } from "@/lib/features/trainer/trainerSlice";
import ToggleSwitch from "../component/ToggleSwitch";
import { getLearner } from "@/lib/features/learner/learnerSlice";
import { createMainTask } from "@/lib/features/mainTask/mainTaskSlice";

const CreateTask = ({
  handelOnContactModel,
  handelOnSave,
}: {
  handelOnSave: () => void;
  handelOnContactModel: () => void;
}) => {
  const [trainer, setTrainer] = useState<BatchData>({});
  console.log("🚀 ~ trainer:", trainer)
  const [error, setError] = useState<BatchData>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { allUser } = useAppSelector((state) => state?.auth);
  const { learnerData } = useAppSelector((state) => state?.learner);

  const AssignToData: HostItem[] = allUser?.users?.map((item: any) => {
    return { lable: item?.name, value: item?.id };
  });
  const learner: HostItem[] = learnerData?.map((item: any) => {
    return { lable: item?.name, value: item?.id };
  });

  useEffect(() => {
    dispatch(getLearner());
    dispatch(getUser());
    handelOnStaticData();
    setTrainer({ ...trainer, taskOwner: getUserID() })
  }, []);

  const handelOnChang = (e: any, name1?: any, name2?: string) => {

    const keys = Object.keys(trainer)
    if (name2 && keys?.includes(name2)) {
      const filterData = trainer?.[name2]?.map((item: any, i: number) => {
        const { name, value, checked } = e.target;
        if (name1 === i) {
          return { ...item, [`${name}`]: name === "videoUpload" ? checked : value }
        } else {
          return item
        }
      })
      setTrainer({ ...trainer, [name2]: filterData })
    }
    else if (name1) {
      setTrainer({ ...trainer, [`${name1}`]: e });
      setError({ ...error, [`${name1}`]: "" });
    } else {
      const { name, value, files, checked } = e.target;
      if (name === "idProof") {
        setTrainer({ ...trainer, [`${name}`]: files?.[0] });
        setError({ ...error, [`${name}`]: "" });
      } else {
        setTrainer({ ...trainer, [`${name}`]: name === "reminder" ? checked : value });
        setError({ ...error, [`${name}`]: "" });
      }
    }
  };

  const vaidation = () => {
    let formValid = true;
    const regex = /^[\w-]+(\.[\w-]+)*@([a-z\d]+(-[a-z\d]+)*\.)+[a-z]{2,}$/i;
    const newError: any = {};

    // if (!trainer?.email?.trim()) {
    //   formValid = false;
    //   newError["email"] = "Please enter email";
    // } else if (!regex.test(trainer?.email)) {
    //   formValid = false;
    //   newError["email"] = "Please enter a valid email address";
    // }
    if (!trainer?.taskOwner) {
      formValid = false;
      newError["taskOwner"] = "Please select task Owner";
    }
    if (!trainer?.assignTo) {
      formValid = false;
      newError["assignTo"] = "Please select assign To";
    }
    // if (!trainer?.phone?.trim()) {
    //   formValid = false;
    //   newError["phone"] = "Please enter phone number";
    // } else if (!(trainer?.phone?.length === 10)) {
    //   formValid = false;
    //   newError["phone"] = "Please enter valid phone number";
    // }

    setError(newError);
    return formValid;
  };

  const handelOnSubmit = () => {
    if (vaidation()) {
      setIsLoading(true);
      const data = {
        taskOwner: trainer?.taskOwner ? parseInt(trainer?.taskOwner) : null,
        assignTo: trainer?.assignTo ? parseInt(trainer?.assignTo) : null,
        dueDate: trainer?.dueDate ? trainer?.dueDate : null,
        subject: trainer?.subject ? trainer?.subject : null,
        source: trainer?.source ? trainer?.source : null,
        note: trainer?.note ? trainer?.note : null,
        learnerId: trainer?.learnerId ? trainer?.learnerId : null,
        batch: trainer?.batch ? trainer?.batch : null,
        priority: trainer?.priority ? trainer?.priority : null,
        status: trainer?.status ? trainer?.status : "Inprogress",
        location: trainer?.location ? trainer?.location : null,
        slackStage: trainer?.slackStage ? trainer?.slackStage : null,
        trainerId: trainer?.trainerId ? trainer?.trainerId : null,
        taskType: trainer?.taskType ? trainer?.taskType : null,
        description: trainer?.description ? trainer?.description : null,
        reminder: trainer?.reminder ? trainer?.reminder : null,
      }

      dispatch(createMainTask(data))
        .unwrap()
        .then((res: any) => {
          if (res) {
            toast.success(
              res?.message
                ? res?.message
                : "Task Created Successfully"
            );
            setTrainer({ ...LeadeDataView, countryCode: '91' });
            setError(LeadeDataView);
            handelOnSave();
            handelOnStaticData();
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
    setTrainer({
      ...trainer
    });
  };

  const handelOnCancel = () => {
    setError(LeadeDataView);
    handelOnContactModel();
    handelOnStaticData();
  };

  return (
    <>
      <CustomModel
        headerImg={Contact}
        lable="Create Task"
        onCancel={handelOnCancel}
        onSave={handelOnSubmit}
        isLoading={isLoading}
      // large={true}
      >
        <h3 className="font-bold text-lg mb-4">
          Task Information
        </h3>
        <div className="grid gap-6 mb-6 md:grid-cols-2 ">
          {createTaskForm?.map((item: any) => {
            return item?.type === "input" ? (
              <CustomInput
                onChange={handelOnChang}
                lableValue={item?.lableValue}
                value={item?.name === "idProof" ? trainer[item?.name]?.name : trainer[item?.name]}
                error={error[item?.name]}
                name={item?.name}
                placeholder={item?.placeholder}
                typeValue={item?.typeValue}
                mandatory={item?.mandatory}
              />
            ) : item?.type === "select" ? (
              <SingleSelece
                onChange={handelOnChang}
                value={trainer?.[item?.name]}
                error={error[item?.name]}
                name={item?.name}
                lableValue={item?.lableValue}
                data={item?.name === "assignTo" || item?.name === "taskOwner" ? AssignToData : item?.name === "learnerId" ? learner : item?.data}
                mandatory={item?.mandatory}
              />
            ) : item?.type === "multiSelect" ? (
              <MultiSelectDropdown
                onChange={(e) => handelOnChang(e, item?.name)}
                value={trainer?.[item?.name]}
                name={item?.name}
                lableValue={item?.lableValue}
                data={item?.data}
              />
            ) : null;
          })}
          <ToggleSwitch value={trainer?.reminder} onChange={handelOnChang} />
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
              value={trainer?.taskType}
              onChange={handelOnChang}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            // placeholder="Enter your text here..."
            />
          </div><div className="w-full min-w-[200px] ">
            <label
              className="font-medium text-base flex gap-1 mb-2">
              Description {error?.description && <span className="text-red-500 text-sm mt-1 pl-1">{error?.description}</span>}
            </label>
            <textarea
              name="description"
              value={trainer?.description}
              onChange={handelOnChang}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            // placeholder="Enter your text here..."
            />
          </div>
        </div>
      </CustomModel>
    </>
  );
};

export default CreateTask;
