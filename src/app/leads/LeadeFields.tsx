"use client";
import React, { useEffect, useMemo, useState } from "react";
import CustomInput from "../component/CustomInput";
import SingleSelece from "../component/SingleSelece";
import { LeadeDataView, HostItem, CommonInterFace } from "../component/Type";
import CustomModel from "../component/CustomModel";
import Contact from "../../assets/employee_contact.svg";
import { toast } from "react-toastify";
import { createLeadForm, createLeadForm1, createLeadForm2, createLeadForm3 } from "@/CommonData";
import { addAndUpdateKanbanData, addLeadData, getKanban } from "@/lib/features/lead/leadSlice";
import { useAppDispatch, useAppSelector } from "../../lib/store";
import { getUserID } from "@/assets/utils/auth.util";
import { getCourses } from "@/lib/features/courses/coursesSlice";
import MultiSelectDropdown from "../component/MultiSelectDropdown";

const LeadeFields = ({
  habdelOnEdit, editValue
}: {
  editValue?: string
  habdelOnEdit: () => void;
}) => {
  console.log("🚀 ~ editValue:", editValue)
  const [leade, setLeade] = useState<any[]>([]);
  const [leadHeader, setLeadHeader] = useState<CommonInterFace>();
  const [error, setError] = useState<CommonInterFace>(LeadeDataView);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { kanbanAllData } = useAppSelector((state) => state?.lead);


  useEffect(() => {
    dispatch(getKanban())
    // handelOnStaticData();
  }, []);

  // Extract "names" from each item, split them into arrays, and flatten the result
  const kanbanList = kanbanAllData?.data || [];
  const filteredItems = kanbanList?.filter((item: any) => item?.kanbanName === "lead" && item?.id?.toString() === editValue);
  console.log("🚀 ~ filteredItems:", filteredItems)

  const nameArray = useMemo(() => {
    // Filter items where kanbanName is "lead"
    return filteredItems?.[0]?.fieldList?.split(",") || [];
  }, []);

  useEffect(() => {
    handelOnStaticData()
  }, [nameArray, kanbanList])

  const handleOnChange = (e: any) => {
    const { name } = e.target;

    setLeade((prevLeads: string[]) => {
      // Ensure prevLeads is always an array
      const leadsArray = Array.isArray(prevLeads) ? prevLeads : [];

      // Check if the name already exists in the array
      const exists = leadsArray.includes(name);

      if (exists) {
        // If it exists, remove it
        return leadsArray.filter((lead) => lead !== name);
      } else {
        // If it doesn't exist, add it
        return [...leadsArray, name];
      }
    });
  };

  const haderOnChange = (e: any) => {
    const { name, value } = e.target;
    setLeadHeader({ ...leadHeader, [`${name}`]: value });
    setError({ ...error, [`${name}`]: "" });
  };


  const vaidation = () => {
    let formValid = true;
    const regex = /^[\w-]+(\.[\w-]+)*@([a-z\d]+(-[a-z\d]+)*\.)+[a-z]{2,}$/i;
    const newError: any = {};

    // if (!leade?.email?.trim()) {
    //   formValid = false;
    //   newError["email"] = "Please enter email";
    // } else if (!regex.test(leade?.email)) {
    //   formValid = false;
    //   newError["email"] = "Please enter a valid email address";
    // }
    if (!leadHeader?.kanbanHeaders?.trim()) {
      formValid = false;
      newError["kanbanHeaders"] = "Please enter kanban header";
    }
    // if (!leade?.techStack) {
    //   formValid = false;
    //   newError["techStack"] = "Please select tech stack";
    // }
    // if (!leade?.countryCode?.trim()) {
    //   formValid = false;
    //   newError["countryCode"] = "Please enter cc";
    // } else if (leade?.countryCode?.length > 4) {
    //   formValid = false;
    //   newError["countryCode"] = "Please enter maximum 4 digit cc";
    // }
    // if (!leade?.phone?.trim()) {
    //   formValid = false;
    //   newError["phone"] = "Please enter phone number";
    // } else if (!(leade?.phone?.length === 10)) {
    //   formValid = false;
    //   newError["phone"] = "Please enter valid phone number";
    // }

    setError(newError);
    return formValid;
  };

  const handelOnSubmit = () => {
    if (vaidation()) {
      setIsLoading(true);

      const data = filteredItems?.[0]?.id
        ? {
          fieldList: leade?.join(','),
          kanbanName: "lead",
          kanbanHeaders: leadHeader?.kanbanHeaders ? leadHeader?.kanbanHeaders : editValue,
          id: filteredItems?.[0].id
        }
        : {
          fieldList: leade?.join(','),
          kanbanName: "lead",
          kanbanHeaders: leadHeader?.kanbanHeaders,
        };


      dispatch(addAndUpdateKanbanData(data))
        .unwrap()
        .then((res: any) => {
          if (res?.status === 200 || res?.status === 201) {
            toast.success(
              res?.data?.message
                ? res?.data?.message
                : "Kanban Created Successfully"
            );
            dispatch(getKanban())
            setError(LeadeDataView);
            habdelOnEdit();
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
    setLeade(nameArray);
    setLeadHeader({ kanbanHeaders: filteredItems?.[0]?.kanbanHeaders ? filteredItems?.[0]?.kanbanHeaders : "" })
  };

  const handelOnCancel = () => {
    setError(LeadeDataView);
    habdelOnEdit();
    handelOnStaticData();
  };

  return (
    <>
      <CustomModel
        lable={editValue === "0" ? "Create Kanban" : "Edit Kanban"}
        button2={editValue === "0" ? "Create" : "Save"}
        onCancel={handelOnCancel}
        onSave={handelOnSubmit}
        isLoading={isLoading}
        small={true}
      >
        <div className="">
          <CustomInput
            onChange={haderOnChange}
            lableValue="Kanban header"
            value={leadHeader?.kanbanHeaders}
            name="kanbanHeaders"
            error={error["kanbanHeaders"]}
            typeValue={"text"}
            // placeholder={item?.placeholder}
            mandatory={true}
          />
          <div className="grid gap-4 mt-10 mb-8 md:grid-cols-2">
            {createLeadForm1?.map((item: any, index: number) => {
              return <div className="flex items-center">
                <input
                  id={"checked-checkbox" + index}
                  type="checkbox"
                  name={item?.name}
                  checked={leade?.includes(item?.name)} // Controlled component
                  onChange={handleOnChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor={"checked-checkbox" + index}
                  className="ms-2 text-sm font-medium text-gray-900"
                >
                  {item.lableValue}
                </label>
              </div>
            })}
          </div>
        </div>
      </CustomModel>
    </>
  );
};

export default LeadeFields;
