import React, { useEffect, useState } from 'react'

const ButtonInput = ({ lableValue, typeValue, placeholder, handelOnData, name, value, error }: { error?: String, value?: any, name?: string, handelOnData?: (name?: string | undefined, e?: any) => void, lableValue: String, typeValue: String, placeholder: string }) => {
    const [status, setStatus] = useState<Boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [allEmail, setAllEmail] = useState<any>([])
    const [errorEmail, setErrorEmail] = useState<string>('')

    useEffect(() => {
        if (value?.length > 0) {
            setAllEmail(value)
        } else {
            setAllEmail([])
        }
    }, [value])


    const handelOnStatus = () => {
        setStatus(!status)
    }

    const vaidation = () => {
        let formValid = true;
        const regex = /^[\w-]+(\.[\w-]+)*@([a-z\d]+(-[a-z\d]+)*\.)+[a-z]{2,}$/i;

        if (!email?.trim()) {
            formValid = false
            setErrorEmail("Please enter email")
        } else if (!regex.test(email)) {
            formValid = false;
            setErrorEmail("Please enter a valid email address");
        }

        return formValid;
    };
    const handelOnSave = () => {
        if (vaidation() && handelOnData) {
            handelOnStatus()
            const emails = [...allEmail, email]
            setAllEmail(emails)
            setEmail('')
            handelOnData(name, emails)
        }
    }

    const handelOnChangemail = (e: { target: { value: string } }): void => {
        const { value } = e.target
        setEmail(value)
        setErrorEmail('')
    }

    const handelonDelete = (id: number) => {
        const filterData = allEmail?.filter((item: any, index: number) => index !== id)
        setAllEmail(filterData)
    }

    return (
        <div>
            <div className="relative  w-full min-w-[200px]">
                <label className="font-medium text-base text-[#A8C6DF]">{lableValue} {(error ? error : errorEmail) && <span className="text-red-500 text-sm mt-1">{error ? error : errorEmail}</span>}</label>
                <div className="relative">
                    {status ? <input disabled={!status ? true : false} name={name} value={!status ? allEmail : email} onChange={(e: any) => handelOnChangemail(e)} type={`${typeValue}`} className="h-full text-lg w-full border-b border-[#0003] -mt-2 bg-transparent pt-4 pb-1.5 font-sans font-semibold text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 pr-16" placeholder={!status ? placeholder : "Add email"} /> :
                        <div className={`flex ${allEmail?.length === 0 && 'h-9'} pr-16 flex-wrap gap-y-1 gap-x-2 border-b border-[#0003] pt-4 pb-1.5`}>
                            {allEmail?.map((item: string, index: number) => {
                                return <p className="flex items-center text-base px-3 py-0.5 rounded-2xl bg-gray-200 font-sans font-semibold text-blue-gray-700 transition-all gap-x-2">{item} <p className="text-red-700 text-center cursor-pointer" onClick={() => handelonDelete(index)}>x</p></p>
                            })}
                        </div>}
                    <button type="submit" className="absolute end-2.5 bottom-2.5 text-sky-600 text-base font-medium" onClick={() => { status ? handelOnSave() : handelOnStatus() }}>{status ? "Save" : "+ ADD"}</button>
                </div>
            </div>
        </div>
    )
}

export default ButtonInput