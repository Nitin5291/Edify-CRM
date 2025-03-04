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
  getLeadFilter,
} from "@/lib/features/lead/leadSlice";
import { toast } from "react-toastify";
import {
  BatcheListView,
  dataFilter,
  filterId,
  BatchActiveFilter,
} from "@/CommonData";
import { getUser } from "@/lib/features/auth/authSlice";
import moment from "moment";
import { getUserID } from "@/assets/utils/auth.util";
import { getCourses } from "@/lib/features/courses/coursesSlice";
import BatchKanban from "./BatchKanban";
import CreateBatch from "./CreateBatch";
import { deleteBatchData, getBatch, getFilterBatch } from "@/lib/features/batch/batchSlice";
import { CreateLeadeStatus } from "@/lib/features/navbar/navbarSlice";
import * as XLSX from 'xlsx';

const initialColumnDefs: ColDef[] = [
  {
    checkboxSelection: true,
    headerCheckboxSelection: true,
    field: "batchName",
    headerName: "Batch Name",
    minWidth: 215,
    maxWidth: 350,
  },
  // {
  //   field: "trainer",
  //   headerName: "Trainer",
  //   minWidth: 190,
  //   maxWidth: 250,
  //   cellRenderer: (params: { data: any }) => {
  //     const data = params.data;
  //     return (
  //       <div className="flex items-center gap-2 capitalize ">
  //         {data?.trainer?.name
  //           ? data?.trainer?.name
  //           : "-"}
  //       </div>
  //     );
  //   },
  // },

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
  {
    field: "stack",
    headerName: "Stack",
    minWidth: 250,
    maxWidth: 350,
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      const getColorClass = () => {
        switch (data?.stack) {
          case "App Stack":
            return "bg-red-500 text-white";
          case "Ai Stack":
            return "bg-indigo-700 text-white";
          case "Agile Stack":
            return "bg-green-600 text-white";
          default:
            return "bg-transparent text-black";
        }
      }
      return (
        <div className="flex justify-center items-center capitalize w-full">
          <span className={` w-full h-auto flex justify-center flex-wrap mt-1.5 px-4 relative`}>
            {data?.stack && <p
              className={`flex justify-center rounded-full w-48 h-7 items-center mb-1.5 ${getColorClass()}`}
            >
              {data?.stack}
            </p>}
          </span>
        </div>
      );
    },
  },
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
  // {
  //   field: "timings",
  //   headerName: "Timings",
  //   minWidth: 190,
  //   maxWidth: 250,
  // },
  // {
  //   field: "noOfStudents",
  //   headerName: "No Of Students",
  //   minWidth: 215,
  //   maxWidth: 350,
  // },
  {
    field: "location",
    headerName: "Location",
    minWidth: 215,
    maxWidth: 350,
  },
];

const BatchPage = ({
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
  const [filterData, setFilterData] = useState<any>(BatcheListView?.[0]?.value);
  let { batchData, isLoader, isdelLoader } = useAppSelector((state) => state?.batch);
  batchData = batchData?.data
  const { nav } = useAppSelector((state) => state);
  const { CoursesData } = useAppSelector((state) => state?.courses);

  useEffect(() => {
    dispatch(getBatch());
    
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
    dispatch(getBatch());
  };

  const handelOnFilter = (data: string) => {
    if (data === "my_batches") {
      const filterData = `userId=${getUserID()}`;
      dispatch(getFilterBatch({ data: filterData }));
    } else if (data === "yesterdays_batches") {
      const filterData = `fromDate=${moment(new Date())
        .subtract(1, "days")
        .format("YYYY-MM-DD")}&toDate=${moment(new Date()).format(
          "YYYY-MM-DD"
        )}`;
      dispatch(getFilterBatch({ data: filterData }));
    } else if (data === "todays_batches") {
      const filterData = `fromDate=${moment(new Date()).format(
        "YYYY-MM-DD"
      )}&toDate=${moment(new Date()).add(1, "days").format("YYYY-MM-DD")}`;
      dispatch(getFilterBatch({ data: filterData }));
    } else if (data === "this_week_batches") {
      const filterData = `fromDate=${moment()
        .startOf("week")
        .format("YYYY-MM-DD")}&toDate=${moment()
          .endOf("week")
          .format("YYYY-MM-DD")}`;
      dispatch(getFilterBatch({ data: filterData }));
    } else if (data === "this_month_batches") {
      const filterData = `fromDate=${moment()
        .startOf("month")
        .format("YYYY-MM-DD")}&toDate=${moment()
          .endOf("month")
          .add(1, "days")
          .format("YYYY-MM-DD")}`;
      dispatch(getFilterBatch({ data: filterData }));
    } else if (data === "lastmonth_batches") {
      const filterData = `fromDate=${moment()
        .subtract(1, "months")
        .startOf("month")
        .format("YYYY-MM-DD")}&toDate=${moment()
          .subtract(1, "months")
          .endOf("month")
          .add(1, "days")
          .format("YYYY-MM-DD")}`;
      dispatch(getFilterBatch({ data: filterData }));
    } else {
      dispatch(getBatch());
      setActiveFilter("all")
    }

    setFilterData(data);
  };

  const TopHeader = useMemo(
    () =>
      BatcheListView?.filter?.((item: any) => item?.value === filterData)?.[0]
        ?.lable,
    [filterData]
  );

  const handelOnTableChange = (data: string) => {
    setActive(data);
  };
  const handelOnDelete = () => {
    dispatch(deleteBatchData(filterId(selectedCell)))
      .unwrap()
      .then((res: any) => {
        if (res) {
          toast.success(
            res?.message
              ? res?.message
              : "Batchs Deleted Successfully"
          );
          dispatch(getBatch());
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
    if (batchData?.length > 0) {
      const filtetData = activeFilter === "all" ? batchData : batchData?.filter((item: any) => item?.batchStatus === activeFilter)
      if (searchValue) {
        return dataFilter(
          filtetData?.map((item: any) => ({
            ...item,
          })),
          searchValue,
          ["batchName", "stack", "slot", "batchStatus", "stage"]
        );
      } else {
        return filtetData;
      }
    } else {
      return [];
    }
  }, [batchData, searchValue, activeFilter, filterData]);


  const handelOnTableFilterChange = (data: string) => {
    setActiveFilter(data)
  }

  const exportOnClick = () => {
    const data = batchData?.map((item: any) => {
      return {
        'Batch Name': item?.batchName,
        'Class Mode': item?.classMode,
        "Location": item?.location,
        "stack": item?.stack,
        "Trainer Name": item?.trainer?.trainerName,
        "Start Date": item?.startDate && moment(item?.startDate).format("DD-MM-YYYY"),
        'Timing': item?.timing,
        "Tentative End Date": item?.tentativeEndDate && moment(item?.tentativeEndDate).format("DD-MM-YYYY"),
        'Batch Status': item?.batchStatus,
        'Comment': item?.comment,
        'Batch Stage': item?.batchStage,
        'Stage': item?.stage,
        'Mentor': item?.mentor,
        'Zoom Account': item?.zoomAccount,
        'Stack Owner': item?.stackOwner,
        'Owner': item?.owner,
        'Slot': item?.slot,
        'Batch Owner': item?.batchOwner,
        'Topic Status': item?.topicStatus,
        "Description": item?.description
      }
    })
    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 50 },

    ];

    // Create a new workbook and add a worksheet
    const workbook = XLSX.utils.book_new();
    // const worksheet = XLSX.utils.json_to_sheet(data);

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Batches');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'Batches.xlsx');
  }


  return (
    <div className="lg:w-full">
      <div className="mx-5 my-2.5 py-2.5 shadow-lg border-2 bg-[#FFF] rounded-lg">
        <TableHeader
          tableData={batchData}
          handelOnSearch={handelOnSearch}
          searchValue={searchValue}
          active={active}
          handelOnTableChange={handelOnTableChange}
          filterData={filterData}
          handelOnFilter={handelOnFilter}
          filterList={BatcheListView}
          headerImg={Contact}
          headerLable={TopHeader}
          headerBtnLable="Create Batch"
          headerBtnOnClick={handelOnContactModel}
          deletBtnStatus={fieldStatus}
          isdelLoader={isdelLoader}
          handelOnDelete={handelOnDelete}
          activeFilter={activeFilter}
          handelOnTableFilterChange={handelOnTableFilterChange}
          activeFilterStatus={BatchActiveFilter}
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
                    overlayNoRowsTemplate={"Batch data no found"}
                    onFirstDataRendered={onFirstDataRendered}
                    paginationNumberFormatter={paginationNumberFormatter}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <BatchKanban />
        )}
      </div>
      {nav?.LeadStatus && (
        <CreateBatch
          handelOnContactModel={handelOnContactModel}
          handelOnSave={handelOnSave}
        />
      )}
    </div>
  );
};

export default BatchPage;
