import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import Image from "next/image";
import {
  CoursesData,
  CoursesDataStatus,
  CoursesDataStatusView,
  CoursesDataView,
} from "../component/Type";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import Person from "../../assets/person_logo.svg";
import JointBtn from "../component/JointBtn";
import { toast } from "react-toastify";
import {
  updateCoursesData,
} from "@/lib/features/courses/coursesSlice";
import InputEdit from "../component/InputEdit";

const CourseDetail = ({
  handelOnSet,
}: {
  handelOnSet: (id: number, data: any) => void;
}) => {
  const [learner, setLearner] = useState<CoursesData>(CoursesDataView);
  const [learnerChange, setLearnerChange] =
    useState<CoursesData>(CoursesDataView);
  const [error, setError] = useState<CoursesData>(CoursesDataView);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disableData, setDisableData] =
    useState<CoursesDataStatusView>(CoursesDataStatus);
  const [changeStatus, setChangeStatus] = useState<Boolean>(true);
  const dispatch = useAppDispatch();
  const { SingleCourses } = useAppSelector((state) => state?.courses);

  useEffect(() => {
    if (SingleCourses?.course) {
      setLearner(SingleCourses?.course);
      setLearnerChange(SingleCourses?.course);
    }
  }, [SingleCourses?.course]);
  useEffect(() => {
    if (learner) {
      const value = JSON.stringify(learnerChange) === JSON.stringify(learner);
      setChangeStatus(value);
    }
  }, [learner]);

  const handelOnChange = (e: {
    target: { name: any; value: any; files: any };
  }) => {
    const { name, value, files } = e.target;
    if (name === "courseImage" || name === "courseBrochure") {
      setLearner({ ...learner, [`${name}`]: files?.[0] });
    } else {
      setLearner({ ...learner, [`${name}`]: value });
    }
    setError({ ...error, [`${name}`]: "" });
  };

  const vaidation = () => {
    let formValid = true;
    const newError: any = {};

    if (!learner?.name?.trim()) {
      formValid = false;
      newError["name"] = "Please enter course name";
    }
    if (!learner?.fee?.toString()?.trim()) {
      formValid = false;
      newError["fee"] = "Please enter course fee";
    }
    //if (!learner?.description?.trim()) {
    //    formValid = false
    //    newError["description"] = "Please enter description"
    //}
    //
    //if (!learner?.courseBrochure) {
    //    formValid = false
    //    newError["courseBrochure"] = "Please select course brochure"
    //}
    //if (!learner?.courseImage) {
    //    formValid = false
    //    newError["courseImage"] = "Please select course image"
    //}

    setError(newError);
    return formValid;
  };

  const handelOnSubmit = () => {
    if (vaidation()) {
      //setIsLoading(true);
      const formData = new FormData();

      formData.append("name", learner?.name);
      formData.append("description", learner?.description);
      formData.append("fee", learner?.fee);
      learner?.courseImage &&
        formData.append("courseImage", learner?.courseImage);
      learner?.courseBrochure &&
        formData.append("courseBrochure", learner?.courseBrochure);

      dispatch(
        updateCoursesData({ id: SingleCourses?.course?.id, body: formData })
      )
        .unwrap()
        .then((res: any) => {
          if (res?.data) {
            toast.success(
              res?.message ? res?.message : "Course Updated Successfully"
            );
            setLearner(CoursesDataView);
            setError(CoursesDataView);
            handelOnSet(-1, []);
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
    setError(CoursesDataView);
    setLearner(SingleCourses?.course);
    setLearnerChange(SingleCourses?.course);
    // handelOnSet(-1, []);
  };

  const handelOnStatus = (name: String, value: Boolean) => {
    setDisableData({ ...CoursesDataStatus, [`${name}`]: value });
  };

  return (
    <div className="p-4 px-8">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Course Image</h3>
        <div>
          <div className="flex gap-4">
            <Image
              src={
                learner?.courseImage instanceof File
                  ? URL.createObjectURL(learner?.courseImage)
                  : Person
              }
              width={80}
              height={80}
              alt="Person"
              className="rounded-full"
            />
            <div className="flex items-end gap-4">
              <label htmlFor="dropzone-file">
                <div className="flex gap-0.5 cursor-pointer">
                  <BiEditAlt className="mb-0.5" />
                  <span className="text-sm">Edit</span>
                </div>
                <input
                  id="dropzone-file"
                  name="courseImage"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handelOnChange}
                />
              </label>
              {error?.courseImage && (
                <span className="text-red-500 text-sm mt-1">
                  {error?.courseImage}
                </span>
              )}
            </div>
          </div>
        </div>
        <h2 className="text-lg font-medium">Course Information</h2>
      </div>
      <div className="grid gap-6 my-8 md:grid-cols-2">
        <InputEdit
          lable="Course Name"
          disable={disableData?.name}
          name="name"
          error={error?.name}
          type="text"
          value={learner?.name}
          onChange={handelOnChange}
          handelOnStatus={handelOnStatus}
        />
        <InputEdit
          lable="Course Fee"
          disable={disableData?.fee}
          name="fee"
          error={error?.fee}
          type="text"
          value={learner?.fee}
          onChange={handelOnChange}
          handelOnStatus={handelOnStatus}
        />
        <InputEdit
          lable="Description"
          disable={disableData?.description}
          name="description"
          error={error?.description}
          type="text"
          value={learner?.description}
          onChange={handelOnChange}
          handelOnStatus={handelOnStatus}
        />
        <InputEdit
          lable="Course Brochure"
          disable={disableData?.courseBrochure}
          name="courseBrochure"
          error={error?.courseBrochure}
          type="file"
          value={
            learner?.courseBrochure?.name ? learner?.courseBrochure?.name : learner?.courseBrochure
          }
          onChange={handelOnChange}
          handelOnStatus={handelOnStatus}
        />
      </div>
      <div className="flex items-center gap-2 justify-center py-5 pt-5 pb-2.5 border-t border-gray-200 rounded-b">
        {!changeStatus && (
          <JointBtn
            button1="Cancel"
            button2={"Update"}
            onClick1={handelOnCancel}
            onClick2={handelOnSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
