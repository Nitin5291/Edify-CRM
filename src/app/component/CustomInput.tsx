import moment from 'moment';
import React from 'react'

const CustomInput = ({ lableValue, handelOnKey, disabled = false, typeValue, placeholder, onChange, name, value = '', error, accept, mandatory = false, alphaBatically = true, name1, value1 = '' }: { error?: string | null, value?: any, name?: String, onChange?: (e: any) => void, lableValue: String, typeValue: String, placeholder?: String, disabled?: boolean, accept?: string, handelOnKey?: (e: any) => void, mandatory?: boolean, alphaBatically?: boolean, name1?: string, value1?: string, }) => {
    const handleKeyDown = (e: { key: string; preventDefault: () => void }) => {
        // Allow only numeric digits
        if (!/^\d$/.test(e.key) && e.key !== 'Backspace') {
            e.preventDefault();
        }
    };
    const handleTextKeyDown = (e: { key: string; preventDefault: () => void }) => {
        // Allow only numeric digits
        if (!/^[a-zA-Z\s]*$/.test(e.key) && e.key !== 'Backspace') {
            e.preventDefault();
        }
    };
    return (
        <div>
            <div className="relative h-11 w-full min-w-[200px] mb-2">
                <label
                    className="font-medium text-base flex gap-1">
                    {lableValue} {mandatory && <span className="text-red-500 text-sm mt-1">*</span>} {error && <span className="text-red-500 text-sm mt-1 pl-1">{error}</span>}
                </label>
                {typeValue === "file" ?
                    <label htmlFor="file">
                        <div className='flex cursor-pointer'>
                            <span className="h-full text-lg w-full border-b border-[#0003] -mt-2.5 bg-transparent pt-4 font-sans font-semibold text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 text-neutral-400">{value ? value : placeholder ? placeholder : 'Choose File'}</span>
                        </div>
                        <input id="file" name={`${name}`} type={`${typeValue}`} className="hidden" accept={accept ? accept : "image/*"} onChange={onChange} />
                    </label>
                    : typeValue === 'date' || typeValue === 'datetime-local' ? <input placeholder={`${placeholder ? placeholder : ""}`}
                        name={`${name}`}
                        value={`${value}`}
                        type={`${typeValue}`}
                        disabled={disabled}
                        min={typeValue === 'datetime-local' ? moment(new Date()).format("YYYY-MM-DDTHH:mm") : moment(new Date()).format("YYYY-MM-DD")}
                        onChange={onChange}
                        className="h-full text-lg w-full border-b border-[#0003] -mt-2 bg-transparent pt-4 pb-1.5 font-sans font-semibold text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 " /> :
                        name === "phone" ? <div className='h-full flex gap-2'>
                            <div className='flex relative'>
                                <p className='absolute top-1 text-xl'>+</p>
                                <input placeholder={`${placeholder ? placeholder : ""}`}
                                    name={`${name1}`}
                                    value={`${value1}`}
                                    disabled={disabled}
                                    type={`${typeValue}`}
                                    onChange={onChange}
                                    onKeyDown={handleKeyDown}
                                    className="pl-4 h-full text-lg w-14 border-b border-[#0003] -mt-2 bg-transparent pt-4 pb-1.5 font-sans font-semibold text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 " />
                            </div>
                            <input placeholder={`${placeholder ? placeholder : ""}`}
                                name={`${name}`}
                                value={`${value}`}
                                type={`${typeValue}`}
                                disabled={disabled}
                                onChange={onChange}
                                onKeyDown={alphaBatically ? name === "ask_ai" ? handelOnKey : name === "phone" || name === "feeQuoted" || name === "amountSpent" || name === "fullNumber" || name === "feeAmount" || name === "paidNumber" || name === "totalFees" || name === "feePaid" || name === "dueAmmount" || name === "mobile" || name === 'phoneNumber' || name === "trainerId" || name === "freeSlots" || name === 'countryCode' ? handleKeyDown : name === "name" ? handleTextKeyDown : undefined : undefined}
                                className="h-full text-lg w-full border-b border-[#0003] -mt-2 bg-transparent pt-4 pb-1.5 font-sans font-semibold text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 " />
                        </div>
                            : <input placeholder={`${placeholder ? placeholder : ""}`}
                                name={`${name}`}
                                value={`${value}`}
                                type={`${typeValue}`}
                                disabled={disabled}
                                onChange={onChange}
                                onKeyDown={alphaBatically ? name === "ask_ai" ? handelOnKey : name === "phone" || name === "feeQuoted" || name === "amountSpent" || name === "fullNumber" || name === "feeAmount" || name === "paidNumber" || name === "totalFees" || name === "feePaid" || name === "dueAmmount" || name === "mobile" || name === 'phoneNumber' || name === "trainerId" || name === "freeSlots" || name === 'countryCode' ? handleKeyDown : name === "name" ? handleTextKeyDown : undefined : undefined}
                                className="h-full text-lg w-full border-b border-[#0003] -mt-2 bg-transparent pt-4 pb-1.5 font-sans font-semibold text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 " />
                }
            </div>
        </div>
    )
}

export default CustomInput





// <input placeholder={`${placeholder ? placeholder : ""}`}
//                             name={`${name}`}
//                             value={`${value}`}
//                             type={`${typeValue}`}
//                             disabled={disabled}
//                             onChange={onChange}
//                             onKeyDown={alphaBatically ? name === "ask_ai" ? handelOnKey : name === "phone" || name === "feeQuoted" || name === "amountSpent" || name === "fullNumber" || name === "feeAmount" || name === "paidNumber" || name === "totalFees" || name === "feePaid" || name === "dueAmmount" || name === "mobile" || name === 'phoneNumber' || name === "trainerId" || name === "freeSlots" || name === 'countryCode' ? handleKeyDown : name === "name" ? handleTextKeyDown : undefined : undefined}
//                             className="h-full text-lg w-full border-b border-[#0003] -mt-2 bg-transparent pt-4 pb-1.5 font-sans font-semibold text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 " />