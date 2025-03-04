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
  getLeadFilter,
} from "@/lib/features/lead/leadSlice";
import { toast } from "react-toastify";
import {
  TaskListView,
  dataFilter,
  TrainerActiveFilter,
  filterId,
} from "@/CommonData";
import { getUser } from "@/lib/features/auth/authSlice";
import moment from "moment";
import { CreateLeadeStatus } from "@/lib/features/navbar/navbarSlice";
import { getUserID } from "@/assets/utils/auth.util";
import { getCourses } from "@/lib/features/courses/coursesSlice";
import CreateTask from "./CreateTask";
import { deleteTrainersData } from "@/lib/features/trainer/trainerSlice";
import TasksKanban from "./TasksKanban";
import { deleteMainTaskData, getFilterMainTask, getMainTask } from "@/lib/features/mainTask/mainTaskSlice";
import * as XLSX from 'xlsx';

const initialColumnDefs: ColDef[] = [
  {
    checkboxSelection: true,
    headerCheckboxSelection: true,
    field: "taskOwnerUser",
    headerName: "Task Owner",
    minWidth: 215,
    maxWidth: 350,
    cellStyle: { textAlign: 'center' },
    headerClass: 'center-header',
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (
        <div className="flex justify-center items-center capitalize w-full">
          {data?.taskOwnerUser?.name
            ? data?.taskOwnerUser?.name
            : "-"}
        </div>
      );
    },
  },
  {
    field: "assignedUser",
    headerName: "Assign To",
    minWidth: 215,
    maxWidth: 350,
    cellStyle: { textAlign: 'center' },
    headerClass: 'center-header',
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (
        <div className="flex justify-center items-center capitalize w-full">
          {data?.assignedUser?.name
            ? data?.assignedUser?.name
            : "-"}
        </div>
      );
    },
  },
  {
    field: "taskType",
    headerName: "Task Type",
    minWidth: 215,
    maxWidth: 350,
    cellStyle: { textAlign: 'center' },
    headerClass: 'center-header',
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (
        <div className="flex justify-center items-center capitalize w-full">
          {data?.taskType
            ? data?.taskType
            : "-"}
        </div>
      );
    },
  },
  {
    field: "subject",
    headerName: "Subject",
    minWidth: 250,
    maxWidth: 350,
    cellStyle: { textAlign: 'center' },
    headerClass: 'center-header',
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (
        <div className="flex justify-center items-center capitalize w-full">
          {data?.subject
            ? data?.subject
            : "-"}
        </div>
      );
    },
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    minWidth: 190,
    maxWidth: 250,
    cellStyle: { textAlign: 'center' },
    headerClass: 'center-header',
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (
        <div className="flex justify-center items-center capitalize w-full">
          {data?.dueDate
            ? moment(data?.dueDate).format("DD-MM-YYYY")
            : "-"}
        </div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    minWidth: 190,
    maxWidth: 250,
    cellStyle: { textAlign: 'center' },
    headerClass: 'center-header',
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (
        <div className="flex justify-center items-center capitalize w-full">
          {data?.status
            ? data?.status
            : "-"}
        </div>
      );
    },
  },
  {
    field: "priority",
    headerName: "Priority",
    minWidth: 400,
    maxWidth: 500,
    cellStyle: { textAlign: 'center' },
    headerClass: 'center-header',
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (
        <div className="flex justify-center items-center capitalize w-full">
          {data?.priority}
        </div>
      );
    },
  },
];

const TaskPage = ({
  handelOnSet, setPagination, pagination = 0, activeFilter, setActiveFilter
}: {
  handelOnSet: (id: number, data: LeadeData[]) => void; pagination: number, setPagination?: any, activeFilter?: string, setActiveFilter?: any
}) => {
  const dispatch = useAppDispatch();
  const tableRef = useRef<any>(null);
  const [selectedCell, setSelectedCell] = useState<any>([]);
  const [fieldStatus, setFieldStatus] = useState<Boolean>(true);
  const [active, setActive] = useState<string>("table");
  const [searchValue, setSearchValue] = useState<string>("");
  const [filterData, setFilterData] = useState<any>(TaskListView?.[0]?.value);
  const { nav } = useAppSelector((state) => state);
  const { CoursesData } = useAppSelector((state) => state?.courses);
  const { mainTaskData, isLoader, isdelLoader } = useAppSelector((state) => state?.mainTask);

  useEffect(() => {
    dispatch(getMainTask());
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
      handelOnSet(param?.rowIndex, [param?.data]);
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
      setFieldStatus(false);
      setSelectedCell(selectedData);
    } else {
      setFieldStatus(true);
      setSelectedCell([]);
    }
  };

  const handelOnContactModel = () => {
    dispatch(CreateLeadeStatus(!nav?.LeadStatus));
    // dispatch(getUser("salesperson"));
  };

  const handelOnSave = () => {
    handelOnContactModel();
    dispatch(getMainTask());
  };

  const handelOnFilter = (data: string) => {
    if (data === "my_trainer") {
      const filterData = `userId=${getUserID()}`;
      dispatch(getFilterMainTask({ data: filterData }));
    } else if (data === "open_tasks") {
      const filterData = `status=Inprogress`;
      dispatch(getFilterMainTask({ data: filterData }));
    } else if (data === "closed_tasks") {
      const filterData = `status=Completed`;
      dispatch(getFilterMainTask({ data: filterData }));
    } else {
      dispatch(getMainTask());
      setActiveFilter("all")
    }

    setFilterData(data);
  };

  const TopHeader = useMemo(
    () =>
      TaskListView?.filter?.((item: any) => item?.value === filterData)?.[0]
        ?.lable,
    [filterData]
  );

  const handelOnTableChange = (data: string) => {
    setActive(data);
  };
  const handelOnDelete = () => {
    dispatch(deleteMainTaskData(filterId(selectedCell)))
      .unwrap()
      .then((res: any) => {
        if (res) {
          toast.success(
            res?.message
              ? res?.message
              : "Task Deleted Successfully"
          );
          dispatch(getMainTask());
          setFieldStatus(true);
        }
      })
      .catch((err: any) => {
        const error = JSON.parse(err?.message);
        toast.error(error?.message ? error?.message : "Something went wrong");
      });
  };

  const handelOnSearch = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchValue(e?.target.value);
  };

  const filteredActivities = React.useMemo(() => {
    if (mainTaskData?.length > 0) {
      const filtetData = activeFilter === "all" ? mainTaskData : mainTaskData?.filter((item: any) => item?.status === activeFilter)
      if (searchValue) {
        return dataFilter(
          filtetData?.map((item: any) => ({
            ...item,
          })),
          searchValue,
          ["taskType", "subject", "status", "priority"]
        );
      } else {
        return filtetData;
      }
    } else {
      return [];
    }
  }, [mainTaskData, searchValue, activeFilter,filterData]);


  const handelOnTableFilterChange = (data: string) => {
    setActiveFilter(data)
  }

  const exportOnClick = () => {
    const data = mainTaskData?.map((item: any) => {
      return {
        'Task Owner': item?.taskOwner,
        'Assign To': item?.assignTo,
        "Due Date": item?.dueDate && moment(item?.dueDate).format("DD-MM-YYYY"),
        'Subject': item?.subject,
        'Source': item?.source,
        'Note': item?.note,
        'Learner Name': item?.learnerId,
        'Batch': item?.batch,
        'Priority': item?.priority,
        'Status': item?.status,
        'Reminder': item?.reminder,
        "Task Type": item?.taskType,
        "Description": item?.description
      }
    })
    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 50 },
      { wch: 50 },
    ];

    // Create a new workbook and add a worksheet
    const workbook = XLSX.utils.book_new();
    // const worksheet = XLSX.utils.json_to_sheet(data);

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'Tasks.xlsx');
  }


  return (
    <div className="lg:w-full">
      <div className="mx-5 my-2.5 py-2.5 shadow-lg border-2 bg-[#FFF] rounded-lg">
        <TableHeader
          tableData={mainTaskData}
          handelOnSearch={handelOnSearch}
          searchValue={searchValue}
          active={active}
          handelOnTableChange={handelOnTableChange}
          filterData={filterData}
          handelOnFilter={handelOnFilter}
          filterList={TaskListView}
          headerImg={Contact}
          headerLable={TopHeader}
          headerBtnLable="Create Task"
          headerBtnOnClick={handelOnContactModel}
          deletBtnStatus={fieldStatus}
          isdelLoader={isdelLoader}
          handelOnDelete={handelOnDelete}
          activeFilter={activeFilter}
          handelOnTableFilterChange={handelOnTableFilterChange}
          activeFilterStatus={TrainerActiveFilter}
          editBtn={true}
          exportBtn="Export"
          exportOnClick={exportOnClick}
        />
        {active === "table" ? (
          <div className="w-full px-5 gap-6 xl:h-full">
            <div
              className={`flex min-h-[68vh] xl:min-h-[70vh] xl:h-full w-${isLoader ? "[fit-content]" : "full"
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
                    rowData={filteredActivities}
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
                    overlayNoRowsTemplate={"Task data no found"}
                    onFirstDataRendered={onFirstDataRendered}
                    paginationNumberFormatter={paginationNumberFormatter}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <TasksKanban />
        )}
      </div>
      {nav?.LeadStatus && (
        <CreateTask
          handelOnContactModel={handelOnContactModel}
          handelOnSave={handelOnSave}
        />
      )}
    </div>
  );
};

export default TaskPage;
