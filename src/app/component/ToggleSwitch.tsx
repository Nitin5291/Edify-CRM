import React from "react";

const ToggleSwitch = ({ value, onChange }: { value?: any, onChange?: (e: any) => void }) => {
    return (
        <div className="grid gap-2">
            <span className="font-medium text-base text-gray-900 dark:text-gray-300">
                Reminder
            </span>
            <label className="items-center cursor-pointer">
                <input
                    name="reminder"
                    type="checkbox"
                    checked={value == "true" || value == true ? true : false}
                    className="sr-only peer"
                    onChange={onChange}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
        </div>
    );
};

export default ToggleSwitch;
