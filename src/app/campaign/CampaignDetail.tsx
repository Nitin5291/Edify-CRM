"use client";
import React, { useEffect, useState } from "react";
import {
  CampaignForm,
  LeadeData,
  CampaignDataView,
  CommonInterFace,
  HostItem,
} from "@/app/component/Type";
import JointBtn from "@/app/component/JointBtn";
import InputEdit from "../component/InputEdit";
import SingleSelece from "../component/SingleSelece";
import { FilterLableAndValue, updateCampaignForm } from "@/CommonData";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { getSingleLead, updateLeadData } from "@/lib/features/lead/leadSlice";
import MultiSelectDropdown from "../component/MultiSelectDropdown";
import { updateCampaign } from "@/lib/features/campaign/campaignSlice";
import { getUserID } from "@/assets/utils/auth.util";
import { getUser } from "@/lib/features/auth/authSlice";

const CampaignDetail = ({
  handelOnSet,
}: {
  handelOnSet: (id: number, data: LeadeData[]) => void;
}) => {
  const dispatch = useAppDispatch();
  const [disableData, setDisableData] = useState<CommonInterFace>(CampaignDataView);
  const [campaignData, setCampaignData] = useState<CommonInterFace>(CampaignForm);
  const [error, setError] = useState<CommonInterFace>(CampaignForm);
  const [changeContactData, setChangeContactData] = useState<CommonInterFace>(CampaignForm);
  const [changeStatus, setChangeStatus] = useState<Boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { singleCampaignData } = useAppSelector((state) => state?.campaign);
  console.log("🚀 ~ singleCampaignData:", singleCampaignData)
  const handelOnStatus = (name: String, value: Boolean) => {
    setDisableData((prevData) => ({ ...prevData, [`${name}`]: value }));
  };
  const { allUser } = useAppSelector((state) => state?.auth);
  const campaignOwner: HostItem[] = allUser?.users?.filter((item: any) => { return item?.user_metadata?.userRole === "admin" })?.map((item: any) => {
    return { lable: item?.user_metadata?.name, value: item?.id };
  });
  useEffect(() => {
    dispatch(getUser());
  }, [])


  const handelOnChange = (e: any, name1?: any) => {
    if (name1) {
      setCampaignData({ ...campaignData, [`${name1}`]: e });
      setError({ ...error, [`${name1}`]: "" });
    } else {
      const { name, value } = e.target;
      setCampaignData({ ...campaignData, [`${name}`]: value });
      setError({ ...error, [`${name}`]: "" });
    }
  };
  useEffect(() => {
    if (singleCampaignData?.campaigns?.[0]) {
      handelonClear();
    }
  }, [singleCampaignData?.campaigns?.[0]]);

  useEffect(() => {
    if (campaignData) {
      const value =
        JSON.stringify(changeContactData) === JSON.stringify(campaignData);
      setChangeStatus(value);
    }
  }, [campaignData]);

  const handelOnCancel = () => {
    setDisableData(CampaignDataView);
    setCampaignData(campaignData);
    handelOnSet(-1, []);
  };

  const handelonClear = () => {
    setCampaignData(singleCampaignData?.campaigns?.[0]);
    setChangeContactData(singleCampaignData?.campaigns?.[0]);
  };

  const vaidation = () => {
    let formValid = true;
    const regex = /^[\w-]+(\.[\w-]+)*@([a-z\d]+(-[a-z\d]+)*\.)+[a-z]{2,}$/i;
    const newError: any = {};

    // if (!campaignData?.email?.trim()) {
    //   formValid = false;
    //   newError["email"] = "Please enter email";
    // } else if (!regex.test(campaignData?.email)) {
    //   formValid = false;
    //   newError["email"] = "Please enter a valid email address";
    // }
    if (!campaignData?.name?.trim()) {
      formValid = false;
      newError["name"] = "Please enter campaign name";
    }
    if (!campaignData?.status?.trim()) {
      formValid = false;
      newError["status"] = "Please enter campaign status";
    }
    if (!campaignData?.type?.trim()) {
      formValid = false;
      newError["type"] = "Please enter campaign type";
    }
    if (!campaignData?.campaignDate?.trim()) {
      formValid = false;
      newError["campaignDate"] = "Please enter campaign start date";
    }
    if (!campaignData?.endDate?.trim()) {
      formValid = false;
      newError["endDate"] = "Please enter campaign end date";
    }

    setError(newError);
    return formValid;
  };

  const handelOnSave = () => {
    if (vaidation()) {
      setIsLoading(true);
      const data = {
        campaignOwner: campaignData?.campaignOwner ? campaignData?.campaignOwner : null,
        name: campaignData?.name ? campaignData?.name : null,
        status: campaignData?.status ? campaignData?.status : null,
        type: campaignData?.type ? campaignData?.type : null,
        campaignDate: campaignData?.campaignDate ? campaignData?.campaignDate : null,
        endDate: campaignData?.endDate ? campaignData?.endDate : null,
        active: campaignData?.active ? campaignData?.active : null,
        description: campaignData?.description ? campaignData?.description : null,
        amountSpent: campaignData?.amountSpent ? parseInt(campaignData?.amountSpent) : null,
        userId: getUserID()
        // phone: campaignData?.phone ? campaignData?.phone : null,
        // courseId: campaignData?.courseId ? campaignData?.courseId : null,
      };
      dispatch(updateCampaign({ id: singleCampaignData?.campaigns?.[0]?.id, data: data }))
        .unwrap()
        .then((res: any) => {
          if (res) {
            toast.success(
              res?.message ? res?.message : "Campaign Update Successfully"
            );
            setError(CampaignForm);
            handelOnCancel();
            dispatch(getSingleLead(singleCampaignData?.campaigns?.[0]?.id));
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
          <div className="grid gap-10 mb-8 md:grid-cols-2">
            {updateCampaignForm?.map((item: any) => {          // updateCampaignForm
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
                    value={campaignData?.[item?.name]}
                    onChange={handelOnChange}
                    handelOnStatus={handelOnStatus}
                    alphaBatically={item?.alphaBatically}
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
                        campaignData?.[item?.name]
                          ? (item?.name === "campaignOwner" ? campaignOwner : item?.data)?.filter(
                            (i: any) => i?.value === campaignData?.[item?.name]
                          )?.[0]?.lable
                          : ""
                      }
                      onChange={handelOnChange}
                      handelOnStatus={handelOnStatus}
                    />
                  ) : (
                    <SingleSelece
                      onChange={handelOnChange}
                      value={campaignData?.[item?.name]}
                      error={error?.[item?.name]}
                      name={item?.name}
                      lableValue={item?.lableValue}
                      data={item?.name === "campaignOwner" ? campaignOwner : item?.data}
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
                          ? campaignData?.courseId
                            ? campaignData?.courseId
                              ?.map((item: any) => {
                                return item?.lable;
                              })
                              ?.join(",")
                            : ""
                          : typeof campaignData?.[item?.name] === "object" &&
                          campaignData?.[item?.name]?.length > 0 &&
                          campaignData?.[item?.name]
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
                          ? campaignData?.[item?.name]
                          : campaignData?.[item?.name]?.[0]?.lable
                            ? typeof campaignData?.[item?.name] === "object" &&
                            campaignData?.[item?.name]?.length > 0 &&
                            campaignData?.[item?.name]
                            : typeof campaignData?.[item?.name] === "object" &&
                            FilterLableAndValue(campaignData?.[item?.name])
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
              value={campaignData?.description}
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

export default CampaignDetail;

