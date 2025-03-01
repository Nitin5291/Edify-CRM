"use client";
import React, { useEffect, useState } from 'react';
import Calendar from '@fullcalendar/react'; // Use default import
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { getCalendar, selectCalendar } from '@/lib/features/calender/calenderSlice';
import { toast } from 'react-toastify';
import { callsConnect, getLeadData } from '@/lib/features/lead/leadSlice';
import { FaPhoneAlt } from 'react-icons/fa';
import { getAgentId } from '@/assets/utils/auth.util';
import CalendarModel from './CalendarModel';
import { adjustTime } from '@/CommonData';


const CalendarComponent: React.FC = () => {
    const dispatch = useAppDispatch()
    const [modelOpen, setModelOpen] = useState<unknown[]>([])
    const handleDateClick = (arg: any) => {
        alert('date click! ' + arg.dateStr);
    };
    const calendar = useAppSelector(selectCalendar);
    const { LeadData } = useAppSelector((state) => state?.lead);
    const getUniqueEventIds = (clickInfo: any) => {
        const clickedDate = clickInfo.event._def.extendedProps.date?.split('T')[0];

        if (!clickedDate) {
            return [];
        }

        // Use a Set to ensure unique IDs
        const uniqueIds = new Set(
            LeadData?.leads.filter((item: any) => item.nextFollowUp?.split('T')[0] === clickedDate)
                .map((item: any) => item.id)
        );

        return Array.from(uniqueIds); // Convert Set back to Array
    }

    const handleEventClick = (clickInfo: any) => {
        // setModelOpen(getUniqueEventIds(clickInfo))
        // alert('Event: ' + clickInfo.event.title);
    };
    const handleEvent = (clickInfo: any) => {
        setModelOpen(getUniqueEventIds(clickInfo))
        // alert('Event: ' + clickInfo.event.title);
    };

    const data = LeadData?.leads?.length > 0 ? LeadData?.leads?.map((item: { name: string; phone: any; nextFollowUp: any; id: any; }) => {
        return {
            title: item?.name, start: adjustTime(item?.nextFollowUp), phone: item?.phone, id: item?.id, end: null, extendedProps: { date: adjustTime(item?.nextFollowUp) }
        }
    }) : []

    useEffect(() => {
        dispatch(getLeadData("opportunity"));
    }, [])


    const handelOnCall = (phone: string) => {
        const data = {
            agentId: getAgentId(),
            to: phone,
        };
        dispatch(callsConnect(data))
            .unwrap()
            .then((res: any) => {
                if (res?.status === 200) {
                    dispatch(getCalendar())
                    toast.success(res?.data?.message);
                }
            })
            .catch((err: any) => {
                const error = JSON.parse(err?.message);
                toast.error(error?.message ? error?.message : "Something went wrong");
            });
    };

    const renderEventContent = (eventInfo: any) => {
        console.log("🚀 ~ renderEventContent ~ eventInfo:", eventInfo)
        return (
            <div className='flex gap-2 mx-1'>
                <FaPhoneAlt size={17} className="inline cursor-pointer text-blue-500" onClick={() => handelOnCall(eventInfo?.event?._def?.phone)} />
                <b onClick={() => handleEvent(eventInfo)}>{eventInfo.event.title}</b>
            </div>
        );
    };

    return (
        <div className='h-[82vh]'>
            <Calendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                // initialView="timeGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                buttonText={{
                    today: 'Today',
                    month: 'Month',
                    week: 'Week',
                    day: 'Day',
                }}
                editable={true}
                selectable={true}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                events={data}
                eventContent={renderEventContent}
                height="82vh"
                // showNonCurrentDates={false}
                fixedWeekCount={false}
            />
            {modelOpen?.length > 0 && < CalendarModel modelOpen={modelOpen} setModelOpen={setModelOpen} />}
        </div>
    );
};

export default CalendarComponent;
