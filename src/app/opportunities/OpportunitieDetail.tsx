"use client";
import React, { useEffect, useState } from "react";
import {
  OpportunitiyDataView,
  OpportunitiyDisableDataView,
  LeadeData,
  OpportunitiyData1,
  HostItem,
} from "@/app/component/Type";
import JointBtn from "@/app/component/JointBtn";
import InputEdit from "../component/InputEdit";
import SingleSelece from "../component/SingleSelece";
import { updateOpportunityForm, FilterLableAndValue } from "@/CommonData";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { getSingleLead, updateLeadData } from "@/lib/features/lead/leadSlice";
import { getUserID } from "@/assets/utils/auth.util";
import MultiSelectDropdown from "../component/MultiSelectDropdown";
import { getCourses } from "@/lib/features/courses/coursesSlice";

const EditOpportunitie = ({
  handelOnSet,
}: {
  handelOnSet: (id: number, data: LeadeData[]) => void;
}) => {
  const dispatch = useAppDispatch();
  const [disableData, setDisableData] = useState<OpportunitiyData1>(
    OpportunitiyDisableDataView
  );
  const [opportunitiyData, setOpportunitiyData] =
    useState<OpportunitiyData1>(OpportunitiyDataView);
  const [error, setError] = useState<OpportunitiyData1>(OpportunitiyDataView);
  const [changeContactData, setChangeContactData] =
    useState<OpportunitiyData1>(OpportunitiyDataView);
  const [changeStatus, setChangeStatus] = useState<Boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let { SingleLead } = useAppSelector((state) => state?.lead);
  SingleLead = SingleLead?.leads
  const handelOnStatus = (name: String, value: Boolean) => {
    setDisableData({ ...OpportunitiyDisableDataView, [`${name}`]: value });
  };

  const { CoursesData } = useAppSelector((state) => state?.courses);
  const { allUser } = useAppSelector((state) => state?.auth);

  const Courses: HostItem[] = CoursesData?.courses?.map((item: any) => {
    return { lable: item?.name, value: item?.id };
  });
  const counselledBy: HostItem[] = allUser?.users?.map((item: any) => {
    return { lable: item?.name, value: item?.id };
  });
  useEffect(() => {
    dispatch(getCourses());
  }, []);

  const handelOnChange = (
    e: { target: { name: String; value: String } },
    name1?: string
  ) => {
    if (name1) {
      setOpportunitiyData({ ...opportunitiyData, [name1]: e });
      setError({ ...error, [`${name1}`]: "" });
    } else {
      const { name, value } = e.target;
      setOpportunitiyData({ ...opportunitiyData, [`${name}`]: value });
      setError({ ...error, [`${name}`]: "" });
    }
  };
  useEffect(() => {
    if (SingleLead) {
      handelonClear();
    }
  }, [SingleLead]);

  useEffect(() => {
    if (opportunitiyData) {
      const value =
        JSON.stringify(changeContactData) === JSON.stringify(opportunitiyData);
      setChangeStatus(value);
    }
  }, [opportunitiyData]);

  const handelOnCancel = () => {
    setDisableData(OpportunitiyDisableDataView);
    setOpportunitiyData(opportunitiyData);
    handelOnSet(-1, []);
  };

  const handelonClear = () => {
    setOpportunitiyData({
      ...SingleLead,
      courseId: SingleLead?.Courses?.map((item: any) => {
        return {
          lable: item?.name,
          value: item?.LeadCourse?.courseId,
        };
      }),
    });
    setChangeContactData({
      ...SingleLead,
      courseId: SingleLead?.Courses?.map((item: any) => {
        return {
          lable: item?.name,
          value: item?.LeadCourse?.courseId,
        };
      }),
    });
  };

  const vaidation = () => {
    let formValid = true;
    const regex = /^[\w-]+(\.[\w-]+)*@([a-z\d]+(-[a-z\d]+)*\.)+[a-z]{2,}$/i;
    const newError: any = {};

    if (!opportunitiyData?.email?.trim()) {
      formValid = false;
      newError["email"] = "Please enter email";
    } else if (!regex.test(opportunitiyData?.email)) {
      formValid = false;
      newError["email"] = "Please enter a valid email address";
    }
    if (!opportunitiyData?.name?.trim()) {
      formValid = false;
      newError["name"] = "Please enter name";
    }
    if (!opportunitiyData?.phone?.trim()) {
      formValid = false;
      newError["phone"] = "Please enter phone number";
    } else if (!(opportunitiyData?.phone?.length === 10)) {
      formValid = false;
      newError["phone"] = "Please enter valid phone number";
    }

    setError(newError);
    return formValid;
  };

  const handelOnSave = () => {
    if (vaidation()) {
      setIsLoading(true);
      const data = {
        name: opportunitiyData?.name,
        opportunitySource: opportunitiyData?.opportunitySource,
        techStack: opportunitiyData?.techStack,
        expRegistrationDate: opportunitiyData?.expRegistrationDate,
        demoAttendedDate: opportunitiyData?.demoAttendedDate,
        counselledBy: opportunitiyData?.counselledBy,
        priceList: opportunitiyData?.priceList,
        fullNumber: opportunitiyData?.fullNumber,
        countryCode: opportunitiyData?.countryCode,
        alternativePhone: opportunitiyData?.alternativePhone,
        phone: opportunitiyData?.phone,
        leadScore: opportunitiyData?.leadScore,
        courseList: opportunitiyData?.courseList,
        leadOwner: opportunitiyData?.leadOwner,
        coldLeadReason: opportunitiyData?.coldLeadReason,
        visitedDate: opportunitiyData?.visitedDate,
        warmStage: opportunitiyData?.warmStage,
        expectedWalkInDate: opportunitiyData?.expectedWalkInDate,
        email: opportunitiyData?.email,
        classMode: opportunitiyData?.classMode,
        feeQuoted: opportunitiyData?.feeQuoted,
        batchTiming:
          opportunitiyData?.batchTiming?.length > 0
            ? opportunitiyData?.batchTiming?.map((item: any) => {
              return item?.value ? item?.value : item;
            })
            : null,
        opportunityStatus: opportunitiyData?.opportunityStatus,
        description: opportunitiyData?.description,
        nextFollowUp: opportunitiyData?.nextFollowUp,
        opportunityStage: opportunitiyData?.opportunityStage,
        userId: getUserID(),
        leadStage: opportunitiyData?.leadStage,
      };
      dispatch(updateLeadData({ id: SingleLead?.id, data: data }))
        .unwrap()
        .then((res: any) => {
          if (res) {
            toast.success(
              res?.message ? res?.message : "Opportunity Updated Successfully"
            );
            setError(OpportunitiyDataView);
            handelOnCancel();
            dispatch(getSingleLead(SingleLead?.id));
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

  return (
    <>
      <div>
        <div className="p-4 md:p-5">
          <div className="grid gap-10 mb-6 md:grid-cols-2">
            {updateOpportunityForm?.map((item: any) => {
              return item?.type === "input" ? (
                <InputEdit
                  lable={item?.lableValue}
                  disable={disableData?.[item?.name]}
                  name={item?.name}
                  name1={item?.name1}
                  value1={opportunitiyData?.[item?.name1]}
                  error={error?.[item?.name] || error?.[item?.name1]}
                  type={item?.typeValue}
                  value={opportunitiyData?.[item?.name]}
                  onChange={handelOnChange}
                  handelOnStatus={handelOnStatus}
                />
              ) : item?.type === "select" ? (
                disableData?.[item?.name] ? (
                  <InputEdit
                    lable={item?.lableValue}
                    disable={disableData?.[item?.name]}
                    name={item?.name}
                    error={error?.[item?.name]}
                    type="text"
                    value={
                      opportunitiyData?.[item?.name]
                        ? (item?.name === "counselledBy" ? counselledBy : item?.data)?.filter(
                          (i: any) =>
                            i?.value === opportunitiyData?.[item?.name]
                        )?.[0]?.lable
                        : ""
                    }
                    onChange={handelOnChange}
                    handelOnStatus={handelOnStatus}
                  />
                ) : (
                  <SingleSelece
                    onChange={handelOnChange}
                    value={opportunitiyData?.[item?.name]}
                    error={error?.[item?.name]}
                    name={item?.name}
                    lableValue={item?.lableValue}
                    data={item?.name === "counselledBy" ? counselledBy : item?.data}
                  />
                )
              ) : item?.type === "multiSelect" ? (
                disableData?.[item?.name] ? (
                  <InputEdit
                    lable={item?.lableValue}
                    disable={disableData?.[item?.name]}
                    name={item?.name}
                    error={error?.[item?.name]}
                    type="text"
                    value={
                      item?.name === "courseId"
                        ? opportunitiyData?.courseId
                          ? opportunitiyData?.courseId
                            ?.map((item: any) => {
                              return item?.lable;
                            })
                            ?.join(",")
                          : ""
                        : typeof opportunitiyData?.[item?.name] === "object" &&
                        opportunitiyData?.[item?.name]?.length > 0 &&
                        opportunitiyData?.[item?.name]
                          ?.map((item: any) => {
                            return item;
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
                        ? opportunitiyData?.[item?.name]
                        : opportunitiyData?.[item?.name]?.[0]?.lable
                          ? opportunitiyData?.[item?.name]
                          : typeof opportunitiyData?.[item?.name] === "object" &&
                          opportunitiyData?.[item?.name]?.length > 0 &&
                          FilterLableAndValue(opportunitiyData?.[item?.name])
                    }
                    error={error?.[item?.name]}
                    name={item?.name}
                    lableValue={item?.lableValue}
                    data={item?.name === "courseId" ? Courses : item?.data}
                  />
                )
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
              value={opportunitiyData?.description}
              onChange={handelOnChange}
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

export default EditOpportunitie;
