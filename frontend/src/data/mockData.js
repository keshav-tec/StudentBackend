export const studentProfile = {
  name: "Keshav Kumar",
  role: "Student Learner",
  department: "CSE (AI & ML)",
  semester: "4th Semester",
  credits: 120,
  doubtsSolved: 18,
};

export const tutors = [
  {
    id: 1,
    name: "Aman Raj",
    subject: "Data Structures & Algorithms",
    rating: 4.9,
    sessions: 124,
    available: "Today, 5:00 PM",
    avatar: "AR",
    verified: true,
  },
  {
    id: 2,
    name: "Priya Singh",
    subject: "Operating Systems",
    rating: 4.8,
    sessions: 96,
    available: "Today, 7:00 PM",
    avatar: "PS",
    verified: true,
  },
  {
    id: 3,
    name: "Rahul Kumar",
    subject: "Database Management",
    rating: 4.7,
    sessions: 81,
    available: "Tomorrow, 4:00 PM",
    avatar: "RK",
    verified: true,
  },
];

export const doubts = [
  {
    id: 1,
    title: "How does recursion work in binary trees?",
    subject: "DSA",
    status: "Answered",
    tutor: "Aman Raj",
    date: "26 Sep 2026",
  },
  {
    id: 2,
    title: "Difference between process and thread",
    subject: "Operating Systems",
    status: "Pending",
    tutor: "Not assigned",
    date: "25 Sep 2026",
  },
  {
    id: 3,
    title: "Normalization in DBMS",
    subject: "DBMS",
    status: "Answered",
    tutor: "Rahul Kumar",
    date: "23 Sep 2026",
  },
];

export const bookings = [
  {
    id: 1,
    tutor: "Aman Raj",
    subject: "Data Structures & Algorithms",
    date: "Today",
    time: "5:00 PM - 6:00 PM",
    status: "Confirmed",
  },
  {
    id: 2,
    tutor: "Priya Singh",
    subject: "Operating Systems",
    date: "Tomorrow",
    time: "7:00 PM - 8:00 PM",
    status: "Confirmed",
  },
];

