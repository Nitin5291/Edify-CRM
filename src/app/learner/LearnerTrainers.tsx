import { ColDef } from 'ag-grid-community';
import React, { useEffect } from 'react'
import Table from '../component/Table';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { getTrainer } from '@/lib/features/learner/learnerSlice';

const initialColumnDefs: ColDef[] = [
    {
        field: "trainerName",
        headerName: "Trainer Name",
        minWidth: 215,
        maxWidth: 350,
        cellStyle: { textAlign: 'center' },
        headerClass: 'center-header',
    },
    {
        field: "phone",
        headerName: "Phone",
        minWidth: 190,
        maxWidth: 250,
        cellStyle: { textAlign: 'center' },
        headerClass: 'center-header',
    },
    {
        field: "email",
        headerName: "Email",
        minWidth: 190,
        maxWidth: 250,
        cellStyle: { textAlign: 'center' },
        headerClass: 'center-header',
    },
    {
        field: "techStack",
        headerName: "Tech Stack",
        minWidth: 250,
        maxWidth: 350,
        cellStyle: { textAlign: 'center' },
        headerClass: 'center-header',
        cellRenderer: (params: { data: any }) => {
            const data = params.data;
            const getColorClass = () => {
                switch (data?.techStack) {
                    case "App Stack":
                        return "text-white bg-red-500";
                    case "Ai Stack":
                        return "text-white bg-indigo-700";
                    case "Agile Stack":
                        return "text-white bg-green-600";
                    default:
                        return "text-black bg-transparent";
                }
            }
            return (
                <div className="flex justify-center items-center capitalize w-full">
                    <span className={` w-full h-auto flex justify-center flex-wrap mt-1.5 px-4 relative`}>
                        {data?.techStack && <p
                            className={`flex justify-center rounded-full w-48 h-7 items-center mb-1.5 ${getColorClass()}`}
                        >
                            {data?.techStack}
                        </p>}
                    </span>
                </div>
            );
        },
    },

    {
        field: "freeSlots",
        headerName: "Free Slots",
        minWidth: 215,
        maxWidth: 350,
        cellStyle: { textAlign: 'center' },
        headerClass: 'center-header',
    },
    {
        field: "location",
        headerName: "Location",
        minWidth: 215,
        maxWidth: 350,
        cellStyle: { textAlign: 'center' },
        headerClass: 'center-header',
    },
];

const LearnerTrainers = () => {
    const dispatch = useAppDispatch();
    let { learnerBatch, isLoader, trainerData,SingleLearner } = useAppSelector((state) => state?.learner);
      SingleLearner = SingleLearner?.learners

    useEffect(() => {
        // const idData = learnerBatch?.batches?.map((id: any) => id.id)?.join(',')
        // const learner = {
        //     ids: idData
        // }
        // dispatch(getTrainer(learner))
        dispatch(getTrainer(SingleLearner?.id))
    }, [])



    return (
        <Table
            noDataFoundMsg="Trainers data not found"
            isLoader={isLoader}
            initialColumnDefs={initialColumnDefs}
            datas={trainerData?.trainers}
        // datas={[]}
        />
    )
}

export default LearnerTrainers