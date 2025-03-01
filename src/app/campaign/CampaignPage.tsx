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
  dataFilter,
  CampaignListView,
  CampaignActiveFilter,
  filterId,
} from "@/CommonData";
import { getUser } from "@/lib/features/auth/authSlice";
import moment from "moment";
import { CreateLeadeStatus } from "@/lib/features/navbar/navbarSlice";
import { getUserID } from "@/assets/utils/auth.util";
import { getCourses } from "@/lib/features/courses/coursesSlice";
import CreateCampaign from "./CreateCampaign";
import { deleteCampaignData, getCampaign, getFilterCampaign } from "@/lib/features/campaign/campaignSlice";
import CampaignKanban from "./CampaignKanban";
import * as XLSX from 'xlsx';

const initialColumnDefs: ColDef[] = [
  {
    field: "name",
    headerName: "Campaign Name",
    minWidth: 300,
    maxWidth: 350,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    cellStyle: { textAlign: 'center' }, // Center align cell content
    headerClass: 'center-header',
  },
  {
    field: "campaignOwnerName",
    headerName: "Campaign Owner",
    minWidth: 300,
    maxWidth: 350,
    cellStyle: { textAlign: 'center' }, // Center align cell content
    headerClass: 'center-header',
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (
        <div className="flex items-center justify-center gap-2 capitalize ">
          {data?.campaignOwnerName
            ? data?.campaignOwnerName
            : "-"}
        </div>
      );
    },
  },
  {
    field: "type",
    headerName: "Type",
    minWidth: 300,
    maxWidth: 350,
    cellStyle: { textAlign: 'center' }, // Center align cell content
    headerClass: 'center-header',
  },
  {
    field: "status",
    headerName: "Status",
    minWidth: 300,
    maxWidth: 350,
    cellStyle: { textAlign: 'center' }, // Center align cell content
    headerClass: 'center-header',
  },
  {
    field: "campaignDate",
    headerName: "Start Date",
    minWidth: 300,
    maxWidth: 350,
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (
        <div className="flex items-center justify-center gap-2 capitalize ">
          {data?.campaignDate
            ? moment(data?.campaignDate).format("DD-MM-YYYY")
            : "-"}
        </div>
      );
    },
  },
  {
    field: "endDate",
    headerName: "End Date",
    minWidth: 300,
    maxWidth: 350,
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (
        <div className="flex items-center justify-center gap-2 capitalize ">
          {data?.endDate
            ? moment(data?.endDate).format("DD-MM-YYYY")
            : "-"}
        </div>
      );
    },
  },
];

const CampaignPage = ({
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
  const [filterData, setFilterData] = useState<any>(CampaignListView?.[0]?.value);
  const { nav } = useAppSelector((state) => state);
  const { isLoader, isdelLoader, campaignData } = useAppSelector((state) => state?.campaign);
  const { CoursesData } = useAppSelector((state) => state?.courses);
  const { allUser } = useAppSelector((state) => state?.auth);

  useEffect(() => {
    dispatch(getUser());
    dispatch(getCampaign());
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
  };

  const handelOnSave = () => {
    handelOnContactModel();
    dispatch(getCampaign());
  };

  const handelOnFilter = (data: string) => {
    if (data === "my_active_campaigns") {
      const filterData = `userId=${getUserID()}`;
      dispatch(getFilterCampaign({ data: filterData }));
    } else {
      dispatch(getCampaign());
      setActiveFilter('all')
    }

    setFilterData(data);
  };

  const TopHeader = useMemo(
    () =>
      CampaignListView?.filter?.((item: any) => item?.value === filterData)?.[0]
        ?.lable,
    [filterData]
  );

  const handelOnTableChange = (data: string) => {
    setActive(data);
  };
  const handelOnDelete = () => {
    dispatch(deleteCampaignData(filterId(selectedCell)))
      .unwrap()
      .then((res: any) => {
        if (res) {
          toast.success(
            res?.data?.message
              ? res?.data?.message
              : "Campaign Deleted Successfully"
          );
          dispatch(getCampaign());
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
    if (campaignData?.campaigns?.length > 0) {
      const filtetData = activeFilter === "all" ? campaignData?.campaigns : campaignData?.campaigns?.filter((item: any) => item?.status === activeFilter)
      if (searchValue) {
        return dataFilter(
          filtetData?.map((item: any) => ({
            ...item,
            campaignOwnerName: allUser?.users?.filter((i: any) => {
              return item?.campaignOwner == i?.id
            })?.[0]?.user_metadata?.name
          })),
          searchValue,
          ["name", "techStack", "phone", "classMode", "leadStatus","campaignOwnerName","status","type"]
        );
      } else {
        return filtetData?.map((item: any) => ({
          ...item,
          campaignOwnerName: allUser?.users?.filter((i: any) => {
            return item?.campaignOwner == i?.id
          })?.[0]?.user_metadata?.name
        }));
      }
    } else {
      return [];
    }
  }, [campaignData?.campaigns, searchValue, activeFilter, filterData, allUser]);
  console.log("🚀 ~ filteredActivities ~ filteredActivities:", filteredActivities)


  const handelOnTableFilterChange = (data: string) => {
    setActiveFilter(data)
  }


  const exportOnClick = () => {
    const data = filteredActivities?.map((item: any) => { return { 'Campaign name': item?.name, 'Campaign Owner': item?.campaignOwnerName, 'Type': item?.type, "Status": item?.status, "Start Date": item?.campaignDate && moment(item?.campaignDate).format("DD-MM-YYYY"), "End Date": item?.endDate && moment(item?.endDate).format("DD-MM-YYYY"), "Amount Spent On Campaign": item?.amountSpent, "Description": item?.description } })
    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 50 },

    ];

    // Create a new workbook and add a worksheet
    const workbook = XLSX.utils.book_new();
    // const worksheet = XLSX.utils.json_to_sheet(data);

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Campaign');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'Campaign.xlsx');
  }

  const handelOnCalendar = () => {
    setCalendar(!calendar)
  }

  return (
    <div className="lg:w-full">
      <div className="mx-5 my-2.5 py-2.5 shadow-lg border-2 bg-[#FFF] rounded-lg">
        <TableHeader
          // tableData={lead?.LeadData?.leads}
          tableData={campaignData?.campaigns}
          handelOnSearch={handelOnSearch}
          searchValue={searchValue}
          active={active}
          handelOnTableChange={handelOnTableChange}
          filterData={filterData}
          handelOnFilter={handelOnFilter}
          filterList={CampaignListView}
          headerImg={Contact}
          headerLable={TopHeader}
          headerBtnLable="Create Campaign"
          headerBtnOnClick={handelOnContactModel}
          deletBtnStatus={fieldStatus}
          isdelLoader={isdelLoader}
          handelOnDelete={handelOnDelete}
          activeFilter={activeFilter}
          handelOnTableFilterChange={handelOnTableFilterChange}
          activeFilterStatus={CampaignActiveFilter}
          exportBtn="Export"
          exportOnClick={exportOnClick}
          calendarView={true}
          handelOnCalendar={handelOnCalendar}
          editBtn={true}
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
                    overlayNoRowsTemplate={"Leads data no found"}
                    onFirstDataRendered={onFirstDataRendered}
                    paginationNumberFormatter={paginationNumberFormatter}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <CampaignKanban />
        )}
      </div>
      {nav?.LeadStatus && (
        <CreateCampaign
          handelOnContactModel={handelOnContactModel}
          handelOnSave={handelOnSave}
        />
      )}
    </div>
  );
};

export default CampaignPage;
