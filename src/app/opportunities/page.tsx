'use client'
import React, { useEffect, useState } from 'react';
import { LeadeData } from '../component/Type';
import { useAppDispatch } from '@/lib/store';
import { getUser } from '@/lib/features/auth/authSlice';
import OpportunitiesPage from './OpportunitiesPage';
import EditOpportunitiet from './EditOpportunitiet';
import Calendar from './calendar/Calendar';
import { useRouter, useSearchParams } from 'next/navigation';

const Page = () => {
    const [opportunity, setOpportunity] = useState<LeadeData[] | null>(null);
    const [id, setID] = useState<number>(-1);
    const [pagination, setPagination] = useState<number>(0);
    const [activeFilter, setActiveFilter] = useState<string>('all')
    const [calendar, setCalendar] = useState<boolean>(false);
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryID = searchParams.get('ids');

    useEffect(() => {
        if (!queryID) {
            setID(-1)
        }
    }, [queryID]);

    useEffect(() => {
        router.push('/opportunities')
    }, [])


    const handelOnSet = (id: number, data: LeadeData[]) => {
        setID(id);
        setOpportunity(data);
        if (id !== -1) {
            dispatch(getUser('salesperson'))
            router.push('/opportunities?ids=1')
        }
        if (id === -1) {
            router.push('/opportunities')
        }
    };


    return (
        <>
            {calendar ?
                <Calendar setCalendar={setCalendar} /> : id === -1 ? (
                    <OpportunitiesPage handelOnSet={handelOnSet} pagination={pagination} activeFilter={activeFilter} setActiveFilter={setActiveFilter} setPagination={setPagination} calendar={calendar} setCalendar={setCalendar} />
                ) : (
                    <EditOpportunitiet handelOnSet={handelOnSet} opportunity={opportunity} />
                )}
        </>
    );
};

export default Page;
