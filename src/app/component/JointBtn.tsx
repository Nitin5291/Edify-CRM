import React from 'react'
import Loader from './Loader'

const JointBtn = ({ button1, disablButton1, disablButton2, button2 = "", onClick1, onClick2, isLoading = false }: { disablButton1?: boolean; disablButton2?: boolean; isLoading?: Boolean, button1: String, button2: String, onClick1?: () => void, onClick2?: () => void }) => {
    return (
        <div className="flex items-center gap-2 justify-center">
            <button
                onClick={onClick1}
                type="button"
                disabled={disablButton1 ? disablButton1 : isLoading ? true : false}
                className="py-2 w-32 lg:w-48 text-base font-medium text-[#0979D0] focus:outline-none bg-white rounded-lg border border-[#0979D0] hover:bg-gray-100 disabled:opacity-50"
            >
                {button1}
            </button>
            <button
                onClick={onClick2}
                type="button"
                disabled={disablButton2 ? disablButton2 : isLoading ? true : false}
                className="text-white bg-[#0979D0] hover:bg-[#097ad0de] rounded-lg text-base py-2 w-32 lg:w-48 text-center disabled:opacity-50"
            >
                {isLoading ? <Loader label={`${button2}`} /> : button2}
            </button>
        </div>
    )
}

export default JointBtn