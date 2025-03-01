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
import { OpportunitiyData } from "../component/Type";
import TableHeader from "../component/TableHeader";
import Loader from "../component/Loader";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { toast } from "react-toastify";
import { CoursePageView, dataFilter, filterId, useWindowDimensions } from "@/CommonData";
import { getUser } from "@/lib/features/auth/authSlice";
import CreateCourses from "./CreateCourses";
import {
  deleteCoursesData,
  getCourses,
} from "@/lib/features/courses/coursesSlice";
import { MdModeEditOutline } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import Image from "next/image";
import { postpy } from "@/base";
import { BsSend } from "react-icons/bs";
import Logo from "../../assets/favicon.png";
import BoatImg from "../../assets/Boat2.gif"

const initialColumnDefs: ColDef[] = [
  {
    field: "name",
    headerName: "Course",
    minWidth: 200,
    maxWidth: 350,
    checkboxSelection: true,
    headerCheckboxSelection: true,
  },
  {
    field: "description",
    headerName: "Description",
    minWidth: 600,
    maxWidth: 1050,
  },
  {
    field: "fee",
    headerName: "Course Fee",
    minWidth: 150,
    maxWidth: 300,
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (
        <div className="flex items-center gap-2 capitalize ">
          {data?.fee ? data?.fee : "-"}
        </div>
      );
    },
  },
];

const LearnerPage = ({
  handelOnSet,
}: {
  handelOnSet: (id: number, data: OpportunitiyData[]) => void;
}) => {
  const dispatch = useAppDispatch();
  const tableRef = useRef<any>(null);
  const [courseModel, setCourseModel] = useState<Boolean>(false);
  const [selectedCell, setSelectedCell] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [fieldStatus, setFieldStatus] = useState<Boolean>(true);
  const [filterData, setFilterData] = useState<any>(CoursePageView?.[0]?.value);
  const { isLoader, CoursesData } = useAppSelector((state) => state?.courses);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [datas, setDatas] = useState<any[]>([]);
  const [editValue, setEditValue] = useState<string>("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const { height, width } = useWindowDimensions();
  const [value, setValue] = useState<string>("");
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    dispatch(getCourses());
  }, []);

  useEffect(() => {
    const fetchHtml = async (htmlstring: string) => {
      try {
        const blob = new Blob([htmlstring], { type: "text/html" });
        const url = window.URL.createObjectURL(blob);
        return url;
      } catch (error) {
        console.error('Error fetching HTML:', error);
      }
    };

    const fetchAllHtml = async () => {
      const newUrls: any = await Promise.all(datas.map(async (item) => {
        return fetchHtml(item.chart);
      }));
      setUrls(newUrls);
    };

    fetchAllHtml();
  }, [datas]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [datas]);
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

  const handleCellClicked = (
    param: CellClickedEvent<OpportunitiyData, any>
  ) => {
    if (param?.rowIndex !== null && param?.data !== undefined) {
      handelOnSet(param?.data?.id, [param?.data]);
    }
  };

  const gridOptions = {
    rowClass: "custom-row-hover",
    // domLayout: 'autoHeight',
  };

  const onGridReady = (params: { api: any }) => {
    tableRef.current = params.api;
  };

  const handleSelectionChanged = (
    e: SelectionChangedEvent<OpportunitiyData>
  ) => {
    const selectedData = e.api.getSelectedRows();
    if (selectedData.length > 0) {
      setFieldStatus(false);
      setSelectedCell(selectedData);
    } else {
      setFieldStatus(true);
      setSelectedCell([]);
    }
  };

  const handelOnCoursesModel = () => {
    setCourseModel(!courseModel);
    dispatch(getUser());
    dispatch(getCourses());
  };

  const handelOnSave = () => {
    handelOnCoursesModel();
  };
  const handelOnFilter = (data: string) => {
    setFilterData(data);
  };

  const TopHeader = useMemo(() =>
    CoursePageView?.filter?.((item: any) => item?.value === filterData)?.[0]
      ?.lable,
    [filterData]
  );

  const filteredActivities = React.useMemo(() => {
    if (CoursesData?.courses?.length > 0) {
      if (searchValue) {
        return dataFilter(
          CoursesData?.courses?.map((item: any) => ({
            ...item,
          })),
          searchValue,
          ["name", "description", "fee"]
        );
      } else {
        return CoursesData?.courses;
      }
    } else {
      return [];
    }
  }, [CoursesData, searchValue]);

  const handelOnSearch = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchValue(e?.target.value);
  };

  const handelOnDelete = () => {
    dispatch(
      deleteCoursesData({
        data: selectedCell?.length > 1 ? true : false,
        ids: filterId(selectedCell),
      })
    )
      .unwrap()
      .then((res: any) => {
        if (res) {
          toast.success(
            res?.data?.message
              ? res?.data?.message
              : "Leads Deleted Successfully"
          );
          dispatch(getCourses());
          setFieldStatus(true);
        }
      })
      .catch((err: any) => {
        const error = JSON.parse(err?.message);
        toast.error(error?.message ? error?.message : "Something went wrong");
      });
  };

  const handleOnEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
  };
  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleButtonClick = async (e: any, index: any) => {
    if (index === null ? value : editValue) {
      setLoader(true);
      try {
        const body = { question: index === null ? value : editValue };
        const response: any = await postpy('ask-question', body);
        if (response?.status === 200) {
          if (index === null) {
            setDatas([...datas, { prompt: value, chart: response.data?.answer }]);
            setValue("");
          } else {
            datas[index].chart = response.data?.answer;
            datas[index].prompt = editValue;
            setDatas([...datas]);
            setEditValue("");
            setEditIndex(null);
          }
        }
        setLoader(false);
      } catch (error: any) {
        setLoader(false);
        toast.error(JSON.stringify(error.response.data.error));
      }
    } else {
      toast.error("Please enter a prompt");
    }
  };


  return (
    <div className="pt-5 ps-2 flex justify-center w-full">
      <div className="w-[70%]">
        <div className="mx-5 my-2.5 py-2.5 shadow-lg border-2 bg-[#FFF] rounded-lg">
          <TableHeader
            handelOnSearch={handelOnSearch}
            searchValue={searchValue}
            filterData={filterData}
            handelOnFilter={handelOnFilter}
            filterList={CoursePageView}
            headerImg={Contact}
            headerLable={TopHeader}
            headerBtnLable="Create Course"
            headerBtnOnClick={handelOnCoursesModel}
            KanbanStatus={false}
            handelOnDelete={handelOnDelete}
            deletBtnStatus={fieldStatus}
          />
          <div className="w-full px-5 gap-6 xl:h-full">
            <div
              className={`flex min-h-[68vh] xl:min-h-[70vh] xl:h-full w-${isLoader ? "[fit-content]" : "full"
                } mx-auto ag-theme-alpine`}
            >
              {isLoader ? ( // Check if contactData is null
                <Loader size={10} />
              ) : (
                <div className="relative overflow-auto" style={{ width: "100%" }}>
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
                    overlayNoRowsTemplate={"Learner data no found"}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {courseModel && (
          <CreateCourses
            handelOnCoursesModel={handelOnCoursesModel}
            handelOnSave={handelOnSave}
          />
        )}
      </div>
      <div className="relative w-[30%] flex flex-col justify-between">
        <div ref={scrollContainerRef} className="bg-gray-100 px-2 py-4 rounded-md shadow-inner" style={{ height: `${height - 200}px`, overflowY: 'auto' }}>
          {datas?.length > 0 ? datas?.map((item, index) => {
            return (
              <div key={index} className="chart-container mb-4">
                <div className="flex justify-end w-full mb-2 gap-1">
                  <MdModeEditOutline className="cursor-pointer" onClick={() => { setEditIndex(index); setEditValue(item?.prompt) }}
                    size={25}
                  />
                  {editIndex === index ?
                    <div className="relative">
                      <textarea
                        value={editValue}
                        disabled={loader}
                        onChange={handleOnEditChange}
                        placeholder="Ask me anything"
                        rows={3}
                        cols={45}
                        className="rounded-md text-lg w-full border border-[#0003] bg-transparent px-3 p-2 font-sans font-semibold text-blue-gray-700 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0"
                      />
                      <button
                        onClick={() => { setEditIndex(null); setEditValue("") }}
                        disabled={loader}
                        className={`bg-gray-500 text-white rounded-full disabled:bg-slate-200 disabled:text-gray-500 absolute bottom-2.5 right-16 px-2 py-0.5`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={(e) => handleButtonClick(e, index)}
                        disabled={loader}
                        className={`bg-sky-600 text-white rounded-full disabled:bg-slate-200 disabled:text-gray-500 absolute bottom-2.5 right-1 px-2 py-0.5`}
                      >
                        Send
                      </button>
                    </div>
                    :
                    <span className="w-[70%] bg-gray-300 px-3 py-2 rounded-xl text-sm" style={{ inlineSize: "auto" }}>{item?.prompt}</span>
                  }
                  <FaRegUserCircle
                    size={25}
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <Image
                    className="w-9 h-9 cursor-pointer"
                    src={Logo}
                    alt="Company Logo"
                  />
                  <span className="max-w-[80%] ml-5 bg-red-100 px-3 py-2 rounded-xl text-sm" style={{ inlineSize: "auto", width: "fit-content" }}>{item?.chart}</span>
                </div>
              </div>
            )
          }) : <div className="flex justify-center content-center items-center" style={{ height: `${height - 290}px` }}>  <Image src={BoatImg} alt="BoatImg" className=" w-52 h-52" /></div>}
        </div>
        <div className="relative mt-4">
          <textarea
            value={value}
            disabled={loader}
            onChange={handleOnChange}
            placeholder="Ask me anything related to our courses"
            rows={1}
            cols={45}
            className="rounded-md text-lg w-full border border-[#0003] bg-transparent px-3 p-2 font-sans font-semibold text-blue-gray-700 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0"
          />
          <button
            onClick={(e) => handleButtonClick(e, null)}
            disabled={loader}
            className={`bg-sky-600 text-white rounded-full disabled:bg-slate-200 disabled:text-gray-500 absolute bottom-2.5 right-3 ${loader ? "p-2" : "p-3"}`}
          >
            {loader ? <Loader size={5} /> : <BsSend />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearnerPage;
