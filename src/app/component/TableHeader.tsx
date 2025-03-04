import Image from "next/image";
import React, { useState, useRef, useMemo } from "react";
import { IoIosSearch } from "react-icons/io";
import Table from "../../assets/table.svg";
import Down_Icon from "../../assets/downarrow.svg";
import White_Down_Icon from "../../assets/whitedownarrow.svg";
import WhiteTable from "../../assets/whiteTable.svg";
import Kanban from "../../assets/kanban.svg";
import WhiteKanban from "../../assets/white_kanban.svg";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { useOnClickOutsideMultiple } from "@/CommonData";
import { usePathname, useRouter } from "next/navigation";
import { PiCalendarDotsDuotone } from "react-icons/pi";
import SingleBtn from "./SingleBtn";

const TableHeader = ({
  KanbanStatus = true,
  handelOnSearch,
  searchValue = "",
  handelOnDelete,
  isdelLoader = false,
  deleteStatus = true,
  deletBtnStatus = false,
  filterList,
  active = "table",
  handelOnTableChange,
  filterData,
  handelOnFilter,
  headerImg,
  placeholder,
  headerLable,
  headerBtnLable,
  headerBtnOnClick,
  back = false,
  handelOnBack,
  handelOnTableFilterChange,
  activeFilter,
  activeFilterStatus = [],
  tableData = [],
  calendarView = false,
  handelOnCalendar,
  exportBtn,
  exportOnClick,
  habdelOnEdit,
  editBtn = false,
  editColumns = false,
  setEditValue,
}: {
  active?: string;
  headerImg: any;
  placeholder?: string;
  headerLable: String;
  headerBtnLable?: String;
  headerBtnOnClick?: () => void;
  back?: boolean;
  handelOnBack?: () => void;
  filterList?: any;
  filterData?: string;
  handelOnFilter?: (e: string) => void;
  handelOnTableChange?: (e: string) => void;
  isdelLoader?: boolean;
  handelOnDelete?: () => void;
  deleteStatus?: boolean;
  deletBtnStatus?: Boolean;
  searchValue?: string;
  handelOnSearch?: (e: any) => void;
  KanbanStatus?: boolean;
  handelOnTableFilterChange?: (e: string) => void;
  activeFilter?: string;
  activeFilterStatus?: any;
  tableData?: any;
  calendarView?: boolean;
  handelOnCalendar?: () => void;
  exportBtn?: string;
  editBtn?: boolean;
  exportOnClick?: () => void;
  habdelOnEdit?: (e?: any) => void;
  editColumns?: boolean;
  editValue?: string;
  setEditValue?: any;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const filterbtn = useRef<HTMLDivElement>(null);
  const filterbtndown = useRef<HTMLDivElement>(null);
  //const [active, setActive] = useState<string>('table')
  const [filter, setFilter] = useState<boolean>(false);
  const [filter1, setFilter1] = useState<boolean>(false);
  const [editView, setEditView] = useState<string>();

  const handelonChange = (data: string) => {
    if (handelOnTableChange) {
      handelOnTableChange(data);
    }
  };

  useMemo(() => {
    setEditView("");
  }, [editColumns])

  const handelonChangeEditView = (e?: any) => {
    const { value } = e.target;
    setEditView(value);
  };

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    // Your logic for handling clicks outside of ref1 and ref2 elements
    setFilter(false);
    setFilter1(false);
  };

  useOnClickOutsideMultiple([filterbtn, filterbtndown], handleClickOutside);

  const handelOnFilterData = (data: string) => {
    if (handelOnFilter) {
      handelOnFilter(data);
      setFilter(false);
      setFilter1(false);
    }
  };
  const handelonDelete = () => {
    if (handelOnDelete) {
      if (!deletBtnStatus) {
        handelOnDelete();
        setFilter(false);
      }
    }
  };

  const handelonChangeStatus = (data: string) => {
    if (handelOnTableFilterChange) {
      handelOnTableFilterChange(data);
    }
  };

  const countLeadsByStatus = (status: string) => {
    if (Array.isArray(tableData)) {
      if (status === "all") {
        return tableData?.length;
      } else {
        return tableData?.filter(
          (lead: {
            leadStatus: string;
            opportunityStatus: string;
            batchStatus: string;
            trainerStatus: string;
            status: string;
          }) =>
            (pathname === "/trainers"
              ? lead?.trainerStatus
              : pathname === "/batches"
                ? lead?.batchStatus
                : pathname === "/opportunities"
                  ? lead?.opportunityStatus
                  : pathname === "/campaign" || pathname === "/learner" || pathname === "/tasks"
                    ? lead?.status
                    : lead?.leadStatus) === status.toString()
        ).length;
      }
    }
  };

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-3 justify-between items-center px-5 py-2">
        <div className="flex gap-3 items-center">
          {back && (
            <div className="cursor-pointer" onClick={handelOnBack}>
              <MdOutlineArrowBackIosNew size={25} />
            </div>
          )}
          <Image src={headerImg} alt="Contact icon" />
          <h2 className="text-2xl text-[#032D60] font-medium flex items-center gap-2">
            {headerLable}
            <div ref={filterbtndown}>
              <Image
                src={Down_Icon}
                alt="down arrow"
                className="h-6 w-6 cursor-pointer"
                onClick={() => setFilter1(!filter1)}
              />
              {filter1 && (
                <div className="z-10 absolute bg-white divide-y-4  divide-neutral-400 border border-neutral-400 rounded-lg shadow w-60">
                  <ul
                    className="text-sm rounded-lg  cursor-pointer text-gray-700"
                    aria-labelledby="dropdownMenuIconHorizontalButton"
                  >
                    {filterList?.map((item: any, index: number) => {
                      return (
                        <li
                          key={index}
                          className={`border-b rounded-lg border-b-neutral-300 ${item?.value === filterData && "bg-neutral-200"
                            } `}
                          onClick={() => handelOnFilterData(item?.value)}
                        >
                          <span className="block px-4  py-4 hover:bg-gray-100">
                            {item?.lable}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </h2>
        </div>
        <div className="flex gap-2">
          {calendarView && (
            <PiCalendarDotsDuotone
              size={34}
              // onClick={() => router.push("/calendar")}
              onClick={handelOnCalendar}
              className="cursor-pointer"
            />
          )}

          {headerBtnLable && (
            <button
              onClick={headerBtnOnClick}
              className="flex items-center gap-2 px-4 h-8 justify-center rounded-md bg-[#0176D3] p-1 text-sm font-normal leading-6 text-white"
            >
              {headerBtnLable} <Image src={White_Down_Icon} alt="down arrow" />
            </button>
          )}
          {headerBtnLable && (
            <div ref={filterbtn} className="relative">
              <button
                onClick={() => setFilter(!filter)}
                className="flex items-center gap-2 px-4 h-8 justify-center rounded-md border border-neutral-400 p-1 text-sm font-normal leading-6 "
              >
                {"Actions"} <Image src={Down_Icon} alt="down arrow" />
              </button>
              {filter && (
                <div className="z-10 absolute right-0 bg-white divide-y-2 divide-neutral-400 border border-neutral-400 shadow w-28">
                  <ul
                    className="text-sm text-gray-700"
                    aria-labelledby="dropdownMenuIconHorizontalButton"
                  >
                    <li
                      className={`border-b border-b-neutral-300 ${deletBtnStatus
                        ? "bg-neutral-200 cursor-default"
                        : "cursor-pointer"
                        } `}
                      onClick={handelonDelete}
                    >
                      <span className="block px-4 py-2">Delete</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center px-5 py-2">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="w-72 relative">
              <IoIosSearch
                size={18}
                className="absolute top-2 left-2 text-[#969492]"
              />
              <input
                value={searchValue}
                onChange={handelOnSearch}
                type="search"
                className="block w-full h-8 rounded-md border border-[#969492] pl-8 p-1.5 text-gray-900"
                placeholder="Search"
              />
            </div>

            {activeFilterStatus?.length > 0 && (
              <div className="inline-flex rounded-md shadow-sm" role="group">
                {activeFilterStatus?.map(
                  (
                    item: {
                      value: string;
                      key:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<React.AwaitedReactNode>
                      | null
                      | undefined;
                    },
                    index: any
                  ) => {
                    return (
                      <button
                        onClick={() => handelonChangeStatus(item?.value)}
                        type="button"
                        className={`inline-flex gap-2 items-center px-4 py-1 text-sm font-normal border border-[#747474] focus:border-transparent' transition duration-700 ${index === activeFilterStatus?.length - 1
                          ? "rounded-e-lg"
                          : index === 0
                            ? "rounded-s-lg"
                            : ""
                          } ${activeFilter === item?.value
                            ? "bg-[#0176D3] text-[#FFFFFF]"
                            : "text-gray-900 bg-transparent"
                          }`}
                      >
                        {item?.key}
                        <p className=" text-white bg-[#E6086D] py-1 px-2.5 rounded-full">
                          {countLeadsByStatus(item?.value)}
                        </p>
                      </button>
                    );
                  }
                )}
              </div>
            )}

            {KanbanStatus && (
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  onClick={() => handelonChange("table")}
                  type="button"
                  className={`inline-flex gap-2 items-center px-4 py-2 text-sm font-normal border border-[#747474] rounded-s-lg focus:border-transparent' transition duration-700 ${active === "table"
                    ? "bg-[#0176D3] text-[#FFFFFF]"
                    : "text-gray-900 bg-transparent"
                    }`}
                >
                  <Image
                    src={active === "table" ? WhiteTable : Table}
                    alt="table icon"
                  />
                  Table
                </button>
                <button
                  onClick={() => handelonChange("card")}
                  type="button"
                  className={`inline-flex gap-2 items-center px-4 py-2 text-sm font-normal border border-[#747474] rounded-e-lg transition duration-700 ${active === "card"
                    ? "bg-[#0176D3] text-[#FFFFFF]"
                    : "text-gray-900 bg-transparent"
                    }`}
                >
                  {/* hover color */}
                  {/* hover:bg-[#0176D3] hover:text-white focus:bg-[#0176D3] focus:text-white focus:border-transparent */}
                  <Image
                    src={active === "card" ? WhiteKanban : Kanban}
                    alt="Card icon"
                  />
                  Kanban
                </button>
              </div>
            )}

            {/* <div ref={filterbtn} className='relative'>
                        <Image src={Filter} alt="Filter icon" className='h-9 cursor-pointer' onClick={() => setFilter(!filter)} />
                        {filter && <div className="z-10 absolute bg-white divide-y-4 divide-neutral-400 border border-neutral-400 rounded-lg shadow w-44">
                            <ul className="text-sm rounded-lg cursor-pointer text-gray-700" aria-labelledby="dropdownMenuIconHorizontalButton">
                                {filterList?.map((item: any, index: number) => {
                                    return (
                                        <li key={index} className={`border-b border-b-neutral-300 ${item?.value === filterData && 'bg-neutral-200'} `} onClick={() => handelOnFilterData(item?.value)}>
                                            <span className="block px-4 py-2 hover:bg-gray-100">{item?.lable}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>}
                    </div> */}
          </div>
          {/* <div className='flex items-center gap-6'>
                    {deleteStatus && <div className={`${isdelLoader ? 'w-24' : 'w-20'}`}>
                        <SingleBtn name="Delete" color="red" disable={deletBtnStatus} loader={isdelLoader} onClick={handelOnDelete} />
                    </div>}
                    <button type="button" className="inline-flex gap-3 items-center py-2 text-base font-normal text-[#181818] bg-transparent ">
                        <Image src={Download} alt="download icon" />
                        Download
                    </button>
                </div> */}
        </div>
        <div className="flex gap-3">
          {editBtn && editView && <div>
            <SingleBtn icon="edit" name="Edit Fields" onClick={() => setEditValue(editView)} />
          </div>}
          {editBtn &&
            editColumns ? <div className="flex gap-2">
            <select value={editView} onChange={handelonChangeEditView} className="h-8 max-w-36 px-3 whitespace-nowrap text-base font-normal focus:outline-none rounded border">
              <option value="">Edit View</option>
              {activeFilterStatus?.map((item: {
                value: string;
                key:
                | string
                | number
                | bigint
                | boolean
                | null
                | undefined;
              },
                index: any) => {
                return (
                  <option key={index} value={item?.value}>{item?.key}</option>
                );
              })}
            </select>
            <div>
              <SingleBtn name="Add Kanban" onClick={() => setEditValue("0")} />
            </div>
          </div> :
            <div>
              <SingleBtn icon="edit" name="Edit Columns" onClick={habdelOnEdit} />
            </div>
          }
          {exportBtn && (
            <div>
              <SingleBtn name={exportBtn} onClick={exportOnClick} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
