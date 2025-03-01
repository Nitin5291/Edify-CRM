"use client";
import CustomInput from "@/app/component/CustomInput";
import QuillEditor from "@/app/component/QuillEditor";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { EmailRowData, EmailView } from "../component/Type";
import { toast } from "react-toastify";
import {
  addEmail,
  addEmailTemplate,
  aksAI,
  getEmail,
} from "@/lib/features/lead/leadSlice";
import ButtonInput from "../component/ButtonInput";
import { getUserID } from "@/assets/utils/auth.util";
import SingleBtn from "../component/SingleBtn";
import Table from "../component/Table";
import { ColDef } from "ag-grid-community";
import CustomModel from "../component/CustomModel";
import SingleSelece from "../component/SingleSelece";
import { EmailTypeData, FilterLableAndValue } from "@/CommonData";
import Loader from "../component/Loader";
import Email from "../../assets/email.svg";

export const initialColumnDefsEmail: ColDef[] = [
  {
    field: "from",
    headerName: "From",
    minWidth: 215,
    maxWidth: 300,
  },
  {
    field: "to",
    headerName: "To",
    minWidth: 215,
    maxWidth: 300,
  },
  // {
  //   field: "bcc",
  //   headerName: "Bcc",
  //   minWidth: 215,
  //   maxWidth: 300,
  // },
  {
    field: "subject",
    headerName: "Subject",
    minWidth: 425,
    maxWidth: 600,
  },
  {
    field: "body",
    headerName: "Body",
    minWidth: 570,
    maxWidth: 1000,
    cellRenderer: (params: { data: any }) => {
      const data = params.data;
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: data?.body
              ? data?.body
              : data?.emailTemplate?.htmlContent,
          }}
        ></div>
      );
    },
  },
];
const EmailPage = () => {
  const [emailData, setEmailData] = useState<EmailRowData>(EmailView);
  const [error, setError] = useState<EmailRowData>(EmailView);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loading1, setLoading1] = useState<boolean>(false);
  const [text, setText] = useState<any>();
  const [textError, setTextError] = useState<string>("");
  const [isModel, setIsModel] = useState<boolean>(false);
  const [isTemp, setIsTemp] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { SingleLead, email, isLoader } = useAppSelector(
    (state) => state?.lead
  );

  useEffect(() => {
    dispatch(getEmail(SingleLead?.id));
    setEmailData({
      ...emailData,
      ["to"]: [SingleLead?.email],
      ["from"]: "kdigital@yopmail.com",
    });
  }, [SingleLead]);



  const handleChange = (value: string) => {
    setText(value);
    setTextError("");
  };

  const handelOnChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setEmailData({ ...emailData, [`${name}`]: value });
    setError({ ...error, [`${name}`]: "" });
  };

  const handelOnData = (name?: string, data?: any[]) => {
    setEmailData({ ...emailData, [`${name}`]: data });
    setError({ ...error, [`${name}`]: "" });
  };

  const vaidation = () => {
    let formValid = true;
    const regex = /^[\w-]+(\.[\w-]+)*@([a-z\d]+(-[a-z\d]+)*\.)+[a-z]{2,}$/i;
    const newError: any = {};

    if (!(emailData?.to?.length > 0)) {
      formValid = false;
      newError["to"] = "Please enter to";
    }
    if (!emailData?.from?.trim()) {
      formValid = false;
      newError["from"] = "Please enter from";
    } else if (!regex.test(emailData?.from)) {
      formValid = false;
      newError["from"] = "Please enter a valid email address";
    }
    if (!(emailData?.bcc?.length > 0)) {
      formValid = false;
      newError["bcc"] = "Please enter bcc";
    }
    if (!emailData?.subject) {
      formValid = false;
      newError["subject"] = "Please enter subject";
    }
    if (!text) {
      formValid = false;
      setTextError("Please enter message");
    }

    setError(newError);
    return formValid;
  };

  const handelOnSave = () => {
    //if (vaidation()) {
    setIsLoading(true);
    if (isTemp) {
      const data = {
        name: emailData?.template ? emailData?.template : emailData?.ask_ai,
        subject: emailData?.subject,
        htmlContent: text,
        userId: getUserID(),
      };
      dispatch(addEmailTemplate(data))
        .unwrap()
        .then((res: any) => {
          if (res?.status === 201) {
            handelOnVarify(res?.data?.template?.id);
          }
        })
        .catch((err: any) => {
          const error = JSON?.parse(err?.message);
          toast.error(error?.message ? error?.message : "Something went wrong");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      handelOnVarify();
    }
    // }
  };

  const handelOnVarify = (id?: number) => {
    const dataTemp = {
      to: emailData?.to,
      // bcc: emailData?.bcc,
      from: emailData?.from,
      subject: emailData?.subject,
      emailTemplateId: id,
      leadId: SingleLead?.id,
      userId: getUserID(),
    };
    const data = {
      to: emailData?.to,
      // bcc: emailData?.bcc,
      from: emailData?.from,
      subject: emailData?.subject,
      htmlContent: text,
      leadId: SingleLead?.id,
      userId: getUserID(),
    };
    dispatch(addEmail(id ? dataTemp : data))
      .unwrap()
      .then((res: any) => {
        if (res) {
          toast.success("Email sent successfully");
          //toast.success(res?.data?.message ? res?.data?.message : "Email sent successfully");
          handelOnCancel();
          setIsTemp(false);
          dispatch(getEmail(SingleLead?.id));
        }
      })
      .catch((err: any) => {
        const error = JSON?.parse(err?.message);
        toast.error(error?.error ? error?.error : "Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handelOnCancel = () => {
    setText("");
    setError(EmailView);
    setEmailData(EmailView);
    setEmailData({
      ...EmailView,
      ["to"]: [SingleLead?.email],
      ["from"]: "kdigital@yopmail.com",
    });
    setIsModel(!isModel);
  };

  const handelOnKey = (e: any) => {
    setEmailData({ ...emailData, ["ask_ai"]: e.target.value });
    if (e.key === "Enter") {
      if (e?.target?.value) {
        setLoading(true);
        setIsTemp(true);
        const searchData = {
          searchQuery: `Generate Emails Template For ${e?.target?.value}`,
        };
        dispatch(aksAI(searchData))
          .then((res: any) => {
            if (res?.payload?.status === 200) {
              setText(res?.payload?.data?.result?.replaceAll("\n", "<br>"));
              setLoading(false);
              setEmailData({
                ...emailData,
                ["subject"]: e?.target?.value,
                ["ask_ai"]: e?.target?.value,
                ["template"]: "",
              });
            } else {
              setLoading(false);
              setIsTemp(false);
              toast.error(res.response.data.error.message);
            }
          })
          .catch((err) => {
            setIsTemp(false);
            const error = JSON?.parse(err?.message);
            toast.error(
              error?.message ? error?.message : "Something went wrong"
            );
          });
      }
    }
  };

  const SearchClick = (data: any) => {
    if (data) {
      setLoading(true);
      setEmailData({
        ...emailData,
        ["subject"]: data,
        ["ask_ai"]: data,
        ["template"]: "",
      });
      const searchData = {
        searchQuery: `Generate Emails Template For ${data}`,
      };
      setIsTemp(true);
      dispatch(aksAI(searchData))
        .then((res: any) => {
          if (res?.payload?.status === 200) {
            setText(res?.payload?.data?.result?.replaceAll("\n", "<br>"));
            setLoading(false);
          } else {
            setLoading(false);
            setIsTemp(false);
            toast.error(res.response.data.error.message);
          }
        })
        .catch((err) => {
          setIsTemp(false);
          setLoading(false);
          const error = JSON?.parse(err?.message);
          toast.error(error?.message ? error?.message : "Something went wrong");
        });
    }
  };
  const DropDownClick = (data: any) => {
    if (data) {
      setLoading1(true);
      setEmailData({
        ...emailData,
        ["subject"]: data?.target?.value,
        ["template"]: data?.target?.value,
      });
      const searchData = {
        searchQuery: `Generate Emails Template For ${data?.target?.value}`,
      };
      setIsTemp(true);
      dispatch(aksAI(searchData))
        .then((res: any) => {
          if (res?.payload?.status === 200) {
            setText(res?.payload?.data?.result?.replaceAll("\n", "<br>"));
            setLoading1(false);
          } else {
            setLoading1(false);
            setIsTemp(false);
            toast.error(res.response.data.error.message);
          }
        })
        .catch((err) => {
          setLoading1(false);
          setIsTemp(false);
          const error = JSON?.parse(err?.message);
          toast.error(error?.message ? error?.message : "Something went wrong");
        });
    }
  };
  return (
    <div>
      <div className="px-5 pt-7 pb-6">
        {isModel && (
          <CustomModel
            lable="Create Email"
            onCancel={handelOnCancel}
            onSave={handelOnSave}
            isLoading={isLoading}
            headerImg={Email}
          >
            <>
              <div className="grid gap-8 mb-7 md:grid-cols-2">
                <CustomInput
                  name="from"
                  disabled={true}
                  value={emailData?.from}
                  error={error?.from}
                  onChange={handelOnChange}
                  lableValue="From"
                  placeholder="From"
                  typeValue="email"
                />
                <ButtonInput
                  placeholder="To"
                  value={emailData?.to}
                  name="to"
                  typeValue="email"
                  handelOnData={handelOnData}
                  lableValue="To"
                  error={error?.to}
                />
              </div>
              {/* <ButtonInput
                  placeholder="Bcc"
                  value={emailData?.bcc}
                  name="bcc"
                  typeValue="email"
                  handelOnData={handelOnData}
                  lableValue="Bcc"
                  error={error?.bcc}
                /> */}
              <div className="grid gap-8 mb-8 ">
                <CustomInput
                  name="subject"
                  value={emailData?.subject}
                  error={error?.subject}
                  onChange={handelOnChange}
                  lableValue="Subject"
                  placeholder="Subject"
                  typeValue="text"
                />
              </div>
              <div className="grid gap-8 mb-8 md:grid-cols-2">
                {loading1 ? (
                  <div className="relative">
                    <CustomInput
                      disabled={loading}
                      name="template"
                      value={emailData?.template}
                      error={error?.template}
                      onChange={handelOnChange}
                      lableValue="Templates"
                      placeholder="Templates"
                      typeValue="text"
                      handelOnKey={handelOnKey}
                    />
                    <button
                      type="submit"
                      className="absolute end-2.5 bottom-0.5 text-sky-600 text-base font-medium"
                      onClick={() => DropDownClick(emailData?.template)}
                    >
                      <Loader />
                    </button>
                  </div>
                ) : (
                  <SingleSelece
                    onChange={DropDownClick}
                    value={emailData?.template}
                    name="template"
                    lableValue="Templates"
                    data={FilterLableAndValue(EmailTypeData)}
                  />
                )}
                <div className="relative">
                  <CustomInput
                    disabled={loading || loading1}
                    name="ask_ai"
                    value={emailData?.ask_ai}
                    onChange={handelOnChange}
                    lableValue="Ask Ai"
                    placeholder="Ask Ai"
                    typeValue="text"
                    handelOnKey={handelOnKey}
                  />
                  <button
                    type="submit"
                    disabled={loading || loading1}
                    className="absolute end-2.5 bottom-0.5 text-sky-600 text-base font-medium"
                    onClick={() => SearchClick(emailData?.ask_ai)}
                  >
                    {!loading ? "Search" : <Loader />}
                  </button>
                </div>

                {/* <SearchableDropdown
                                placeholder={'Search Template'}
                                options={FilterLableAndValue(EmailTypeData)}
                                selectedVal={value}
                                handleChange={DropDownClick}
                                handelOnKey={handelOnKey}
                                lableValue='Template'
                                loading={loading}
                            /> */}
              </div>
              <div className="mb-8">
                <span className="text-red-500 text-sm mt-1">{textError}</span>
                <QuillEditor handleChange={handleChange} text={text} />
              </div>
            </>
          </CustomModel>
        )}

        <div className="grid gap-2 mb-3">
          <div className="flex px-1">
            {/* <h2 className="text-black text-lg font-semibold">Email</h2> */}
            <SingleBtn
              name="+ New Email"
              bgcolor="sky"
              onClick={() => {
                setIsModel(!isModel);
              }}
            />
          </div>
          <Table
            noDataFoundMsg="Email data no found"
            isLoader={isLoader}
            initialColumnDefs={initialColumnDefsEmail}
            datas={email?.emails}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailPage;
