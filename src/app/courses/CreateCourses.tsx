'use client'
import React, { useState } from 'react'
import CustomInput from '../component/CustomInput'
import { CoursesDataView, CoursesData, HostItem } from '../component/Type'
import CustomModel from '../component/CustomModel'
import Contact from "../../assets/employee_contact.svg"
import Person from "../../assets/person_logo.svg"
import { toast } from 'react-toastify'
import { useAppDispatch } from '../../lib/store';
import Image from 'next/image'
import { BiEditAlt } from 'react-icons/bi'
import { addCoursesData } from '@/lib/features/courses/coursesSlice'

const CreateLearner = ({ handelOnCoursesModel, handelOnSave }: { handelOnSave: () => void, handelOnCoursesModel: () => void }) => {
    const [learner, setLearner] = useState<CoursesData>(CoursesDataView)
    const [error, setError] = useState<CoursesData>(CoursesDataView)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch()

    const handelOnChang = (e: { target: { name: any; value: any; files: any; } }) => {
        const { name, value, files } = e.target
        if (name === 'courseImage' || name === 'courseBrochure') {
            setLearner({ ...learner, [`${name}`]: files?.[0] })
        } else {
            setLearner({ ...learner, [`${name}`]: value })
        }
        setError({ ...error, [`${name}`]: '' })
    }

    const vaidation = () => {
        let formValid = true;
        const newError: any = {};


        if (!learner?.name?.trim()) {
            formValid = false
            newError["name"] = "Please enter course name"
        }
        if (!learner?.fee?.trim()) {
            formValid = false
            newError["fee"] = "Please enter course fee"
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

            formData.append('name', learner?.name)
            formData.append('description', learner?.description)
            formData.append('fee', learner?.fee)
            formData.append('courseImage', learner?.courseImage)
            formData.append('courseBrochure', learner?.courseBrochure)

            dispatch(addCoursesData(formData)).unwrap()
                .then((res: any) => {
                    if (res?.data) {
                        toast.success(res?.message ? res?.message : "Courses Created Successfully");
                        setLearner(CoursesDataView)
                        setError(CoursesDataView)
                        handelOnSave()
                    }
                })
                .catch((err) => {
                    const error = JSON.parse(err?.message)
                    toast.error(error?.message ? error?.message : "Something went wrong");
                }).finally(() => {
                    setIsLoading(false);
                });

        }
    }

    const handelOnCancel = () => {
        setError(CoursesDataView);
        handelOnCoursesModel();
    }

    return (
        <>
            <CustomModel headerImg={Contact} lable="Create Course" onCancel={handelOnCancel} onSave={handelOnSubmit} isLoading={isLoading}>
                <div className="grid gap-4">
                    <h3 className="text-lg font-medium">Course Image</h3>
                    <div>
                        <div className='flex gap-4'>
                            <Image src={learner?.courseImage instanceof File ? URL.createObjectURL(learner?.courseImage) : Person} width={80} height={80} alt='Person' className='rounded-full' />
                            <div className='flex items-end gap-4'>
                                <label htmlFor="dropzone-file">
                                    <div className='flex gap-0.5 cursor-pointer'>
                                        <BiEditAlt className='mb-0.5' />
                                        <span className='text-sm'>Edit</span>
                                    </div>
                                    <input id="dropzone-file" name='courseImage' type="file" className="hidden" accept="image/*" onChange={handelOnChang} />
                                </label>
                                {error?.courseImage && <span className="text-red-500 text-sm mt-1">{error?.courseImage}</span>}
                            </div>
                        </div>
                    </div>
                    <h2 className='text-lg font-medium'>Course Information</h2>
                </div>
                <div className="grid gap-6 my-8 md:grid-cols-2">
                    <CustomInput onChange={handelOnChang} lableValue="Course Name" value={learner?.name} error={error?.name} name="name" placeholder="Course Name" typeValue="text" />
                    <CustomInput onChange={handelOnChang} lableValue="Course Fee" value={learner?.fee} error={error?.fee} name="fee" placeholder="Course Fee" typeValue="text" />
                    <CustomInput onChange={handelOnChang} lableValue="Description" value={learner?.description} error={error?.description} name="description" placeholder="Description" typeValue="text" />
                    <CustomInput onChange={handelOnChang} lableValue="Course Brochure" value={learner?.courseBrochure?.name} error={error?.courseBrochure} name="courseBrochure" placeholder="Course Brochure" typeValue="file" />
                </div>
            </CustomModel>
        </>
    )
}

export default CreateLearner