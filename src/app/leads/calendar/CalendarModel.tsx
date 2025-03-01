import React, { useEffect, useState } from 'react'
import CustomModel from '../../component/CustomModel'
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { getSingleLead } from '@/lib/features/lead/leadSlice';
import { calendarLead } from '@/CommonData';
import moment from 'moment';
import Loader from '../../component/Loader';

const CalendarModel = ({ modelOpen, setModelOpen }: { setModelOpen: any, modelOpen: any }) => {
    const dispatch = useAppDispatch();
    let { SingleLead, isLoader } = useAppSelector((state) => state?.lead);
    SingleLead = SingleLead?.leads
    console.log("🚀 ~ CalendarModel ~ SingleLead:", SingleLead)
    const [userIndex, setUserIndex] = useState<number>(0)

    const handelOnCancel = () => {
        setModelOpen([])
    }

    useEffect(() => {
        dispatch(getSingleLead(modelOpen?.[userIndex]));
    }, [userIndex])

    const handelOnNext = () => {
        setUserIndex(userIndex + 1)
    }
    const handelOnPreview = () => {
        setUserIndex(userIndex - 1)
    }

    const disablButton1 = userIndex === 0
    const disablButton2 = modelOpen?.length - 1 === userIndex

    return (
        <div>
            <CustomModel disablButton1={disablButton1} close={true} onClose={handelOnCancel} disablButton2={disablButton2} lable="User Details" button1="Preview" button2="Next" onCancel={handelOnPreview} onSave={handelOnNext} >
                {isLoader ?
                    <div className=''>
                        <Loader size={10} />
                    </div>
                    :
                    <>
                        <div className="grid gap-10 mb-6 md:grid-cols-2">
                            {calendarLead?.map((item: any) => {
                                return <h1 className='font-semibold'>{item?.lableValue}: <span className='font-normal text-gray-500 text-sm'>{item?.name === "batchTiming" ? SingleLead?.[item?.name]?.join(", ") : item?.name === "Courses" ? SingleLead?.['courseList'] : item?.name === "nextFollowUp" ? moment(SingleLead?.[item?.name]).format("DD MMM YYYY h:mm A") : SingleLead?.[item?.name] ? SingleLead?.[item?.name] : "-"}</span></h1>
                            })}
                        </div>
                        <h1 className='font-semibold'>Description: <span className='font-normal text-gray-500 text-sm'>{SingleLead?.description ? SingleLead?.description : "-"}</span></h1>
                    </>}
            </CustomModel>
        </div>
    )
}

export default CalendarModel;