import Image from "next/image";
import React from "react";
import Edit from "../../assets/Edit.svg";
import moment from "moment";
import { convertDate } from "@/CommonData";

const InputEdit = ({
  lable,
  disable,
  type,
  name,
  name1,
  value,
  value1,
  onChange,
  handelOnStatus,
  error,
  alphaBatically = true
}: {
  lable: String;
  disable: Boolean;
  type: string;
  name: String;
  name1?: string;
  value?: any;
  value1?: any;
  // onChange?: (e: any) => void;
  onChange?: any;
  handelOnStatus: (name: String, status: Boolean) => void;
  error?: string;
  alphaBatically?: boolean;
}) => {
  const handleKeyDown = (e: {
    ctrlKey: any;
    key: string;
    preventDefault: () => void;
  }) => {
    // Allow only numeric digits, backspace, and clipboard operations (Ctrl+C, Ctrl+V, Ctrl+A)
    const allowedKeys = [
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      "Tab",
      "Enter",
      "Control"
    ];

    const isControlKey = e.ctrlKey && ["c", "v", "a"].includes(e.key);

    if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key) && !isControlKey) {
      e.preventDefault();
    }
  };

  const handleTextKeyDown = (e: {
    key: string;
    preventDefault: () => void;
  }) => {
    // Allow only alphabetic characters and spaces
    if (!/^[a-zA-Z\s]*$/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  const handleDoubleClick = () => {
    handelOnStatus(name, false);
  };

  const extractFilename = (url: string) => {
    if (typeof url !== 'string' && url) {
      throw new Error('Invalid input: URL must be a string');
    }
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  return (
    <div>
      <button className="h-11 w-full min-w-[200px]">
        <label className="font-medium text-base text-[#444444] flex gap-2">
          {lable}
          {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
        </label>
        <div className="relative">
          {disable && (
            <button
              className="absolute w-full h-full"
              onDoubleClick={handleDoubleClick}
            ></button>
          )}
          {disable && (
            <Image
              src={Edit}
              alt="edit icon"
              onClick={() => handelOnStatus(name, false)}
              className="absolute right-1 cursor-pointer"
            />
          )}
          {type === "file" ? (
            <label >
              <div className="flex cursor-pointer">
                <span
                  onDoubleClick={handleDoubleClick}
                  className="h-full text-start text-lg w-full border-b border-[#0003] -mt-2.5 bg-transparent pt-4 font-sans font-semibold text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 text-neutral-400"
                >
                  {value?.name ? value?.name : value ? extractFilename(value) : lable ? lable : "Choose File"}
                </span>
              </div>
              <input
                // placeholder={`${lable}`}
                name={`${name}`}
                onChange={(e: any) => {
                  onChange(e);
                  e.target.value = null
                }}
                disabled={disable ? true : false}
                onDoubleClick={handleDoubleClick}
                type={`${type}`}
                className="hidden"
              />
            </label>
          ) : type === "date" ? (
            <input
              // placeholder={`${lable}`}
              name={`${name}`}
              value={`${value ? moment(new Date(value)).format("YYYY-MM-DD") : ""
                }`}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              min={moment(new Date()).format("YYYY-MM-DD")}
              disabled={disable ? true : false}
              type={`${type}`}
              className="h-full text-lg w-full border-b border-[#0003] -mt-2 bg-transparent pt-4 pb-1.5 font-sans font-semibold text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0"
            />
          ) : type === "datetime-local" ? (
            <input
              placeholder={`${lable}`}
              name={`${name}`}
              value={`${value ? convertDate(value) : ""}`}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              min={name === "visitedDate" ? convertDate(new Date(`${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear() - 1}`)) : convertDate(new Date())}
              disabled={disable ? true : false}
              type={`${type}`}
              className="h-full text-lg w-full border-b border-[#0003] -mt-2 bg-transparent pt-4 pb-1.5 font-sans font-semibold text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0"
            />
          ) : name === "phone" ? (
            <div className='h-full flex gap-2'>
              <div className='h-full flex relative'>
                <p className='absolute top-1 text-xl'>+</p>
                <input
                  // placeholder={`${lable}`}
                  name={`${name1}`}
                  value={`${value1 ? value1 : ""}`}
                  onChange={onChange}
                  disabled={disable ? true : false}
                  onDoubleClick={handleDoubleClick}
                  onKeyDown={handleKeyDown}
                  type={`${type}`}
                  className="pl-4 h-full text-lg w-14 border-b border-[#0003] -mt-2 bg-transparent pt-4 pb-1.5 font-sans font-semibold text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0"
                />
              </div>
              <input
                // placeholder={`${lable}`}
                name={`${name}`}
                value={`${value ? value : ""}`}
                onChange={onChange}
                disabled={disable ? true : false}
                onDoubleClick={handleDoubleClick}
                onKeyDown={
                  alphaBatically ?
                    name === "amountSpent" ||
                      name === "phone" ||
                      name === "feeQuoted" ||
                      name === "phoneNumber" ||
                      name === "leadScore" ||
                      name === "trainerId" ||
                      name === "freeSlots" ||
                      name === "countryCode"
                      ? handleKeyDown
                      : name === "name"
                        ? handleTextKeyDown
                        : undefined
                    : undefined
                }
                type={`${type}`}
                className="h-full text-lg w-full border-b border-[#0003] -mt-2 bg-transparent pt-4 pb-1.5 font-sans font-semibold text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0"
              />
            </div>
          ) : (
            <input
              // placeholder={`${lable}`}
              name={`${name}`}
              value={`${value ? value : ""}`}
              onChange={onChange}
              disabled={disable ? true : false}
              onDoubleClick={handleDoubleClick}
              onKeyDown={
                alphaBatically ?
                  name === "amountSpent" ||
                    name === "phone" ||
                    name === "feeQuoted" ||
                    name === "phoneNumber" ||
                    name === "leadScore" ||
                    name === "trainerId" ||
                    name === "freeSlots" ||
                    name === "countryCode"
                    ? handleKeyDown
                    : name === "name"
                      ? handleTextKeyDown
                      : undefined
                  : undefined
              }
              type={`${type}`}
              className="h-full text-lg w-full border-b border-[#0003] -mt-2 bg-transparent pt-4 pb-1.5 font-sans font-semibold text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0"
            />
          )}
        </div>
      </button>
    </div>
  );
};

export default InputEdit;
