'use client'
import React, { useEffect, useState } from 'react';
import New_Task from "../../assets/new_task.svg";
import Image from 'next/image';
import { IoIosArrowDown, IoIosArrowForward, IoIosArrowUp } from 'react-icons/io';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { deleteSingleTaskData, getTaskIdData } from '@/lib/features/task/taskSlice';
import moment from 'moment';
import { toast } from 'react-toastify';
import Loader from '../component/Loader';
import { getActivity } from '@/lib/features/activity/activitySlice';
import Table from '../component/Table';
import { ColDef } from 'ag-grid-community';
import { initialColumnDefsMeeting } from './NewMeeting';
import { initialColumnDefsEmail } from './EmailPage';
import { initialColumnDefsMsg } from './Message';
import { initialColumnDefsWpMsg } from './WhatsApp';
import Email from "../../assets/email.svg";
import New_Meeting from "../../assets/new_meeting.svg";
import Message_Img from "../../assets/message.svg";
import Whatsapp from "../../assets/whatsapp.svg";

const initialColumnDefs: ColDef[] = [
    {
        field: "subject",
        headerName: "Subject",
        minWidth: 215,
        maxWidth: 450,
    },
    {
        field: "dueDate",
        headerName: "Due Date",
        minWidth: 215,
        maxWidth: 450,
        cellRenderer: (params: { data: any }) => {
            const data = params.data;
            return (
                <div className="flex items-center gap-2 capitalize ">
                    {data?.dueDate
                        ? moment.utc(data?.dueDate).format("DD MMM, YYYY, h:mm A")
                        : "-"}
                </div>
            );
        },
    },
    {
        field: "priority",
        headerName: "Priority",
        minWidth: 215,
        maxWidth: 450,
    },
    {
        field: "userId",
        headerName: "Owner",
        minWidth: 210,
        maxWidth: 450,
        cellRenderer: (params: { data: any }) => {
            return (
                <div className="flex items-center gap-2">{params?.data?.user?.name}</div>
            );
        },
    },
];


const ActivityAccordion = ({ name, id }: { name?: string, id?: number }) => {
    const [childId, setChildId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch()
    const { SingleLead } = useAppSelector((state) => state?.lead)
    const { activity, isLoader } = useAppSelector((state) => state?.activity)
    console.log("🚀 ~ ActivityAccordion ~ activity:", activity)


    useEffect(() => {
        if (name && id) {
            const data = name === "leadId" ? { leadId: id } : { [name]: id }
            dispatch(getActivity(data));
        }
    }, [])



    const handleOnChildId = (id: number) => {
        setChildId(childId === id ? null : id);
    }

    // const handelOnDelete = (id: any) => {
    //     setIsLoading(id);
    //     dispatch(deleteSingleTaskData(id)).unwrap().then((res: any) => {
    //         if (res) {
    //             toast.success(res?.data?.message ? res?.data?.message : "Task Deleted Successfully");
    //             dispatch(getTaskIdData(SingleLead?.userId))
    //         }
    //     })
    //         .catch((err: any) => {
    //             const error = JSON.parse(err?.message)
    //             toast.error(error?.message ? error?.message : "Something went wrong");
    //         }).finally(() => {
    //             setIsLoading(false);
    //         });

    // }


    const item: any[] = [{
        id: 1,
        subject: "test",
        dueDate: new Date(),
        priority: "testttt",
        header: "assigned To Pavan",
        des: "Lorem ipsum dolor sit amet consectetur. Accumsan risus ut luctus eleifend varius turpis.",
        lead: {
            name: "111"
        }
    }, {
        id: 1,
        subject: "test",
        dueDate: new Date(),
        priority: "testttt",
        header: "assigned To Pavan",
        des: "Lorem ipsum dolor sit amet consectetur. Accumsan risus ut luctus eleifend varius turpis.",
        lead: {
            name: "111"
        }
    }]

    return (
        <div>
            {/* <h2>
                <button
                    type="button"
                    className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border-b border-b-gray-200"
                >
                    <span className="text-black text-xl font-bold">{'Upcoming & Overdue'}</span>
                    <IoIosArrowUp size={22} />
                </button>
            </h2> */}
            {activity?.data?.length > 0 ?
                <div className='border-b border-gray-200 mt-4'>
                    {activity?.data?.map((data: any, index: number) => {
                        return (
                            <div key={index} className="flex gap-3.5" >
                                {index === childId ? <IoIosArrowDown size={22} className='mt-1.5 cursor-pointer' onClick={() => handleOnChildId(index)} /> : <IoIosArrowForward size={22} className='mt-1.5 cursor-pointer' onClick={() => handleOnChildId(index)} />}

                                {/* <ol className="relative border-s-2 border-dashed border-red-600 w-full"> */}
                                <ol className="relative w-full">
                                    <li className="mb-10 ms-6">
                                        <span className="absolute flex items-center justify-center w-8 h-8 bg-white rounded-full -start-4">
                                            <Image src={data?.activityName === "Message" ? Message_Img : data?.activityName === "Whatsapp" ? Whatsapp : data?.activityName === "Email" ? Email : data?.activityName === "Meeting" ? New_Meeting : New_Task} alt={"Image"} />
                                        </span>
                                        <div className="flex justify-between items-center">
                                            <div className='flex gap-5' onClick={() => handleOnChildId(index)}>
                                                <h3 className="text-sky-600 text-xl font-bold mb-2 cursor-pointer">{data?.activityName}</h3>
                                                <span className='text-base'>{data?.header}</span>
                                            </div>
                                            {isLoading === data?.id ? <Loader /> : < div className="text-base p-1 rounded z-10 cursor-pointer" /* onClick={() => handelOnDelete(data?.id)} */>
                                                {/* <RiDeleteBin6Line size={24} className='text-red-400' /> */}
                                                {moment(data?.createdAt).format("DD MMM, YYYY, h:mm A")}
                                            </div>}
                                        </div>
                                        {/* <span className='text-base'>{data?.des}</span> */}
                                        {index === childId && <div className={`px-2 ${data?.activityName === "Email" ? "h-60" : "h-32"}  sm:px-4 py-4 flex flex-wrap gap-2 sm:gap-4 lg:gap-10`}>
                                            <Table
                                                noDataFoundMsg="Task data no found"
                                                isLoader={isLoader}
                                                initialColumnDefs={data?.activityName === "Message" ? initialColumnDefsMsg : data?.activityName === "Whatsapp" ? initialColumnDefsWpMsg : data?.activityName === "Email" ? initialColumnDefsEmail : data?.activityName === "Meeting" ? initialColumnDefsMeeting : initialColumnDefs}
                                                datas={[data?.data]}
                                                pagination={false}
                                                heightDisable={true}
                                            />
                                            {/* <div className="flex flex-wrap gap-2 sm:gap-4 lg:gap-10">
                                            <p className="text-neutral-800 text-sm sm:text-base font-semibold">Subject: <span className="font-normal">{data?.subject ? data?.subject : '-'}</span></p>
                                            <p className="text-neutral-800 text-sm sm:text-base font-semibold">DueDate: <span className="font-normal">{data?.dueDate ? moment.utc(data?.dueDate).format("DD-MM-YYYY h:mm A") : "-"}</span></p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 sm:gap-4 lg:gap-10">
                                            <p className="text-neutral-800 text-sm sm:text-base font-semibold">Priority: <span className="font-normal">{data?.priority ? data?.priority : "-"}</span></p>
                                            <p className="text-neutral-800 text-sm sm:text-base font-semibold">Owner: <span className="font-normal">{data?.lead?.name ? data?.lead?.name : '-'}</span></p>
                                        </div> */}
                                        </div>}
                                    </li>
                                </ol>
                            </div>
                        )
                    })}
                </div> :
                <div className='h-[50vh] items-center flex justify-center'>
                    <h1>Activity Not Found</h1>
                </div>}
        </div >
    )
}

export default ActivityAccordion;
