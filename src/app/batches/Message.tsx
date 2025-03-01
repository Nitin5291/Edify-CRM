"use client";
import { MessageRowData, MessageView } from "@/app/component/Type";
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
import CustomModel from "../component/CustomModel";
import SingleBtn from "../component/SingleBtn";
import Table from "../component/Table";
import { ColDef } from "ag-grid-community";
import SearchableDropdown from "../component/SearchableDropdown";
import { EmailTypeData, FilterLableAndValue } from "@/CommonData";
import QuillEditor from "../component/QuillEditor";
import Message_Img from "../../assets/message.svg";

const Message = ({ name, id }: { name?: string, id?: number }) => {
  const [messageData, setMessageData] = useState<MessageRowData>(MessageView);
  const [error, setError] = useState<MessageRowData>(MessageView);
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
    dispatch(getMessages({ type: "text", data: `${name}=${id}` }));
    setMessageData(messageData);
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
    setMessageData({ ...messageData, [`${name}`]: value });
    setError({ ...error, [`${name}`]: "" });
  };

  const vaidation = () => {
    let formValid = true;
    const newError: any = {};

    if (!(messageData?.phoneNumber?.length > 0)) {
      formValid = false;
      newError["phoneNumber"] = "Please enter phone";
    }
    if (messageData?.template) {
      if (text ? text === "<p><br></p>" : !text) {
        formValid = false;
        setTextError("Please enter message");
      }
    } else {
      if (!messageData?.messageContent?.trim()) {
        formValid = false;
        newError["messageContent"] = "Please enter message";
      }
    }

    setError(newError);
    return formValid;
  };

  const handelOnCreate = () => {
    if (vaidation()) {
      setIsLoading(true);
      if (messageData?.template) {
        const data = {
          name: messageData?.template,
          content: text,
          type: "text",
          userId: getUserID(),
        };
        dispatch(addMessageTemplate({ query: "text", body: data }))
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
    //   phoneNumber: "+91" + messageData?.phoneNumber,
    //   messageTemplateId: templateId,
    //   type: "text",
    //   leadId: id,
    //   userId: getUserID(),
    // };
    const dataTemp = name === "batchId" ? {
      phoneNumber: "+91" + messageData?.phoneNumber,
      messageTemplateId: templateId,
      type: "text",
      batchId: id,
      userId: getUserID(),
    } : name === "trainerId" ? {
      phoneNumber: "+91" + messageData?.phoneNumber,
      messageTemplateId: templateId,
      type: "text",
      trainerId: id,
      userId: getUserID(),
    } : name === "campaignId" ? {
      phoneNumber: "+91" + messageData?.phoneNumber,
      messageTemplateId: templateId,
      type: "text",
      campaignId: id,
      userId: getUserID(),
    } : name === "learnerId" ? {
      phoneNumber: "+91" + messageData?.phoneNumber,
      messageTemplateId: templateId,
      type: "text",
      learnerId: id,
      userId: getUserID(),
    } : name === "mainTaskId" ? {
      phoneNumber: "+91" + messageData?.phoneNumber,
      messageTemplateId: templateId,
      type: "text",
      mainTaskId: id,
      userId: getUserID(),
    } :name&& {
      phoneNumber: "+91" + messageData?.phoneNumber,
      messageTemplateId: templateId,
      type: "text",
      [name]: id,
      userId: getUserID(),
    };

    const data = name === "batchId" ? {
      phoneNumber: "+91" + messageData?.phoneNumber,
      messageContent: messageData?.messageContent,
      type: "text",
      batchId: id,
      userId: getUserID(),
    } : name === "trainerId" ? {
      phoneNumber: "+91" + messageData?.phoneNumber,
      messageContent: messageData?.messageContent,
      type: "text",
      trainerId: id,
      userId: getUserID(),
    } : name === "campaignId" ? {
      phoneNumber: "+91" + messageData?.phoneNumber,
      messageContent: messageData?.messageContent,
      type: "text",
      campaignId: id,
      userId: getUserID(),
    } : name === "learnerId" ? {
      phoneNumber: "+91" + messageData?.phoneNumber,
      messageContent: messageData?.messageContent,
      type: "text",
      learnerId: id,
      userId: getUserID(),
    } : name === "mainTaskId" ? {
      phoneNumber: "+91" + messageData?.phoneNumber,
      messageContent: messageData?.messageContent,
      type: "text",
      mainTaskId: id,
      userId: getUserID(),
    } : name && {
      phoneNumber: "+91" + messageData?.phoneNumber,
      messageContent: messageData?.messageContent,
      type: "text",
      [name]: id,
      userId: getUserID(),
    };
    dispatch(addMessage(templateId ? dataTemp : data))
      .unwrap()
      .then((res: any) => {
        if (res?.status === 200) {
          handelOnCancel();
          dispatch(getMessages({ type: "text", data: `${name}=${id}` }));
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

  const handleChange = (value: string) => {
    setText(value);
    setTextError("");
  };

  const handelOnCancel = () => {
    setMessageData({ ...MessageView, [`phoneNumber`]: messageData?.phoneNumber });
    setError(MessageView);
    setIsModel(!isModel);
    setTextError("");
    setText("");
  };
  const handelOnKey = (e: any) => {
    if (e.key === "Enter") {
      setMessageData({ ...messageData, ["template"]: e?.target?.value, [`phoneNumber`]: messageData?.phoneNumber });
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
      setMessageData({
        ...messageData,
        ["template"]: data?.lable ? data?.lable : data,
        [`phoneNumber`]: messageData?.phoneNumber
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
    dispatch(getMessages({ type: "text", data: `${name}=${id}` }));
  };

  return (
    <div className="px-5 py-11">
      {isModel && (
        <CustomModel
          lable="Message"
          onCancel={handelOnCancel}
          onSave={handelOnCreate}
          isLoading={isLoading}
          headerImg={Message_Img}
        >
          <div className="grid gap-8 mb-8 md:grid-cols-2">
            <CustomInput
              name="phoneNumber"
              value={messageData?.phoneNumber}
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
          {messageData?.template ? (
            <div className="mb-8">
              <span className="text-red-500 text-sm mt-1">{textError}</span>
              <QuillEditor handleChange={handleChange} text={text} />
            </div>
          ) : (
            <div className="mb-4">
              <CustomInput
                name="messageContent"
                value={messageData?.messageContent}
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
        <div className="flex  px-1">
          {/* <h2 className="text-black text-lg font-semibold">Message</h2> */}
          <div className="flex gap-3">
            <SingleBtn
              name={`Refresh`}
              icon="Refresh"
              onClick={() => {
                handelOnRefresh();
              }}
            />
            <SingleBtn
              name="+ New SMS"
              bgcolor="sky"
              onClick={() => {
                setIsModel(!isModel);
              }}
            />
          </div>
        </div>
        <Table
          noDataFoundMsg="Message data no found"
          isLoader={isLoader}
          initialColumnDefs={initialColumnDefs}
          datas={message?.messages}
        />
      </div>
    </div>
  );
};

export default Message;
