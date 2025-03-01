import React from 'react'

const SingleSelece = ({ lableValue, data, onChange, name, value, error,mandatory }: { error?: String, value?: String, name?: String, onChange?: (e: any) => void, lableValue: String, data: { value: string; lable: string }[] ,mandatory?:boolean}) => {
    return (
        <div>
            <div className="relative h-11 w-full min-w-[200px] mb-2">
                <label
                    className="font-medium text-base text-[#444444] flex gap-1">
                    {lableValue}{mandatory && <span className="text-red-500 text-sm mt-1">*</span>}  {error && <span className="text-red-500 text-sm mt-1 ml-1">{error}</span>}
                </label>
                <select name={`${name}`} value={`${value}`} onChange={onChange} className="h-full text-neutral-800 text-lg w-full border-b border-[#0003] -mt-2 bg-transparent pt-3.5 font-sans font-semibold outline outline-0 transition-all placeholder-shown:border-blue-gray-200">
                    {/* <option value="">Select {lableValue}</option> */}
                    <option value=""></option>
                    {data?.map((item) => (
                        <option className='text-neutral-800' key={item.value} value={item?.value}>
                            {item?.lable}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default SingleSelece