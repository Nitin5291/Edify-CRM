"use client";
import React, { useEffect, useRef, useState } from "react";
import Logo from "../../assets/Digital_Edify.png";
// import Logo from "../../assets/skillcapital.png";
import ProfileLogo from "../../assets/profileLogo.png";
import Down_Icon from "../../assets/downarrow.svg";
import { SlBell } from "react-icons/sl";
import { FaRegUserCircle } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import AIicon from "../../assets/AILogo1.gif";
import Message from "../../assets/message.png"
import Phone from "../../assets/phone.png"
import { getUserRole, logout } from "@/assets/utils/auth.util";
import { navigation, useOnClickOutsideMultiple } from "@/CommonData";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import Confetti from "react-confetti";
import { IoSearchSharp } from "react-icons/io5";

import {
  CreateLeadeStatus,
  CreateOpportunityStatus,
} from "@/lib/features/navbar/navbarSlice";
import useWindowSize from "react-use/lib/useWindowSize";
import SearchCustomModel from "../component/SearchCustomModel";
import { IoIosSearch } from "react-icons/io";
// import { PiCalendarDotsDuotone } from "react-icons/pi";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<Boolean>(false);
  const [isLogout, setIsLogout] = useState<Boolean>(false);
  const [isNotification, setIsNotification] = useState<Boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [isNavbar, setIsNavbar] = useState(navigation);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchModel, setSearchModel] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const logoutbtn = useRef<HTMLDivElement>(null);
  const headerLeft = useRef<HTMLDivElement>(null);
  const notificationbtn = useRef<HTMLDivElement>(null);
  const filterbtn = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { Greeting } = useAppSelector((state) => state?.nav);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (pathname !== "#") {
      const data = navigation?.map((item) => {
        if (item?.href === pathname) {
          return { ...item, current: true };
        } else {
          return { ...item, current: false };
        }
      });
      setIsNavbar(data);
    }
  }, [pathname]);

  const handleClickOutside = () => {
    setIsLogout(false);
    setIsNotification(false);
    setIsOpen(false);
    setFilter("");
  };

  useOnClickOutsideMultiple(
    [logoutbtn, notificationbtn, filterbtn, headerLeft],
    handleClickOutside
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handelOnTabChange = (name: String, href: String) => {
    if (href !== "#") {
      router.push(`${href}`);
      const data = navigation?.map((item) => {
        if (item?.name === name) {
          return { ...item, current: true };
        } else {
          return { ...item, current: false };
        }
      });
      setIsNavbar(data);
    }
  };

  const handelOnlogout = () => {
    logout();
    router.push("/");
  };

  const handelOnFilterData = (data: string) => {
    if (data === "Create Lead") {
      router.push("/leads");
      dispatch(CreateLeadeStatus(true));
    } else if (data === "Create Opportunity") {
      router.push("/opportunities");
      dispatch(CreateOpportunityStatus(true));
    } else if (data === filter) {
      setFilter("");
    }
    setFilter("");
  };

  return (
    <nav className="sticky top-0 z-10 bg-white">
      <Confetti
        numberOfPieces={Greeting ? 300 : 0}
        gravity={0.1}
        width={width - 18}
        height={height}
      />
      <div className="mx-auto z-10 bg-white flex justify-between relative shadow-lg items-center py-2 lg:py-0 lg:pt-4 px-2 lg:px-6 md:pr-4">
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden ml-auto p-2 focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>

          {/* Company Logo */}
          <div
            /* className="pr-4 lg:pb-3" */ className="flex gap-3 lg:pb-1 align-middle"

          >
            {/* <div ref={headerLeft} >
              <Image className="h-10 pt-0 xl:pt-1 cursor-pointer" src={Menu_Icon} alt="Menu Icon" onClick={() => setIsOpen(!isOpen)} />
              //  <Image className="h-10 pt-1" src={Menu_Icon} alt="Menu Icon" />
              {isOpen && (
                <div
                  className="origin-top-left absolute left-2 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                // tabIndex="-1"
                >
                  <div className="py-1" role="none">
                    <div className="px-4 py-2 text-sm text-gray-900">
                      <div className="relative">
                        <IoIosSearch size={18} className='absolute top-2 left-2 text-[#969492]' />
                        <input type="search" className="block w-full h-8 rounded-md border border-[#969492] pl-8 p-1.5 text-gray-900 focus:outline-none" placeholder="Search" />
                      </div>
                    </div>
                    <div className="px-4 py-2 text-sm text-gray-900 cursor-pointer flex gap-2 items-center" onClick={() => {
                      router.push("/calendar");
                      setIsOpen(false);
                    }}><FaCalendarAlt />Calendar</div>
                    <div className="px-4 py-2 text-sm text-gray-900 cursor-pointer flex gap-2 items-center"> <MdLeaderboard />Cold Leads</div>
                  </div>
                </div>
              )}
            </div> */}
            <Image
              className="w-16 !h-10 my-2 lg:my-0 xl:pb-2 cursor-pointer"
              src={Logo}
              alt="Company Logo"
              layout="responsive"
              onClick={() => handelOnTabChange("Dashboard", "/dashboard")}
            />
          </div>
        </div>

        {/* Icons */}
        <div className="flex gap-4 xl:gap-7" ref={filterbtn}>
          {/* Desktop Navigation */}
          {/* <div className="hidden lg:flex">
            {isNavbar?.map((item) => (
              <div
                key={item.name}
                className={classNames(
                  item.current
                    ? "bg-red-100 relative border-b-2 border-b-red-500"
                    : "hover:border-b-2 hover:border-b-red-500",
                  "items-center relative text-black rounded-t pb-4 text-base font-normal cursor-pointer flex gap-2 px-2 py-1.5 mx-0 xl:mx-1 xl:py-3 xl:px-3 xl:gap-3 xl:text-lg "
                )}
                aria-current={item?.current ? "page" : undefined}
              >
                <span onClick={() => handelOnTabChange(item?.name, item?.href)}>
                  {item?.name}
                </span>
                {item?.name !== "Home" && item?.name !== "Ask AI" && (
                  <div className="w-full">
                    <Image
                      src={Down_Icon}
                      alt="down arrow"
                      onClick={() => setFilter(item?.name)}
                    />
                    {item?.children && item?.name === filter && (
                      <div className="z-40 top-12 xl:top-14 left-0 absolute w-full bg-white divide-y-4 divide-neutral-400 border border-neutral-400 shadow ">
                        <ul className="text-sm cursor-pointer text-gray-700">
                          {item?.children?.map((childItem, index) => (
                            <li
                              key={index}
                              className={`border-b border-b-neutral-300 ${
                                childItem?.name === filter && "bg-neutral-200"
                              }`}
                              onClick={() =>
                                handelOnFilterData(childItem?.name)
                              }
                            >
                              <span className="block px-2 py-2 hover:bg-gray-100">
                                {childItem?.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div> */}
          <div className="hidden lg:flex">
            {isNavbar?.map((item) => (
              <div
                key={item.name}
                className={classNames(
                  item.current
                    ? " relative border-b-4 border-b-[#5028CC]"
                    : "hover:border-b-2 hover:border-b-[#5028CC]",
                  "items-center relative text-black rounded-t pb-3 text-base font-normal cursor-pointer flex gap-2 px-1 py-1 mx-0 xl:mx-0.5 xl:py-3 xl:px-2 xl:gap-1.5 xl:text-lg"
                )}
                aria-current={item?.current ? "page" : undefined}
              >
                <span onClick={() => handelOnTabChange(item?.name, item?.href)}>
                  {item?.name}
                </span>
                {item?.name !== "Dashboard" && item?.name !== "Ask AI" && (
                  <div className="w-full">
                    {/* <Image
                      src={Down_Icon}
                      alt="down arrow"
                      onClick={() => setFilter(item?.name)}
                    /> */}
                    {item?.children && item?.name === filter && (
                      <div className="z-40 top-12 xl:top-14 left-0 absolute w-full bg-white divide-y-4 divide-neutral-400 border border-neutral-400 shadow">
                        <ul className="text-sm cursor-pointer text-gray-700">
                          {item?.children?.map((childItem, index) => (
                            <li
                              key={index}
                              className={`border-b border-b-neutral-300 ${childItem?.name === filter && "bg-neutral-200"
                                }`}
                              onClick={() =>
                                handelOnFilterData(childItem?.name)
                              }
                            >
                              <span className="block px-2 py-2 hover:bg-gray-100">
                                {childItem?.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
        <div className="flex items-center  gap-4 px-4 lg:pb-3 lg:px-0 relative">
          {/* <PiCalendarDotsDuotone size={28}
              onClick={() => router.push("/calendar")}
              className="cursor-pointer" /> */}
          <IoSearchSharp size={26} className="cursor-pointer" onClick={() => setSearchModel(!searchModel)} />
          <Image
            src={Phone}
            alt="Phone"
            className="w-7 h-7 cursor-pointer" // Add cursor-pointer for better UX
          // onClick={() => router.push("/message")} // Add onClick handler to navigate
          />
          <Image
            src={Message}
            alt="AI chat"
            className="w-8 h-7 cursor-pointer" // Add cursor-pointer for better UX
            onClick={() => router.push("/message")} // Add onClick handler to navigate
          />
          <Image
            src={AIicon}
            alt="AI chat"
            className="w-10 h-9 cursor-pointer" // Add cursor-pointer for better UX
            onClick={() => router.push("/ask_aI")} // Add onClick handler to navigate
          />
          <div ref={notificationbtn}>
            <SlBell
              size={25}
              onClick={() => setIsNotification(!isNotification)}
              className="cursor-pointer"
            />
            {isNotification && (
              <div className="absolute px-4 py-2 z-50 w-auto text-sm bg-white border border-gray-100 rounded-lg shadow-md top-9 right-1.5">
                <h1 className="text-xl border-b-2">Notifications</h1>
                <div className="p-2 pb-0 text-gray-900 md:pb-4">
                  <ul
                    className="space-y-3"
                    aria-labelledby="mega-menu-dropdown-button"
                  >
                    {/* <li>
                                            <p className="text-gray-500 cursor-pointer">
                                                Add Contact
                                            </p>
                                        </li> */}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <div ref={logoutbtn}>
            <Image
              src={ProfileLogo}
              alt="Profile Logo"
              className="w-9 h-9 cursor-pointer text-red-600" // Add cursor-pointer for better UX
              onClick={() => setIsLogout(!isLogout)}
            />

            {isLogout && (
              <div className="absolute z-50 w-24 text-sm bg-white border border-gray-100 rounded shadow-md top-9 right-0.5">
                <div className="pb-0 w-full text-gray-900">
                  <ul className="w-full">
                    {getUserRole() === "admin" && (
                      <li className="border-b border-b-gray-300">
                        <p
                          onClick={() => {
                            router.push("/user");
                            setIsLogout(false);
                          }}
                          className="text-gray-500 text-base cursor-pointer px-3 py-2"
                        >
                          User
                        </p>
                      </li>
                    )}
                    <li>
                      <p
                        onClick={() => handelOnlogout()}
                        className="text-gray-500 text-base cursor-pointer px-3 py-2"
                      >
                        Logout
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white py-2 px-6 w-full">
          {isNavbar?.map((item) => (
            <div
              key={item.name}
              //onClick={() => { handelOnTabChange(item?.name, item?.href); toggleMenu() }}
              className={classNames(
                item.current
                  ? "text-gray-900 "
                  : "text-gray-600 hover:text-gray-900",
                "flex justify-between w-full py-2 px-4 text-lg font-normal"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              <div className="w-full">
                <span
                  onClick={() => {
                    handelOnTabChange(item?.name, item?.href);
                    toggleMenu();
                  }}
                >
                  {item.name}
                </span>
                {/* {item?.children && item?.name === filter && (
                                    <div className="w-full bg-white divide-y-4 divide-neutral-400 border border-neutral-400 shadow" onClick={() => alert("test")}>
                                        <ul className="text-sm cursor-pointer text-gray-700">
                                            {item?.children?.map((childItem, index) => (
                                                <li
                                                    key={index}
                                                    className={`border-b w-full border-b-neutral-300 ${childItem?.name === filter && 'bg-neutral-200'}`}
                                                    onClick={() => handelOnFilterData(childItem?.name)}
                                                >
                                                    <span className="block px-2 py-2 hover:bg-gray-100">{childItem?.name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )} */}
              </div>
              {/* {item?.name !== "Home" && (
                                <div className='grid justify-end'>
                                    <Image src={Down_Icon} alt="down arrow" onClick={() => setFilter(item?.name)} />
                                </div>
                            )} */}
            </div>
          ))}
        </div>
      )}
      {searchModel && <SearchCustomModel onClose={() => setSearchModel(!searchModel)}>
        <div className="w-full mt-4 relative">
          <IoIosSearch
            size={18}
            className="absolute top-3 left-2 text-[#969492]"
          />
          <input
            // value={searchValue}
            // onChange={handelOnSearch}
            type="search"
            className="block w-full h-10 rounded-3xl border border-[#d3d2d2] shadow outline-none pl-8 p-1.5 text-gray-900"
            placeholder="Search"
          />
        </div>
      </SearchCustomModel>}
    </nav>
  );
};

export default Navbar;
