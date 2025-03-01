"use client"
import React, { useState } from 'react'
import UserPage from './UserPage'
import { LeadeData } from '../component/Type';
import EditUser from './EditUser';

const page = () => {
    const [user, setUser] = useState<any>(null);
    const [id, setID] = useState<number>(-1);
    const handelOnSet = (id: number, data: LeadeData[]) => {
        setID(id);
        setUser(data)
    }

    return (

        <div> {id === -1 ? <UserPage handelOnSet={handelOnSet} /> : (
            <EditUser handelOnSet={handelOnSet} user={user} />
        )}</div>
    )
}

export default page