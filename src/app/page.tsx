'use client'
import Digital_lync from "../assets/Digital_Edify.png"
// import Digital_lync from "../assets/skillcapital.png"
// import Curved from "../assets/new_edify.png"
import Curved from "../assets/gradient_edify.png"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import Image from "next/image"
import { toast } from "react-toastify"
import { userLogin } from "@/assets/utils/auth.util"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { authLogin } from "@/lib/features/auth/authSlice"
import Loader from "./component/Loader"

export default function Page() {
  const [loginData, setLoginData] = useState<{ email?: string; password?: string }>({ email: '', password: '' });
  const [error, setError] = useState<{ email?: string; password?: string }>({});
  const [loader, setLoader] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch()
  const { isLoader } = useAppSelector((state) => state?.auth);


  const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    setError({ ...error, [name]: "" });
  };

  const vaidation = () => {
    let formValid = true;
    const regex = /^[\w-]+(\.[\w-]+)*@([a-z\d]+(-[a-z\d]+)*\.)+[a-z]{2,}$/i;
    const regexPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const newError: { email?: string; password?: string } = {};

    if (!loginData?.email?.trim()) {
      formValid = false
      newError["email"] = "Please enter email"
    } else if (!regex.test(loginData?.email)) {
      formValid = false;
      newError["email"] = "Please enter a valid email address";
    }

    if (!loginData?.password?.trim()) {
      formValid = false
      newError["password"] = "Please enter password"
    }

    setError(newError);
    return formValid;
  };

  const handelOnSubmit = async () => {
    if (vaidation()) {
      setLoader(true)
      const data = {
        email: loginData.email,
        password: loginData.password
      };

      try {
        const response = await fetch("api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loginData.email, password: loginData.password }),
        });
        console.log("🚀 ~ handelOnSubmit ~ response:", response)
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Login failed");
        userLogin(data?.data)
        router.push('/dashboard')
        setLoader(false)
        console.log("🚀 ~ handelOnSubmit ~ data:", data)
      } catch (err: any) {
        toast.error(err?.message ? err?.message : "Something went wrong");
        setLoader(false)
      }

      // dispatch(authLogin(data)).unwrap()
      //   .then((res: any) => {
      //     userLogin(res)
      //     toast.success(res?.message ? res?.message : "Login Successful");
      //     router.push('/dashboard')
      //     setLoader(false)
      //   })
      //   .catch((err) => {
      //     const error = JSON?.parse(err?.message)
      //     toast.error(error?.message ? error?.message : "Something went wrong");
      //     setLoader(false)
      //   });
    }
  }

  const handleKeyDown = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handelOnSubmit(); // Call submit function on Enter key press
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex justify-center mt-6 md:mt-30 w-full md:w-1/2 p-6 md:p-0">
        <div className="flex flex-col justify-center w-full max-w-sm md:max-w-md lg:max-w-lg">
          <div className="flex justify-center">
            <Image src={Digital_lync} className="h-16  w-40" alt="DigitalEdify" />
          </div>
          <div className="mt-10 bg-white border border-gray-300 p-6 rounded-lg shadow-lg">
            <div>
              <label className="block text-sm font-normal leading-6 text-gray-900">Email</label>
              <input
                id="email"
                value={loginData?.email}
                name="email"
                type="text"
                onChange={(e) => handelOnChange(e)}
                required
                onKeyDown={handleKeyDown}
                className="block w-full rounded-lg border border-gray-300 p-1.5 text-gray-900 focus:border-sky-500 focus:outline-none h-12 sm:text-sm sm:leading-6"
              />
              <span className="text-sm text-red-600">{error["email"]}</span>
            </div>
            <div className="mt-5">
              <label className="block text-sm font-normal leading-6 text-gray-900">Password</label>
              <input
                name="password"
                value={loginData?.password}
                type="password"
                onChange={(e) => handelOnChange(e)}
                required
                onKeyDown={handleKeyDown}
                className="block w-full rounded-lg border border-gray-300 p-1.5 text-gray-900 focus:border-sky-500 focus:outline-none h-12 sm:text-sm sm:leading-6"
              />
              <span className="text-sm text-red-600">{error["password"]}</span>
            </div>
            <div className="mt-9">
              <button
                disabled={loader}
                type="submit"
                onClick={() => handelOnSubmit()}
                className="flex w-full justify-center rounded-lg bg-gradient-to-r from-blue-500 to-pink-600 p-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loader ? <Loader size={5} label="Login..." /> : "Login"}
              </button>
            </div>
            <div className="flex gap-2 mt-8">
              <input type="checkbox" className="h-5 w-5" />
              <span className="font-normal text-sm text-gray-600">Remember Me</span>
            </div>
            <span className="text-gray-500 text-sm font-medium mt-24 text-center block">©2024, All rights reserved</span>
          </div>
        </div>
      </div>
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-white">
        <div className="px-14 2xl:px-24 mt-10 text-center">
          <h1 className="text-[#042D60]  font-bold text-[2rem] leading-[normal]">Seamlessly manage all learner data in a unified platform.</h1>
          <p className="text-[#042D60] font-normal text-lg">Centralize customer data effortlessly. Streamline communication, sales, and support for seamless growth.</p>
        </div>
        <div className="relative mt-4">
          <div className="relative h-[32.5rem] lg:h-[33rem] xl:h-[30.5rem] w-full">
            <Image src={Curved} alt="Curved" layout="fill" objectFit="cover" />
          </div>
        </div>
      </div>
    </div>
  )
}
