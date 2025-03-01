"use client";
import { WhatsAppRowData, WhatsAppView } from "@/app/component/Type";
import CustomInput from "@/app/component/CustomInput";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  addMessage,
  addMessageTemplate,
  aksAI,
  getMessages,
} from "@/lib/features/lead/leadSlice";
import { getUserID } from "@/assets/utils/auth.util";
import SingleBtn from "../component/SingleBtn";
import Table from "../component/Table";
import { ColDef } from "ag-grid-community";
import CustomModel from "../component/CustomModel";
import SearchableDropdown from "../component/SearchableDropdown";
import { EmailTypeData, FilterLableAndValue } from "@/CommonData";
import QuillEditor from "../component/QuillEditor";
import { MdOutlineRefresh } from "react-icons/md";
import Whatsapp from "../../assets/whatsapp.svg";

const WhatsApp = ({ name, id }: { name?: string, id?: number }) => {
  const [whatsAppData, setWhatsAppData] =
    useState<WhatsAppRowData>(WhatsAppView);
  const [error, setError] = useState<WhatsAppRowData>(WhatsAppView);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModel, setIsModel] = useState<boolean>(false);
  const [value, setValue] = useState({ lable: true, value: "" });
  const [text, setText] = useState<any>();
  const [textError, setTextError] = useState<string>("");
  const dispatch = useAppDispatch();
  const { message, isLoader } = useAppSelector(
    (state) => state?.lead
  );

  useEffect(() => {
    dispatch(getMessages({ type: "whatsapp", data: `${name}=${id}` }));
    setWhatsAppData(whatsAppData);
  }, []);

  const initialColumnDefs: ColDef[] = [
    {
      field: "phoneNumber",
      headerName: "Phone",
      minWidth: 215,
      maxWidth: 450,
    },
    {
      field: "messageContent",
      headerName: "Message",
      minWidth: 215,
      maxWidth: 750,
      cellRenderer: (params: { data: any }) => {
        const data = params.data;
        return (
          <div dangerouslySetInnerHTML={{ __html: data?.messageContent }}></div>
        );
      },
    },
  ];

  const handelOnChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setWhatsAppData({ ...whatsAppData, [`${name}`]: value });
    setError({ ...error, [`${name}`]: "" });
  };

  const handleChange = (value: string) => {
    setText(value);
    setTextError("");
  };

  const handelOnData = (name?: string, data?: any[]) => {
    setWhatsAppData({ ...whatsAppData, [`${name}`]: data });
    setError({ ...error, [`${name}`]: "" });
  };

  const vaidation = () => {
    let formValid = true;
    const newError: any = {};

    if (!(whatsAppData?.phoneNumber?.length > 0)) {
      formValid = false;
      newError["phoneNumber"] = "Please enter phone";
    }
    if (whatsAppData?.template) {
      if (text ? text === "<p><br></p>" : !text) {
        formValid = false;
        setTextError("Please enter message");
      }
    } else {
      if (!whatsAppData?.messageContent?.trim()) {
        formValid = false;
        newError["messageContent"] = "Please enter message";
      }
    }

    setError(newError);
    return formValid;
  };

  //   const handelOnCreate = () => {
  //     if (vaidation()) {
  //       setIsLoading(true);
  //       const data = {
  //         phoneNumber: "+91" + whatsAppData?.phoneNumber,
  //         messageContent: whatsAppData?.messageContent,
  //         type: "text",
  //         leadId: SingleLead?.id,
  //         userId: getUserID(),
  //       };
  //       dispatch(addMessage(data))
  //         .unwrap()
  //         .then((res: any) => {
  //           if (res?.status === 200) {
  //             handelOnCancel();
  //             dispatch(getMessages({ type: "whatsapp", data:`${name}=${id}` }));
  //             toast.success(
  //               res?.data?.messageContent
  //                 ? res?.data?.messageContent
  //                 : "Whatsapp message send successfully"
  //             );
  //           }
  //         })
  //         .catch((err: any) => {
  //           const error = JSON.parse(err?.messageContent);
  //           toast.error(
  //             error?.errorMessage ? error?.errorMessage : "Something went wrong"
  //           );
  //         })
  //         .finally(() => {
  //           setIsLoading(false);
  //         });
  //     }
  //   };

  const handelOnCreate = () => {
    if (vaidation()) {
      setIsLoading(true);
      if (whatsAppData?.template) {
        const data = {
          name: whatsAppData?.template,
          content: text,
          type: "whatsapp",
          userId: getUserID(),
        };
        dispatch(addMessageTemplate({ query: "whatsapp", body: data }))
          .unwrap()
          .then((res: any) => {
            if (res?.status === 201) {
              handelOnForm(res?.data?.template?.id);
            }
          })
          .catch((err: any) => {
            const error = JSON.parse(err?.message);
            toast.error(
              error?.message ? error?.message : "Something went wrong"
            );
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        handelOnForm();
      }
    }
  };

  const handelOnForm = (templateId?: number) => {
    // const dataTemp = {
    //   phoneNumber: "+91" + whatsAppData?.phoneNumber,
    //   messageTemplateId: templateId,
    //   type: "whatsapp",
    //   leadId: id,
    //   userId: getUserID(),
    // };
    const dataTemp = name === "batchId" ? {
      phoneNumber: "+91" + whatsAppData?.phoneNumber,
      messageTemplateId: templateId,
      type: "whatsapp",
      batchId: id,
      userId: getUserID(),
    } : name === "trainerId" ? {
      phoneNumber: "+91" + whatsAppData?.phoneNumber,
      messageTemplateId: templateId,
      type: "whatsapp",
      trainerId: id,
      userId: getUserID(),
    } : name === "campaignId" ? {
      phoneNumber: "+91" + whatsAppData?.phoneNumber,
      messageTemplateId: templateId,
      type: "whatsapp",
      campaignId: id,
      userId: getUserID(),
    } : name === "learnerId" ? {
      phoneNumber: "+91" + whatsAppData?.phoneNumber,
      messageTemplateId: templateId,
      type: "whatsapp",
      learnerId: id,
      userId: getUserID(),
    } : name === "mainTaskId" ? {
      phoneNumber: "+91" + whatsAppData?.phoneNumber,
      messageTemplateId: templateId,
      type: "whatsapp",
      mainTaskId: id,
      userId: getUserID(),
    } : name && {
      phoneNumber: "+91" + whatsAppData?.phoneNumber,
      messageTemplateId: templateId,
      type: "whatsapp",
      [name]: id,
      userId: getUserID(),
    };

    const data = name === "batchId" ? {
      phoneNumber: "+91" + whatsAppData?.phoneNumber,
      messageContent: whatsAppData?.messageContent,
      type: "whatsapp",
      batchId: id,
      userId: getUserID(),
    } : name === "trainerId" ? {
      phoneNumber: "+91" + whatsAppData?.phoneNumber,
      messageContent: whatsAppData?.messageContent,
      type: "whatsapp",
      trainerId: id,
      userId: getUserID(),
    } : name === "campaignId" ? {
      phoneNumber: "+91" + whatsAppData?.phoneNumber,
      messageContent: whatsAppData?.messageContent,
      type: "whatsapp",
      campaignId: id,
      userId: getUserID(),
    } : name === "learnerId" ? {
      phoneNumber: "+91" + whatsAppData?.phoneNumber,
      messageContent: whatsAppData?.messageContent,
      type: "whatsapp",
      learnerId: id,
      userId: getUserID(),
    } : name === "mainTaskId" ? {
      phoneNumber: "+91" + whatsAppData?.phoneNumber,
      messageContent: whatsAppData?.messageContent,
      type: "whatsapp",
      mainTaskId: id,
      userId: getUserID(),
    } : name && {
      phoneNumber: "+91" + whatsAppData?.phoneNumber,
      messageContent: whatsAppData?.messageContent,
      type: "whatsapp",
      [name]: id,
      userId: getUserID(),
    };
    dispatch(addMessage(templateId ? dataTemp : data))
      .unwrap()
      .then((res: any) => {
        if (res?.status === 200) {
          handelOnCancel();
          dispatch(getMessages({ type: "whatsapp", data: `${name}=${id}` }));
          toast.success(
            res?.data?.message
              ? res?.data?.message
              : "Message sent successfully"
          );
        }
      })
      .catch((err: any) => {
        const error = JSON.parse(err?.message);
        toast.error(
          error?.errorMessage ? error?.errorMessage : "Something went wrong"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handelOnCancel = () => {
    setWhatsAppData(WhatsAppView);
    setError(WhatsAppView);
    setIsModel(!isModel);
  };

  const handelOnKey = (e: any) => {
    if (e.key === "Enter") {
      setWhatsAppData({
        ...WhatsAppView,
        ["template"]: e?.target?.value,
        [`phoneNumber`]: whatsAppData?.phoneNumber,
      });
      if (e?.target?.value) {
        setLoading(true);
        const searchData = {
          searchQuery: `Generate Text Message Template For ${e?.target?.value} 250 character message`,
        };
        dispatch(aksAI(searchData))
          .then((res: any) => {
            if (res?.payload?.status === 200) {
              setText(res?.payload?.data?.result?.replaceAll("\n", "<br>"));
              setLoading(false);
            } else {
              setLoading(false);
              toast.error(res.response.data.error.message);
            }
          })
          .catch((err) => {
            setLoading(false);
            const error = JSON?.parse(err?.message);
            toast.error(
              error?.message ? error?.message : "Something went wrong"
            );
          });
      }
    }
  };

  const DropDownClick = (data: any) => {
    if (data) {
      setLoading(true);
      setValue(data);
      setWhatsAppData({
        ...WhatsAppView,
        ["template"]: data?.lable ? data?.lable : data,
        [`phoneNumber`]: whatsAppData?.phoneNumber,
      });
      const searchData = {
        searchQuery: `Generate Text Message Template For ${data?.lable} 250 character message`,
      };
      dispatch(aksAI(searchData))
        .then((res: any) => {
          if (res?.payload?.status === 200) {
            setText(res?.payload?.data?.result?.replaceAll("\n", "<br>"));
            setLoading(false);
          } else {
            setLoading(false);
            toast.error(res.response.data.error.message);
          }
        })
        .catch((err) => {
          setLoading(false);
          const error = JSON?.parse(err?.message);
          toast.error(error?.message ? error?.message : "Something went wrong");
        });
    }
  };

  const handelOnRefresh = () => {
    dispatch(getMessages({ type: "whatsapp", data: `${name}=${id}` }));
  };

  return (
    <div className="px-5 py-11">
      {isModel && (
        <CustomModel
          lable="WhatsApp"
          onCancel={handelOnCancel}
          onSave={handelOnCreate}
          isLoading={isLoading}
          button2="Send"
          headerImg={Whatsapp}
        >
          <div className="grid gap-8 mb-8 md:grid-cols-2">
            <CustomInput
              name="phoneNumber"
              value={whatsAppData?.phoneNumber}
              error={error?.phoneNumber}
              onChange={handelOnChange}
              lableValue="Phone"
              placeholder="Phone"
              typeValue="text"
            />
            <SearchableDropdown
              placeholder={"Search Template"}
              options={FilterLableAndValue(EmailTypeData)}
              selectedVal={value}
              handleChange={DropDownClick}
              handelOnKey={handelOnKey}
              lableValue="Template"
              loading={loading}
            />
          </div>
          {whatsAppData?.template ? (
            <div className="mb-8">
              <span className="text-red-500 text-sm mt-1">{textError}</span>
              <QuillEditor handleChange={handleChange} text={text} />
            </div>
          ) : (
            <div className="mb-4">
              <CustomInput
                name="messageContent"
                value={whatsAppData?.messageContent}
                error={error?.messageContent}
                onChange={handelOnChange}
                lableValue="Message"
                placeholder="Message"
                typeValue="text"
              />
            </div>
          )}
        </CustomModel>
      )}
      <div className="grid gap-2">
        <div className="flex px-1">
          {/* <h2 className="text-black text-lg font-semibold">WhatsApp</h2> */}
          <div className="flex gap-3">
            <SingleBtn
              name={`Refresh`}
              icon="Refresh"
              onClick={() => {
                handelOnRefresh();
              }}
            />
            <SingleBtn
              name="+ New Message"
              bgcolor="sky"
              onClick={() => {
                setIsModel(!isModel);
              }}
            />
          </div>
        </div>
        <Table
          noDataFoundMsg="WhatsApp data no found"
          isLoader={isLoader}
          initialColumnDefs={initialColumnDefs}
          datas={message?.messages}
        />
      </div>
    </div>
  );
};

export default WhatsApp;
