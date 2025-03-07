'use client'
import React, { useEffect, useState } from 'react';
import { LeadeData } from '../component/Type';
import { useAppDispatch } from '@/lib/store';
import { getUser } from '@/lib/features/auth/authSlice';
import EditTask from './EditTask';
import TaskPage from './TaskPage';
import { useRouter, useSearchParams } from 'next/navigation';

const Page = () => {
    const [task, setTask] = useState<LeadeData[] | null>(null);
    const [id, setID] = useState<number>(-1);
    const [pagination, setPagination] = useState<number>(0);
    const [activeFilter, setActiveFilter] = useState<string>('all')
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryID = searchParams.get('ids');

    useEffect(() => {
        if (!queryID) {
            setID(-1)
        }
    }, [queryID]);

    useEffect(() => {
        router.push('/tasks')
    }, [])

    const handelOnSet = (id: number, data: LeadeData[]) => {
        setID(id);
        setTask(data);
        if (id !== -1) {
            // dispatch(getUser('salesperson'))
            router.push('/tasks?ids=1')
        }
        if (id === -1) {
            router.push('/tasks')
        }
    };

    return (
        <>
            {id === -1 ? (
                <TaskPage handelOnSet={handelOnSet} pagination={pagination} activeFilter={activeFilter} setActiveFilter={setActiveFilter} setPagination={setPagination} />
            ) : (
                <EditTask handelOnSet={handelOnSet} task={task} />
            )}
        </>
    );
};

export default Page;
