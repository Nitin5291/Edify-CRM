"use client";
import React, { useEffect, useState } from "react";
import {
  LearnerDataView,
  HostItem,
  OpportunitiyData1,
  LeadeData,
  LearnerDisableDataView,
} from "@/app/component/Type";
import JointBtn from "@/app/component/JointBtn";
import InputEdit from "../component/InputEdit";
import SingleSelece from "../component/SingleSelece";
import {
  createLearnerForm,
  createLearnerForm1,
  FilterLableAndValue,
} from "@/CommonData";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { getSingleLead, updateLeadData } from "@/lib/features/lead/leadSlice";
import { getUserID } from "@/assets/utils/auth.util";
import { getCourses } from "@/lib/features/courses/coursesSlice";
import MultiSelectDropdown from "../component/MultiSelectDropdown";
import { getSingleLearner, updateLearner } from "@/lib/features/learner/learnerSlice";
import { getBatch } from "@/lib/features/batch/batchSlice";

const LearnerDetail = ({
  handelOnSet,
}: {
  handelOnSet: (id: number, data: LeadeData[]) => void;
}) => {
  const dispatch = useAppDispatch();
  const [disableData, setDisableData] = useState<OpportunitiyData1>(
    LearnerDisableDataView
  );
  const [learnerData, setLearnerData] =
    useState<OpportunitiyData1>(LearnerDataView);
  const [error, setError] = useState<OpportunitiyData1>(LearnerDataView);
  const [changeContactData, setChangeContactData] =
    useState<OpportunitiyData1>(LearnerDataView);
  const [changeStatus, setChangeStatus] = useState<Boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let { SingleLearner } = useAppSelector((state) => state?.learner);
  SingleLearner = SingleLearner?.response
  const handelOnStatus = (name: String, value: Boolean) => {
    setDisableData({ ...LearnerDisableDataView, [`${name}`]: value });
  };
  const { CoursesData } = useAppSelector((state) => state?.courses);

  const Courses: HostItem[] = CoursesData?.courses?.map((item: any) => {
    return { lable: item?.name, value: item?.id };
  });

  const { batchData } = useAppSelector((state) => state?.batch);
  const Batch: HostItem[] = batchData?.map((item: any) => {
    return { lable: item?.batchName, value: item?.id };
  });
  console.log("🚀 ~ constBatch:HostItem[]=batchData?.map ~ Batch:", Batch)

  useEffect(() => {
    dispatch(getCourses());
    dispatch(getBatch());
  }, []);

  const handelOnChange = (
    e: { target: { name: String; value: String; files: any } },
    name1?: string
  ) => {
    if (name1) {
      setLearnerData({ ...learnerData, [name1]: e });
      setError({ ...error, [`${name1}`]: "" });
    } else {
      const { name, value, files } = e.target;
      setLearnerData({ ...learnerData, [`${name}`]: name === "idProof" || name === "instalment1Screenshot" ? files?.[0] : value });
      setError({ ...error, [`${name}`]: "" });
    }
  };
  const handelOnChangeInstance = (
    e: { target: { name: String; value: String; files: any } },
  ) => {
    const { name, files } = e.target;
    setLearnerData({ ...learnerData, [`instalment1Screenshot`]: files?.[0] });
    setError({ ...error, [`${name}`]: "" });
  };
  useEffect(() => {
    if (SingleLearner) {
      handelonClear();
    }
  }, [SingleLearner]);

  useEffect(() => {
    if (learnerData) {
      const value =
        JSON.stringify(changeContactData) === JSON.stringify(learnerData);
      setChangeStatus(value);
    }
  }, [learnerData]);

  const handelOnCancel = () => {
    setDisableData(LearnerDisableDataView);
    setLearnerData(learnerData);
    handelOnSet(-1, []);
  };

  const handelonClear = () => {
    const filterData = {
      ...SingleLearner /* , instalment1Screenshot: SingleLearner?.instalment1Screenshot?.[0], idProof: SingleLearner?.idProof?.[0], */, batchId: SingleLearner?.batches?.map((item: any) => {
        return { lable: item?.batchName, value: item?.id };
      })
    }
    console.log("🚀 ~ handelonClear ~ filterData:", filterData)
    setLearnerData(filterData);
    setChangeContactData(filterData);
  };

  const vaidation = () => {
    let formValid = true;
    const regex = /^[\w-]+(\.[\w-]+)*@([a-z\d]+(-[a-z\d]+)*\.)+[a-z]{2,}$/i;
    const newError: any = {};

    if (!learnerData?.email?.trim()) {
      formValid = false;
      newError["email"] = "Please enter email";
    } else if (!regex.test(learnerData?.email)) {
      formValid = false;
      newError["email"] = "Please enter a valid email address";
    }
    // if (!learnerData?.dueDate?.trim()) {
    //   formValid = false;
    //   newError["dueDate"] = "Please enter dueDate";
    // }
    // if (!learnerData?.registeredDate?.trim()) {
    //   formValid = false;
    //   newError["registeredDate"] = "Please enter registered date";
    // }
    // if (!learnerData?.dateOfBirth?.trim()) {
    //   formValid = false;
    //   newError["dateOfBirth"] = "Please enter date Of birth";
    // }
    // if (!learnerData?.name?.trim()) {
    //   formValid = false;
    //   newError["name"] = "Please enter name";
    // }
    // if (!learnerData?.name?.trim()) {
    //   formValid = false;
    //   newError["name"] = "Please enter name";
    // }
    // if (!learnerData?.phone?.trim()) {
    //   formValid = false;
    //   newError["phone"] = "Please enter phone number";
    // } else if (!(learnerData?.phone?.length === 10)) {
    //   formValid = false;
    //   newError["phone"] = "Please enter valid phone number";
    // }
    //}

    setError(newError);
    return formValid;
  };

  const handelOnSave = () => {
    if (vaidation()) {
      setIsLoading(true);
      // const data = {
      //   name: learnerData?.name ? learnerData?.name : null,
      //   idProof: learnerData?.idProof ? learnerData?.idProof : null,
      //   batchId: learnerData?.batchId?.[0]?.value
      //     ? learnerData?.batchId?.map((item: any) => {
      //       return item?.value;
      //     })
      //     : learnerData?.batchId ? learnerData?.batchId : null,
      //   phone: learnerData?.phone ? learnerData?.phone : null,
      //   dateOfBirth: learnerData?.dateOfBirth ? learnerData?.dateOfBirth : null,
      //   registeredDate: learnerData?.registeredDate ? learnerData?.registeredDate : null,
      //   email: learnerData?.email ? learnerData?.email : null,
      //   source: learnerData?.source ? learnerData?.source : null,
      //   location: learnerData?.location ? learnerData?.location : null,
      //   description: learnerData?.description ? learnerData?.description : null,
      //   totalFees: learnerData?.totalFees ? learnerData?.totalFees : null,
      //   modeofInstallmentpayment: learnerData?.modeofInstallmentpayment ? learnerData?.modeofInstallmentpayment : null,
      //   feesPaid: learnerData?.feesPaid ? learnerData?.feesPaid : null,
      //   instalment1Screenshot: learnerData?.instalment1Screenshot ? learnerData?.instalment1Screenshot : null,
      //   dueAmount: learnerData?.dueAmount ? learnerData?.dueAmount : null,
      //   dueDate: learnerData?.dueDate ? learnerData?.dueDate : null,
      //   // name: learnerData?.name ? learnerData?.name : null,
      //   // // lastName: learnerData?.lastName ? learnerData?.lastName : null,
      //   // visitedStage: learnerData?.visitedStage ? learnerData?.visitedStage : null,
      //   // phone: learnerData?.phone ? learnerData?.phone : null,
      //   // alternatePhone: learnerData?.alternatePhone ? learnerData?.alternatePhone : null,
      //   // email: learnerData?.email ? learnerData?.email : null,
      //   // location: learnerData?.location ? learnerData?.location : null,
      //   // source: learnerData?.source ? learnerData?.source : null,
      //   // attendedDemo: learnerData?.attendedDemo ? learnerData?.attendedDemo : null,
      //   // leadCreatedTime: learnerData?.leadCreatedTime ? learnerData?.leadCreatedTime : null,
      //   // counselingDoneBy: learnerData?.counselingDoneBy ? parseInt(learnerData?.counselingDoneBy) : null,
      //   // idProof: learnerData?.idProof ? learnerData?.idProof : null,
      //   // dateOfBirth: learnerData?.dateOfBirth ? learnerData?.dateOfBirth : null,
      //   // registeredDate: learnerData?.registeredDate ? learnerData?.registeredDate : null,
      //   // description: learnerData?.description ? learnerData?.description : null,
      //   // exchangeRate: learnerData?.exchangeRate ? learnerData?.exchangeRate : null,
      //   // learnerOwner: learnerData?.learnerOwner ? parseInt(learnerData?.learnerOwner) : null,
      //   // currency: learnerData?.currency ? learnerData?.currency : null,
      //   // learnerStage: learnerData?.learnerStage ? learnerData?.learnerStage : null,
      //   // // batchIds: learnerData?.batchIds ? learnerData?.batchIds : ["4"],
      //   // batchIds: ["4"],
      //   // courses: learnerData?.courses ? learnerData?.courses : []
      // };
      const formData = new FormData();

      formData.append("name", learnerData?.name ? learnerData?.name : '');
      // formData.append("idProof", learnerData?.idProof ? learnerData?.idProof : null);
      if (learnerData?.idProof && typeof learnerData?.idProof?.[0] !== "string") {
        formData.append("idProof", learnerData.idProof);
      } else {
        formData.append("idProof", '');
      }
      formData.append("batchId", learnerData?.batchId?.[0]?.value
        ? learnerData?.batchId?.map((item: any) => {
          return item?.value;
        })
        : learnerData?.batchId ? learnerData?.batchId : null);
      formData.append("phone", learnerData?.phone ? learnerData?.phone : '');
      formData.append("dateOfBirth", learnerData?.dateOfBirth ? learnerData?.dateOfBirth : null);
      formData.append("registeredDate", learnerData?.registeredDate ? learnerData?.registeredDate : null);
      formData.append("email", learnerData?.email ? learnerData?.email : '');
      formData.append("source", learnerData?.source ? learnerData?.source : '');
      formData.append("location", learnerData?.location ? learnerData?.location : '');
      formData.append("description", learnerData?.description ? learnerData?.description : '');
      formData.append("totalFees", learnerData?.totalFees ? learnerData?.totalFees : '');
      formData.append("modeofInstallmentpayment", learnerData?.modeofInstallmentpayment ? learnerData?.modeofInstallmentpayment : '');
      formData.append("feesPaid", learnerData?.feesPaid ? learnerData?.feesPaid : '');
      if (learnerData?.instalment1Screenshot && typeof learnerData?.instalment1Screenshot?.[0] !== "string") {
        formData.append("instalment1Screenshot", learnerData.instalment1Screenshot);
      } else {
        formData.append("instalment1Screenshot", "");
      }
      formData.append("dueAmount", learnerData?.dueAmount ? learnerData?.dueAmount : '');
      formData.append("dueDate", learnerData?.dueDate ? learnerData?.dueDate : null);

      dispatch(updateLearner({ id: SingleLearner?.id, data: formData }))
        .unwrap()
        .then((res: any) => {
          if (res) {
            toast.success(
              res?.message ? res?.message : "Learner Updated Successfully"
            );
            setError(LearnerDataView);
            handelOnCancel();
            dispatch(getSingleLearner(SingleLearner?.id));
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
            {createLearnerForm?.map((item: any) => {
              return item?.type === "input" ? (
                <InputEdit
                  lable={item?.lableValue}
                  disable={disableData?.[item?.name]}
                  name={item?.name}
                  error={error?.[item?.name]}
                  type={item?.typeValue}
                  value={item?.name === "idProof" ? learnerData?.[item?.name]?.name ? learnerData?.[item?.name]?.name : learnerData?.[item?.name] : learnerData?.[item?.name]}
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
                      learnerData?.[item?.name]
                        ? item?.data?.filter(
                          (i: any) => i?.value === learnerData?.[item?.name]
                        )?.[0]?.lable
                        : ""
                    }
                    onChange={handelOnChange}
                    handelOnStatus={handelOnStatus}
                  />
                ) : (
                  <SingleSelece
                    onChange={handelOnChange}
                    value={learnerData?.[item?.name]}
                    error={error?.[item?.name]}
                    name={item?.name}
                    lableValue={item?.lableValue}
                    data={item?.data}
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
                      item?.name === "batchId" ? learnerData?.batchId
                        ? learnerData?.batchId
                          ?.map((item: any) => {
                            return item?.lable;
                          })
                          ?.join(",")
                        : ""
                        :
                        item?.name === "courseId"
                          ? learnerData?.courseId
                            ? learnerData?.courseId
                              ?.map((item: any) => {
                                return item?.lable;
                              })
                              ?.join(",")
                            : ""
                          : typeof learnerData?.[item?.name] === "object" &&
                          learnerData?.[item?.name]?.length > 0 &&
                          learnerData?.[item?.name]
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
                      item?.name === "batchId"
                        ? learnerData?.[item?.name]
                        : learnerData?.[item?.name]?.[0]?.lable
                          ? learnerData?.[item?.name]
                          : typeof learnerData?.[item?.name] === "object" &&
                          learnerData?.[item?.name]?.length > 0 &&
                          FilterLableAndValue(learnerData?.[item?.name])
                    }
                    error={error?.[item?.name]}
                    name={item?.name}
                    lableValue={item?.lableValue}
                    data={item?.name === "courseId" ? Courses : item?.name === "batchId" ? Batch : item?.data}
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
              value={learnerData?.description}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              onChange={(e: any) => handelOnChange(e)}
            // placeholder="Enter your text here..."
            />
          </div>
          <h3 className="font-bold text-lg mt-5 mb-2">
            Payment Details
          </h3>
          <div className="grid gap-10 mb-6 md:grid-cols-2">
            {createLearnerForm1?.map((item: any) => {
              return item?.type === "input" ? (
                <InputEdit
                  lable={item?.lableValue}
                  disable={disableData?.[item?.name]}
                  name={item?.name}
                  error={error?.[item?.name]}
                  type={item?.typeValue}
                  value={item?.name === "instalment1Screenshot" ? learnerData?.[item?.name]?.name ? learnerData?.[item?.name]?.name : learnerData?.[item?.name] : learnerData?.[item?.name]}
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
                      learnerData?.[item?.name]
                        ? item?.data?.filter(
                          (i: any) => i?.value === learnerData?.[item?.name]
                        )?.[0]?.lable
                        : ""
                    }
                    onChange={handelOnChange}
                    handelOnStatus={handelOnStatus}
                  />
                ) : (
                  <SingleSelece
                    onChange={handelOnChange}
                    value={learnerData?.[item?.name]}
                    error={error?.[item?.name]}
                    name={item?.name}
                    lableValue={item?.lableValue}
                    data={item?.data}
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
                        ? learnerData?.courseId
                          ? learnerData?.courseId
                            ?.map((item: any) => {
                              return item?.lable;
                            })
                            ?.join(",")
                          : ""
                        : typeof learnerData?.[item?.name] === "object" &&
                        learnerData?.[item?.name]?.length > 0 &&
                        learnerData?.[item?.name]
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
                        ? learnerData?.[item?.name]
                        : learnerData?.[item?.name]?.[0]?.lable
                          ? learnerData?.[item?.name]
                          : typeof learnerData?.[item?.name] === "object" &&
                          learnerData?.[item?.name]?.length > 0 &&
                          FilterLableAndValue(learnerData?.[item?.name])
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

export default LearnerDetail;
