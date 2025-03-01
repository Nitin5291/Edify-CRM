"use client";
import React, { useEffect, useState } from "react";
import CustomInput from "../component/CustomInput";
import SingleSelece from "../component/SingleSelece";
import { CommonInterFace, HostItem } from "../component/Type";
import CustomModel from "../component/CustomModel";
import Contact from "../../assets/employee_contact.svg";
import { toast } from "react-toastify";
import { createCampaignForm } from "@/CommonData";
import { addLeadData } from "@/lib/features/lead/leadSlice";
import { useAppDispatch, useAppSelector } from "../../lib/store";
import { getUserID } from "@/assets/utils/auth.util";
import MultiSelectDropdown from "../component/MultiSelectDropdown";
import { createCampaign } from "@/lib/features/campaign/campaignSlice";
import { getUser } from "@/lib/features/auth/authSlice";

const CreateCampaign = ({
  handelOnContactModel,
  handelOnSave,
}: {
  handelOnSave: () => void;
  handelOnContactModel: () => void;
}) => {
  const [campaign, setCampaign] = useState<CommonInterFace>({});
  const [error, setError] = useState<CommonInterFace>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const { allUser } = useAppSelector((state) => state?.auth);
  const campaignOwner: HostItem[] = allUser?.users?.filter((item: any) => { return item?.user_metadata?.userRole === "admin" })?.map((item: any) => {
    return { lable: item?.user_metadata?.name, value: item?.id };
  });

  useEffect(() => {
    handelOnStaticData();
    dispatch(getUser());
  }, []);

  const handelOnChang = (e: any, name1?: any) => {
    if (name1) {
      setCampaign({ ...campaign, [`${name1}`]: e });
      setError({ ...error, [`${name1}`]: "" });
    } else {
      const { name, value } = e.target;
      setCampaign({ ...campaign, [`${name}`]: value });
      setError({ ...error, [`${name}`]: "" });
    }
  };

  const vaidation = () => {
    let formValid = true;
    const regex = /^[\w-]+(\.[\w-]+)*@([a-z\d]+(-[a-z\d]+)*\.)+[a-z]{2,}$/i;
    const newError: any = {};

    // if (!campaign?.email?.trim()) {
    //   formValid = false;
    //   newError["email"] = "Please enter email";
    // } else if (!regex.test(campaign?.email)) {
    //   formValid = false;
    //   newError["email"] = "Please enter a valid email address";
    // }
    if (!campaign?.campaignOwner?.trim()) {
      formValid = false;
      newError["campaignOwner"] = "Please select campaign Owner";
    }
    if (!campaign?.type?.trim()) {
      formValid = false;
      newError["type"] = "Please select type";
    }
    // if (!campaign?.status?.trim()) {
    //   formValid = false;
    //   newError["status"] = "Please enter campaign status";
    // }
    // if (!campaign?.type?.trim()) {
    //   formValid = false;
    //   newError["type"] = "Please enter campaign type";
    // }
    // if (!campaign?.campaignDate?.trim()) {
    //   formValid = false;
    //   newError["campaignDate"] = "Please enter campaign start date";
    // }
    // if (!campaign?.endDate?.trim()) {
    //   formValid = false;
    //   newError["endDate"] = "Please enter campaign end date";
    // }


    setError(newError);
    return formValid;
  };

  const handelOnSubmit = () => {
    if (vaidation()) {
      setIsLoading(true);
      const data = {
        campaignOwner: campaign?.campaignOwner ? campaign?.campaignOwner : null,
        name: campaign?.name ? campaign?.name : null,
        status: campaign?.status ? campaign?.status : "Upcoming",
        type: campaign?.type ? campaign?.type : null,
        campaignDate: campaign?.campaignDate ? campaign?.campaignDate : null,
        endDate: campaign?.endDate ? campaign?.endDate : null,
        active: campaign?.active ? campaign?.active : null,
        description: campaign?.description ? campaign?.description : null,
        userId: getUserID()
      };
      dispatch(createCampaign(data))
        .unwrap()
        .then((res: any) => {
          if (res?.status === 201) {
            toast.success(
              res?.data?.message
                ? res?.data?.message
                : "Campaign Created Successfully"
            );
            setCampaign({});
            setError({});
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
    setCampaign({});
  };

  const handelOnCancel = () => {
    setError({});
    handelOnContactModel();
    handelOnStaticData();
  };

  return (
    <>
      <CustomModel
        headerImg={Contact}
        lable="Create Campaign"
        onCancel={handelOnCancel}
        onSave={handelOnSubmit}
        isLoading={isLoading}
      >
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          {createCampaignForm?.map((item: any) => {
            return item?.type === "input" ? (
              <CustomInput
                onChange={handelOnChang}
                lableValue={item?.lableValue}
                value={campaign[item?.name]}
                error={error[item?.name]}
                name={item?.name}
                mandatory={item?.mandatory}
                placeholder={item?.placeholder}
                typeValue={item?.typeValue}
                alphaBatically={item?.alphaBatically}
              />
            ) : item?.type === "select" ? (
              <SingleSelece
                onChange={handelOnChang}
                value={campaign?.[item?.name]}
                name={item?.name}
                error={error[item?.name]}
                mandatory={item?.mandatory}
                lableValue={item?.lableValue}
                data={item?.name === "campaignOwner" ? campaignOwner : item?.data}
              />
            ) : item?.type === "multiSelect" ? (
              <MultiSelectDropdown
                onChange={(e) => handelOnChang(e, item?.name)}
                error={error[item?.name]}
                mandatory={item?.mandatory}
                value={campaign?.[item?.name]}
                name={item?.name}
                lableValue={item?.lableValue}
                data={item?.data}
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
            value={campaign?.description}
            onChange={handelOnChang}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          // placeholder="Enter your text here..."
          />
        </div>
      </CustomModel>
    </>
  );
};

export default CreateCampaign;
