"use client";
import React, { useEffect, useState } from "react";
import {
  LeadeDataView,
  HostItem,
  LeadeData,
  RowDataView,
  CommonInterFace,
} from "@/app/component/Type";
import JointBtn from "@/app/component/JointBtn";
import InputEdit from "../component/InputEdit";
import SingleSelece from "../component/SingleSelece";
import { coursesPrice, createLeadForm1, FilterLableAndValue, ProgramsPrice } from "@/CommonData";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { getSingleLead, updateLeadData } from "@/lib/features/lead/leadSlice";
import { getUserID } from "@/assets/utils/auth.util";
import MultiSelectDropdown from "../component/MultiSelectDropdown";

const LeadeDetail = ({
  handelOnSet,
}: {
  handelOnSet: (id: number, data: LeadeData[]) => void;
}) => {
  const dispatch = useAppDispatch();
  const [disableData, setDisableData] = useState<CommonInterFace>(RowDataView);
  const [leadeData, setLeadeData] = useState<CommonInterFace>(LeadeDataView);
  const [error, setError] = useState<CommonInterFace>(LeadeDataView);
  const [changeContactData, setChangeContactData] =
    useState<CommonInterFace>(LeadeDataView);
  const [changeStatus, setChangeStatus] = useState<Boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let { SingleLead } = useAppSelector((state) => state?.lead);
  const handelOnStatus = (name: String, value: Boolean) => {
    setDisableData((prevData) => ({ ...prevData, [`${name}`]: value }));
  };
  SingleLead = SingleLead?.leads

  const { allUser } = useAppSelector((state) => state?.auth);
  console.log("🚀 ~ allUser:", allUser)
  const counselledBy: HostItem[] = allUser?.users?.filter((item: any) => { return item?.user_metadata?.userRole === "admin" })?.map((item: any) => {
    return { lable: item?.user_metadata?.name, value: item?.id };
  });
  const leadOwner: HostItem[] = allUser?.users?.filter((item: any) => { return item?.user_metadata?.userRole === "salesperson" })?.map((item: any) => {
    return { lable: item?.user_metadata?.name, value: item?.id };
  });

  const handelOnChange = (e: any, name1?: any) => {
    if (name1) {
      setLeadeData({ ...leadeData, [`${name1}`]: e });
      setError({ ...error, [`${name1}`]: "" });
    } else {
      const { name, value } = e.target;
      setLeadeData({ ...leadeData, [`${name}`]: value });
      setError({ ...error, [`${name}`]: "" });
    }
  };

  useEffect(() => {
    const handleOnFunction = () => {
      const programData = ProgramsPrice || [];
      const courseData = coursesPrice || [];

      const program = programData.find((item: any) => item?.label === leadeData?.programs)?.value || 0;
      const course = courseData.find((item: any) => item?.label === leadeData?.courseList)?.value || 0;

      const value =
        leadeData?.programs && leadeData?.courseList
          ? program + course
          : leadeData?.programs
            ? program
            : leadeData?.courseList
              ? course
              : 0;


      setLeadeData((prevData: any) => ({ ...prevData, priceList: value }));
    };

    handleOnFunction();
  }, [leadeData?.programs, leadeData?.courseList, ProgramsPrice, coursesPrice]);

  useEffect(() => {
    if (SingleLead) {
      handelonClear();
    }
  }, [SingleLead]);

  useEffect(() => {
    if (leadeData) {
      const value =
        JSON.stringify(changeContactData) === JSON.stringify(leadeData);
      setChangeStatus(value);
    }
  }, [leadeData]);

  const handelOnCancel = () => {
    setDisableData(RowDataView);
    setLeadeData(leadeData);
    handelOnSet(-1, []);
  };

  const handelonClear = () => {
    setLeadeData({
      ...SingleLead,
      countryCode: SingleLead?.countryCode,

    });
    setChangeContactData({
      ...SingleLead
    });
  };

  const vaidation = () => {
    let formValid = true;
    const regex = /^[\w-]+(\.[\w-]+)*@([a-z\d]+(-[a-z\d]+)*\.)+[a-z]{2,}$/i;
    const newError: any = {};

    if (!leadeData?.email?.trim()) {
      formValid = false;
      newError["email"] = "Please enter email";
    } else if (!regex.test(leadeData?.email)) {
      formValid = false;
      newError["email"] = "Please enter a valid email address";
    }
    // if (!leadeData?.name?.trim()) {
    //   formValid = false;
    //   newError["name"] = "Please enter name";
    // }
    if (!leadeData?.countryCode?.trim()) {
      formValid = false;
      newError["countryCode"] = "Please enter cc";
    } else if (leadeData?.countryCode?.length > 4) {
      formValid = false;
      newError["countryCode"] = "Please enter maximum 4 digit cc";
    }
    if (!leadeData?.phone?.trim()) {
      formValid = false;
      newError["phone"] = "Please enter phone number";
    } else if (!(leadeData?.phone?.length === 10)) {
      formValid = false;
      newError["phone"] = "Please enter valid phone number";
    }

    {
      /*
         if (!leadeData?.leadSource?.trim()) {
            formValid = false
            newError["leadSource"] = "Please select lead source"
        }
        if (!leadeData?.techStack?.trim()) {
            formValid = false
            newError["techStack"] = "Please select tech stack"
        }
        if (!(leadeData?.courseId?.length > 0)) {
            formValid = false
            newError["courseId"] = "Please select course"
        }
        if (!leadeData?.feeQuoted) {
            formValid = false
            newError["feeQuoted"] = "Please enter fee quoted"
        }
        if (!leadeData?.classMode) {
            formValid = false
            newError["classMode"] = "Please select classMode"
        }
        if (!leadeData?.batchTiming) {
            formValid = false
            newError["batchTiming"] = "Please select batch timimng"
        }
        if (!leadeData?.description?.trim()) {
            formValid = false
            newError["description"] = "Please enter description"
        }
        if (!leadeData?.leadStatus) {
            formValid = false
            newError["leadStatus"] = "Please select lead status"
        }
        if (!leadeData?.nextFollowUp) {
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
      const data = {
        name: leadeData?.name,
        techStack: leadeData?.techStack,
        expRegistrationDate: leadeData?.expRegistrationDate,
        demoAttendedDate: leadeData?.demoAttendedDate,
        counselledBy: leadeData?.counselledBy,
        priceList: leadeData?.priceList,
        countryCode: leadeData?.countryCode,
        // alternativePhone: leadeData?.alternativePhone,
        phone: leadeData?.phone,
        programs: leadeData?.programs,
        leadScore: leadeData?.leadScore,
        courseList: leadeData?.courseList,
        leadOwner: leadeData?.leadOwner,
        coldLeadReason: leadeData?.coldLeadReason,
        visitedDate: leadeData?.visitedDate,
        warmStage: leadeData?.warmStage,
        expectedWalkInDate: leadeData?.expectedWalkInDate,
        email: leadeData?.email,
        classMode: leadeData?.classMode,
        feeQuoted: leadeData?.feeQuoted,
        batchTiming:
          leadeData?.batchTiming?.length > 0
            ? leadeData?.batchTiming?.map((item: any) => {
              return item?.value ? item?.value : item;
            })
            : null,
        leadStatus: leadeData?.leadStatus,
        description: leadeData?.description,
        nextFollowUp: leadeData?.nextFollowUp,
        userId: getUserID(),
        leadStage: leadeData?.leadStage,
        leadSource: leadeData?.leadSource,
        leadSourceURL: leadeData?.leadSourceURL,
      };
      dispatch(updateLeadData({ id: SingleLead?.id, data: data }))
        .unwrap()
        .then((res: any) => {
          if (res) {
            toast.success(
              res?.message ? res?.message : "Leade Update Successfully"
            );
            setError(LeadeDataView);
            handelOnCancel();
            dispatch(getSingleLead(SingleLead?.id));
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
          {/* <h2 className="text-lg font-medium text-center mb-3 p-1 rounded-3xl bg-[#6D9EEB] w-full">Learner Model Fields</h2> */}
          <div className="grid gap-10 mb-8 md:grid-cols-2">
            {createLeadForm1?.map((item: any) => {
              return item?.type === "input" ? (
                <div
                  key={item.name}
                  onClick={() => handelOnStatus(item.name, false)}
                  className="cursor-pointer"
                >
                  <InputEdit
                    lable={item?.lableValue}
                    disable={item?.name === "priceList" ? true : disableData?.[item?.name]}
                    name={item?.name}
                    name1={item?.name1}
                    value1={leadeData?.[item?.name1]}
                    value={leadeData?.[item?.name]}
                    error={error?.[item?.name] || error?.[item?.name1]}
                    type={item?.typeValue}
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
                        leadeData?.[item?.name]
                          ? (item?.name === "leadOwner" ? leadOwner :/*  item?.name === "leadStatus" ? leadData : */ item?.name === "counselledBy" ? counselledBy : item?.data)?.filter(
                            (i: any) => i?.value == leadeData?.[item?.name]
                          )?.[0]?.lable
                          : ""
                      }
                      onChange={handelOnChange}
                      handelOnStatus={handelOnStatus}
                    />
                  ) : (
                    <SingleSelece
                      onChange={handelOnChange}
                      value={leadeData?.[item?.name]}
                      error={error?.[item?.name]}
                      name={item?.name}
                      lableValue={item?.lableValue}
                      data={item?.name === "leadOwner" ? leadOwner : /* item?.name === "leadStatus" ? leadData :  */item?.name === "counselledBy" ? counselledBy : item?.data}
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
                          ? leadeData?.courseId
                            ? leadeData?.courseId
                              ?.map((item: any) => {
                                return item?.lable;
                              })
                              ?.join(",")
                            : ""
                          : typeof leadeData?.[item?.name] === "object" &&
                          leadeData?.[item?.name]?.length > 0 &&
                          leadeData?.[item?.name]
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
                          ? leadeData?.[item?.name]
                          : leadeData?.[item?.name]?.[0]?.lable
                            ? typeof leadeData?.[item?.name] === "object" &&
                            leadeData?.[item?.name]?.length > 0 &&
                            leadeData?.[item?.name]
                            : typeof leadeData?.[item?.name] === "object" &&
                            FilterLableAndValue(leadeData?.[item?.name])
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
          </div>

          <div className="w-full min-w-[200px] mb-2">
            <label
              className="font-medium text-base flex gap-1 mb-2">
              Description {error?.description && <span className="text-red-500 text-sm mt-1 pl-1">{error?.description}</span>}
            </label>
            <textarea
              name="description"
              onChange={handelOnChange}
              value={leadeData?.description}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            // placeholder="Enter your text here..."
            />
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

export default LeadeDetail;

