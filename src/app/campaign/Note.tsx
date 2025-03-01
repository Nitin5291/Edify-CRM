"use client";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  addNote,
  deleteNode,
  getNote,
  updateNote,
} from "@/lib/features/lead/leadSlice";
import SingleBtn from "../component/SingleBtn";
import Table from "../component/Table";
import moment from "moment";
import { ColDef } from "ag-grid-community";
import CustomModel from "../component/CustomModel";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { getUser } from "@/lib/features/auth/authSlice";
import useDebounce from "@/CommonData";
import { postpy } from "@/base";
import { getUserID } from "@/assets/utils/auth.util";

const Note = ({ name, id }: { name?: string; id?: number }) => {
  const [noteData, setNoteData] = useState<string>("");
  const [prompData, setPrompData] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [edit, setEdit] = useState<string>("");
  const [isModel, setIsModel] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [filteredNames, setFilteredNames] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState<number>(0);
  const [wordCountHit, setWordCountHit] = useState<number>(1);
  const [leadContent, setLeadContent] = useState<string>("");
  const [lastKey, setLastKey] = useState<string>("");

  const debouncedLastKey = useDebounce(lastKey, 2000);
  const debouncedNoteData = useDebounce(noteData, 700);
  const debouncedWordData = useDebounce(wordCount, 300);


  const { NoteData, SingleLead, isLoader } = useAppSelector((state) => state?.lead);
  const { allUser } = useAppSelector((state) => state?.auth);
  const { singleCampaignData } = useAppSelector((state) => state?.campaign);
  const dispatch = useAppDispatch();

  const textareaRef = useRef<any>(null);

  // Automatically resize textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [noteData]);

  useEffect(() => {
    if (lastKey) {
      setLastKey("")
    }
  }, [debouncedLastKey]);

  useEffect(() => {
    if (SingleLead?.id || id) {
      dispatch(getNote(name ? `${name}=${id}` : `leadId=${SingleLead?.id}`));
      if (SingleLead?.id) {
        // handelOnContent()
      }
    }
    dispatch(getUser());
  }, [SingleLead, id]);

  useEffect(() => {
    if (noteData) {
      const words = noteData?.trim().split(/\s+/); // Split by whitespace to count words
      setWordCount(words?.length); // Update word count
      setPrompData("")
    }
  }, [debouncedNoteData]);

  const names =
    allUser?.users?.map((item: { name: any }) => {
      return item.name;
    }) ?? [];

  const initialColumnDefs: ColDef[] = [
    {
      field: "createdAt",
      headerName: "CreatedAt",
      minWidth: 205,
      maxWidth: 250,
      cellRenderer: (params: { data: any }) => {
        const data = params.data;
        return (
          <div className="flex items-center gap-2 capitalize ">
            {data?.createdAt
              ? moment(data?.createdAt).format("DD MMM, YYYY, h:mm A")
              : "-"}
          </div>
        );
      },
    },

    {
      field: "content",
      headerName: "Content",
      minWidth: 515,
      maxWidth: 1400,
    },

    {
      field: "id",
      headerName: "Action",
      minWidth: 100,
      maxWidth: 140,
      cellRenderer: (params: { data: any }) => {
        const data = params.data;
        return (
          <div className="flex gap-4 h-10">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setEdit(data?.id);
                setNoteData(data?.content);
                setIsModel(true);
              }}
            >
              <MdModeEdit size={24} />
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handelOnDelete(data?.id)}
            >
              <MdDelete size={22} className="text-red-600" />
            </div>
          </div>
        );
      },
    },
  ];

  const handelOnChange = (
    e: { target: { name: any; value: any } },
    name1?: any
  ) => {
    const { name, value } = e.target;
    setNoteData(value);
    setError("");
  };

  const vaidation = () => {
    let formValid = true;
    let newError: any = "";

    if (!noteData?.trim()) {
      formValid = false;
      newError = "Please enter note";
    }

    setError(newError);
    return formValid;
  };

  const handelOnCreate = () => {
    //if (vaidation()) {
    setIsLoading(true);
    const data = name ? {
      content: noteData,
      [name]: id,
      userId: getUserID()
    } : {
      content: noteData,
      campaignId: id,
      userId: getUserID()
    }
    dispatch(addNote(data))
      .unwrap()
      .then((res: any) => {
        if (res?.status === 201) {
          toast.success(
            res?.data?.message
              ? res?.data?.message
              : "Note created successfully"
          );
          handelOnCancel();
          dispatch(getNote(name ? `${name}=${id}` : `leadId=${SingleLead?.id}`));
        }
      })
      .catch((err: any) => {
        const error = JSON.parse(err?.message);
        toast.error(error?.message ? error?.message : "Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });

    //}
  };
  const handelOnUpdate = () => {
    //if (vaidation()) {
    setIsLoading(true);
    const data = name === "batchId" ? {
      content: noteData,
      batchId: id,
      userId: getUserID()
    } : name === "trainerId" ? {
      content: noteData,
      trainerId: id,
      userId: getUserID()
    } : name === "campaignId" ? {
      content: noteData,
      campaignId: id,
      userId: getUserID()
    } : name && {
      content: noteData,
      [name]: SingleLead?.id,
      userId: getUserID()
    };
    dispatch(updateNote({ id: edit, data: data }))
      .unwrap()
      .then((res: any) => {
        if (res) {
          toast.success(
            res?.data?.message
              ? res?.data?.message
              : "Note update successfully"
          );
          handelOnCancel();
          dispatch(getNote(name ? `${name}=${id}` : `leadId=${SingleLead?.id}`));
        }
      })
      .catch((err: any) => {
        const error = JSON.parse(err?.message);
        toast.error(error?.message ? error?.message : "Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });

    //}
  };

  const handelOnCancel = () => {
    setError("");
    setNoteData("");
    setEdit("");
    setIsModel(false);
    setWordCount(0)
    setWordCountHit(1)
    setLastKey("")
  };

  const handelOnDelete = (dleteId: string) => {
    if (dleteId) {
      dispatch(deleteNode(dleteId))
        .unwrap()
        .then((res: any) => {
          if (res) {
            toast.success(
              res?.data?.message
                ? res?.data?.message
                : "Note deleted successfully"
            );
            dispatch(getNote(name ? `${name}=${id}` : `leadId=${SingleLead?.id}`));
          }
        })
        .catch((err: any) => {
          const error = JSON.parse(err?.message);
          toast.error(error?.message ? error?.message : "Something went wrong");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleTextChange = (e: any) => {
    const value = e.target.value;
    setNoteData(value);


    // const lastWord = value.split(" ").pop();
    // if (lastWord && lastWord.startsWith("@")) {
    //   const query = lastWord.slice(1).toLowerCase();
    //   const filtered = names.filter((name: string) =>
    //     name.toLowerCase().includes(query)
    //   );
    //   setFilteredNames(filtered);
    //   setShowDropdown(true);
    // } else {
    //   setShowDropdown(false);
    // }
  };

  const handleNameClick = (name: string) => {
    const words = noteData.split(" ");
    words.pop();
    words.push(`@${name}`);
    setNoteData(words.join(" ") + " ");
    setShowDropdown(false);
  };


  const handelOnContent = async () => {
    try {
      const body = { lead_id: SingleLead?.id }
      const response: any = await postpy('content', body);
      if (response?.status === 200) {
        const data = await response?.data
        setLeadContent(data)
      } else {
        setLeadContent("")
        toast.error('API request failed');
      }
    } catch (error) {
      setLeadContent("")
      toast.error('Error making API call:' + error);
    }
  }


  useEffect(() => {
    // Function to handle API call based on word count
    const handleAPICall = async () => {
      // if (wordCount !== wordCountHit) {
      // if (wordCount === 5 || wordCount === 10 || wordCount === 15) {
      // setWordCountHit(wordCount)
      if (lastKey !== 'Tab') {
        try {
          // Replace with your actual API call logic
          // Example of using fetch to make a POST request
          if (noteData) {
            const body = { prompt: noteData, content: leadContent }
            const response: any = await postpy('prompt', body);

            if (response?.status === 200) {
              const data = await response?.data
              setPrompData(data?.replace(/\n/g, ''));
            } else {
              setPrompData("");
              throw new Error('API request failed');
            }
          } else {
            setPrompData("");
          }
        } catch (error) {
          console.error('Error making API call:', error);
          setPrompData("");
        }
      }
      // }
      // }
    };

    // Call the function to handle API call
    handleAPICall();
  }, [debouncedWordData, debouncedNoteData]);

  const handleKeyDown = (e: any) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      setLastKey(e.key)
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      // Insert tab character
      const newValue = noteData + prompData;
      setPrompData("")

      // Update the value and the cursor position
      setNoteData(newValue?.replaceAll("  ", " ")?.trim());
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = newValue?.trim()?.length;
      }, 0);
    }
  };

  // Sort NoteData by createdAt in descending order
  const sortedNoteData = NoteData?.data?.slice().sort((a: any, b: any) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  console.log("🚀 ~ sortedNoteData ~ sortedNoteData:", sortedNoteData)

  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index: any) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div className="px-5 py-3">
      {isModel && (
        <CustomModel
          lable="Note"
          onCancel={handelOnCancel}
          onSave={edit ? handelOnUpdate : handelOnCreate}
          isLoading={isLoading}
          button2={edit ? "Update" : "Create"}
        >
          {/* <CustomInput
            name="note"
            value={noteData}
            error={error}
            onChange={handelOnChange}
            lableValue="New Note"
            placeholder="New Note"
            typeValue="text"
          /> */}
          <div className="relative">
            <label className="font-medium text-base text-[#A8C6DF] flex gap-2">
              New Note
              {error && (
                <span className="text-red-500 text-sm mt-1">{error}</span>
              )}
            </label>
            <div className="relative w-full">
              <textarea
                ref={textareaRef}
                value={noteData}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter your notes here..."
                rows={10}
                cols={50}
                className="w-full h-64 p-2 border border-gray-300 rounded overflow-hidden"
              />
              {prompData && (
                <div ref={textareaRef} className="absolute top-[9px] left-[9px] text-gray-500 pointer-events-none ">
                  {noteData ? noteData + prompData : "Enter your notes here..."}
                </div>
              )}
            </div>
            {showDropdown && (
              <ul className="absolute z-10 w-full border h-auto max-h-44 overflow-auto border-gray-300 bg-white mt-2 rounded shadow-lg top-3">
                {filteredNames.map((name, index) => (
                  <li
                    key={index}
                    onClick={() => handleNameClick(name)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CustomModel>
      )}
      {/* <MyComponent /> */}
      <div className="grid gap-2">
        <div className="flex justify-between mb-4">
          <SingleBtn
            name="+ New Note"
            bgcolor="sky"
            onClick={() => {
              setIsModel(!isModel);
            }}
          />
        </div>
        {/* <Table
          noDataFoundMsg="Note data no found"
          isLoader={isLoader}
          initialColumnDefs={initialColumnDefs}
          datas={sortedNoteData}
        /> */}


        <div id="accordion-collapse" data-accordion="collapse">

          {sortedNoteData?.map((data: any, i: number) => {
            return (
              <div className="my-4 border-2 rounded-lg">
                <h2>
                  <button
                    type="button"
                    className="flex items-center justify-between w-full px-5 pt-5 pb-2 font-medium rtl:text-right text-gray-500 "
                    data-accordion-target="#accordion-collapse-body-2"
                    aria-expanded={openAccordion === i}
                    aria-controls="accordion-collapse-body-2"
                    onClick={() => toggleAccordion(i)}
                  >
                    <div className="flex gap-3 items-center">
                      <svg
                        data-accordion-icon
                        className={`w-3 h-3 shrink-0  ${openAccordion === i ? 'rotate-180' : 'rotate-90'}`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5L5 1 1 5"
                        />
                      </svg>
                      <span>Note By {singleCampaignData?.campaign?.name}</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className={`${openAccordion === i ? '' : 'hidden'} flex gap-2 h-10`}>
                        <div
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => {
                            setEdit(data?.id);
                            setNoteData(data?.content);
                            setIsModel(true);
                          }}
                        >
                          <MdModeEdit size={24} />
                        </div>
                        <div
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => handelOnDelete(data?.id)}
                        >
                          <MdDelete size={22} className="text-red-600" />
                        </div>
                      </div>
                      <span className="text-sm font-normal">{moment(data?.createdAt).format("MMM DD, YYYY  h:mm A")}</span>
                    </div>
                  </button>
                  <div className={`${openAccordion === i ? 'hidden' : ''} px-10 pb-3`}>
                    <p className="mb-2 text-gray-500">{data?.content?.length > 50 ? data?.content?.slice(0, 50) + '...' : data?.content}</p>
                  </div>
                </h2>
                <div
                  id="accordion-collapse-body-2"
                  className={`${openAccordion === i ? '' : 'hidden'}`}
                  aria-labelledby="accordion-collapse-heading-2"
                >
                  <div className="px-5 pb-5">
                    <p className="mb-2 text-gray-500">{data?.content}</p>
                  </div>
                </div>
              </div>
            )
          })}


        </div>

      </div>
    </div>
  );
};

export default Note;


