import React, { useState } from "react";
import { LuSendHorizonal } from "react-icons/lu";
import Loader from "../component/Loader";
import { useAppDispatch } from "@/lib/store";
import { aksAI } from "@/lib/features/lead/leadSlice";
import { toast } from "react-toastify";
import { HiLightBulb } from "react-icons/hi";

const AskAI = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [text, setText] = useState<any>();
  const dispatch = useAppDispatch();

  const handelOnSave = () => {
    if (value) {
      setText("");
      setLoader(true);
      const searchData = {
        searchQuery: value,
      };
      dispatch(aksAI(searchData))
        .then((res: any) => {
          if (res?.payload?.status === 200) {
            setText(res?.payload?.data?.result?.replaceAll("\n", "<br/>"));
            setLoader(false);
          } else {
            setLoader(false);
            toast.error(res.response.data.error.message);
          }
        })
        .catch((err) => {
          setLoader(false);
          const error = JSON?.parse(err?.message);
          toast.error(error?.message ? error?.message : "Something went wrong");
        });
    }
  };

  return (
    <div className="mt-5">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask Me Anything"
          rows={8}
          className="h-full rounded-md text-lg w-full border border-[#0003] bg-transparent px-3 p-2 font-sans font-semibold text-blue-gray-700 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 "
        />
        <button
          onClick={() => handelOnSave()}
          disabled={loader}
          className={`bg-sky-600 text-white rounded-full disabled:bg-slate-200 disabled:text-gray-500 absolute bottom-3 right-3 ${loader ? "p-2" : "p-3"
            }`}
        >
          {loader ? <Loader size={5} /> : <LuSendHorizonal />}
        </button>
      </div>
      {text && <div className="bg-gray-200 rounded-md mt-4 py-8">
        {text ? (
          <p
            className="bg-white p-4 mx-9 rounded-md"
            dangerouslySetInnerHTML={{ __html: text }}
          ></p>
        ) : (
          <p className="flex gap-5 bg-sky-200 p-4">
            <HiLightBulb size={20} className="text-blue-500" /> Power of AI at
            your fingertips. Ask me anything.
          </p>
        )}
      </div>}
    </div>
  );
};

export default AskAI;
