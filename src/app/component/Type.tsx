export interface LeadeData {
  name: string;
  phone: string;
  countryCode: string;
  email: string;
  leadSource: string;
  techStack: string;
  // courseId: any;
  classMode: string;
  feeQuoted: any;
  batchTiming: string;
  leadStatus: string;
  description: string;
  nextFollowUp: string;
}
export interface CommonInterFace {
  [key: string]: any | null;
}
export const LeadeDataView = {
  name: "",
  phone: "",
  countryCode: "",
  email: "",
  leadSource: "",
  techStack: "",
  // courseId: [],
  classMode: "",
  feeQuoted: "",
  batchTiming: "",
  leadStatus: "",
  description: "",
  nextFollowUp: "",
};

export const RowDataView = {
  name: true,
  idproof: true,
  phone: true,
  dateofbirth: true,
  email: true,
  registrationdate: true,
  location: true,
  batchids: true,
  sources: true,
  registrationcourse: true,
  perferabletime: true,
  techStack: true,
  batchtiming: true,
  courseDetails: true,
  modeOfClass: true,
  feeAmount: true,
  installmentPayment: true,
  totalFees: true,
  installmentScreenshot: true,
  dueAmmount: true,
  dueDate: true,
  expRegistrationDate: true,
  nextFollowUp: true,
  countryCode: true,
  demoAttendedDate: true,
  counselledBy: true,
  fullNumber: true,
  priceList: true,
  alternativePhone: true,
  feeQuoted: true,
  leadSource: true,
  leadScore: true,
  courseList: true,
  classMode: true,
  leadOwner: true,
  coldLeadReason: true,
  leadStatus: true,
  warmStage: true,
  expectedWalkInDate: true,
  visitedDate: true,
  programs: true,
  batchTiming: true,
  leadSourceURL: true,
  description: true,

};

export interface AccordionItemProps {
  data: Array<[]>;
  content: string;
  linkText?: string;
  links?: { url: string; text: string }[];
}

export interface ActivityAccordionTaskData {
  id: number;
  title: string;
  data?: {
    new_task?: {
      title: string;
      description: string;
    };
    new_meeting?: {
      title: string;
      description: string;
    };
    email?: {
      title: string;
      description: string;
    };
  }[];
}
interface Task {
  title: string;
  description: string;
}
[];

export type DataItem = {
  [key: string]: Task;
};

export interface PriorityItem {
  lable: string;
  value: string;
}
export interface HostItem {
  lable: string;
  value: string;
}

export interface TaskRowData {
  subject: string;
  dueDate: string;
  priority: string;
  owner: string;
}
export const TaskType = {
  subject: "",
  dueDate: "",
  priority: "",
  owner: "",
  salesperson: "", // Assuming these are part of TaskRowData
  email: "",
  phoneNumber: "",
};
export interface AttendanceRowData {
  userId: string;
  clockIn: string;
  clockOut: string;
  workingHours: string;
}
export interface TaskRowData {
  salesperson: string;
  email: string;
  phoneNumber: string;
}

export type ErrorObject = {
  [key: string]: string; // Define a string index signature
};

export interface NewTaskRowData {
  userId: string;
  priority: string;
  dueDate: string;
  subject: string;
}
export const NewTaskView = {
  userId: "",
  priority: "",
  dueDate: "",
  subject: "",
};
export interface EmailRowData {
  to: any;
  bcc: any;
  from: string;
  subject: string;
  html: string;
  template: string;
  ask_ai: string;
}
export const EmailView = {
  to: [],
  bcc: [],
  from: "",
  html: "",
  subject: "",
  template: "",
  ask_ai: "",
};
export interface MeetingRowData {
  hostId: string;
  participants: any;
  meetingName: string;
  location: string;
  startTime: string;
  endTime: string;
}
export const MeetingView = {
  hostId: "",
  participants: "",
  meetingName: "",
  location: "",
  startTime: "",
  endTime: "",
};
export interface WhatsAppRowData {
  phoneNumber: string;
  messageContent: string;
  template?: string;
}
export const WhatsAppView = {
  phoneNumber: "",
  messageContent: "",
  template: "",
};
export interface MessageRowData {
  phoneNumber: string;
  messageContent: string;
  template?: string;
}
export const MessageView = {
  phoneNumber: "",
  messageContent: "",
  template: "",
};
export interface LogCallRowData {
  callTo: string;
  callType: string;
  outgoingCallStatus: string;
  callStartTime: string;
  callEndTime: string;
  subject: string;
  voiceRecording: any;
}
export const LogCallView = {
  callTo: "",
  callType: "",
  outgoingCallStatus: "",
  callStartTime: "",
  callEndTime: "",
  subject: "",
  voiceRecording: "",
};
export interface TrackingRowData {
  latitude: string;
  longitude: string;
  address: string;
  id: string;
}

export interface OpportunitiyData {
  id: number;
  name: string;
  phone: string;
  email: string;
  demoAttendedDate: string;
  opportunityStage: string;
  demoAttendedStage: string;
  visitedStage: string;
  coldLeadReason: string;
}

export interface OpportunitiyData1 {
  [key: string]: any | null; // Define the structure of the leade object
}

export const OpportunitiyDataView = {
  name: "",
  phone: "",
  email: "",
  demoAttendedDate: "",
  opportunityStage: "",
  demoAttendedStage: "",
  visitedStage: "",
  coldLeadReason: "",
  countryCode: "",
  leadSource: "",
  techStack: "",
  courseId: [],
  classMode: "",
  feeQuoted: "",
  batchTiming: "",
  leadStatus: "",
  description: "",
  nextFollowUp: "",
};
export const OpportunitiyDisableDataView = {
  name: true,
  opportunityStatus: true,
  phone: true,
  expRegistrationDate: true,
  opportunityStage: true,
  email: true,
  demoAttendedStage: true,
  feeQuoted: true,
  visitedStage: true,
  batchTiming: true,
  coldLeadReason: true,
  description: true,
  countryCode: true,
  leadSource: true,
  techStack: true,
  courseId: true,
  classMode: true,
  leadStatus: true,
  nextFollowUp: true,
  fullNumber: true,
  counselledBy: true,
  priceList: true,
  alternativePhone: true,
  leadScore: true,
  courseList: true,
  leadOwner: true,
  warmStage: true,
  visitedDate: true,
  expectedWalkInDate: true,
  opportunitySource: true,
};

export interface LearnerData {
  fullName: string;
  dateofBirth: string;
  phone: string;
  email: string;
  techstack: string;
  courseDetails: string;
  source: string;
  registeredDate: string;
  attendedDemo: string;
  modeofClass: string;
  learnerImage: any;
}
export const LearnerDataView = {
  firstName: "",
  lastName: "",
  phone: "",
  alternatePhone: "",
  email: "",
  location: "",
  source: "",
  attendedDemo: "",
  leadCreatedTime: "",
  counselingDoneBy: "",
  idProof: "",
  dateOfBirth: "",
  registeredDate: "",
  description: "",
  exchangeRate: "",
  learnerOwner: "",
  currency: "",
  learnerStage: "",
  batchIds: []
};

export const LearnerDisableDataView = {
  firstName: true,
  lastName: true,
  name: true,
  phone: true,
  alternatePhone: true,
  email: true,
  location: true,
  source: true,
  attendedDemo: true,
  leadCreatedTime: true,
  counselingDoneBy: true,
  idProof: true,
  dateOfBirth: true,
  registeredDate: true,
  description: true,
  exchangeRate: true,
  learnerOwner: true,
  currency: true,
  learnerStage: true,
  batchId: true,
  totalFees: true,
  modeofInstallmentpayment: true,
  feesPaid: true,
  instalment1Screenshot: true,
  dueAmount: true,
  dueDate: true,
};

export interface CoursesData {
  name: string;
  fee: string;
  description: string;
  courseBrochure: any;
  courseImage: any;
}
export const CoursesDataView = {
  name: "",
  fee: "",
  description: "",
  courseBrochure: "",
  courseImage: "",
};

export interface CoursesDataStatusView {
  name: boolean;
  fee: boolean;
  description: boolean;
  courseBrochure: boolean;
  courseImage: boolean;
}
export const CoursesDataStatus = {
  name: true,
  fee: true,
  description: true,
  courseBrochure: true,
  courseImage: true,
};
export interface UserData {
  [key: string]: any | null;
}
export const UserDataView = {
  name: "",
  mobile: "",
  empCode: "",
  email: "",
  username: "",
  password: "",
  role: "",
};


export interface BatchData {
  [key: string]: any | null; // Define the structure of the leade object
}

export const BatchDataView = {
  batchName: true,
  stack: true,
  location: true,
  startDate: true,
  slot: true,
  tentativeEndDate: true,
  trainerId: true,
  classMode: true,
  batchStatus: true,
  stage: true,
  topicStatus: true,
  note: true,
  noOfStudents: true,
  comment: true,
  learnerIds: true,
  timing: true,
  batchStage: true,
  mentor: true,
  zoomAccount: true,
  stackOwner: true,
  owner: true,
  batchOwner: true,
  description: true,
};

export const BatchForm = {
  batchName: "",
  stack: "",
  location: "",
  startDate: "",
  slot: "",
  tentativeEndDate: "",
  trainerId: "",
  classMode: "",
  batchStatus: "",
  stage: "",
  topicStatus: "",
  note: "",
  noOfStudents: "",
  comment: "",
  learnerIds: [],
};


export const TrainerDataView = {
  trainersName: true,
  trainerOwner: true,
  description: true,
  freeSlots: true,
  idProof: true,
  techStack: true,
  trainerStatus: true,
  phone: true,
  batches: true,
  email: true,
  batchStage: true,
  location: true,
  slackStage: true,
  trainerId: true,
  joiningDate: true,
  working: true,
};
export const TaskDataView = {
  taskOwner: true,
  assignTo: true,
  dueDate: true,
  subject: true,
  source: true,
  note: true,
  learnerId: true,
  batch: true,
  priority: true,
  status: true,
};
export const UserData = {
  name: true,
  mobile: true,
  empCode: true,
  email: true,
  username: true,
  role: true,
  teleCMIAgentId: true,
  teleCMIPassword: true,
};

export const TrainerForm = {
  trainersName: "",
  trainersOwner: "",
  description: "",
  freeSlots: "",
  idProof: "",
  techStack: "",
  trainerStatus: "",
  phone: "",
  batches: "",
  email: "",
  batchStage: "",
  location: "",
}

export const CampaignDataView = {
  campaignOwner: true,
  name: true,
  type: true,
  status: true,
  campaignDate: true,
  endDate: true,
  phone: true,
  courseId: true,
  active: true,
  startDate: true,
  amountSpent: true,
};

export const CampaignForm = {
  name: "",
  type: "",
  status: "",
  campaignDate: "",
  endDate: ""
}
