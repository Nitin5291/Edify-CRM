import React from "react";
import AskAI from "./AskAI";
import Navbar from "../Navbar/page";

const Page = () => {
  return (
    <div className="lg:w-full">
        <Navbar/>
      <div className="mx-5 my-2.5 py-2.5 shadow-lg border-2 bg-[#FFF] rounded-lg p-5 pb-5">
        <AskAI />
      </div>
    </div>
  );
};

export default Page;
