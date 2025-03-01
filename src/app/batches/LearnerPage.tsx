"use client";
import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import {
  CellClickedEvent,
  ColDef,
  SelectionChangedEvent,
} from "ag-grid-community";
import { useRef, useState, useEffect } from "react";
import { LeadeData } from "../component/Type";
import Loader from "../component/Loader";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import moment from "moment";
import { getCourses } from "@/lib/features/courses/coursesSlice";

const initialColumnDefs: ColDef[] = [
  {
     field: "created_on",
     headerName: "Created Time",
     minWidth: 250,
     maxWidth: 350,
     cellRenderer: (params: { data: any }) => {
       const data = params.data;
       return (
         <div className="flex items-center justify-center gap-2 capitalize ">
           {data?.createdAt
             ? moment(data?.createdAt).format("h:mm A")
             : "-"}
         </div>
       );
     },
   },
   {
     field: "registeredDate",
     headerName: "Registered Date",
     minWidth: 250,
     maxWidth: 350,
     cellRenderer: (params: { data: any }) => {
       const data = params.data;
       return (
         <div className="flex items-center justify-center gap-2 capitalize ">
           {data?.registeredDate
             ? moment(data?.registeredDate).format("DD/MM/YYYY")
             : "-"}
         </div>
       );
     },
   },
   {
     field: "name",
     headerName: "Name",
     minWidth: 300,
     maxWidth: 400,
     cellRenderer: (params: { data: any }) => {
       const data = params.data;
       return (
         <div className="flex items-center justify-center gap-2">
           {data?.name ? data?.name : "-"}
         </div>
       );
     },
   },
   {
     field: "phone",
     headerName: "Phone",
     minWidth: 250,
     maxWidth: 300,
     cellRenderer: (params: { data: any }) => {
       const data = params.data;
       return (
         <div className="flex items-center justify-center gap-2">
           {data?.phone}
           {/* {"+ " + data?.countryCode && data?.countryCode?.replace("+", "") + " " + data?.phone} */}
         </div>
       );
     },
   },
   {
     field: "email",
     headerName: "Email",
     cellStyle: { textAlign: 'center' },
     minWidth: 400,
     maxWidth: 500,
   },
];

const dummyData = [
  {
    batchName: "Az-900 Devops",
    trainer: "K. Pavan",
    batchStatus: "Upcoming",
    stage: "Orange",
    slot: "Morning",
    stack: "Agile Stack",
    startDate: new Date(),
    tentativeEndDate: new Date(),
    timings: "7:00 PM",
    noOfStudents: 30,
    Location: "Hyderabad",
  },
  {
    batchName: "Az-900 Devops",
    trainer: "K. Pavan",
    batchStatus: "Ongoing",
    stage: "Green",
    slot: "Evening",
    stack: "Ai Stack",
    startDate: new Date(),
    tentativeEndDate: new Date(),
    timings: "7:00 PM",
    noOfStudents: 30,
    Location: "Hyderabad",
  },
  {
    batchName: "Az-900 Devops",
    trainer: "K. Pavan",
    batchStatus: "Upcoming",
    stage: "Orange",
    slot: "Morning",
    stack: "App Stack",
    startDate: new Date(),
    tentativeEndDate: new Date(),
    timings: "7:00 PM",
    noOfStudents: 30,
    Location: "Hyderabad",
  }
]

const LearnerPage = () => {
  const dispatch = useAppDispatch();
  const tableRef = useRef<any>(null);
  const { CoursesData } = useAppSelector((state) => state?.courses);
  const [pagination, setPagination] = useState<number>(0);
  const { batchLearner, isLoader } = useAppSelector((state) => state?.batch);
  console.log("🚀 ~ LearnerPage ~ batchLearner:", batchLearner)


  useEffect(() => {
    if (!(CoursesData?.courses?.length > 0)) {
      dispatch(getCourses());
    }
  }, []);

  const onFirstDataRendered = React.useCallback((params: { api: { paginationGoToPage: (arg0: number) => void; }; }) => {
    params.api.paginationGoToPage(pagination);
  }, []);

  const paginationNumberFormatter = React.useCallback((params: {
    api: any; value: { toLocaleString: () => string; };
  }) => {
    setPagination(params.api.paginationProxy.currentPage)
    return params.value.toLocaleString();
  }, []);

  const [columnDefs] = useState<ColDef[]>(initialColumnDefs);

  const defaultColDef = {
    sortable: true,
    flex: 1,
    headerComponentParams: { placeholder: "Enter Member ID" },
    resizable: true,
    suppressMovable: true,
    //cellClass: "uppercase",
    cellStyle: {
      color: "#181818",
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: "400",
      fontFamily: "Inter",
    },
    headerClass: "whitespace-normal",
    wrapText: true,
    autoHeight: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  };

  const handleCellClicked = (param: CellClickedEvent<LeadeData, any>) => {
    if (param?.rowIndex !== null && param?.data !== undefined) {
      // handelOnSet(param?.rowIndex, [param?.data]);
    }
  };

  const gridOptions = {
    rowClass: "custom-row-hover",
    // domLayout: 'autoHeight',
  };

  const onGridReady = (params: { api: any }) => {
    tableRef.current = params.api;
  };

  const handleSelectionChanged = (e: SelectionChangedEvent<LeadeData>) => {
    const selectedData = e.api.getSelectedRows();
    if (selectedData.length > 0) {
    } else {
    }
  };

  return (
    <div className="lg:w-full">
      <div className="w-full px-3 gap-6 xl:h-full">
        <div
          className={`flex min-h-[62vh] xl:min-h-[70vh] xl:h-full w-${isLoader ? "[fit-content]" : "full"
            } mx-auto ag-theme-alpine`}
        >
          {isLoader ? (
            <Loader size={10} />
          ) : (
            <div
              className="relative overflow-auto"
              style={{ width: "100%" }}
            >
              <AgGridReact
                ref={tableRef}
                rowData={batchLearner}
                // rowData={dummyData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                enableBrowserTooltips={true}
                //tooltipShowDelay={{ tooltipShowDelay: 2 }}
                rowSelection="multiple"
                pagination={true}
                onCellClicked={handleCellClicked}
                gridOptions={gridOptions}
                paginationAutoPageSize={true}
                onSelectionChanged={(e) => handleSelectionChanged(e)}
                onGridReady={onGridReady}
                animateRows={true}
                suppressRowClickSelection={true}
                overlayNoRowsTemplate={"Batch data no found"}
                onFirstDataRendered={onFirstDataRendered}
                paginationNumberFormatter={paginationNumberFormatter}
              />
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default LearnerPage;
