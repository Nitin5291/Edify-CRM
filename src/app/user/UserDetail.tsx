"use client";
import React, { useEffect, useState } from "react";
import {
  TrainerForm,
  LeadeData,
  UserData,
  CommonInterFace,
} from "@/app/component/Type";
import JointBtn from "@/app/component/JointBtn";
import InputEdit from "../component/InputEdit";
import SingleSelece from "../component/SingleSelece";
import { UpdateUserFrom, FilterLableAndValue } from "@/CommonData";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import MultiSelectDropdown from "../component/MultiSelectDropdown";
import { updateMainTask } from "@/lib/features/mainTask/mainTaskSlice";
import { updateUser } from "@/lib/features/auth/authSlice";

const UserDetail = ({
  handelOnSet, user
}: {
  handelOnSet: (id: number, data: LeadeData[]) => void; user: any
}) => {
  user = user?.[0]
  const dispatch = useAppDispatch();
  const [disableData, setDisableData] = useState<CommonInterFace>(UserData);
  const [userData, setUserData] = useState<CommonInterFace>(TrainerForm);
  const [error, setError] = useState<CommonInterFace>(TrainerForm);
  const [changeUserData, setChangeUserData] = useState<CommonInterFace>(TrainerForm);
  const [changeStatus, setChangeStatus] = useState<Boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handelOnStatus = (name: String, value: Boolean) => {
    setDisableData((prevData) => ({ ...prevData, [`${name}`]: value }));
  };

  const handelOnChange = (e: any, name1?: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [`${name}`]: value });
    setError({ ...error, [`${name}`]: "" });
  };
  useEffect(() => {
    if (user) {
      handelonClear();
    }
  }, [user]);

  useEffect(() => {
    if (userData) {
      const value =
        JSON.stringify(changeUserData) === JSON.stringify(userData);
      setChangeStatus(value);
    }
  }, [userData]);

  const handelOnCancel = () => {
    setDisableData(UserData);
    setUserData(userData);
    setError(TrainerForm);
    handelOnSet(-1, []);
  };

  const handelonClear = () => {
    setUserData(user);
    setChangeUserData(user);

  };

  const vaidation = () => {
    let formValid = true;
    const regex = /^[\w-]+(\.[\w-]+)*@([a-z\d]+(-[a-z\d]+)*\.)+[a-z]{2,}$/i;
    const newError: any = {};

    if (!userData?.email?.trim()) {
      formValid = false;
      newError["email"] = "Please enter email";
    } else if (!regex.test(userData?.email)) {
      formValid = false;
      newError["email"] = "Please enter a valid email address";
    }
    if (!userData?.mobile?.trim()) {
      formValid = false;
      newError["mobile"] = "Please enter mobile number";
    } else if (!(userData?.mobile?.length === 10)) {
      formValid = false;
      newError["mobile"] = "Please enter valid mobile number";
    }
    if (!userData?.name?.trim()) {
      formValid = false;
      newError["name"] = "Please enter name";
    }
    if (!userData?.empCode?.trim()) {
      formValid = false;
      newError["empCode"] = "Please enter employee code";
    }
    if (!userData?.username?.trim()) {
      formValid = false;
      newError["username"] = "Please enter user name";
    }
    if (!userData?.role?.trim()) {
      formValid = false;
      newError["role"] = "Please select role";
    }


    setError(newError);
    return formValid;
  };

  const handelOnSave = () => {
    if (vaidation()) {
      setIsLoading(true);
      const formData = new FormData();

      const data = {
        name: userData?.name,
        mobile: userData?.mobile,
        empCode: userData?.empCode,
        email: userData?.email,
        username: userData?.username,
        password: userData?.password,
        role: userData?.role,
        teleCMIAgentId: userData?.teleCMIAgentId,
        teleCMIPassword: userData?.teleCMIPassword,
      }

      dispatch(updateUser({ id: user?.id, data: data }))
        .unwrap()
        .then((res: any) => {
          if (res) {
            toast.success(
              res?.message ? res?.message : "User Update Successfully"
            );
            setError({});
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
            User Information
          </h3>
          <div className="grid gap-10 mb-8 md:grid-cols-2">
            {UpdateUserFrom?.map((item: any) => {
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
                    value={userData?.[item?.name]}
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
                        userData?.[item?.name]
                          ? item?.data?.filter(
                            (i: any) => i?.value === userData?.[item?.name]
                          )?.[0]?.lable
                          : ""
                      }
                      onChange={handelOnChange}
                      handelOnStatus={handelOnStatus}
                    />
                  ) : (
                    <SingleSelece
                      onChange={handelOnChange}
                      value={userData?.[item?.name]}
                      error={error?.[item?.name]}
                      name={item?.name}
                      lableValue={item?.lableValue}
                      data={item?.data}
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
                          ? userData?.courseId
                            ? userData?.courseId
                              ?.map((item: any) => {
                                return item?.lable;
                              })
                              ?.join(",")
                            : ""
                          : typeof userData?.[item?.name] === "object" &&
                          userData?.[item?.name]?.length > 0 &&
                          userData?.[item?.name]
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
                          ? userData?.[item?.name]
                          : userData?.[item?.name]?.[0]?.lable
                            ? typeof userData?.[item?.name] === "object" &&
                            userData?.[item?.name]?.length > 0 &&
                            userData?.[item?.name]
                            : typeof userData?.[item?.name] === "object" &&
                            FilterLableAndValue(userData?.[item?.name])
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

export default UserDetail;

