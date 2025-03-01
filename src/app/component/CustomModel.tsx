import React from "react";
import JointBtn from "./JointBtn";
import Image from "next/image";

const CustomModel = ({
  headerImg,
  lable,
  children,
  onSave,
  onCancel,
  onClose,
  close = false,
  isLoading = false,
  button2,
  button1,
  disablButton1,
  disablButton2,
  large = false,
  small = false
}: {
  button2?: string;
  button1?: string;
  disablButton1?: boolean;
  disablButton2?: boolean;
  isLoading?: Boolean;
  headerImg?: any;
  lable: String;
  children: any;
  onSave?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  close?: boolean;
  large?: boolean;
  small?: boolean;
}) => {
  return (
    <>
      <div
        aria-hidden="true"
        className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
      >
        <div
          className={`relative p-4 w-full ${small ? "max-w-2xl" : large ? "max-w-4xl xl:max-w-screen-2xl" : "max-w-3xl xl:max-w-5xl"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal content */}
          <div className="relative md:px-8 bg-white rounded-lg shadow">
            {/* Modal header */}
            <div className="flex gap-4 items-center justify-between p-4 md:p-5 border-b rounded-t">
              {headerImg && (
                <Image
                  src={headerImg}
                  alt="header image"
                  className="w-9 h-9"
                />
              )}
              <h3 className="text-xl font-semibold text-gray-900">{lable}</h3>
              <button
                disabled={isLoading ? true : false}
                onClick={close ? onClose : onCancel}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <div className="p-4 px-8 md:px-6 md:p-5 max-h-[80vh] overflow-auto">
              {/* <div className="grid gap-6 mb-8 md:grid-cols-2"> */}
              {children}
              {/* </div> */}
            </div>
            {/* Modal footer */}
            <div className="flex items-center gap-2 justify-center py-5 pt-5 pb-2.5 border-t border-gray-200 rounded-b">
              <JointBtn
                button1={button1 ? button1 : "Cancel"}
                button2={button2 ? button2 : "Create"}
                onClick1={onCancel}
                onClick2={onSave}
                isLoading={isLoading}
                disablButton1={disablButton1}
                disablButton2={disablButton2}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomModel;
