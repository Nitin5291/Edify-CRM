"use client";
import React, { useEffect, useState } from "react";
import CustomInput from "../component/CustomInput";
import SingleSelece from "../component/SingleSelece";
import {
  OpportunitiyData1,
  HostItem,
} from "../component/Type";
import CustomModel from "../component/CustomModel";
import Contact from "../../assets/employee_contact.svg";
import { createLearnerCourseDetails, createLearnerFormData } from "@/CommonData";
import { useAppDispatch, useAppSelector } from "../../lib/store";
import { getCourses } from "@/lib/features/courses/coursesSlice";
import MultiSelectDropdown from "../component/MultiSelectDropdown";
import { toast } from "react-toastify";
import { createLearner, getLearner } from "@/lib/features/learner/learnerSlice";
import { getUserID } from "@/assets/utils/auth.util";

const CreateLearner = ({
  handelOnContactModel,
  handelOnSave,
}: {
  handelOnSave: () => void;
  handelOnContactModel: () => void;
}) => {
  const [learner, setLearner] =
    useState<OpportunitiyData1>({ countryCode: "91" });
  console.log("🚀 ~ learner:", learner)
  const [error, setError] = useState<OpportunitiyData1>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  let { batchData } = useAppSelector((state) => state?.batch);
  batchData = batchData?.data

  useEffect(() => {
    dispatch(getLearner());
  }, []);
  const Batch: HostItem[] = batchData && batchData?.map((item: any) => {
    return { lable: item?.batchName, value: item?.id };
  });

  const handelOnChang = (e: { target: { name: any; value: any; files: any }; }, name1?: any) => {
    if (name1) {
      setLearner({ ...learner, [`${name1}`]: e });
      setError({ ...error, [`${name1}`]: "" });
    } else {
      const { name, value } = e.target;
      setLearner({ ...learner, [`${name}`]: value });
      setError({ ...error, [`${name}`]: "" });
    }
  };

  const vaidation = () => {
    let formValid = true;
    const regex = /^[\w-]+(\.[\w-]+)*@([a-z\d]+(-[a-z\d]+)*\.)+[a-z]{2,}$/i;
    const newError: any = {};

    if (!learner?.email?.trim()) {
      formValid = false;
      newError["email"] = "Please enter email";
    } else if (!regex.test(learner?.email)) {
      formValid = false;
      newError["email"] = "Please enter a valid email address";
    }
    if (!learner?.name?.trim()) {
      formValid = false;
      newError["name"] = "Please enter name";
    }
    if (!learner?.phone?.trim()) {
      formValid = false;
      newError["phone"] = "Please enter phone number";
    } else if (!(learner?.phone?.length === 10)) {
      formValid = false;
      newError["phone"] = "Please enter valid phone number";
    }
    // if (!learner?.countryCode?.trim()) {
    //   formValid = false;
    //   newError["countryCode"] = "Please enter cc";
    // } else if (learner?.countryCode?.length > 4) {
    //   formValid = false;
    //   newError["countryCode"] = "Please enter maximum 4 digit cc";
    // }

    setError(newError);
    return formValid;
  };

  const handelOnSubmit = () => {
    if (vaidation()) {
      setIsLoading(true);
      const data = {
        name: learner?.name ? learner?.name : null,
        batchId: learner?.batchId?.length > 0
          ? `${learner?.batchId?.map((item: any) => {
            return item?.value;
          })?.join()}`
          : null,
        phone: learner?.phone ? learner?.phone : null,
        registeredDate: learner?.registeredDate ? learner?.registeredDate : null,
        email: learner?.email ? learner?.email : null,
        location: learner?.location ? learner?.location : null,
        description: learner?.description ? learner?.description : null,
        countryCode: learner?.countryCode ? learner?.countryCode : '91',
        userId: getUserID(),
        // lastName: learner?.lastName ? learner?.lastName : null,
        // visitedStage: learner?.visitedStage ? learner?.visitedStage : null,
        // phone: learner?.phone ? learner?.phone : null,
        // alternatePhone: learner?.alternatePhone ? learner?.alternatePhone : null,
        // email: learner?.email ? learner?.email : null,
        // location: learner?.location ? learner?.location : null,
        // source: learner?.source ? learner?.source : null,
        // attendedDemo: learner?.attendedDemo ? learner?.attendedDemo : null,
        // leadCreatedTime: learner?.leadCreatedTime ? learner?.leadCreatedTime : null,
        // counselingDoneBy: learner?.counselingDoneBy ? parseInt(learner?.counselingDoneBy) : null,
        // idProof: learner?.idProof ? learner?.idProof : null,
        // dateOfBirth: learner?.dateOfBirth ? learner?.dateOfBirth : null,
        // registeredDate: learner?.registeredDate ? learner?.registeredDate : null,
        // exchangeRate: learner?.exchangeRate ? learner?.exchangeRate : null,
        // learnerOwner: learner?.learnerOwner ? parseInt(learner?.learnerOwner) : null,
        // currency: learner?.currency ? learner?.currency : null,
        // learnerStage: learner?.learnerStage ? learner?.learnerStage : null,
        // // batchIds: learner?.batchIds ? learner?.batchIds : ["4"],
        // batchIds: ["4"],
        // courses: [
        //   {
        //     courseId: learner?.courseId ? parseInt(learner?.courseId) : null,
        //     techStack: learner?.techStack ? learner?.techStack : null,
        //     courseComments: learner?.courseComments ? learner?.courseComments : null,
        //     slackAccess: learner?.slackAccess ? learner?.slackAccess : null,
        //     lmsAccess: learner?.lmsAccess ? learner?.lmsAccess : null,
        //     preferableTime: learner?.preferableTime ? learner?.preferableTime : null,
        //     batchTiming: learner?.batchTiming ? learner?.batchTiming : null,
        //     modeOfClass: learner?.modeOfClass ? learner?.modeOfClass : null,
        //     comment: learner?.comment ? learner?.comment : null,
        //   }
        // ],
      };
      console.log("🚀 ~ handelOnSubmit ~ data:", data)
      dispatch(createLearner(data))
        .unwrap()
        .then((res: any) => {
          if (res) {
            toast.success(
              res?.message
                ? res?.message
                : "Learner Created Successfully"
            );
            setLearner({});
            setError({});
            handelOnSave();
          }
        })
        .catch((err: any) => {
          const error = JSON.parse(err.message);
          toast.error(error?.error ? error?.error : "Something went wrong");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handelOnCancel = () => {
    setError({});
    handelOnContactModel();
  };

  return (
    <>
      <CustomModel
        headerImg={Contact}
        lable="Create Learner"
        onCancel={handelOnCancel}
        onSave={handelOnSubmit}
        isLoading={isLoading}
      >
        <>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            {createLearnerFormData?.map((item: any) => {
              return item?.type === "input" ? (
                <CustomInput
                  onChange={handelOnChang}
                  lableValue={item?.lableValue}
                  error={error[item?.name] || error[item?.name1]}
                  name={item?.name}
                  name1={item?.name1}
                  value={learner?.[item?.name]}
                  value1={learner?.[item?.name1]}
                  mandatory={item?.mandatory}
                  // placeholder={item?.placeholder}
                  typeValue={item?.typeValue}
                />
              ) : item?.type === "select" ? (
                <SingleSelece
                  onChange={handelOnChang}
                  value={learner?.[item?.name]}
                  mandatory={item?.mandatory}
                  name={item?.name}
                  lableValue={item?.lableValue}
                  data={item?.data}
                />
              ) : item?.type === "multiSelect" ? (
                <MultiSelectDropdown
                  onChange={(e) => handelOnChang(e, item?.name)}
                  value={learner?.[item?.name]}
                  name={item?.name}
                  mandatory={item?.mandatory}
                  lableValue={item?.lableValue}
                  data={item?.name === "batchId" ? Batch : item?.data}
                />
              ) : null;
            })}
          </div>
          {/* <div className="mt-12">
            <h1 className="text-lg font-bold mb-2">Course Details</h1>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              {createLearnerCourseDetails?.map((item: any) => {
                return item?.type === "input" ? (
                  <CustomInput
                    onChange={handelOnChang}
                    lableValue={item?.lableValue}
                    value={learner?.[item?.name]}
                    error={error[item?.name]}
                    name={item?.name}
                    // placeholder={item?.placeholder}
                    typeValue={item?.typeValue}
                  />
                ) : item?.type === "select" ? (
                  <SingleSelece
                    onChange={handelOnChang}
                    value={learner?.[item?.name]}
                    name={item?.name}
                    lableValue={item?.lableValue}
                    data={item?.data}
                  />
                ) : item?.type === "multiSelect" ? (
                  <MultiSelectDropdown
                    onChange={(e) => handelOnChang(e, item?.name)}
                    value={learner?.[item?.name]}
                    name={item?.name}
                    lableValue={item?.lableValue}
                    data={item?.name === "courseId" ? Courses : item?.data}
                  />
                ) : null;
              })}
            </div>
          </div> */}
          <div className="w-full min-w-[200px] mb-2">
            <label
              className="font-medium text-base flex gap-1 mb-2">
              Description {error?.description && <span className="text-red-500 text-sm mt-1 pl-1">{error?.description}</span>}
            </label>
            <textarea
              name="description"
              value={learner?.description}
              onChange={(e: any) => handelOnChang(e)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Text..."
            />
          </div>
        </>

      </CustomModel>
    </>
  );
};

export default CreateLearner;
