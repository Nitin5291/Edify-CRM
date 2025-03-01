"use client";
import * as React from "react";
import Contact from "../../assets/employee_contact.svg";
import { AgGridReact } from "ag-grid-react";
import {
  CellClickedEvent,
  ColDef,
  SelectionChangedEvent,
} from "ag-grid-community";
import { useRef, useState, useEffect, useMemo } from "react";
import { LeadeData } from "../component/Type";
import TableHeader from "../component/TableHeader";
import Loader from "../component/Loader";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  deleteLeadsData,
  getLeadData,
  getLeadFilter,
} from "@/lib/features/lead/leadSlice";
import { toast } from "react-toastify";
import {
  BatcheListView,
  dataFilter,
  filterId,
  BatchActiveFilter,
  calculateDuration,
} from "@/CommonData";
import { getUser } from "@/lib/features/auth/authSlice";
import moment from "moment";
import { CreateLeadeStatus } from "@/lib/features/navbar/navbarSlice";
import { getUserID } from "@/assets/utils/auth.util";
import { getCourses } from "@/lib/features/courses/coursesSlice";
import CreateLeade from "../leads/CreateLeade";
import BatchKanban from "./BatchKanban";
import CreateBatch from "./CreateBatch";
import { getBatchTopic } from "@/lib/features/batch/batchSlice";

const initialColumnDefs: ColDef[] = [
  {
    field: "topic",
    headerName: "Topic States",
    minWidth: 190,
    maxWidth: 250,
    checkboxSelection: true,
    headerCheckboxSelection: true,
  },
  {
    field: "date",
    headerName: "Date",
    minWidth: 180,
    maxWidth: 250,
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (
        <div className="flex items-center gap-2 capitalize ">
          {data?.date
            ? moment(data?.date).format("DD-MM-YYYY")
            : "-"}
        </div>
      );
    },
  },
  {
    field: "startTime",
    headerName: "Start Time",
    minWidth: 190,
    maxWidth: 250,
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (
        <div className="flex items-center gap-2 capitalize ">
          {data?.startTime
            ? data?.startTime
            : "-"}
        </div>
      );
    },
  },
  // {
  //   field: "endTime",
  //   headerName: "End Time",
  //   minWidth: 190,
  //   maxWidth: 250,
  //   cellRenderer: (params: { data: any }) => {
  //     const data = params.data;
  //     return (
  //       <div className="flex items-center gap-2 capitalize ">
  //         {data?.endTime
  //           ? data?.endTime
  //           : "-"}
  //       </div>
  //     );
  //   },
  // },
  {
    field: "phone",
    headerName: "Phone",
    minWidth: 190,
    maxWidth: 250,
  },
  {
    field: "email",
    headerName: "Email",
    minWidth: 190,
    maxWidth: 250,
  },
  {
    field: "modelOfClass",
    headerName: "Model of Class",
    minWidth: 190,
    maxWidth: 250,
  },
  {
    field: "techStac",
    headerName: "Tech Stack",
    minWidth: 190,
    maxWidth: 250,
  },
  {
    field: "totalFees",
    headerName: "Total Fees",
    minWidth: 190,
    maxWidth: 250,
  },
  {
    field: "feesPaid",
    headerName: "Fees Paid",
    minWidth: 190,
    maxWidth: 250,
  },
  {
    field: "dueAmount",
    headerName: "Due Amount",
    minWidth: 190,
    maxWidth: 250,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    minWidth: 190,
    maxWidth: 250,
  },
  // {
  //   field: "duration",
  //   headerName: "Duration",
  //   minWidth: 190,
  //   maxWidth: 250,
  //   cellRenderer: (params: { data: any }) => {
  //     const data = params.data;
  //     return (
  //       <div className="flex items-center gap-2 capitalize ">
  //         {data?.endTime && data?.startTime
  //           ? calculateDuration(data?.startTime, data?.endTime)
  //           : "-"}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   field: "attendance",
  //   headerName: "Attendance",
  //   minWidth: 190,
  //   maxWidth: 250,
  // },
  // {
  //   field: "isVideoUploaded",
  //   headerName: "Video Upload",
  //   minWidth: 190,
  //   maxWidth: 250,
  // },
  // {
  //   field: "trainerName",
  //   headerName: "Trainer Name",
  //   minWidth: 215,
  //   maxWidth: 350,
  // },
];

const Topic = () => {
  const dispatch = useAppDispatch();
  const tableRef = useRef<any>(null);
  const { CoursesData } = useAppSelector((state) => state?.courses);
  const [pagination, setPagination] = useState<number>(0);
  const { SingleBatch, isLoader, batchTopic } = useAppSelector((state) => state?.batch);

  useEffect(() => {
    dispatch(getBatchTopic(SingleBatch?.id));
    if (!(CoursesData?.courses?.length > 0)) {
      dispatch(getCourses());
    }
  }, [SingleBatch]);

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
                rowData={batchTopic?.batchTopics}
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

export default Topic;
