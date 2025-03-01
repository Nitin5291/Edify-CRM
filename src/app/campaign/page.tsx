'use client'
import React, { useEffect, useState } from 'react';
import { CommonInterFace } from '../component/Type';
import EditCampaign from './EditCampaign';
import CampaignPage from './CampaignPage';
import Calendar from './calendar/Calendar';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUser } from '@/lib/features/auth/authSlice';
import { useAppDispatch } from '@/lib/store';

const Page = () => {
    const [campaign, setCampaign] = useState<CommonInterFace[] | null>(null);
    const [id, setID] = useState<number>(-1);
    const [pagination, setPagination] = useState<number>(0);
    const [activeFilter, setActiveFilter] = useState<string>('all')
    const [calendar, setCalendar] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const queryID = searchParams.get('ids');

    useEffect(() => {
        if (!queryID) {
            setID(-1)
        }
    }, [queryID]);

    useEffect(() => {
        router.push('/campaign')
    }, [])

    const handelOnSet = (id: number, data: CommonInterFace[]) => {
        setID(id);
        setCampaign(data);
        if (id !== -1) {
            dispatch(getUser());
            router.push('/campaign?ids=1')
        }
        if (id === -1) {
            router.push('/campaign')
        }
    };

    return (
        <>
            {calendar ?
                <Calendar setCalendar={setCalendar} /> :
                id === -1 ? (
                    <CampaignPage handelOnSet={handelOnSet} pagination={pagination} activeFilter={activeFilter} setActiveFilter={setActiveFilter} setPagination={setPagination} calendar={calendar} setCalendar={setCalendar} />
                ) : (
                    <EditCampaign handelOnSet={handelOnSet} campaign={campaign} />
                )}
        </>
    );
};

export default Page;
