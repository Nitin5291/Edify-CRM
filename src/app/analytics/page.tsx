"use client";
import React, { useState, useEffect, useRef } from "react";
import { BsSend } from "react-icons/bs";
import Loader from "../component/Loader";
import { useWindowDimensions } from "@/CommonData";
import { postpy } from "@/base";
import { toast } from "react-toastify";
import { FaRegUserCircle } from "react-icons/fa";
import Logo from "../../assets/favicon.png";
import Image from "next/image";
import { MdModeEditOutline } from "react-icons/md";
import BoatImg from "../../assets/BoatImage.gif"

const IframeWithFallback = ({ ...props }) => {
    const [supportsIframe, setSupportsIframe] = useState(true);

    useEffect(() => {
        setSupportsIframe(!!window.HTMLIFrameElement);
    }, []);

    if (!supportsIframe) {
        return <p>Your browser does not support iframes.</p>;
    }

    return <iframe {...props} />;
};

const AnalyticsPage: React.FC = () => {
    const [value, setValue] = useState<string>("");
    const [editValue, setEditValue] = useState<string>("");
    const [datas, setDatas] = useState<any[]>([]);
    const [urls, setUrls] = useState<string[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [loader, setLoader] = useState<boolean>(false);
    const { height, width } = useWindowDimensions();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const fetchHtml = async (htmlstring: string) => {
            try {
                const blob = new Blob([htmlstring], { type: "text/html" });
                const url = window.URL.createObjectURL(blob);
                return url;
            } catch (error) {
                console.error('Error fetching HTML:', error);
            }
        };

        const fetchAllHtml = async () => {
            const newUrls: any = await Promise.all(datas.map(async (item) => {
                return fetchHtml(item.chart);
            }));
            setUrls(newUrls);
        };

        fetchAllHtml();
    }, [datas]);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [datas]);

    const handleButtonClick = async (e: any, index: any) => {
        if (index === null ? value : editValue) {
            setLoader(true);
            try {
                const body = { prompt: index === null ? value : editValue };
                const response: any = await postpy('generate-visualization', body);
                if (response?.status === 200) {
                    if (index === null) {
                        setDatas([...datas, { prompt: value, chart: response.data }]);
                        setValue("");
                    } else {
                        datas[index].chart = response.data;
                        datas[index].prompt = editValue;
                        setDatas([...datas]);
                        setEditValue("");
                        setEditIndex(null);
                    }
                }
                setLoader(false);
            } catch (error: any) {
                setLoader(false);
                toast.error(JSON.stringify(error.response.data.error));
            }
        } else {
            toast.error("Please enter a prompt");
        }
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };
    const handleOnEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditValue(e.target.value);
    };

    if (!isMounted) {
        return null; // or a loading state
    }

    return (
        <div className="h-[calc(100vh-100px)]">
            <div className="pt-5 ps-2 flex justify-center w-full">
                <div className="w-[70%]">
                    <div className="grid grid-cols-2 justify-between gap-2 p-4">
                        {["First_visualization", "Second_visualization", "Third_visualization", "Fourth_visualization"]?.map((viz, index) => (
                            <IframeWithFallback
                                key={index}
                                id="inlineFrameExample"
                                title="Inline Frame Example"
                                width={width / 3}
                                height={height / 2.39}
                                src={`${process.env.NEXT_PUBLIC_PY_API_BASE_URL}${viz}`}
                            />
                        ))}
                    </div>
                </div>
                <div className="relative w-[30%] flex flex-col justify-between">
                    <div ref={scrollContainerRef} className="bg-gray-100 my-2 py-4 rounded-md shadow-inner" style={{ height: `${height - 200}px`, overflowY: 'auto' }}>
                        {datas?.length > 0 ? datas?.map((item, index) => (
                            <div key={index} className="chart-container mb-4">
                                <div className="flex justify-end w-full mb-2 gap-1">
                                    <MdModeEditOutline className="cursor-pointer" onClick={() => { setEditIndex(index); setEditValue(item?.prompt) }}
                                        size={25}
                                    />
                                    {editIndex === index ?
                                        <div className="relative">
                                            <textarea
                                                value={editValue}
                                                disabled={loader}
                                                onChange={handleOnEditChange}
                                                placeholder="Ask me anything"
                                                rows={3}
                                                cols={45}
                                                className="rounded-md text-lg w-full border border-[#0003] bg-transparent px-3 p-2 font-sans font-semibold text-blue-gray-700 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0"
                                            />
                                            <button
                                                onClick={() => { setEditIndex(null); setEditValue("") }}
                                                disabled={loader}
                                                className={`bg-gray-500 text-white rounded-full disabled:bg-slate-200 disabled:text-gray-500 absolute bottom-2.5 right-16 px-2 py-0.5`}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={(e) => handleButtonClick(e, index)}
                                                disabled={loader}
                                                className={`bg-sky-600 text-white rounded-full disabled:bg-slate-200 disabled:text-gray-500 absolute bottom-2.5 right-1 px-2 py-0.5`}
                                            >
                                                Send
                                            </button>
                                        </div>
                                        :
                                        <span className="w-9/12 bg-gray-300 px-3 py-2 rounded-xl text-sm" style={{ inlineSize: "auto" }}>{item?.prompt}</span>
                                    }
                                    <FaRegUserCircle
                                        size={25}
                                    />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <Image
                                        className="w-9 h-9 cursor-pointer"
                                        src={Logo}
                                        alt="Company Logo"
                                    />
                                    <IframeWithFallback
                                        id="inlineFrameExample"
                                        title="Inline Frame Example"
                                        width={width / 3.7}
                                        height={height / 2.5}
                                        src={urls[index]}
                                    />
                                </div>
                            </div>
                        )) : <div className="flex justify-center content-center items-center" style={{ height: `${height - 300}px` }}>  <Image src={BoatImg} alt="BoatImg" className=" w-52 h-52" /></div>}
                    </div>
                    <div className="relative mt-4">
                        <textarea
                            value={value}
                            disabled={loader}
                            onChange={handleOnChange}
                            placeholder="Ask me anything"
                            rows={1}
                            cols={45}
                            className="rounded-md text-lg w-full border border-[#0003] bg-transparent px-3 p-2 font-sans font-semibold text-blue-gray-700 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0"
                        />
                        <button
                            onClick={(e) => handleButtonClick(e, null)}
                            disabled={loader}
                            className={`bg-sky-600 text-white rounded-full disabled:bg-slate-200 disabled:text-gray-500 absolute bottom-2.5 right-3 ${loader ? "p-2" : "p-3"}`}
                        >
                            {loader ? <Loader size={5} /> : <BsSend />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
