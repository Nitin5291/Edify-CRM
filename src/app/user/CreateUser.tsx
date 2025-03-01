"use client";
import React, { useState } from "react";
import CustomInput from "../component/CustomInput";
import { UserDataView, UserData } from "../component/Type";
import CustomModel from "../component/CustomModel";
import Contact from "../../assets/employee_contact.svg";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../lib/store";
import { CreateUserFrom } from "@/CommonData";
import { createUser, getUser } from "@/lib/features/auth/authSlice";
import SingleSelece from "../component/SingleSelece";

const CreateUser = ({
  handelOnCoursesModel,
}: {
  handelOnCoursesModel: () => void;
}) => {
  const [user, setUser] = useState<UserData>(UserDataView);
  const [error, setError] = useState<UserData>(UserDataView);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handelOnChang = (e: {
    target: { name: any; value: any; files: any };
  }) => {
    const { name, value } = e.target;
    setUser({ ...user, [`${name}`]: value });
    setError({ ...error, [`${name}`]: "" });
  };

  const vaidation = () => {
    let formValid = true;
    const regex = /^[\w-]+(\.[\w-]+)*@([a-z\d]+(-[a-z\d]+)*\.)+[a-z]{2,}$/i;
    const newError: any = {};

    if (!user?.email?.trim()) {
      formValid = false;
      newError["email"] = "Please enter email";
    } else if (!regex.test(user?.email)) {
      formValid = false;
      newError["email"] = "Please enter a valid email address";
    }
    if (!user?.mobile?.trim()) {
      formValid = false;
      newError["mobile"] = "Please enter mobile number";
    } else if (!(user?.mobile?.length === 10)) {
      formValid = false;
      newError["mobile"] = "Please enter valid mobile number";
    }
    if (!user?.name?.trim()) {
      formValid = false;
      newError["name"] = "Please enter name";
    }
    if (!user?.empCode?.trim()) {
      formValid = false;
      newError["empCode"] = "Please enter employee code";
    }
    if (!user?.username?.trim()) {
      formValid = false;
      newError["username"] = "Please enter user name";
    }
    // if (!user?.teleCMIAgentId?.trim()) {
    //   formValid = false;
    //   newError["teleCMIAgentId"] = "Please enter tele CMI Agent Id";
    // }
    // if (!user?.teleCMIPassword?.trim()) {
    //   formValid = false;
    //   newError["teleCMIPassword"] = "Please enter tele CMI Password";
    // }
    if (!user?.role?.trim()) {
      formValid = false;
      newError["role"] = "Please select role";
    }

    setError(newError);
    return formValid;
  };

  const handelOnSubmit = () => {
    if (vaidation()) {
      setIsLoading(true);
      const data = {
        name: user?.name,
        mobile: user?.mobile,
        empCode: user?.empCode,
        email: user?.email,
        username: user?.username,
        password: user?.password,
        role: user?.role,
        teleCMIAgentId: user?.teleCMIAgentId,
        teleCMIPassword: user?.teleCMIPassword,
      };

      dispatch(createUser(data))
        .unwrap()
        .then((res: any) => {
          if (res?.data) {
            toast.success(
              res?.message ? res?.message : "User Created Successfully"
            );
            handelOnCancel();
            dispatch(getUser());
          }
        })
        .catch((err) => {
          const error = JSON.parse(err?.message);
          toast.error(error?.message ? error?.message : "Something went wrong");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handelOnCancel = () => {
    setError(UserDataView);
    setUser(UserDataView);
    handelOnCoursesModel();
  };

  return (
    <>
      <CustomModel
        headerImg={Contact}
        lable="Create User"
        onCancel={handelOnCancel}
        onSave={handelOnSubmit}
        isLoading={isLoading}
      >
        <div className="grid gap-6 my-1 mb-6 md:grid-cols-2">
          {CreateUserFrom?.map((item: any) => {
            return item?.type === "input" ? (
              <CustomInput
                onChange={handelOnChang}
                lableValue={item?.lableValue}
                value={user?.[item?.name]}
                error={error?.[item?.name]}
                name={item?.name}
                placeholder={item?.placeholder}
                typeValue={item?.typeValue}
              />
            ) : item?.type === "select" ? (
              <SingleSelece
                onChange={handelOnChang}
                value={user?.[item?.name]}
                name={item?.name}
                lableValue={item?.lableValue}
                data={item?.data}
                error={error?.[item?.name]}
              />
            ) : null;
          })}
        </div>
      </CustomModel>
    </>
  );
};

export default CreateUser;
