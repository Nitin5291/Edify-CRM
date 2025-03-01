"use client";
import React, { useEffect } from 'react';
import Calendar from '@fullcalendar/react'; // Use default import
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { adjustTime } from '@/CommonData';
import { getCampaign } from '@/lib/features/campaign/campaignSlice';


const CalendarComponent: React.FC = () => {
    const dispatch = useAppDispatch()
    const handleDateClick = (arg: any) => {
        alert('date click! ' + arg.dateStr);
    };
    const { campaignData } = useAppSelector((state) => state?.campaign);
    const getUniqueEventIds = (clickInfo: any) => {
        const clickedDate = clickInfo.event._def.extendedProps.date?.split('T')[0];

        if (!clickedDate) {
            return [];
        }

        // Use a Set to ensure unique IDs
        const uniqueIds = new Set(
            campaignData?.campaigns?.filter((item: any) => item.campaignDate?.split('T')[0] === clickedDate)
                .map((item: any) => item.id)
        );

        return Array.from(uniqueIds); // Convert Set back to Array
    }

    const handleEventClick = (clickInfo: any) => {
        // alert('Event: ' + clickInfo.event.title);
    };
    const handleEvent = (clickInfo: any) => {
        // alert('Event: ' + clickInfo.event.title);
    };

    const data = campaignData?.campaigns?.length > 0 ? campaignData?.campaigns?.map((item: { name: string; phone: any; campaignDate: any; endDate: any; id: any; }) => {
        return {
            title: item?.name, start: adjustTime(item?.campaignDate), id: item?.id, end: adjustTime(item?.endDate), extendedProps: { date: adjustTime(item?.campaignDate) }
        }
    }) : []

    useEffect(() => {
        dispatch(getCampaign());
    }, [])



    const renderEventContent = (eventInfo: any) => {
        return (
            <div className='flex gap-2 mx-1 bg-blue-500'>
                <b className='text-white px-2' onClick={() => handleEvent(eventInfo)}>{eventInfo.event.title}</b>
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
        </div>
    );
};

export default CalendarComponent;
