'use client'
import * as React from 'react'
import Contact from "../../assets/employee_contact.svg"
import { ColDef } from 'ag-grid-community';
import { useState, useEffect, useMemo } from 'react'
import TableHeader from '../component/TableHeader'
import Loader from '../component/Loader';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { filterId, UserPageView, UserRole } from '@/CommonData';
import { deleteUser, getUser } from '@/lib/features/auth/authSlice';
import Table from '../component/Table';
import moment from 'moment';
import CreateUser from './CreateUser';
import { toast } from 'react-toastify';


const initialColumnDefs: ColDef[] = [
    {
        field: 'createdAt', headerName: "Created on",
        minWidth: 200, maxWidth: 250,
        cellRenderer: (params: { data: any; }) => {
            const data = params.data;
            return (
                <div className='flex items-center gap-2 capitalize'>
                    {data?.createdAt ? moment(data?.createdAt).format("DD MMM, YYYY, h:mm A") : "-"}
                </div>
            );
        },
        checkboxSelection: true,
        headerCheckboxSelection: true
    },
    {
        field: 'username', headerName: "User Name",
        minWidth: 180, maxWidth: 250,
    },
    {
        field: 'empCode', headerName: "Emp Code",
        minWidth: 180, maxWidth: 250,
    },
    {
        field: 'name', headerName: "Name",
        minWidth: 180, maxWidth: 200,
    },
    {
        field: 'email', headerName: "Email",
        minWidth: 200, maxWidth: 350,
    },
    {
        field: 'mobile', headerName: "Mobile",
        minWidth: 180, maxWidth: 200,
    },
    {
        field: 'role', headerName: "Role",
        minWidth: 200, maxWidth: 350,
    },

];

const UserPage = ({ handelOnSet }: { handelOnSet: (id: number, data: any) => void; }) => {
    const dispatch = useAppDispatch()
    const AllUserFilter = [...UserPageView, ...UserRole]
    const [userModel, setUserModel] = useState<Boolean>(false);
    const [selectedCell, setSelectedCell] = useState<any>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [filterData, setFilterData] = useState<any>(AllUserFilter?.[0]?.value);
    const { isLoader, allUser, isdelLoader } = useAppSelector((state) => state?.auth)

    useEffect(() => {
        UserData()
    }, [filterData]);
    const UserData = () => {
        if (filterData !== 'All User') {
            dispatch(getUser(filterData))
        } else {
            dispatch(getUser())
        }
    }

    const handelOnCoursesModel = () => {
        setUserModel(!userModel);
    }

    const handelOnFilter = (data: string) => {
        setFilterData(data)
    }

    const TopHeader = useMemo(() => AllUserFilter?.filter?.((item: any) => item?.value === filterData)?.[0]?.lable, [filterData])

    const handelOnSearch = (e: any) => {
        setSearchValue(e?.target?.value)
    }

    const handelOnDelete = () => {
        dispatch(deleteUser(filterId(selectedCell))).unwrap().then((res: any) => {
            if (res) {
                toast.success(res?.data?.message ? res?.data?.message : "User Deleted Successfully");
                UserData()
            }
        })
            .catch((err: any) => {
                const error = JSON.parse(err?.message)
                toast.error(error?.message ? error?.message : "Something went wrong");
            })

    }


    return (
        <div className="lg:w-full">
            <div className="mx-5 my-2.5 py-2.5 shadow-lg border-2 bg-[#FFF] rounded-lg">
                <TableHeader handelOnSearch={handelOnSearch} searchValue={searchValue} KanbanStatus={false} filterData={filterData} handelOnFilter={handelOnFilter} filterList={AllUserFilter} headerImg={Contact} headerLable={TopHeader} headerBtnLable="Create User" headerBtnOnClick={handelOnCoursesModel} isdelLoader={isdelLoader} handelOnDelete={handelOnDelete} />
                <div className="w-full px-5 gap-6 xl:h-full">
                    <div className={`flex min-h-[68vh] xl:min-h-[70vh] xl:h-full w-${isLoader ? '[fit-content]' : 'full'} mx-auto ag-theme-alpine`}>
                        {
                            isLoader ? ( // Check if contactData is null
                                <Loader size={10} />
                            ) :
                                <div className='relative overflow-auto' style={{ width: "100%" }}>
                                    <Table noDataFoundMsg='Message data no found' isLoader={isLoader} initialColumnDefs={initialColumnDefs} datas={allUser?.users} searchValue={searchValue} setSelectedCell={setSelectedCell} handelOnSet={handelOnSet} />
                                </div>}
                    </div>
                </div>
            </div>
            {
                userModel && <CreateUser handelOnCoursesModel={handelOnCoursesModel} />
            }
        </div>
    )
}

export default UserPage