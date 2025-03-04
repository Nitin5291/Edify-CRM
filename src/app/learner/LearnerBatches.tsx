import { CellClickedEvent, ColDef, SelectionChangedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'
import React, { useRef, useState } from 'react'
import { LeadeData } from '../component/Type';
import Table from '../component/Table';
import moment from 'moment';
import { useAppSelector } from '@/lib/store';

const initialColumnDefs: ColDef[] = [
  {
    // checkboxSelection: true,
    // headerCheckboxSelection: true,
    field: "batchName",
    headerName: "Batch Name",
    minWidth: 215,
    maxWidth: 350,
  },
  {
    field: "trainerName",
    headerName: "Trainer",
    minWidth: 190,
    maxWidth: 250,
    // cellRenderer: (params: { data: any }) => {
    //   const data = params.data;
    //   return (
    //     <div className="flex items-center gap-2 capitalize ">
    //       {data?.trainer?.name
    //         ? data?.trainer?.name
    //         : "-"}
    //     </div>
    //   );
    // },
  },

  {
    field: "batchStatus",
    headerName: "Batch Status",
    minWidth: 250,
    maxWidth: 300,
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      const getColorClass = (courseName: string) => {
        switch (courseName) {
          case "Upcoming":
            return "bg-red-500 text-white";
          case "Ongoing":
            return "bg-green-600 text-white";
          default:
            return "bg-transparent text-black";
        }
      }
      return (
        <div className="flex justify-center items-center capitalize w-full">
          <span className={` w-full h-auto flex justify-center flex-wrap mt-1.5 px-4 relative`}>
            <p
              className={`flex justify-center rounded-full w-48 h-7 items-center mb-1.5 ${getColorClass(
                data.batchStatus
              )}`}
            >
              {data.batchStatus}
            </p>
            {data?.Courses?.length === 0 && (
              <p className=" flex justify-center items-center text-black-100">
                -
              </p>
            )}
          </span>
        </div>
      );
    },
  },
  {
    field: "stage",
    headerName: "Stage",
    minWidth: 250,
    maxWidth: 350,
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      const getColorClass = (courseName: string) => {
        switch (courseName) {
          case "Orange":
            return "bg-orange-500 text-white";
          case "Green":
            return "bg-green-600 text-white";
          default:
            return "bg-transparent text-black";
        }
      }
      return (
        <div className="flex justify-center items-center capitalize w-full">
          <span className={` w-full h-auto flex justify-center flex-wrap mt-1.5 px-4 relative`}>
            <p
              className={`flex justify-center rounded-full w-48 h-7 items-center mb-1.5 ${getColorClass(
                data.stage
              )}`}
            >
              {data.stage}
            </p>
            {data?.Courses?.length === 0 && (
              <p className=" flex justify-center items-center text-black-100">
                -
              </p>
            )}
          </span>
        </div>
      );
    },
  },
  {
    field: "slot",
    headerName: "Slot",
    minWidth: 250,
    maxWidth: 350,
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      const getColorClass = (courseName: string) => {
        switch (courseName) {
          case "Morning":
            return "bg-orange-500 text-white";
          case "Evening":
            return "bg-stone-500 text-white";
          default:
            return "bg-transparent text-black";
        }
      }
      return (
        <div className="flex justify-center items-center capitalize w-full">
          <span className={` w-full h-auto flex justify-center flex-wrap mt-1.5 px-4 relative`}>
            <p
              className={`flex justify-center rounded-full w-48 h-7 items-center mb-1.5 ${getColorClass(
                data.slot
              )}`}
            >
              {data.slot}
            </p>
            {data?.Courses?.length === 0 && (
              <p className=" flex justify-center items-center text-black-100">
                -
              </p>
            )}
          </span>
        </div>
      );
    },
  },
  // {
  //   field: "stack",
  //   headerName: "Stack",
  //   minWidth: 250,
  //   maxWidth: 350,
  //   cellRenderer: (params: { data: any }) => {
  //     const data = params.data;
  //     const getColorClass = () => {
  //       switch (data?.stack) {
  //         case "App Stack":
  //           return "bg-red-500 text-white";
  //         case "Ai Stack":
  //           return "bg-indigo-700 text-white";
  //         case "Agile Stack":
  //           return "bg-green-600 text-white";
  //         default:
  //           return "bg-transparent text-black";
  //       }
  //     }
  //     return (
  //       <div className="flex justify-center items-center capitalize w-full">
  //         <span className={` w-full h-auto flex justify-center flex-wrap mt-1.5 px-4 relative`}>
  //           {data?.stack && <p
  //             className={`flex justify-center rounded-full w-48 h-7 items-center mb-1.5 ${getColorClass()}`}
  //           >
  //             {data?.stack}
  //           </p>}
  //         </span>
  //       </div>
  //     );
  //   },
  // },
  {
    field: "startDate",
    headerName: "Start Date",
    minWidth: 200,
    maxWidth: 220,
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (
        <div className="flex items-center gap-2 capitalize ">
          {data?.startDate
            ? moment(data?.startDate).format("DD-MM-YYYY")
            : "-"}
        </div>
      );
    },
  },
  {
    field: "tentativeEndDate",
    headerName: "Tentative End Date",
    minWidth: 200,
    maxWidth: 220,
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (
        <div className="flex items-center gap-2 capitalize ">
          {data?.tentativeEndDate
            ? moment(data?.tentativeEndDate).format("DD-MM-YYYY")
            : "-"}
        </div>
      );
    },
  },
  {
    field: "timings",
    headerName: "Timings",
    minWidth: 190,
    maxWidth: 250,
  },
  {
    field: "noOfStudents",
    headerName: "No Of Students",
    minWidth: 215,
    maxWidth: 350,
  },
  {
    field: "location",
    headerName: "Location",
    minWidth: 215,
    maxWidth: 350,
  },
];

const LearnerBatches = () => {
  let { learnerBatch, isLoader } = useAppSelector((state) => state?.learner);

  return (
    <Table
      noDataFoundMsg="Batches data not found"
      isLoader={isLoader}
      initialColumnDefs={initialColumnDefs}
      datas={learnerBatch?.batchDetails}
      // datas={[]}
    />
  )
}

export default LearnerBatches