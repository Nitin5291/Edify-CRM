'use client'
import React, { useEffect, useState } from 'react';
import { LeadeData } from '../component/Type';
import LearnerPage from './LearnerPage';
import EditLearner from './EditLearner';
import { useRouter, useSearchParams } from 'next/navigation';

const Page = () => {
    const [learner, setLearner] = useState<LeadeData[] | null>(null);
    const [id, setID] = useState<number>(-1);
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
            router.push('/learner')
        }, [])

    const handelOnSet = (id: number, data: LeadeData[]) => {
        setID(id);
        setLearner(data);
        if (id !== -1) {
            router.push('/learner?ids=1')
        }
        if (id === -1) {
            router.push('/learner')
        }
    };


    return (
        <>
            {id === -1 ? (
                <LearnerPage handelOnSet={handelOnSet} activeFilter={activeFilter} setActiveFilter={setActiveFilter}/>
            ) : (
                <EditLearner handelOnSet={handelOnSet} learner={learner} />
            )}
        </>
    );
};

export default Page;
