import { HostItem, PriorityItem } from "@/app/component/Type";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const navigation = [
  // { name: "Dashboard", href: "/dashboard", current: true },
  { name: "Campaigns", href: "/campaign", current: false },
  // { name: "Leads", href: "/leads", current: false },
  { name: 'Leads', href: '/leads', current: false, children: [{ name: 'Create Lead' }] },
  {
    name: "Opportunities",
    href: "/opportunities",
    current: false,
    children: [
      { name: "Create Opportunity" },
      { name: "Visited" },
      { name: "Demo Attended" },
    ],
  },
  { name: "Learners", href: "/learner", current: false },
  { name: "Batches", href: "/batches", current: false },
  { name: "Trainers", href: "/trainers", current: false },
  // // { name: "Courses", href: "/courses", current: false },
  // // { name: "Ask AI", href: "/ask_aI", current: true },
  // // { name: "Activities", href: "#", current: false },
  { name: "Tasks", href: "/tasks", current: false },
  // { name: "Analytics", href: "/analytics", current: false },
];

export const LeadSource = [
  "None",
  "Walk In",
  "Student Referral",
  "Demo",
  "WebSite",
  "Website Chat",
  "Inbound Call",
  "Google AdWords",
  "Facebook Ads",
  "Google My Business",
  "WhatsApp - Digital Edify",
];


export const leadsource = [
  "None",
  "Walk In",
  "Student Referral",
  "Demo",
  "WebSite",
  "Website Chat",
  "Inbound Call",
  "Google AdWords",
  "Facebook Ads",
  "Google My Business",
  "WhatsApp",
];


export const LeadStatus = [
  "Not Contacted",
  "Attempted",
  "Warm Lead",
  "Cold Lead",
];

export const BatchesStatus = [
  "None",
  "Yet to Assign",
  "Ongoing",
];

export const TrainerStatus = [
  "Active",
  "NotActive",
];
export const TaskStatus = [
  "Active",
  "NotActive",
];
export const ModeOfClassList = [
  "Online",
  "Offline"];

// export const CourseList = [
//   "Java",
//   "UI/UX Design",
//   "Python",
//   "React JS",
//   "Full-Stack Developer",
//   "Business Analyst",
//   "Software Testing",
//   "DevOps",
//   "Azure DevOps",
//   "AWS Cloud",
//   "Azure Cloud",
//   "Salesforce",
//   "Azure Data Engineering",
//   "AWS Data Engineering",
//   "GCP Data Engineering",
//   "AI Training & Certification",
//   "Data Science Training",
//   "Power BI",

//   // "AI Artificial Intelligence",
//   // "Data Analyst",
//   // "Communication Skills",
//   // "Spoken English"
// ];

export const coursesPrice = [
  { label: "Java", value: 10000 },
  { label: "UI/UX Design", value: 15000 },
  { label: "Python", value: 10000 },
  { label: "React JS", value: 10000 },
  { label: "Full Stack Developer", value: 20000 },
  { label: "Business Analyst", value: 10000 },
  { label: "Software Testing", value: 10000 },
  { label: "DevOps", value: 10000 },
  { label: "Azure DevOps", value: 15000 },
  { label: "AWS Cloud", value: 10000 },
  { label: "Azure Cloud", value: 10000 },
  { label: "Salesforce", value: 15000 },
  { label: "Azure Data Engineering", value: 25000 },
  { label: "AWS Data Engineering", value: 25000 },
  { label: "GCP Data Engineering", value: 25000 },
  { label: "AI Training & Certification", value: 20000 },
  { label: "Data Science Training", value: 25000 },
  { label: "Power BI", value: 10000 }
];

export const CourseList = coursesPrice?.map((item: any) => { return item?.label })

export const Source = [
  "None",
  "website",
  "Chat",
  "Inbound Call",
  "Direct Walkin",
  "Reference",
  "walkin",
  "Demo",
  "Google My Business",
];


export const PriceList = [
  "None",
  "10000",
  "12000",
  "15000",
  "16000",
  "17000",
  "18000",
  "19000",
  "20000",
  "25000",
  "30000",
];

// export const ProgramsList = [
//   "Full-Stack Java",
//   "Full-Stack Python",
//   "Full-Stack MERN",
//   "Full-Stack AI Data Masters",
//   "Multi-Cloud DevOps",
//   "Multi-Cloud Data Engineering",
//   "AI Data Analyst",
// ];


export const ProgramsPrice = [
  { label: "Full Stack Java", value: 20000 },
  { label: "Full Stack Python", value: 20000 },
  { label: "Full Stack MERN", value: 20000 },
  { label: "Full AI Data Masters", value: 35000 },
  { label: "Multi Cloud DevOps", value: 30000 },
  { label: "Multi Cloud Data Engineering", value: 40000 },
  { label: "AI Data Analyst", value: 25000 }
];

export const ProgramsList = ProgramsPrice?.map((item: any) => { return item?.label })


export const SlotStatus = [
  "None",
  "Morning",
  "Evening",
];
// "Opportunity"

export const TechStack = ["Hyderabad-Online", "Hyderabad-Offline", "Bangalore-Online", "Bangalore-Offline", "Kakinada-Online", "Kakinada-Online"];
export const IdProof = ["None", "App Stack", "Alile Stack", "AI Stack"];
export const techstack = ["Application Stack", "Platform Stack", "AI Data Stack", "Skill Stack"];

// 'VFX',
// 'AR & VR',
// 'UX Design',
// 'Interior Design',
// 'Fashion Design',
// 'Game Design & Art',
// 'Game Development',
// 'Digital Marketing'

// "Career Counselling",
//     "Business Stack",
//     "ServiceNow",
//     "DataStack",
//     "FullStack",
//     "Salesforce",
//     "Cloud Ops",

export const ClassMode = [
  "International Online",
  "India Online",
  "BLR ClassRoom",
  "HYD ClassRoom",
];

export const classmode = [
  "HYD CLASSROOM",
  "BANGALORE CLASSROOM",
  "KAKINADA CLASSROOM",
  "INDIA ONLINE",
  "INTERNATIONAL ONLINE"
];

export const BatchStatusMode = [
  "Upcoming",
  "Ongoing",
  "On Hold",
  "Completed",
];
export const SlackStage = [
  "Yes",
  "No",
];
export const Type = [
  "Email",
  "WhatsApp",
  "Google",
  "Meta",
];
export const BatchTiming = [
  "7AM-8AM",
  "8AM-9AM",
  "9AM-10AM",
  "10AM-11AM",
  "11AM-12PM",
  "12PM-1PM",
  "1PM-2PM",
  "2PM-3PM",
  "3PM-4PM",
  "4PM-5PM",
  "5PM-6PM",
  "6PM-7PM",
  "7PM-8PM",
  "8PM-9PM",
];

export const perferabletime = [
  "7AM-8AM",
  "ANYTIME",
  "8AM-9AM",
  "9AM-10AM",
  "10AM-11AM",
  "11AM-12PM",
  "12PM-1PM",
  "1PM-2PM",
  "2PM-3PM",
  "3PM-4PM",
  "4PM-5PM",
  "5PM-6PM",
  "6PM-7PM",
  "7PM-8PM",
  "8PM-9PM",
  "Week End"
];

export const batchtiming = [
  "7AM-8AM",
  "8AM-9AM",
  "9AM-10AM",
  "10AM-11AM",
  "11AM-12PM",
  "12PM-1PM",
  "1PM-2PM",
  "2PM-3PM",
  "3PM-4PM",
  "4PM-5PM",
  "5PM-6PM",
  "6PM-7PM",
  "7PM-8PM",
  "8PM-9PM",
  "Week End"
];

export const counselledBy = [
  "SalesUser List"
];

export const leadStatus = [
  "Not Contacted",
  "Attempted",
  "Warm Lead",
  // "Opportunity",
  // "Registered",
  // "Not Qualified",
  "Cold Lead",
];

export const warmStage = [
  "None",
  "Visiting Campus",
  "Intrested in Demo",
  "Need Time",
  "Special Requirements"
];

export const opportunitystage = [
  "None",
  "Special Requirements",
  "Visited Campus",
  "Demo Attended",
  "Interested in Demo",
  "Visiting Campus",
  "Fees Negotiation",
  "Batch Allocation",
  "Need Time",
  "Ready to Join",
  "Closed Won(Registered)",
  "Lost Opportunity",
];


export const Prioritydata: PriorityItem[] = [
  { lable: "High", value: "High" },
  { lable: "Low", value: "Low" },
  { lable: "Medium", value: "Medium" },
];

export const CampaignListView: HostItem[] = [
  { lable: "All Active Campaigns", value: "all_active_campaigns" },
  { lable: "My Active Campaigns", value: "my_active_campaigns" },
  { lable: "Recently Viewed Campaigns", value: "recently_viewed_campaigns" },
];
export const DealListView: HostItem[] = [
  { lable: "All Leads", value: "all_leads" },
  { lable: "My Leads", value: "my_leads" },
  { lable: "Today’s Leads", value: "todays_leads" },
  { lable: "Today’s expected Walkins", value: "todays_expected_walkins" },
  // { lable: "Yesterday’s Leads", value: "yesterdays_leads" },
  // { lable: "This Week Leads", value: "this_week_leads" },
  // { lable: "This Month Leads", value: "this_month_leads" },
  // { lable: "Last Month Leads", value: "lastmonth_leads" },
];
export const BatcheListView: HostItem[] = [
  { lable: "All Batches", value: "all_batches" },
  { lable: "My Batches", value: "my_batches" },
  { lable: "Today’s Batches", value: "todays_batches" },
  { lable: "Yesterday’s Batches", value: "yesterdays_batches" },
  { lable: "This Week Batches", value: "this_week_batches" },
  { lable: "This Month Batches", value: "this_month_batches" },
  { lable: "Last Month Batches", value: "lastmonth_batches" },
];
export const TrainerListView: HostItem[] = [
  { lable: "All Trainer", value: "all_trainer" },
  { lable: "My Trainer", value: "my_trainer" },
  { lable: "Today’s Trainer", value: "todays_trainer" },
  { lable: "Yesterday’s Trainer", value: "yesterdays_trainer" },
  { lable: "This Week Trainer", value: "this_week_trainer" },
  { lable: "This Month Trainer", value: "this_month_trainer" },
  { lable: "Last Month Trainer", value: "lastmonth_trainer" },
];
export const TaskListView: HostItem[] = [
  { lable: "All Tasks", value: "all_tasks" },
  { lable: "Open Tasks", value: "open_tasks" },
  { lable: "Closed Tasks", value: "closed_tasks" }
];
export const OpportunitiesListView: HostItem[] = [
  { lable: "All Opportunities", value: "all_opportunities" },
  { lable: "My Opportunities", value: "my_opportunities" },
  { lable: "Today’s Opportunities", value: "todays_opportunities" },
  { lable: "Yesterday’s Opportunities", value: "yesterdays_opportunities" },
  { lable: "This Week Opportunities", value: "this_week_opportunities" },
  { lable: "This Month Opportunities", value: "this_month_opportunities" },
  { lable: "Last Month Opportunities", value: "last_month_opportunities" },
];

export const LearnersListView: HostItem[] = [
  { lable: "All Learners", value: "all_learners" },
  { lable: "My Learners", value: "my_learners" },
  { lable: "Today’s Learners", value: "todays_learners" },
  // { lable: "Yesterday’s Learners", value: "yesterdays_learners" },
  // { lable: "This Week Learners", value: "this_week_learners" },
  // { lable: "This Month Learners", value: "this_month_learners" },
  // { lable: "Last Month Learners", value: "last_month_learners" },
];

export const CoursePageView: HostItem[] = [
  { lable: "Courses", value: "courses" },
];
export const UserPageView: HostItem[] = [
  { lable: "All User", value: "All User" },
];

export const UserRole: HostItem[] = [
  { lable: "Admin", value: "admin" },
  { lable: "Salesperson", value: "salesperson" },
  { lable: "Stakeholder", value: "stakeholder" },
  { lable: "Support", value: "support" },
  { lable: "Trainer", value: "trainer" },
];

export const OpportunityStage = [
  "None",
  "Advanced Discussion",
  "Ready To Join",
  "Visiting",
  "Fees Negotiation",
  "Batch Allocation",
  "Intersted in Demo",
  "Need Time This week",
  "Need Time Next Week",
  "Need Time This Month",
  "Needs Time Next Month",
  "Special Requirements",
  "Payment Link Sent",
  "Closed Won(Registered)",
  "Busy & Asked a call back",
  "Closed Lost",
];
export const LocationData = [
  "Hyderabad", "Bangalore", "Kakinada"
]

export const DemoAttendedStage = [
  "None",
  "Ready to Join",
  "Advanced Discussion",
  "Call Not Answered",
  "Visiting",
  "Fees Negotiation",
  "Batch Allocation",
  "Need time this Week",
  "Need Time Next Week",
  "Need Time This Month",
  "Need Time Next Month",
  "Special Requirements",
  "Closed Won(Registered)",
  "Closed Lost(Cold Lead)",
];

export const VisitedStage = [
  "None",
  "Call Not Answered",
  "Ready To Join",
  "Fees Negotiation",
  "Batch Allocation",
  "Interested Demo",
  "Special Requirements",
  "Need Time This week",
  "Need Time Next Week",
  "Need Time This Month",
  "Need Time Next Month",
  "Closed Won(Registered)",
  "Closed Lost(Cold Lead)",
];
export const LearnerVisitedStage = [
  "None",
  "Morning",
  "Evening"
];

export const ColdLeadReason = [
  "Invalid Number",
  "Not Interested",
  "Joined Another Institute",
  "Asking free course",
  "Pay after Placement",
];

export const OpportunityStatus = ["Visiting", "Visited", "Demo attended", "Lost Opportunity"];

export const EmailTypeData = [
  "Cold Leads Emails Template",
  "Business analyst Email Template",
  "Generic_Followup_Mail",
  "ServiceNow-Stage 1",
  "Testing - Stage 1",
  "Java - Stage 1",
  "React - Stage 1",
  "Angular - Stage 1",
  "Python - Stage 1",
];

// hooks
export const filterId = (selectedCell: any[]) => {
  return selectedCell
    ?.map((item: any) => {
      return item?.id;
    })
    ?.join();
};

export const dataFilter = (
  options: any[],
  searchValue: string = "",
  fields: string[] = []
) => {
  return options?.filter((option: any) => {
    // Check if any field in the option matches the search value
    return fields?.some((field: any) => {
      // Perform filtering logic for each field
      const fieldValue = option?.[field] || "";
      return fieldValue && fieldValue?.toString()?.toLowerCase()?.indexOf(searchValue?.toString()?.toLowerCase()) > -1;
    });
  });
};

export const extractFilename = (url: any) => {
  const pathname = new URL(url).pathname;
  // Extract filename from pathname
  const filename = pathname.substring(pathname.lastIndexOf("/") + 1);
  return decodeURIComponent(filename);
};

type Ref<T> = React.RefObject<T>;

type EventHandler = (event: MouseEvent | TouchEvent) => void;

export function useOnClickOutsideMultiple(
  refs: Ref<any>[],
  handler: EventHandler
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Check if the event target is not contained in any of the refs
      if (
        refs.every(
          (ref) => !ref.current || !ref.current.contains(event.target as Node)
        )
      ) {
        handler(event);
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [refs, handler]);
}

export const FilterLableAndValue = (datas: any) => {
  const data: HostItem[] = datas?.map((item: any) => {
    return { lable: item, value: item };
  });
  return data;
};

export const DateFormate = (data: string) => {
  if (data) {
    const date = new Date(data);
    const convertedDate = date.toISOString().split("T")[0];
    return convertedDate;
  }
  return "";
};

export const downloadExcel = (data: any[], name?: string) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    if (name === "Call Log") {
      worksheet["!cols"] = [
        { wch: 50 },
        { wch: 25 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
      ];
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const file = new Blob([excelBuffer], { type: fileType });
    saveAs(file, `${name}.xlsx`);
  } catch (error) {
    console.error("Error generating Excel:", error);
  }
};

export const formatHour = (hour: number) => {
  if (hour === 0) {
    return "12am";
  } else if (hour === 12) {
    return "12pm";
  } else if (hour < 12) {
    return hour + "am";
  } else {
    return hour - 12 + "pm";
  }
};


interface WindowDimensions {
  width: number;
  height: number;
}

const getWindowDimensions = (): WindowDimensions => {
  if (typeof window !== 'undefined') {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  };
  return {
    width: 0,
    height: 0
  };
}


export const useWindowDimensions = (): WindowDimensions => {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>(getWindowDimensions());

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;


export const convertDate = (dateString: any) => {
  // Create a new Date object from the input string
  const date = new Date(dateString);

  // Extract the date parts
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Format the date as required
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

  return formattedDate;
}

export const adjustTime = (dateString: any) => {
  // Parse the input date string into a Date object
  const date = new Date(dateString);

  // Adjust the time by adding 5.5 hours (19800 seconds)
  const adjustedTime = new Date(date.getTime());
  // const adjustedTime = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);

  // Return the adjusted time as a string or Date object
  return adjustedTime.toISOString(); // or use adjustedTime.toLocaleString() for a more readable format
};

// Time duration find
export const calculateDuration = (start: string, end: string) => {
  const [startHours, startMinutes] = start.split(':').map(Number);
  const [endHours, endMinutes] = end.split(':').map(Number);
  const startTime: any = new Date();
  startTime.setHours(startHours, startMinutes, 0);

  const endTime: any = new Date();
  endTime.setHours(endHours, endMinutes, 0);

  const diffMs = endTime - startTime; // Difference in milliseconds
  const diffMins = Math.floor(diffMs / 60000); // Difference in minutes

  const diffHrs = Math.floor(diffMins / 60); // Hours
  const remainingMins = diffMins % 60; // Remaining minutes

  // console.log(`${diffHrs} hours, ${remainingMins} minutes`);
  return `${diffHrs} h, ${remainingMins} min`
};



//create leade
export const createLeadForm: any = [
  {
    name: "name",
    lableValue: "Name",
    placeholder: "Name",
    typeValue: "text",
    type: "input",
    mandatory: true
  },
  {
    name: "courseList",
    lableValue: "Course",
    data: FilterLableAndValue(CourseList),
    type: "select",
  },
  {
    name: "email",
    lableValue: "Email",
    placeholder: "Email of learner",
    typeValue: "email",
    type: "input",
    mandatory: true
  },
  {
    name: "programs",
    lableValue: "Programs",
    data: FilterLableAndValue(ProgramsList),
    type: "select",
  },
  {
    name: "phone",
    lableValue: "Phone Number",
    placeholder: "Mobile number",
    typeValue: "text",
    type: "input",
    name1: "countryCode",
    mandatory: true,
  },
  {
    name: "techStack",
    lableValue: "Tech Stack",
    data: FilterLableAndValue(techstack),
    type: "select",
  },
];
export const createLeadForm1: any = [
  {
    name: "leadOwner",
    lableValue: "Lead Owner",
    type: "select",
    // typeValue: "text",
    // type: "input",
  },
  {
    name: "nextFollowUp",
    lableValue: "Next Follow Up",
    placeholder: "Next FollowUp",
    typeValue: "date",
    type: "input",
  },
  {
    name: "name",
    lableValue: "Name",
    placeholder: "Name",
    typeValue: "text",
    type: "input",
    mandatory: true
  },
  {
    name: "visitedDate",
    lableValue: "Visited Date",
    placeholder: "Visited Date",
    typeValue: "datetime-local",
    type: "input",
  },
  {
    name: "email",
    lableValue: "Email",
    placeholder: "Email of learner",
    typeValue: "email",
    type: "input",
    mandatory: true
  },
  {
    name: "counselledBy",
    lableValue: "Counselled By",
    // data: FilterLableAndValue(counselledBy),
    type: "select",
  },
  {
    name: "phone",
    name1: "countryCode",
    lableValue: "Contact Number",
    placeholder: "Contact Number",
    typeValue: "text",
    type: "input",
    mandatory: true,
  },
  {
    name: "expectedWalkInDate",
    lableValue: "Expected Walk-in Date",
    placeholder: "Expected walk-in date",
    typeValue: "date",
    type: "input",
  },
  {
    name: "leadStatus",
    lableValue: "Lead Status",
    data: FilterLableAndValue(leadStatus),
    type: "select",
  },
  {
    name: "expRegistrationDate",
    lableValue: "Expected Registration Date",
    placeholder: "Date",
    typeValue: "date",
    type: "input",
  },
  {
    name: "warmStage",
    lableValue: "Warm Lead",
    data: FilterLableAndValue(warmStage),
    type: "select",
  },
  {
    name: "demoAttendedDate",
    lableValue: "Demo Attended Date",
    placeholder: "Demo Attended Date",
    typeValue: "datetime-local",
    type: "input",
  },
  {
    name: "courseList",
    lableValue: "Course",
    data: FilterLableAndValue(CourseList),
    type: "select",
  },
  {
    name: "coldLeadReason",
    lableValue: "Cold Lead Reason",
    data: FilterLableAndValue(ColdLeadReason),
    type: "select",
  },
  {
    name: "programs",
    lableValue: "Programs",
    data: FilterLableAndValue(ProgramsList),
    type: "select",
  },
  {
    name: "classMode",
    lableValue: "Class Mode",
    data: FilterLableAndValue(classmode),
    type: "select",
  },
  {
    name: "techStack",
    lableValue: "Tech Stack",
    data: FilterLableAndValue(techstack),
    type: "select",
    mandatory: true
  },
  {
    name: "batchTiming",
    lableValue: "Batch Timing",
    data: FilterLableAndValue(batchtiming),
    type: "multiSelect",
  },
  {
    name: "priceList",
    lableValue: "Price List",
    // data: FilterLableAndValue(PriceList),
    // type: "select",
    typeValue: "text",
    type: "input",
  },
  {
    name: "feeQuoted",
    lableValue: "Fee Quoted",
    placeholder: "Fee Quoted",
    typeValue: "text",
    type: "input",
  },
  {
    name: "leadSource",
    lableValue: "Lead Source",
    data: FilterLableAndValue(leadsource),
    type: "select",
  },
  {
    name: "leadScore",
    lableValue: "Lead Score",
    typeValue: "text",
    type: "input",
  },
  {
    name: "leadSourceURL",
    lableValue: "Lead Source URL",
    typeValue: "text",
    type: "input",
  },

  // {
  //   name: "alternativePhone",
  //   lableValue: "Alternative Phone",
  //   placeholder: "Alternative Phone",
  //   typeValue: "text",
  //   type: "input",
  // },
  // {
  //   name: "countryCode",
  //   lableValue: "Country Code",
  //   placeholder: "Country Code",
  //   typeValue: "text",
  //   type: "input",
  // },
  // {
  //   name: "fullNumber",
  //   lableValue: "Full Number",
  //   placeholder: "Full Number",
  //   typeValue: "text",
  //   type: "input",
  // },
  // {
  //   name: "leadSource",
  //   lableValue: "Lead Source",
  //   data: FilterLableAndValue(leadsource),
  //   type: "select",
  // },

];

//create leade
export const createLeadForm2: any = [
  {
    name: "registrationcourse",
    lableValue: "Registered Course",
    placeholder: "Registered Course",
    typeValue: "text",
    type: "input",
  },
  {
    name: "perferabletime",
    lableValue: "Preferable Time",
    data: FilterLableAndValue(perferabletime),
    type: "select",
  },
  {
    name: "techStack",
    lableValue: "Tech Stack",
    data: FilterLableAndValue(techstack),
    type: "select",
    mandatory: true
  },
  {
    name: "batchtiming",
    lableValue: "Batch Timing ",
    data: FilterLableAndValue(batchtiming),
    type: "select",
  },
  {
    name: "courseDetails",
    lableValue: "Course Details",
    data: FilterLableAndValue(CourseList),
    type: "select",
  },
  {
    name: "modeOfClass",
    lableValue: "Mode Of Class ",
    data: FilterLableAndValue(ModeOfClassList),
    type: "select",
  }
];


export const createLeadForm3: any = [
  {
    name: "feeAmount",
    lableValue: "Fee or Amount Paid",
    placeholder: "Partial amount",
    typeValue: "text",
    type: "input",
  },
  // {
  //   name: "paidNumber",
  //   lableValue: "Paid Due Amount",
  //   placeholder: "Amount paid",
  //   typeValue: "text",
  //   type: "input",
  // },
  {
    name: "installmentPayment",
    lableValue: "Mode of Installment payment None",
    placeholder: "Payment image",
    typeValue: "file",
    type: "input",
  },
  {
    name: "totalFees",
    lableValue: "Total Fees",
    placeholder: "Full amount",
    typeValue: "text",
    type: "input",
  },
  // {
  //   name: "paidDueDate",
  //   lableValue: "Paid Due's Date",
  //   placeholder: "Pending amount paid date",
  //   typeValue: "date",
  //   type: "input",
  // },
  {
    name: "installmentScreenshot",
    lableValue: "Instalment 1 Screenshot",
    placeholder: "Payment image",
    typeValue: "file",
    type: "input",
  },
  // {
  //   name: "feePaid",
  //   lableValue: "Fee Paid",
  //   placeholder: "Paid amount",
  //   typeValue: "text",
  //   type: "input",
  // },
  {
    name: "dueAmmount",
    lableValue: "Due Amount",
    placeholder: "Pending amount",
    typeValue: "text",
    type: "input",
  },
  {
    name: "dueDate",
    lableValue: "Due Date",
    placeholder: "Last date of payment",
    typeValue: "date",
    type: "input",
  },
  // {
  //   name: "alternativePhone",
  //   lableValue: "Alternative Phone",
  //   placeholder: "Alternative Phone",
  //   typeValue: "text",
  //   type: "input",
  // },
  // {
  //   name: "leadOwner",
  //   lableValue: "Lead Owner",
  //   placeholder: "Lead Owner",
  //   typeValue: "text",
  //   type: "input",
  // },
  // {
  //   name: "courseList",
  //   lableValue: "Course List",
  //   data: FilterLableAndValue(CourseList),
  //   type: "select",
  // },
  // {
  //   name: "priceList",
  //   lableValue: "Price List",
  //   data: FilterLableAndValue(PriceList),
  //   type: "select",
  // },
  // {
  //   name: "techStack",
  //   lableValue: "Tech Stack",
  //   data: FilterLableAndValue(techstack),
  //   type: "select",
  //   mandatory: true
  // },
  // {
  //   name: "courseDetails",
  //   lableValue: "Course Details",
  //   data: FilterLableAndValue(CourseList),
  //   type: "select",
  // },
  // {
  //   name: "leadSource",
  //   lableValue: "Lead Source",
  //   data: FilterLableAndValue(leadsource),
  //   type: "select",
  // },
  // {
  //   name: "classMode",
  //   lableValue: "Class Mode",
  //   data: FilterLableAndValue(classmode),
  //   type: "select",
  // },
  // {
  //   name: "feeQuoted",
  //   lableValue: "Fee Quoted",
  //   placeholder: "Fee Quoted",
  //   typeValue: "text",
  //   type: "input",
  // },
  // {
  //   name: "dlLeadScore",
  //   lableValue: "DL Lead Score",
  //   placeholder: "DL Lead Score",
  //   typeValue: "text",
  //   type: "input",
  // },
  // {
  //   name: "batchtiming",
  //   lableValue: "Batch Timing",
  //   data: FilterLableAndValue(batchtiming),
  //   type: "select",
  // },
  // {
  //   name: "expectedWalkinDate",
  //   lableValue: "Expected walk-in date",
  //   placeholder: "Expected walk-in date",
  //   typeValue: "datetime-local",
  //   type: "input",
  // },
  // {
  //   name: "visitedDate",
  //   lableValue: "Visited Date",
  //   placeholder: "Visited Date",
  //   typeValue: "datetime-local",
  //   type: "input",
  // },
  // {
  //   name: "expectedRegistrationDate",
  //   lableValue: "Expected Registration Date",
  //   placeholder: "Expected Registration Date",
  //   typeValue: "datetime-local",
  //   type: "input",
  // },
  // {
  //   name: "counselledBy",
  //   lableValue: "Counselled By",
  //   data: FilterLableAndValue(counselledBy),
  //   type: "select",
  // },
  // {
  //   name: "leadStatus",
  //   lableValue: "Lead Status",
  //   data: FilterLableAndValue(leadStatus),
  //   type: "select",
  // },
  // {
  //   name: "warmStage",
  //   lableValue: "Warm Stage",
  //   data: FilterLableAndValue(warmStage),
  //   type: "select",
  // },
  // {
  //   name: "nextFollowUp",
  //   lableValue: "Next FollowUp",
  //   placeholder: "Next FollowUp",
  //   typeValue: "datetime-local",
  //   type: "input",
  // },
  // {
  //   name: "demoAttendedDate",
  //   lableValue: "Demo Attended Date",
  //   placeholder: "Demo Attended Date",
  //   typeValue: "datetime-local",
  //   type: "input",
  // },
  // {
  //   name: "opportunityStage",
  //   lableValue: "Opportunity Stage",
  //   data: FilterLableAndValue(opportunitystage),
  //   type: "select",
  // },
  // {
  //   name: "coldLeadReason",
  //   lableValue: "Cold Lead Reason",
  //   data: FilterLableAndValue(ColdLeadReason),
  //   type: "select",
  // },
  // { name: "courseId", lableValue: "Course", type: "multiSelect" },
  // {
  //   name: "batchTiming",
  //   lableValue: "Batch Timing",
  //   data: FilterLableAndValue(BatchTiming),
  //   type: "multiSelect",
  // },
  // {
  //   name: "nextFollowUp",
  //   lableValue: "Next FollowUp",
  //   placeholder: "Next FollowUp",
  //   typeValue: "datetime-local",
  //   type: "input",
  // },
];


//create Opportunity
export const createOpportunityForm: any = [
  {
    name: "name",
    lableValue: "Name",
    placeholder: "Name",
    typeValue: "text",
    type: "input",
    mandatory: true,
  },
  {
    name: "phone",
    lableValue: "Phone",
    placeholder: "Phone",
    typeValue: "text",
    type: "input",
    mandatory: true,
    name1: "countryCode",
  },
  {
    name: "email",
    lableValue: "Email",
    placeholder: "Email",
    typeValue: "email",
    type: "input",
  }, {
    name: "techStack",
    lableValue: "Teck Stack",
    data: FilterLableAndValue(techstack),
    type: "select",
  },
  {
    name: "countryCode",
    lableValue: "Country Code",
    placeholder: "CC",
    typeValue: "text",
    type: "input",
  },
  {
    name: "courseList",
    lableValue: "Course List",
    data: FilterLableAndValue(CourseList),
    type: "select",
  }

];
export const updateOpportunityForm: any = [
  {
    name: "name",
    lableValue: "Name",
    placeholder: "Name",
    typeValue: "text",
    type: "input",
  },
  {
    name: "expRegistrationDate",
    lableValue: "Expected Registration Date",
    placeholder: "",
    typeValue: "date",
    type: "input",
  },
  {
    name: "email",
    lableValue: "Email",
    placeholder: "Email",
    typeValue: "email",
    type: "input",
  },
  {
    name: "nextFollowUp",
    lableValue: "Next FollowUp",
    placeholder: "Next FollowUp",
    typeValue: "datetime-local",
    type: "input",
  },
  {
    name: "countryCode",
    lableValue: "Country Code",
    placeholder: "Country Code",
    typeValue: "text",
    type: "input",
  },
  {
    name: "demoAttendedStage",
    lableValue: "Demo Attended Stage",
    data: FilterLableAndValue(DemoAttendedStage),
    type: "select",
  },
  {
    name: "phone",
    lableValue: "Phone",
    placeholder: "Phone",
    typeValue: "text",
    type: "input",
    name1: "countryCode",
  },
  {
    name: "counselledBy",
    lableValue: "Counselled By",
    // data: FilterLableAndValue(counselledBy),
    type: "select",
  },
  {
    name: "fullNumber",
    lableValue: "Full Number",
    placeholder: "Full Number",
    typeValue: "text",
    type: "input",
  },
  {
    name: "priceList",
    lableValue: "Price List",
    data: FilterLableAndValue(PriceList),
    type: "select",
  },
  {
    name: "alternativePhone",
    lableValue: "Alternative Phone",
    placeholder: "Alternative Phone",
    typeValue: "text",
    type: "input",
  },
  {
    name: "feeQuoted",
    lableValue: "Fee Quoted",
    placeholder: "Fee Quoted",
    typeValue: "number",
    type: "input",
  },
  {
    name: "opportunitySource",
    lableValue: "Opportunity Source",
    data: FilterLableAndValue(LeadSource),
    type: "select",
  },
  {
    name: "leadScore",
    lableValue: "Lead Score",
    placeholder: "Lead Score",
    typeValue: "text",
    type: "input",
  },
  {
    name: "courseList",
    lableValue: "Course List",
    data: FilterLableAndValue(CourseList),
    type: "select",
  },
  {
    name: "classMode",
    lableValue: "Class Mode",
    data: FilterLableAndValue(ClassMode),
    type: "select",
  },
  {
    name: "techStack",
    lableValue: "Tech Stack",
    data: FilterLableAndValue(techstack),
    type: "select",
  },
  {
    name: "batchTiming",
    lableValue: "Batch Timing",
    data: FilterLableAndValue(BatchTiming),
    type: "multiSelect",
  },
  {
    name: "leadOwner",
    lableValue: "Lead Owner",
    data: FilterLableAndValue(LeadStatus),
    type: "select",
  },
  {
    name: "coldLeadReason",
    lableValue: "Cold Lead Reason",
    data: FilterLableAndValue(ColdLeadReason),
    type: "select",
  },
  {
    name: "opportunityStatus",
    lableValue: "Opportunity Status",
    data: FilterLableAndValue(OpportunityStatus),
    type: "select",
  },
  {
    name: "opportunityStage",
    lableValue: "Opportunity Stage",
    data: FilterLableAndValue(OpportunityStage),
    type: "select",
  }, {
    name: "warmStage",
    lableValue: "Warm Stage",
    data: FilterLableAndValue(warmStage),
    type: "select",
  },
  {
    name: "visitedDate",
    lableValue: "Visited date",
    placeholder: "Visited date",
    typeValue: "datetime-local",
    type: "input",
  },
  {
    name: "expectedwalkindate",
    lableValue: "Expected walk-in date",
    placeholder: "Expected walk-in date",
    typeValue: "date",
    type: "input",
  },
];

//Crate user
export const CreateUserFrom = [
  {
    name: "name",
    lableValue: "Name",
    placeholder: "Name",
    typeValue: "text",
    type: "input",
  },
  {
    name: "mobile",
    lableValue: "Mobile",
    placeholder: "Mobile",
    typeValue: "text",
    type: "input",
  },
  {
    name: "empCode",
    lableValue: "Employee Code",
    placeholder: "Employee Code",
    typeValue: "text",
    type: "input",
  },
  {
    name: "email",
    lableValue: "Email",
    placeholder: "Email",
    typeValue: "email",
    type: "input",
  },
  {
    name: "username",
    lableValue: "User name",
    placeholder: "User name",
    typeValue: "text",
    type: "input",
  },
  {
    name: "password",
    lableValue: "Password",
    placeholder: "Password",
    typeValue: "password",
    type: "input",
  },
  { name: "role", lableValue: "Role", data: UserRole, type: "select" },
  {
    name: "teleCMIAgentId",
    lableValue: "Tele CMI Agent Id",
    placeholder: "Tele CMI Agent Id",
    typeValue: "text",
    type: "input",
  },
  {
    name: "teleCMIPassword",
    lableValue: "Tele CMI Password",
    placeholder: "Tele CMI Password",
    typeValue: "password",
    type: "input",
  },
];
export const UpdateUserFrom = [
  {
    name: "name",
    lableValue: "Name",
    placeholder: "Name",
    typeValue: "text",
    type: "input",
  },
  {
    name: "mobile",
    lableValue: "Mobile",
    placeholder: "Mobile",
    typeValue: "text",
    type: "input",
  },
  {
    name: "empCode",
    lableValue: "Employee Code",
    placeholder: "Employee Code",
    typeValue: "text",
    type: "input",
  },
  {
    name: "email",
    lableValue: "Email",
    placeholder: "Email",
    typeValue: "email",
    type: "input",
  },
  {
    name: "username",
    lableValue: "User name",
    placeholder: "User name",
    typeValue: "text",
    type: "input",
  },
  { name: "role", lableValue: "Role", data: UserRole, type: "select" },
  {
    name: "teleCMIAgentId",
    lableValue: "Tele CMI Agent Id",
    placeholder: "Tele CMI Agent Id",
    typeValue: "text",
    type: "input",
  },
  {
    name: "teleCMIPassword",
    lableValue: "Tele CMI Password",
    placeholder: "Tele CMI Password",
    typeValue: "password",
    type: "input",
  },
];


export const calendarLead: any = [
  {
    name: "name",
    lableValue: "Name",
  },
  {
    name: "leadStatus",
    lableValue: "Lead Status",
  },
  {
    name: "countryCode",
    lableValue: "CC",
  },
  {
    name: "leadSource",
    lableValue: "Lead Source",
  },
  {
    name: "phone",
    lableValue: "Phone",
  },
  {
    name: "leadStage",
    lableValue: "Lead Stage",
  },
  {
    name: "email",
    lableValue: "Email",
  },
  {
    name: "techStack",
    lableValue: "Stack",
  },
  { name: "Courses", lableValue: "Course" },
  {
    name: "feeQuoted",
    lableValue: "Fee Quoted",
  },
  {
    name: "classMode",
    lableValue: "Class Mode",
  },
  {
    name: "batchTiming",
    lableValue: "Batch Timing",
  },
  {
    name: "nextFollowUp",
    lableValue: "Next FollowUp",
  },
  {
    name: "techStack",
    lableValue: "Tech Stack",
  },

];

export const leadActiveFilter = [
  { key: "Not Contacted", value: "Not Contacted" },
  { key: "Attempted", value: "Attempted" },
  { key: "Warm Lead", value: "Warm Lead" },
  { key: "Cold Lead", value: "Cold Lead" },
]

export const OpportunityActiveFilter = [
  { key: "Visiting", value: "Visiting" },
  { key: "Visited", value: "Visited" },
  { key: "Demo attended", value: "Demo attended" },
  { key: "Lost Opportunity", value: "Lost Opportunity" },
]

export const BatchActiveFilter = [
  { key: "Upcoming", value: "Upcoming" },
  { key: "Ongoing", value: "Ongoing" },
  { key: "On Hold", value: "On Hold" },
  { key: "Completed", value: "Completed" },
]
export const LearnerActiveFilter = [
  { key: "Upcoming", value: "Upcoming" },
  { key: "Ongoing", value: "Ongoing" },
  { key: "On Hold", value: "On Hold" },
  { key: "Completed", value: "Completed" },
]
export const TrainerActiveFilter = [
  { key: "Active", value: "Active" },
  { key: "NotActive", value: "NotActive" },
]
export const CampaignActiveFilter = [
  // { key: "All Campaign", value: "all" },
  { key: "Upcoming", value: "Upcoming" },
  { key: "Ongoing", value: "Ongoing" },
  { key: "On Hold", value: "On Hold" },
  { key: "Completed", value: "Completed" },
]


//create leade
export const createBatchForm: any = [
  {
    name: "batchName",
    lableValue: "Batch Name",
    placeholder: "Batch Name",
    typeValue: "text",
    type: "input",
    mandatory: true
  },
  // { name: "learnerIds", lableValue: "Learners", type: "multiSelect" },
  {
    name: "stack",
    lableValue: "Stack",
    data: FilterLableAndValue(techstack),
    type: "select",
  },
  {
    name: "location",
    lableValue: "Location",
    data: FilterLableAndValue(LocationData),
    type: "select",
  },
  {
    name: "startDate",
    lableValue: "Start Date",
    placeholder: "Start Date",
    typeValue: "date",
    type: "input",
  },
  {
    name: "slot",
    lableValue: "Slot",
    data: FilterLableAndValue(SlotStatus),
    type: "select",
  },
  {
    name: "tentativeEndDate",
    lableValue: "Tentative End Date",
    placeholder: "Tentative End Date",
    typeValue: "date",
    type: "input",
  },

];
export const updateBatchForm: any = [
  {
    name: "batchName",
    lableValue: "Batch Name",
    placeholder: "Batch Name",
    typeValue: "text",
    type: "input",
  },
  {
    name: "classMode",
    lableValue: "Class Mode",
    data: FilterLableAndValue(ClassMode),
    type: "select",
  },
  // { name: "learnerIds", lableValue: "Learners", type: "multiSelect" },
  {
    name: "location",
    lableValue: "Location",
    data: FilterLableAndValue(LocationData),
    type: "select",
  },
  {
    name: "stack",
    lableValue: "Stack",
    data: FilterLableAndValue(techstack),
    type: "select",
  },
  {
    name: "trainerId",
    lableValue: "Trainer Name",
    type: "select",
  },
  {
    name: "startDate",
    lableValue: "Start Date",
    placeholder: "Start Date",
    typeValue: "date",
    type: "input",
  },
  {
    name: "timing",
    lableValue: "Timing",
    data: FilterLableAndValue(SlotStatus),
    type: "select",
  },
  {
    name: "tentativeEndDate",
    lableValue: "Tentative End Date",
    placeholder: "Tentative End Date",
    typeValue: "date",
    type: "input",
  },
  {
    name: "batchStatus",
    lableValue: "Batch Status",
    data: FilterLableAndValue(BatchStatusMode),
    type: "select",
  },
  {
    name: "comment",
    lableValue: "Comment",
    placeholder: "Comment",
    typeValue: "text",
    type: "input",
  },
  {
    name: "batchStage",
    lableValue: "Batch Stage",
    data: FilterLableAndValue(warmStage),
    type: "select",
  },
  {
    name: "stage",
    lableValue: "Stage",
    data: FilterLableAndValue(ClassMode),
    type: "select",
  },
  {
    name: "mentor",
    lableValue: "Mentor",
    placeholder: "Mentor",
    typeValue: "text",
    type: "input",
  },
  {
    name: "zoomAccount",
    lableValue: "Zoom Account",
    placeholder: "Zoom Account",
    typeValue: "text",
    type: "input",
  },
  {
    name: "stackOwner",
    lableValue: "Stack Owner",
    placeholder: "Stack Owner",
    typeValue: "text",
    type: "input",
  },
  {
    name: "owner",
    lableValue: "Owner",
    placeholder: "Owner",
    typeValue: "text",
    type: "input",
  },
  {
    name: "slot",
    lableValue: "Slot",
    data: FilterLableAndValue(SlotStatus),
    type: "select",
  },
  {
    name: "batchOwner",
    lableValue: "Batch Owner",
    placeholder: "Batch Owner",
    typeValue: "text",
    type: "input",
  },
  {
    name: "topicStatus",
    lableValue: "Topic Status",
    data: FilterLableAndValue(ClassMode),
    type: "select",
  },
];


//create Trainer
export const createTrainerForm: any = [
  {
    name: "trainerName",
    lableValue: "Trainers Name",
    placeholder: "Trainers Name",
    typeValue: "text",
    type: "input",
    mandatory: true,
  },
  {
    name: "email",
    lableValue: "Email",
    placeholder: "Email",
    typeValue: "text",
    type: "input",
  },
  {
    name: "trainerId",
    lableValue: "Trainer ID",
    placeholder: "Trainers ID",
    typeValue: "text",
    type: "input",
  },
  {
    name: "trainerStatus",
    lableValue: "Trainer Status",
    data: FilterLableAndValue(TrainerStatus),
    type: "select",
  },
  {
    name: "phone",
    lableValue: "Phone",
    placeholder: "Phone",
    typeValue: "text",
    type: "input",
    name1: "countryCode",
  },
  {
    name: "location",
    lableValue: "Location",
    data: FilterLableAndValue(LocationData),
    type: "select",
  },

];

export const updateTrainerForm: any = [
  {
    name: "trainerName",
    lableValue: "Trainers Name",
    placeholder: "Trainers Name",
    typeValue: "text",
    type: "input",
  },
  {
    name: "trainerOwner",
    lableValue: "Trainers Owner",
    placeholder: "Trainers Owner",
    // typeValue: "text",
    type: "select",
  },
  {
    name: "phone",
    lableValue: "Phone",
    placeholder: "Phone",
    typeValue: "text",
    type: "input",
    name1: "countryCode",
  },
  {
    name: "idProof",
    lableValue: "Id Proof",
    typeValue: "file",
    type: "input",
    // data: FilterLableAndValue(IdProof),
    // type: "select",
  },
  {
    name: "email",
    lableValue: "Email",
    placeholder: "Email",
    typeValue: "text",
    type: "input",
  },
  {
    name: "slackStage",
    lableValue: "Slack Stage",
    data: FilterLableAndValue(SlackStage),
    type: "select",
  },
  {
    name: "techStack",
    lableValue: "Tech Stack",
    data: FilterLableAndValue(techstack),
    type: "select",
  },
  {
    name: "trainerStatus",
    lableValue: "Trainer Status",
    data: FilterLableAndValue(TrainerStatus),
    type: "select",
  },
  {
    name: "trainerId",
    lableValue: "Trainer ID",
    placeholder: "Trainers ID",
    typeValue: "text",
    type: "input",
  },
  {
    name: "batches",
    lableValue: "Batches",
    data: FilterLableAndValue(BatchesStatus),
    type: "select",
  },
  {
    name: "freeSlots",
    lableValue: "Free-Slots",
    data: FilterLableAndValue(batchtiming),
    type: "multiSelect",
    // placeholder: "Free-Slots",
    // typeValue: "text",
    // type: "input",
  },
  {
    name: "joiningDate",
    lableValue: "Joining Date",
    placeholder: "Joining Date",
    typeValue: "date",
    type: "input",
  },
  {
    name: "location",
    lableValue: "Location",
    data: FilterLableAndValue(LocationData),
    type: "select",
  },
  {
    name: "working",
    lableValue: "Working",
    data: FilterLableAndValue(SlackStage),
    type: "select",
  },
];

//create task
export const createTaskForm: any = [
  {
    name: "taskOwner",
    lableValue: "Task Owner",
    // placeholder: "Task Owner",
    // typeValue: "text",
    // type: "input",
    type: "select",
    mandatory: true
  },
  {
    name: "assignTo",
    lableValue: "Assign To",
    type: "select",
    mandatory: true
  },
  {
    name: "dueDate",
    lableValue: "Due Date",
    placeholder: "Due Date",
    typeValue: "date",
    type: "input",
  },
  {
    name: "subject",
    lableValue: "Subject",
    placeholder: "Subject",
    typeValue: "text",
    type: "input",
  },
  {
    name: "source",
    lableValue: "Source",
    placeholder: "Source",
    typeValue: "text",
    type: "input",
  },
  {
    name: "note",
    lableValue: "Note",
    placeholder: "Note",
    typeValue: "text",
    type: "input",
  },
  {
    name: "learnerId",
    lableValue: "Learner Name",
    type: "select",
    // placeholder: "Learner Name",
    // typeValue: "text",
    // type: "input",
  },
  {
    name: "batch",
    lableValue: "Batch",
    placeholder: "Batch",
    typeValue: "text",
    type: "input",
  },
  {
    name: "priority",
    lableValue: "Priority",
    data: Prioritydata,
    type: "select",
  },
  {
    name: "status",
    lableValue: "Status",
    data: FilterLableAndValue(TaskStatus),
    type: "select",
  },
]


//create Campaign
export const createCampaignForm: any = [
  {
    name: "campaignOwner",
    lableValue: "Campaign Owner",
    type: "select",
    // placeholder: "Name",
    // typeValue: "text",
    // type: "input",
    mandatory: true
  },
  {
    name: "type",
    lableValue: "Type",
    data: FilterLableAndValue(Type),
    type: "select",
    mandatory: true
  },
  {
    name: "name",
    lableValue: "Campaign Name",
    placeholder: "Name",
    typeValue: "text",
    type: "input",
    alphaBatically: false
  },
  {
    name: "status",
    lableValue: "Campaign Status",
    data: FilterLableAndValue(BatchStatusMode),
    type: "select",
  },
  {
    name: "campaignDate",
    lableValue: "Start Date",
    placeholder: "Start Date",
    typeValue: "date",
    type: "input",
  },
  {
    name: "endDate",
    lableValue: "End Date",
    placeholder: "End Date",
    typeValue: "date",
    type: "input",
  },
  {
    name: "active",
    lableValue: "Active",
    data: FilterLableAndValue(SlackStage),
    type: "select",
  },
];
//update Campaign
export const updateCampaignForm: any = [
  {
    name: "campaignOwner",
    lableValue: "Campaign Owner",
    type: "select",
  },
  {
    name: "name",
    lableValue: "Campaign Name",
    placeholder: "Name",
    typeValue: "text",
    type: "input",
    alphaBatically: false
  },
  // {
  //   name: "phone",
  //   lableValue: "Phone",
  //   placeholder: "Phone",
  //   typeValue: "text",
  //   type: "input",
  // },
  // {
  //   name: "courseId",
  //   lableValue: "Course Name",
  //   data: FilterLableAndValue(CourseList),
  //   type: "select",
  // },
  {
    name: "active",
    lableValue: "Active",
    data: FilterLableAndValue(SlackStage),
    type: "select",
  },
  {
    name: "type",
    lableValue: "Type",
    data: FilterLableAndValue(Type),
    type: "select",
  },
  {
    name: "status",
    lableValue: "Status",
    data: FilterLableAndValue(BatchStatusMode),
    type: "select",
  },
  {
    name: "campaignDate",
    lableValue: "Start Date",
    placeholder: "Start Date",
    typeValue: "date",
    type: "input",
  },
  {
    name: "endDate",
    lableValue: "End Date",
    placeholder: "End Date",
    typeValue: "date",
    type: "input",
  },
  {
    name: "amountSpent",
    lableValue: "Amount Spent On Campaign",
    placeholder: "Amount Spent On Campaign",
    typeValue: "text",
    type: "input",
  },
];


//create Learner
export const createLearnerFormData: any = [
  {
    name: "name",
    lableValue: "Name",
    placeholder: "Name",
    typeValue: "text",
    type: "input",
    mandatory: true
  },
  {
    name: "batchId",
    lableValue: "Batch ID",
    type: "multiSelect",
    // placeholder: "Batch ID",
    // typeValue: "text",
    // type: "input",
  },
  {
    name: "phone",
    lableValue: "Phone",
    placeholder: "Phone",
    typeValue: "text",
    type: "input",
    mandatory: true,
    name1: "countryCode",
  },
  {
    name: "registeredDate",
    lableValue: "Registered Date",
    placeholder: "Registered Date",
    typeValue: "date",
    type: "input",
  },
  {
    name: "email",
    lableValue: "Email",
    placeholder: "Email",
    typeValue: "text",
    type: "input",
    mandatory: true
  },
  {
    name: "location",
    lableValue: "Location",
    data: FilterLableAndValue(LocationData),
    type: "select",
  },

];
export const createLearnerForm: any = [
  {
    name: "name",
    lableValue: "Name",
    placeholder: "Name",
    typeValue: "text",
    type: "input",
  },
  {
    name: "idProof",
    lableValue: "Id Proof",
    placeholder: "Id Proof",
    typeValue: "file",
    type: "input",
  },
  {
    name: "phone",
    lableValue: "Phone",
    placeholder: "Phone",
    typeValue: "text",
    type: "input",
    name1: "countryCode",
  },
  {
    name: "dateOfBirth",
    lableValue: "Date of Birth",
    placeholder: "Date of Birth",
    typeValue: "date",
    type: "input",
    mandatory: true
  },
  {
    name: "email",
    lableValue: "Email",
    placeholder: "Email",
    typeValue: "text",
    type: "input",
  },
  {
    name: "registeredDate",
    lableValue: "Registered Date",
    placeholder: "Registered Date",
    typeValue: "date",
    type: "input",
    mandatory: true
  },
  {
    name: "location",
    lableValue: "Location",
    data: FilterLableAndValue(LocationData),
    type: "select",
  },
  {
    name: "batchId",
    lableValue: "Batch ID",
    // placeholder: "Batch ID",
    // typeValue: "text",
    type: "multiSelect",
  },
  {
    name: "source",
    lableValue: "Source",
    placeholder: "Source",
    typeValue: "text",
    type: "input",
  },
];
export const createLearnerForm1: any = [
  {
    name: "totalFees",
    lableValue: "Total Fees",
    placeholder: "Total Fees",
    typeValue: "text",
    type: "input",
  },
  {
    name: "modeofInstallmentpayment",
    lableValue: "Mode of Installment payment",
    placeholder: "Mode of Installment payment",
    typeValue: "text",
    type: "input",
  },
  {
    name: "feesPaid",
    lableValue: "Fees Paid",
    typeValue: "text",
    type: "input",
  },
  {
    name: "instalment1Screenshot",
    lableValue: "Instalment 1 Screenshot",
    placeholder: "Instalment 1 Screenshot",
    typeValue: "file",
    type: "input",
  },
  {
    name: "dueAmount",
    lableValue: "Due Amount",
    placeholder: "Due Amount",
    typeValue: "text",
    type: "input",
  },
  {
    name: "dueDate",
    lableValue: "Due Date",
    placeholder: "Due Date",
    typeValue: "date",
    type: "input",
    mandatory: true
  },
]


export const createLearnerCourseDetails: any = [
  {
    name: "courseId",
    lableValue: "Registered Course",
    placeholder: "Registered Course",
    typeValue: "number",
    type: "input",
  },
  {
    name: "preferableTime",
    lableValue: "Preferable Time",
    placeholder: "Preferable Time",
    typeValue: "datetime-local",
    type: "input",
  },
  {
    name: "techStack",
    lableValue: "Tech Stack",
    placeholder: "Tech Stack",
    typeValue: "text",
    type: "input",
  },
  {
    name: "batchTiming",
    lableValue: "Batch Timing",
    placeholder: "Batch Timing",
    typeValue: "datetime-local",
    type: "input",
  },
  {
    name: "courseComments",
    lableValue: "Course Comments",
    placeholder: "Course Comments",
    typeValue: "text",
    type: "input",
  },
  {
    name: "modeOfClass",
    lableValue: "Mode Of Class",
    placeholder: "Mode Of Class",
    typeValue: "text",
    type: "input",
  },
  {
    name: "slackAccess",
    lableValue: "Slack Access",
    placeholder: "Slack Access",
    typeValue: "text",
    type: "input",
  },
  {
    name: "comment",
    lableValue: "Comment",
    placeholder: "Comment",
    typeValue: "text",
    type: "input",
  },
  {
    name: "lmsAccess",
    lableValue: "LMS Access",
    placeholder: "LMS Access",
    typeValue: "text",
    type: "input",
  },
]


export const createLearnerTrainerForm: any = [
  {
    name: "trainerName",
    lableValue: "Trainer Name",
    placeholder: "Trainer Name",
    typeValue: "text",
    type: "input",
  },
  {
    name: "idProof",
    lableValue: "Id Proof",
    typeValue: "file",
    type: "input",
  },
  {
    name: "phone",
    lableValue: "Phone",
    placeholder: "Phone",
    typeValue: "text",
    type: "input",
    name1: "countryCode",
  },
  {
    name: "dateofBirth",
    lableValue: "Date of Birth",
    placeholder: "Date of Birth",
    typeValue: "date",
    type: "input",
  },
  {
    name: "email",
    lableValue: "Email",
    placeholder: "Email",
    typeValue: "text",
    type: "input",
  },
  {
    name: "registeredDate",
    lableValue: "Registered Date",
    placeholder: "Registered Date",
    typeValue: "date",
    type: "input",
  },
  {
    name: "location",
    lableValue: "Location",
    data: FilterLableAndValue(LocationData),
    type: "select",
  },
  {
    name: "batchId",
    lableValue: "Batch ID's",
    placeholder: "Batch ID's",
    typeValue: "text",
    type: "input",
  },
  {
    name: "alternatePhone",
    lableValue: "Alternate phone",
    placeholder: "Alternate phone",
    typeValue: "text",
    type: "input",
    name1: "countryCode",
  },
  {
    name: "description",
    lableValue: "Description",
    placeholder: "Description",
    typeValue: "text",
    type: "input",
  },
  {
    name: "source",
    lableValue: "Source",
    placeholder: "Source",
    typeValue: "text",
    type: "input",
  },
  {
    name: "exchangeRate",
    lableValue: "Exchange Rate",
    placeholder: "Exchange Rate",
    typeValue: "text",
    type: "input",
  },
  {
    name: "Attended Demo",
    lableValue: "Attended Demo",
    data: FilterLableAndValue(DemoAttendedStage),
    type: "select",
  },
  {
    name: "learnerOwner",
    lableValue: "Learner Owner",
    placeholder: "Learner Owner",
    typeValue: "text",
    type: "input",
  },
  {
    name: "visitedStage",
    lableValue: "Visited Stage",
    data: FilterLableAndValue(VisitedStage),
    type: "select",
  },
  {
    name: "currency",
    lableValue: "Currency",
    placeholder: "Currency",
    typeValue: "text",
    type: "input",
  },
  {
    name: "leadCratedTime",
    lableValue: "Lead crated time",
    placeholder: "Lead crated time",
    typeValue: "datetime-local",
    type: "input",
  },
  {
    name: "counselingDoneBY",
    lableValue: "Counseling Done BY",
    placeholder: "Counseling Done BY",
    typeValue: "text",
    type: "input",
  },
  {
    name: "walkinDate",
    lableValue: "Walkin Date",
    placeholder: "Walkin Date",
    typeValue: "datetime-local",
    type: "input",
  },
];
export const createLearnerCoursesForm: any = [
  {
    name: "registeredCourse",
    lableValue: "Registered Course",
    placeholder: "Registered Course",
    typeValue: "text",
    type: "input",
  },
  {
    name: "preferableTime",
    lableValue: "Preferable Time",
    placeholder: "Preferable Time",
    typeValue: "datetime-local",
    type: "input",
  },
  {
    name: "techStackAI",
    lableValue: "Tech Stack AI",
    data: FilterLableAndValue(OpportunityStage),
    type: "select",
  },
  {
    name: "batchTiming",
    lableValue: "Batch Timing",
    placeholder: "Batch Timing",
    typeValue: "datetime-local",
    type: "input",
  },
  {
    name: "courseComments",
    lableValue: "Course Comments",
    placeholder: "Course Comments",
    typeValue: "text",
    type: "input",
  },
  {
    name: "modeOfClass",
    lableValue: "Mode Of Class",
    data: FilterLableAndValue(OpportunityStage),
    type: "select",
  },
  // {
  //   name: "slackAccess",
  //   lableValue: "Slack Access",
  //   data: FilterLableAndValue(OpportunityStage),
  //   type: "select",
  // },
  // {
  //   name: "comment",
  //   lableValue: "Comment",
  //   placeholder: "Comment",
  //   typeValue: "text",
  //   type: "input",
  // },
  // {
  //   name: "lmsAccess",
  //   lableValue: "LMS Access",
  //   placeholder: "LMS Access",
  //   typeValue: "text",
  //   type: "input",
  // },
];