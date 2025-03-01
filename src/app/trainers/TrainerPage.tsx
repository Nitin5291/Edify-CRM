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
import { toast } from "react-toastify";
import {
  TrainerListView,
  dataFilter,
  TrainerActiveFilter,
  filterId,
} from "@/CommonData";
import { getUser } from "@/lib/features/auth/authSlice";
import moment from "moment";
import { CreateLeadeStatus } from "@/lib/features/navbar/navbarSlice";
import { getUserID } from "@/assets/utils/auth.util";
import { getCourses } from "@/lib/features/courses/coursesSlice";
import CreateTrainer from "./CreateTrainer";
import { deleteTrainersData, getFilterTrainer, getTrainer } from "@/lib/features/trainer/trainerSlice";
import TrainerKanban from "./TrainerKanban";
import * as XLSX from 'xlsx';

const initialColumnDefs: ColDef[] = [
  {
    checkboxSelection: true,
    headerCheckboxSelection: true,
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
  // {
  //   field: "noofBatches",
  //   headerName: "No of Batches",
  //   minWidth: 190,
  //   maxWidth: 250,
  // },
  // {
  //   field: "nooflearners",
  //   headerName: "No of learners",
  //   minWidth: 190,
  //   maxWidth: 250,
  // },
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

const TrainerPage = ({
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
  const [filterData, setFilterData] = useState<any>(TrainerListView?.[0]?.value);
  const { nav } = useAppSelector((state) => state);
  const { CoursesData } = useAppSelector((state) => state?.courses);
  const { trainerData, isLoader, isdelLoader } = useAppSelector((state) => state?.trainer);

  useEffect(() => {
    dispatch(getTrainer());
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
    dispatch(getUser("salesperson"));
  };

  const handelOnSave = () => {
    handelOnContactModel();
    dispatch(getTrainer());
  };

  const handelOnFilter = (data: string) => {
    if (data === "my_trainer") {
      const filterData = `userId=${getUserID()}`;
      dispatch(getFilterTrainer({ data: filterData }));
    } else if (data === "yesterdays_trainer") {
      const filterData = `fromDate=${moment(new Date())
        .subtract(1, "days")
        .format("YYYY-MM-DD")}&toDate=${moment(new Date()).format(
          "YYYY-MM-DD"
        )}`;
      dispatch(getFilterTrainer({ data: filterData }));
    } else if (data === "todays_trainer") {
      const filterData = `fromDate=${moment(new Date()).format(
        "YYYY-MM-DD"
      )}&toDate=${moment(new Date()).add(1, "days").format("YYYY-MM-DD")}`;
      dispatch(getFilterTrainer({ data: filterData }));
    } else if (data === "this_week_trainer") {
      const filterData = `fromDate=${moment()
        .startOf("week")
        .format("YYYY-MM-DD")}&toDate=${moment()
          .endOf("week")
          .format("YYYY-MM-DD")}`;
      dispatch(getFilterTrainer({ data: filterData }));
    } else if (data === "this_month_trainer") {
      const filterData = `fromDate=${moment()
        .startOf("month")
        .format("YYYY-MM-DD")}&toDate=${moment()
          .endOf("month")
          .add(1, "days")
          .format("YYYY-MM-DD")}`;
      dispatch(getFilterTrainer({ data: filterData }));
    } else if (data === "lastmonth_trainer") {
      const filterData = `fromDate=${moment()
        .subtract(1, "months")
        .startOf("month")
        .format("YYYY-MM-DD")}&toDate=${moment()
          .subtract(1, "months")
          .endOf("month")
          .add(1, "days")
          .format("YYYY-MM-DD")}`;
      dispatch(getFilterTrainer({ data: filterData }));
    } else if (data === "all_trainer") {
      dispatch(getTrainer());
      setActiveFilter("all")
    }

    setFilterData(data);
  };

  const TopHeader = useMemo(
    () =>
      TrainerListView?.filter?.((item: any) => item?.value === filterData)?.[0]
        ?.lable,
    [filterData]
  );

  const handelOnTableChange = (data: string) => {
    setActive(data);
  };
  const handelOnDelete = () => {
    dispatch(deleteTrainersData(filterId(selectedCell)))
      .unwrap()
      .then((res: any) => {
        if (res) {
          toast.success(
            res?.message
              ? res?.message
              : "Trainers Deleted Successfully"
          );
          dispatch(getTrainer());
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
    if (trainerData?.data?.length > 0) {
      const filtetData = activeFilter === "all" ? trainerData?.data : trainerData?.data?.filter((item: any) => item?.trainerStatus === activeFilter)
      if (searchValue) {
        return dataFilter(
          filtetData?.map((item: any) => ({
            ...item,
          })),
          searchValue,
          ["name", "techStack", "phone", "classMode", "leadStatus"]
        );
      } else {
        return filtetData;
      }
    } else {
      return [];
    }
  }, [trainerData?.data, searchValue, activeFilter, filterData]);

  console.log("🚀 ~ filteredActivities ~ filteredActivities:", filteredActivities)


  const handelOnTableFilterChange = (data: string) => {
    setActiveFilter(data)
  }

  const exportOnClick = () => {
    const data = trainerData?.data?.map((item: any) => {
      return {
        'Trainers Name': item?.trainerName,
        'Email': item?.email,
        'Trainer Id': item?.trainerId,
        'Phone': item?.phone,
        'Location': item?.location,
        'Trainer Status': item?.trainerStatus,
        'Trainer Owner': item?.trainerOwner,
        'Slack Stage': item?.slackStage,
        'Tech Stack': item?.techStack,
        'Batches': item?.batches,
        'Free Slots': item?.freeSlots,
        "Joining Date": item?.joiningDate && moment(item?.joiningDate).format("DD-MM-YYYY"),
        'Working': item?.working,
        'Commercial Note': item?.commercialNote,
        'Trainer Note': item?.trainerNote,
        "Description": item?.description
      }
    })
    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 50 },
      { wch: 50 },
      { wch: 50 },

    ];

    // Create a new workbook and add a worksheet
    const workbook = XLSX.utils.book_new();
    // const worksheet = XLSX.utils.json_to_sheet(data);

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trainers');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'Trainers.xlsx');
  }

  return (
    <div className="lg:w-full">
      <div className="mx-5 my-2.5 py-2.5 shadow-lg border-2 bg-[#FFF] rounded-lg">
        <TableHeader
          tableData={trainerData?.data}
          handelOnSearch={handelOnSearch}
          searchValue={searchValue}
          active={active}
          handelOnTableChange={handelOnTableChange}
          filterData={filterData}
          handelOnFilter={handelOnFilter}
          filterList={TrainerListView}
          headerImg={Contact}
          headerLable={TopHeader}
          headerBtnLable="Create Trainer"
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
                    overlayNoRowsTemplate={"Batch data no found"}
                    onFirstDataRendered={onFirstDataRendered}
                    paginationNumberFormatter={paginationNumberFormatter}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <TrainerKanban />
        )}
      </div>
      {nav?.LeadStatus && (
        <CreateTrainer
          handelOnContactModel={handelOnContactModel}
          handelOnSave={handelOnSave}
        />
      )}
    </div>
  );
};

export default TrainerPage;
