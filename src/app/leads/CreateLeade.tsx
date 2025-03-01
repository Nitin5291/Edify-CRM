"use client";
import React, { useEffect, useState } from "react";
import CustomInput from "../component/CustomInput";
import SingleSelece from "../component/SingleSelece";
import { LeadeDataView, HostItem, CommonInterFace } from "../component/Type";
import CustomModel from "../component/CustomModel";
import Contact from "../../assets/employee_contact.svg";
import { toast } from "react-toastify";
import { coursesPrice, createLeadForm, createLeadForm2, createLeadForm3, ProgramsPrice } from "@/CommonData";
import { addLeadData } from "@/lib/features/lead/leadSlice";
import { useAppDispatch, useAppSelector } from "../../lib/store";
import { getUserID } from "@/assets/utils/auth.util";
import { getCourses } from "@/lib/features/courses/coursesSlice";
import MultiSelectDropdown from "../component/MultiSelectDropdown";

const CreateLeade = ({
  handelOnContactModel,
  handelOnSave,
}: {
  handelOnSave: () => void;
  handelOnContactModel: () => void;
}) => {
  const [leade, setLeade] = useState<CommonInterFace>({ ...LeadeDataView, countryCode: "91" });
  console.log("🚀 ~ leade:", leade)
  const [error, setError] = useState<CommonInterFace>(LeadeDataView);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { CoursesData } = useAppSelector((state) => state?.courses);

  const Courses: HostItem[] = CoursesData?.courses?.map((item: any) => {
    return { lable: item?.name, value: item?.id };
  });

  useEffect(() => {
    dispatch(getCourses());
    handelOnStaticData();
  }, []);

  const handelOnChang = (e: any, name1?: any) => {
    if (name1) {
      setLeade({ ...leade, [`${name1}`]: e });
      setError({ ...error, [`${name1}`]: "" });
    } else {
      const { name, value } = e.target;
      setLeade({ ...leade, [`${name}`]: value });
      setError({ ...error, [`${name}`]: "" });
    }
  };

  useEffect(() => {
    const handleOnFunction = () => {
      const programData = ProgramsPrice || [];
      const courseData = coursesPrice || [];

      const program = programData.find((item: any) => item?.label === leade?.programs)?.value || 0;
      const course = courseData.find((item: any) => item?.label === leade?.courseList)?.value || 0;

      const value =
        leade?.programs && leade?.courseList
          ? program + course
          : leade?.programs
            ? program
            : leade?.courseList
              ? course
              : 0;


      setLeade((prevData: any) => ({ ...prevData, priceList: value }));
    };

    handleOnFunction();
  }, [leade?.programs, leade?.courseList, ProgramsPrice, coursesPrice]);

  const vaidation = () => {
    let formValid = true;
    const regex = /^[\w-]+(\.[\w-]+)*@([a-z\d]+(-[a-z\d]+)*\.)+[a-z]{2,}$/i;
    const newError: any = {};

    if (!leade?.email?.trim()) {
      formValid = false;
      newError["email"] = "Please enter email";
    } else if (!regex.test(leade?.email)) {
      formValid = false;
      newError["email"] = "Please enter a valid email address";
    }
    if (!leade?.name?.trim()) {
      formValid = false;
      newError["name"] = "Please enter name";
    }
    // if (!leade?.techStack) {
    //   formValid = false;
    //   newError["techStack"] = "Please select tech stack";
    // }
    if (!leade?.countryCode?.trim()) {
      formValid = false;
      newError["countryCode"] = "Please enter cc";
    } else if (leade?.countryCode?.length > 4) {
      formValid = false;
      newError["countryCode"] = "Please enter maximum 4 digit cc";
    }
    if (!leade?.phone?.trim()) {
      formValid = false;
      newError["phone"] = "Please enter phone number";
    } else if (!(leade?.phone?.length === 10)) {
      formValid = false;
      newError["phone"] = "Please enter valid phone number";
    }

    setError(newError);
    return formValid;
  };

  const handelOnSubmit = async () => {
    if (vaidation()) {
      setIsLoading(true);

      const data = {
        name: leade?.name,
        phone: leade?.phone,
        email: leade?.email,
        techStack: leade?.techStack,
        countryCode: leade?.countryCode,
        programs: leade?.programs,
        courseList: leade?.courseList,
        description: leade?.description,
        priceList: leade?.priceList,
        userId: getUserID(),
        leadStage: "lead",
        leadSourceURL: window.location.href
      };

      // const data = {
      //   name: leade?.name,
      //   email: leade?.email,
      //   countryCode: leade?.countryCode,
      //   phone: leade?.phone,
      //   fullNumber: leade?.fullNumber,
      //   alternativePhone: leade?.alternativePhone,
      //   leadOwner: leade?.leadOwner,
      //   courseList: leade?.courseList,
      //   priceList: leade?.priceList,
      //   techStack: leade?.techStack,
      //   courseDetails: leade?.courseDetails,
      //   leadSource: leade?.leadSource,
      //   classMode: leade?.classMode,
      //   feeQuoted: leade?.feeQuoted,
      //   dlLeadScore: leade?.dlLeadScore,
      //   batchtiming: leade?.batchtiming,
      //   expectedWalkinDate: leade?.expectedWalkinDate ? leade?.expectedWalkinDate : null,
      //   visitedDate: leade?.visitedDate ? leade?.visitedDate : null,
      //   expectedRegistrationDate: leade?.expectedRegistrationDate ? leade?.expectedRegistrationDate : null,
      //   counselledBy: leade?.counselledBy,
      //   leadStatus: leade?.leadStatus,
      //   warmStage: leade?.warmStage,
      //   nextFollowUp: leade?.nextFollowUp ? leade?.nextFollowUp : null,
      //   demoAttendedDate: leade?.demoAttendedDate ? leade?.demoAttendedDate : null,
      //   opportunityStage: leade?.opportunityStage,
      //   coldLeadReason: leade?.coldLeadReason,
      //   userId: getUserID(),
      //   leadStage: "lead",
      // }

      dispatch(addLeadData(data))
        .unwrap()
        .then((res: any) => {
          if (res?.status === 201) {
            toast.success(
              res?.data?.message
                ? res?.data?.message
                : "Lead Created Successfully"
            );
            setLeade({ ...LeadeDataView, countryCode: '91' });
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
    setLeade({
      ...leade,
      // [`leadStatus`]: "Not Contacted",
      ["courseId"]:
        Courses?.filter(
          (item) => item?.lable?.toLocaleLowerCase() === "others" || item?.lable?.toLocaleLowerCase() === "other"
        )?.length > 0
          ? Courses?.filter(
            (item) =>
              item?.lable?.toLocaleLowerCase() === "others" || item?.lable?.toLocaleLowerCase() === "other"
          )
          : null,
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
        lable="Create Lead "
        onCancel={handelOnCancel}
        onSave={handelOnSubmit}
        isLoading={isLoading}
      >
        {/* <h2 className="text-lg font-medium text-center mb-3 p-1 rounded-3xl bg-[#6D9EEB] w-full">Learner Model Fields</h2> */}
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          {createLeadForm?.map((item: any) => {
            return item?.type === "input" ? (
              <CustomInput
                onChange={handelOnChang}
                lableValue={item?.lableValue}
                value={leade[item?.name]}
                name={item?.name}
                name1={item?.name1}
                value1={leade[item?.name1]}
                error={error[item?.name] || error[item?.name1]}
                typeValue={item?.typeValue}
                // placeholder={item?.placeholder}
                mandatory={item?.mandatory}
              />
            ) : item?.type === "select" ? (
              <SingleSelece
                onChange={handelOnChang}
                value={leade?.[item?.name]}
                name={item?.name}
                lableValue={item?.lableValue}
                data={item?.data}
                mandatory={item?.mandatory}
                error={error[item?.name]}
              />
            ) : item?.type === "multiSelect" ? (
              <MultiSelectDropdown
                onChange={(e) => handelOnChang(e, item?.name)}
                value={leade?.[item?.name]}
                name={item?.name}
                lableValue={item?.lableValue}
                data={item?.name === "courseId" ? Courses : item?.data}
                mandatory={item?.mandatory}
                error={error[item?.name]}
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
            value={leade?.description}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            onChange={handelOnChang}
            rows={3}
          // placeholder="Enter your text here..."
          />
        </div>
      </CustomModel>
    </>
  );
};

export default CreateLeade;
