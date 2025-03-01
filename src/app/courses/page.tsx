"use client";
import React, { useState } from "react";
import { OpportunitiyData } from "../component/Type";
import CoursesPage from "./CoursesPage";
import EditCourses from "./EditCourses";
import { useAppDispatch } from "@/lib/store";
import { getCoursesID } from "@/lib/features/courses/coursesSlice";

const Page = () => {
  const [courses, setCourses] = useState<OpportunitiyData[] | null>(null);
  const [id, setID] = useState<number>(-1);
  const dispatch = useAppDispatch()

  const handelOnSet = (id: number, data: any) => {
    setID(id);
    setCourses(data);
    if (id !== -1) {
      dispatch(getCoursesID(id));
    }
  };

  return (
    <>
      {id === -1 ? (
        <CoursesPage handelOnSet={handelOnSet} />
      ) : (
        <EditCourses handelOnSet={handelOnSet} courses={courses} />
      )}
    </>
  );
};

export default Page;
