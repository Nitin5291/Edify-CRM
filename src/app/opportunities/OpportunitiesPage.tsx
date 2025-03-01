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
  dataFilter,
  OpportunitiesListView,
  filterId,
  TechStack,
  OpportunityActiveFilter,
} from "@/CommonData";
import { getUser } from "@/lib/features/auth/authSlice";
import moment from "moment";
import {
  CreateOpportunityStatus,
  GreetingStatus,
} from "@/lib/features/navbar/navbarSlice";
import { getUserID } from "@/assets/utils/auth.util";
import CreateOpportunitie from "./CreateOpportunitie";
import OpportunityKanban from "./OpportunityKanban";
import * as XLSX from 'xlsx';

const initialColumnDefs: ColDef[] = [
  {
    field: "created_on",
    headerName: "Created on",
    minWidth: 215,
    maxWidth: 320,
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (
        <div className="flex items-center justify-center gap-2 capitalize ">
          {data?.createdAt
            ? moment(data?.createdAt).format("DD MMM, YYYY, h:mm A")
            : "-"}
        </div>
      );
    },
    checkboxSelection: true,
    headerCheckboxSelection: true,
  },
  // {
  //   field: "leadStatus",
  //   headerName: "Lead Status",
  //   minWidth: 100,
  //   maxWidth: 150,
  //   cellRenderer: (params: { data: any }) => {
  //     const data = params.data;
  //     const statusStyle =
  //       data?.leadStatus === "Cold Lead" ? { color: "red" } : {};

  //     return (
  //       <div style={statusStyle}>
  //         {data?.leadStatus ? data?.leadStatus : "Not Contacted"}
  //       </div>
  //     );
  //   },
  // },
  {
    field: "opportunityStatus",
    headerName: "Opportunity Status",
    minWidth: 200,
    maxWidth: 350,
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      const statusStyle =
        data?.opportunityStatus === "Lost Opportunity" ? { color: "red" } : {};

      return (
        <div style={statusStyle} className="flex justify-center">
          {data?.opportunityStatus ? data?.opportunityStatus : "-"}
        </div>
      );
    },
  },
  {
    field: "name",
    headerName: "Name",
    minWidth: 215,
    cellStyle: { textAlign: 'center' },
    maxWidth: 320,
  },
  {
    field: "phone",
    headerName: "Phone",
    minWidth: 200,
    maxWidth: 220,
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (
        <div className="flex items-center justify-center gap-2">
          {(data?.countryCode ? "+ " + data?.countryCode?.replace("+", "") : "") + " " + data?.phone}
        </div>
      );
    },
  },
  {
    field: "techStack",
    headerName: "Stack",
    minWidth: 200,
    maxWidth: 300,
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (
        <div className="flex justify-center items-center capitalize w-full">
          <span
            className={`flex justify-center flex-wrap w-full h-7 mt-1.5 px-4 rounded-full text-black-500 relative`}
          >
            <p
              className={`${data?.techStack === TechStack?.[0]
                ? "bg-red-200"
                : data?.techStack === TechStack?.[1]
                  ? "bg-teal-200"
                  : data?.techStack === TechStack?.[2]
                    ? "bg-blue-300"
                    : data?.techStack === TechStack?.[3]
                      ? "bg-lime-400"
                      : data?.techStack === TechStack?.[4]
                        ? "bg-teal-400"
                        : data?.techStack === TechStack?.[5]
                          ? "bg-rose-400"
                          : data?.techStack === TechStack?.[6]
                            ? "bg-green-400"
                            : data?.techStack === TechStack?.[7]
                              ? "bg-pink-400"
                              : data?.techStack === TechStack?.[8]
                                ? "bg-indigo-900"
                                : data?.techStack ? "border-2" : ""
                }  ${data?.techStack ? "text-black-100" : ""
                } flex justify-center rounded-full absolute w-36 h-7 items-center`}
            >
              {data?.techStack ? data?.techStack : "-"}
            </p>
          </span>
        </div>
      );
    },
  },
  // {
  //     field: 'classMode', headerName: "Class Mode",
  //     minWidth: 220, maxWidth: 350,
  //     cellRenderer: (params: { data: any; }) => {
  //         const data = params.data;
  //         return (
  //             <div className='flex items-center capitalize w-full'>
  //                 <span className={` w-full h-7 mt-1.5 px-4 rounded-full ${data?.classMode ? 'text-black-100' : ''} relative`}><p className={`${data?.classMode === "International Online" ? 'bg-fuchsia-400' : data?.classMode === "India Online" ? 'bg-emerald-300' : data?.classMode === "BLR ClassRoom" ? 'bg-violet-300' : data?.classMode === "HYD ClassRoom" ? 'bg-blue-300' : ''} flex justify-center rounded-full absolute w-36 h-7 items-center`}>{data?.classMode ? data?.classMode : '-'}</p></span>
  //             </div>
  //         );
  //     },
  // },
  {
    field: "course",
    headerName: "Course",
    minWidth: 400,
    maxWidth: 500,
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      const getColorClass = (courseName: string) => {
        switch (courseName) {
          case "IELTS":
          case "GRE":
          case "GMAT":
          case "PTE":
          case "TOEFL":
            return "bg-teal-200";
          case "Spoken English":
          case "Personality Development":
          case "Public Speaking":
          case "Communication Skills":
          case "Soft Skills":
          case "Aptitude":
            return "bg-red-200";
          case "HR Generalist Core HR":
          case "Recruitment Specialist":
          case "Payroll Specialist":
          case "Learning and Development":
          case "HR Manager":
          case "HR Business Partner":
          case "HR Analytics":
            return "bg-blue-300";
          default:
            return "border-2";
        }
      };

      return (
        <div className="flex items-center capitalize w-full">
          <span className={`flex justify-center flex-wrap w-full h-auto mt-1.5 px-4 relative`}>
            <p
              className={`flex justify-center rounded-full w-48 h-7 items-center mb-1.5 ${getColorClass(
                data.courseList
              )}`}
            >
              {data.courseList}
            </p>
            {/* {data?.Courses?.map((course: any, index: number) => (
              <p
                key={index}
                className={`flex justify-center rounded-full w-48 h-7 items-center mb-1.5 ${getColorClass(
                  course.name
                )}`}
              >
                {course.name}
              </p>
            ))}
            {data?.Courses?.length === 0 && (
              <p className=" flex justify-center items-center text-black-100">
                -
              </p>
            )} */}
          </span>
        </div>
      );
    },
  },
];

const OpportunitiesPage = ({
  handelOnSet, setPagination, pagination = 0, activeFilter, setActiveFilter, setCalendar, calendar
}: {
  handelOnSet: (id: number, data: LeadeData[]) => void; pagination: number, setPagination?: any, activeFilter?: string, setActiveFilter?: any; calendar?: any; setCalendar?: any
}) => {
  const dispatch = useAppDispatch();
  const tableRef = useRef<any>(null);
  const [selectedCell, setSelectedCell] = useState<any>([]);
  const [fieldStatus, setFieldStatus] = useState<Boolean>(true);
  const [active, setActive] = useState<string>("table");
  const [searchValue, setSearchValue] = useState<string>("");
  const [filterData, setFilterData] = useState<any>(
    OpportunitiesListView?.[0]?.value
  );
  const { lead, nav } = useAppSelector((state) => state);

  useEffect(() => {
    dispatch(getLeadData("opportunity"));
    setTimeout(() => {
      dispatch(GreetingStatus(false));
    }, 5000);
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
    dispatch(CreateOpportunityStatus(!nav?.OpportunityStatus));
    dispatch(getUser());
  };

  const handelOnSave = () => {
    handelOnContactModel();
    dispatch(getLeadData("opportunity"));
  };
  const handelOnFilter = (data: string) => {
    if (data === "my_opportunities") {
      const filterData = `userId=${getUserID()}`;
      dispatch(getLeadFilter({ leadStage: "opportunity", data: filterData }));
    } else if (data === "yesterdays_opportunities") {
      const filterData = `fromDate=${moment(new Date())
        .subtract(1, "days")
        .format("YYYY-MM-DD")}&toDate=${moment(new Date()).format(
          "YYYY-MM-DD"
        )}`;
      dispatch(getLeadFilter({ leadStage: "opportunity", data: filterData }));
    } else if (data === "todays_opportunities") {
      const filterData = `fromDate=${moment(new Date()).format(
        "YYYY-MM-DD"
      )}&toDate=${moment(new Date()).add(1, "days").format("YYYY-MM-DD")}`;
      dispatch(getLeadFilter({ leadStage: "opportunity", data: filterData }));
    } else if (data === "this_week_opportunities") {
      const filterData = `fromDate=${moment()
        .startOf("week")
        .format("YYYY-MM-DD")}&toDate=${moment()
          .endOf("week")
          .format("YYYY-MM-DD")}`;
      dispatch(getLeadFilter({ leadStage: "opportunity", data: filterData }));
    } else if (data === "this_month_opportunities") {
      const filterData = `fromDate=${moment()
        .startOf("month")
        .format("YYYY-MM-DD")}&toDate=${moment()
          .endOf("month")
          .add(1, "days")
          .format("YYYY-MM-DD")}`;
      dispatch(getLeadFilter({ leadStage: "opportunity", data: filterData }));
    } else if (data === "last_month_opportunities") {
      const filterData = `fromDate=${moment()
        .subtract(1, "months")
        .startOf("month")
        .format("YYYY-MM-DD")}&toDate=${moment()
          .subtract(1, "months")
          .endOf("month")
          .add(1, "days")
          .format("YYYY-MM-DD")}`;
      dispatch(getLeadFilter({ leadStage: "opportunity", data: filterData }));
    } else if (data === "all_opportunities") {
      dispatch(getLeadData("opportunity"));
      setActiveFilter("all")
    }

    setFilterData(data);
  };

  const TopHeader = useMemo(
    () =>
      OpportunitiesListView?.filter?.(
        (item: any) => item?.value === filterData
      )?.[0]?.lable,
    [filterData]
  );

  const handelOnTableChange = (data: string) => {
    setActive(data);
  };
  const handelOnDelete = () => {
    dispatch(deleteLeadsData(filterId(selectedCell)))
      .unwrap()
      .then((res: any) => {
        if (res) {
          toast.success(
            res?.data?.message
              ? res?.data?.message
              : "Leads Delete Successfully"
          );
          dispatch(getLeadData("opportunity"));
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
    if (lead?.LeadData?.leads?.length > 0) {
      const filtetData = activeFilter === "all" ? lead?.LeadData?.leads : lead?.LeadData?.leads?.filter((item: any) => item?.opportunityStatus === activeFilter)
      if (searchValue) {
        return dataFilter(
          filtetData?.map((item: any) => ({
            ...item,
          })),
          searchValue,
          ["name", "techStack", "phone", "classMode", "leadStatus", 'opportunityStatus', 'courseList']
        );
      } else {
        return filtetData;
      }
    } else {
      return [];
    }
  }, [lead?.LeadData, searchValue, activeFilter]);

  const handelOnTableFilterChange = (data: string) => {
    setActiveFilter(data)
  }

  const handelOnCalendar = () => {
    setCalendar(!calendar)
  }

  const exportOnClick = () => {
    const data = lead?.LeadData?.leads?.map((item: any) => {
      return {
        'Name': item?.name,
        'Email': item?.email,
        "Expected Registration date": item?.expRegistrationDate && moment(item?.expRegistrationDate).format("DD-MM-YYYY"),
        "Next FollowUp date": item?.nextFollowUp && moment(item?.nextFollowUp).format("DD-MM-YYYY"),
        "Demo Attended date": item?.demoAttendedDate && moment(item?.demoAttendedDate).format("DD-MM-YYYY"),
        'Phone': item?.phone,
        'Price List': item?.priceList,
        'Fee Quoted': item?.feeQuoted,
        'Opportunity Source': item?.opportunitySource,
        'Type': item?.type,
        'Lead Score': item?.leadScore,
        "Course List": item?.courseList,
        "Class Mode": item?.classMode,
        "Tech Stack": item?.techStack,
        "Batch Timing": item?.batchTiming,
        "Lead Owner": item?.leadOwner,
        "Cold Lead Reason": item?.coldLeadReason,
        "Opportunity Status": item?.opportunityStatus,
        "Opportunity Stage": item?.opportunityStage,
        "Warm Stage": item?.warmStage,
        "Visited Date": item?.visitedDate && moment(item?.visitedDate).format("DD-MM-YYYY"),
        "Expected walk-in date": item?.expectedWalkInDate && moment(item?.expectedWalkInDate).format("DD-MM-YYYY"),
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
      { wch: 20 },
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

    ];

    // Create a new workbook and add a worksheet
    const workbook = XLSX.utils.book_new();
    // const worksheet = XLSX.utils.json_to_sheet(data);

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Opportunitiy');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'Opportunitiy.xlsx');
  }

  return (
    <div className="lg:w-full">
      <div className="mx-5 my-2.5 py-2.5 shadow-lg border-2 bg-[#FFF] rounded-lg">
        <TableHeader
          tableData={lead?.LeadData?.leads}
          handelOnSearch={handelOnSearch}
          searchValue={searchValue}
          active={active}
          handelOnTableChange={handelOnTableChange}
          filterData={filterData}
          handelOnFilter={handelOnFilter}
          filterList={OpportunitiesListView}
          headerImg={Contact}
          headerLable={TopHeader}
          headerBtnLable="Create Opportunitiy"
          headerBtnOnClick={handelOnContactModel}
          deletBtnStatus={fieldStatus}
          isdelLoader={lead?.isdelLoader}
          handelOnDelete={handelOnDelete}
          activeFilter={activeFilter}
          handelOnTableFilterChange={handelOnTableFilterChange}
          activeFilterStatus={OpportunityActiveFilter}
          calendarView={true}
          handelOnCalendar={handelOnCalendar}
          editBtn={true}
          exportBtn="Export"
          exportOnClick={exportOnClick}
        />
        {active === "table" ? (
          <div className="w-full px-5 gap-6 xl:h-full">
            <div
              className={`flex min-h-[68vh] xl:min-h-[70vh] xl:h-full w-${lead?.isLoader ? "[fit-content]" : "full"
                } mx-auto ag-theme-alpine`}
            >
              {lead?.isLoader ? ( // Check if contactData is null
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
                    overlayNoRowsTemplate={"Opportunity data no found"}
                    onFirstDataRendered={onFirstDataRendered}
                    paginationNumberFormatter={paginationNumberFormatter}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <OpportunityKanban />
        )}
      </div>
      {nav?.OpportunityStatus && (
        <CreateOpportunitie
          handelOnContactModel={handelOnContactModel}
          handelOnSave={handelOnSave}
        />
      )}
    </div>
  );
};

export default OpportunitiesPage;
