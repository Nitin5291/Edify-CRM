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
  getEmails,
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

const EmailPage = ({ name, id }: { name?: string, id?: number }) => {
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
  const { email, isLoader } = useAppSelector(
    (state) => state?.lead
  );
  console.log("🚀 ~ EmailPage ~ email:", email)

  useEffect(() => {
    dispatch(getEmails(`${name}=${id}`));
    setEmailData({
      ...emailData,
      ["from"]: "kdigital@yopmail.com",
    });
  }, [id]);

  const initialColumnDefs: ColDef[] = [
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
    {
      field: "bcc",
      headerName: "Bcc",
      minWidth: 215,
      maxWidth: 300,
    },
    {
      field: "subject",
      headerName: "Subject",
      minWidth: 210,
      maxWidth: 300,
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

  const handelOnVarify = (TemplateId?: number) => {
    const dataTemp = {
      to: emailData?.to,
      bcc: emailData?.bcc,
      from: emailData?.from,
      subject: emailData?.subject,
      emailTemplateId: TemplateId,
      leadId: id,
      userId: getUserID(),
    };
    const data = name === "batchId" ? {
      to: emailData?.to,
      bcc: emailData?.bcc,
      from: emailData?.from,
      subject: emailData?.subject,
      htmlContent: text,
      batchId: id,
      userId: getUserID(),
    } : name === "trainerId" ? {
      to: emailData?.to,
      bcc: emailData?.bcc,
      from: emailData?.from,
      subject: emailData?.subject,
      htmlContent: text,
      trainerId: id,
      userId: getUserID(),
    } : name === "campaignId" ? {
      to: emailData?.to,
      bcc: emailData?.bcc,
      from: emailData?.from,
      subject: emailData?.subject,
      htmlContent: text,
      campaignId: id,
      userId: getUserID(),
    } : name === "learnerId" ? {
      to: emailData?.to,
      bcc: emailData?.bcc,
      from: emailData?.from,
      subject: emailData?.subject,
      htmlContent: text,
      learnerId: id,
      userId: getUserID(),
    } : name === "mainTaskId" ? {
      to: emailData?.to,
      bcc: emailData?.bcc,
      from: emailData?.from,
      subject: emailData?.subject,
      htmlContent: text,
      mainTaskId: id,
      userId: getUserID(),
    } : name && {
      to: emailData?.to,
      bcc: emailData?.bcc,
      from: emailData?.from,
      subject: emailData?.subject,
      htmlContent: text,
      [name]: id,
      userId: getUserID(),
    };
    dispatch(addEmail(TemplateId ? dataTemp : data))
      .unwrap()
      .then((res: any) => {
        if (res) {
          toast.success("Email sent successfully");
          //toast.success(res?.data?.message ? res?.data?.message : "Email sent successfully");
          handelOnCancel();
          setIsTemp(false);
          dispatch(getEmails(`${name}=${id}`));
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
      ["from"]: "kdigital@yopmail.com",
    });
    setIsModel(!isModel);
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
              <div className="grid gap-8 mb-8 md:grid-cols-2">
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
                <ButtonInput
                  placeholder="Bcc"
                  value={emailData?.bcc}
                  name="bcc"
                  typeValue="email"
                  handelOnData={handelOnData}
                  lableValue="Bcc"
                  error={error?.bcc}
                />
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
            initialColumnDefs={initialColumnDefs}
            datas={email?.emails}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailPage;
