"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
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

const Note = () => {
  const [noteData, setNoteData] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [edit, setEdit] = useState<string>("");
  const [isModel, setIsModel] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [filteredNames, setFilteredNames] = useState<string[]>([]);

  const { NoteData, SingleLead, isLoader } = useAppSelector(
    (state) => state?.lead
  );
  const { allUser } = useAppSelector((state) => state?.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getNote());
    dispatch(getUser());
  }, []);

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
    const data = {
      content: noteData,
      leadId: SingleLead?.id,
    };
    dispatch(addNote(data))
      .unwrap()
      .then((res: any) => {
        if (res) {
          toast.success(
            res?.data?.message
              ? res?.data?.message
              : "Note created successfully"
          );
          handelOnCancel();
          dispatch(getNote());
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
    const data = {
      content: noteData,
      leadId: SingleLead?.id,
    };
    dispatch(updateNote({ id: edit, data: data }))
      .unwrap()
      .then((res: any) => {
        if (res) {
          toast.success(
            res?.data?.message
              ? res?.data?.message
              : "Note created successfully"
          );
          handelOnCancel();
          dispatch(getNote());
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
  };

  const handelOnDelete = (id: string) => {
    if (id) {
      dispatch(deleteNode(id))
        .unwrap()
        .then((res: any) => {
          if (res) {
            toast.success(
              res?.data?.message
                ? res?.data?.message
                : "Note deleted successfully"
            );
            dispatch(getNote());
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

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNoteData(value);

    const lastWord = value.split(" ").pop();
    if (lastWord && lastWord.startsWith("@")) {
      const query = lastWord.slice(1).toLowerCase();
      const filtered = names.filter((name: string) =>
        name.toLowerCase().includes(query)
      );
      setFilteredNames(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleNameClick = (name: string) => {
    const words = noteData.split(" ");
    words.pop();
    words.push(`@${name}`);
    setNoteData(words.join(" ") + " ");
    setShowDropdown(false);
  };

  // Sort NoteData by createdAt in descending order
  const sortedNoteData = NoteData?.data?.slice().sort((a:any, b:any) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="px-5 py-11">
      {isModel && (
        <CustomModel
          lable="Notes"
          onCancel={handelOnCancel}
          onSave={edit ? handelOnUpdate : handelOnCreate}
          isLoading={isLoading}
          button2={edit ? "Update" : "Create"}
        >
          <div className="relative">
            <label className="font-medium text-base text-[#A8C6DF] flex gap-2">
              New Note
              {error && (
                <span className="text-red-500 text-sm mt-1">{error}</span>
              )}
            </label>
            <textarea
              value={noteData}
              onChange={handleTextChange}
              rows={10}
              cols={50}
              className="w-full h-40 p-2 border border-gray-300 rounded"
            />
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
      <div className="grid gap-2">
        <div className="flex justify-between px-4">
          <h2 className="text-black text-lg font-semibold">Notes</h2>
          <SingleBtn
            name="+ New Note"
            bgcolor="sky"
            onClick={() => {
              setIsModel(!isModel);
            }}
          />
        </div>
        <Table
          noDataFoundMsg="Note data not found"
          isLoader={isLoader}
          initialColumnDefs={initialColumnDefs}
          datas={sortedNoteData}
        />
      </div>
    </div>
  );
};

export default Note;

