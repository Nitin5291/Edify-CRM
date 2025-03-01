import moment from 'moment';
import React from 'react';

const KanbanCard = ({
    onDragLeave,
    onDragEnter,
    onDragEnd,
    onDragOver,
    onDragStart,
    onDrop,
    data,
    name,
    headerName,
    title,
    designStatus = 1,
    filterData
}: {
    onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnter?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop?: (e: React.DragEvent<HTMLDivElement>, data: string) => void;
    data?: any;
    title?: any;
    name: string;
    headerName: string;
    designStatus?: number
    filterData?: any
}) => {
    const getBackgroundColor = () => {
        switch (headerName) {
            case 'Visiting':
            case 'Not Contacted':
            case 'Upcoming':
            case 'Active':
                return 'bg-green-100 border-t-green-300';
            case 'Visited':
            case 'Attempted':
            case 'Ongoing':
                return 'bg-blue-100 border-t-blue-300';
            case 'Lost Opportunity':
            case 'Cold Lead':
            case 'Completed':
                return 'bg-indigo-100 border-t-slate-400';
            case 'Demo attended':
            case 'Warm Lead':
            case 'Opportunity':
            case 'On Hold':
            case 'Inactive':
            case 'NotActive':
                return 'bg-orange-100 border-t-stone-400';
            default:
                return 'bg-slate-200 border-t-slate-700';
        }
    };
    const getBGColor = () => {
        switch (headerName) {
            case 'Visiting':
            case 'Not Contacted':
            case 'Upcoming':
            case 'Active':
                return 'bg-green-300';
            case 'Visited':
            case 'Attempted':
            case 'Ongoing':
                return 'bg-blue-300';
            case 'Lost Opportunity':
            case 'Cold Lead':
            case 'Completed':
                return 'bg-slate-400';
            case 'Demo attended':
            case 'Warm Lead':
            case 'Opportunity':
            case 'On Hold':
            case 'Inactive':
            case 'NotActive':
                return 'bg-stone-400';
            default:
                return '';
        }
    };

    return (
        <div className="h-full grid gap-4">
            <div
                className={`${getBackgroundColor() || ''
                    } border-t-4 rounded-t-md h-20 min-w-80 Xl:min-w-[340px] 2xl:min-w-[370px] py-3 px-5`}
            >
                <h3 className="text-base font-semibold flex gap-2">{headerName}  <span className={` ${getBGColor()} text-sm font-medium px-2 py-0.5 rounded-full`} >{data?.length}</span></h3>
                <p className="text-sm font-semibold">
                    ₹ 0.00 <span className="text-sm font-medium"> . {data?.length} {title ? title : "Leads"}</span>
                </p>
            </div>
            <div
                onDragLeave={onDragLeave}
                onDragEnter={onDragEnter}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop && onDrop(e, name)}
                className="bg-gray-200 h-[63vh] px-0.5 max-w-96 flex items-center justify-center rounded"
            >
                {data?.length > 0 ? (
                    <div className="w-full h-full py-1 overflow-auto flex flex-col gap-3">
                        {data?.map((item: any) => {
                            if (designStatus === 2) {
                                const getColorClass = (courseName: string) => {
                                    switch (courseName) {
                                        case "Morning":
                                            return "bg-orange-500 text-white";
                                        case "Evening":
                                            return "bg-stone-500 text-white";
                                        default:
                                            return "bg-transparent text-black";
                                    }
                                }
                                return (
                                    <div
                                        key={item?.id}
                                        id={item.id}
                                        draggable
                                        onDragStart={onDragStart}
                                        onDragEnd={onDragEnd}
                                        className="bg-white rounded py-3 px-5 cursor-move"
                                    >
                                        <div className="text-black text-base font-semibold">
                                            {item?.name || item?.batchName}
                                        </div>
                                        {item?.slot && <span className={`w-full h-auto flex flex-wrap mt-1.5 relative`}>
                                            <p
                                                className={`flex justify-center rounded-full w-48 h-7 items-center mb-1.5 ${getColorClass(
                                                    item?.slot
                                                )}`}
                                            >
                                                {item?.slot}
                                            </p>
                                        </span>}
                                        <div className="text-black text-sm font-medium">
                                            {moment(item?.createdAt).format("DD/MM/YYYY, h:mm A")}
                                        </div>

                                    </div>
                                )
                            } else if (designStatus === 3) {

                                return (
                                    <div
                                        key={item?.id}
                                        id={item.id}
                                        draggable
                                        onDragStart={onDragStart}
                                        onDragEnd={onDragEnd}
                                        className="bg-white rounded py-3 px-5 cursor-move"
                                    >
                                        <div className="text-black text-base font-semibold">
                                            {item?.trainerName || item?.taskOwner}
                                        </div>
                                        <div className="text-black text-sm font-medium">
                                            {item?.phone || item?.taskType}
                                        </div>
                                        <div className="text-black text-sm font-medium">
                                            {moment(item?.createdAt).format("DD/MM/YYYY, h:mm A")}
                                        </div>

                                    </div>
                                )
                            } else {
                                return (
                                    <div
                                        key={item?.id}
                                        id={item.id}
                                        draggable
                                        onDragStart={onDragStart}
                                        onDragEnd={onDragEnd}
                                        className="bg-white rounded py-3 px-5 cursor-move"
                                    >
                                        {filterData?.length > 0 ? filterData?.map((i: string) => {
                                            return (
                                                <div className="text-black text-base font-medium">
                                                    {item?.[i] ? item?.[i] : "-"}
                                                </div>)

                                        }) :
                                            <>
                                                <div className="text-black text-base font-semibold">
                                                    {item?.name}
                                                </div>
                                                {item?.phone && <div className="text-black text-sm font-medium">
                                                    {'+' + item?.countryCode + ' ' + item?.phone}
                                                </div>}
                                                <div className="text-black text-sm font-medium">
                                                    {moment(item?.createdAt).format("DD/MM/YYYY, h:mm A")}
                                                </div>
                                            </>
                                        }
                                    </div>
                                )
                            }
                        })}
                    </div>
                ) : (
                    <span className="text-sm font-medium">No data found.</span>
                )}
            </div>
        </div>
    );
};

export default KanbanCard;
