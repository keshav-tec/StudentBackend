import {
  Users,
  MessageCircleQuestion,
  ShieldCheck,
  Activity,
  LogOut,
  BookOpen,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const initialDoubts = [
  {
    id: 1,
    student: "Riya Sharma",
    subject: "DSA",
    doubt: "Binary tree traversal",
    status: "AI Validated",
  },
  {
    id: 2,
    student: "Rahul Kumar",
    subject: "OS",
    doubt: "Deadlock prevention",
    status: "AI Validated",
  },
  {
    id: 3,
    student: "Ankit Singh",
    subject: "DBMS",
    doubt: "Normalization",
    status: "Matched",
  },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const doubts = initialDoubts;

  const validatedCount = doubts.filter(
    (item) => item.status === "AI Validated"
  ).length;

  const matchedCount = doubts.filter(
    (item) => item.status === "Matched"
  ).length;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="flex h-20 items-center justify-between border-b bg-white px-6">

        <div className="flex items-center gap-2">
          <BookOpen
            className="text-indigo-600"
            size={25}
          />

          <span className="text-xl font-bold">
            PeerConnect Admin
          </span>
        </div>

        <div className="flex items-center gap-4">

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold">
              {user?.name || "Administrator"}
            </p>

            <p className="text-xs text-slate-400">
              Administrator
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl p-2 text-red-500 hover:bg-red-50"
            title="Logout"
          >
            <LogOut size={19} />
          </button>

        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl space-y-6 p-6">

        {/* PAGE TITLE */}
        <section>
          <h1 className="text-2xl font-bold">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor tutors, doubts and overall platform activity.
          </p>
        </section>

        {/* STATS */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <Stat
            icon={Users}
            title="Total Users"
            value="248"
          />

          <Stat
            icon={ShieldCheck}
            title="Verified Tutors"
            value="42"
          />

          <Stat
            icon={MessageCircleQuestion}
            title="Total Doubts"
            value={doubts.length}
          />

          <Stat
            icon={Activity}
            title="AI Validated"
            value={validatedCount}
          />

        </section>

        {/* PLATFORM ACTIVITY */}
        <section className="rounded-2xl bg-white shadow-sm">

          <div className="border-b p-6">
            <h2 className="text-lg font-bold">
              Platform Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Monitor AI-processed doubts and tutor matching activity.
            </p>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px] text-left text-sm">

              <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-4">
                    Student
                  </th>

                  <th className="px-6 py-4">
                    Subject
                  </th>

                  <th className="px-6 py-4">
                    Doubt
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Activity
                  </th>
                </tr>
              </thead>

              <tbody>

                {doubts.map((doubt) => (
                  <tr
                    key={doubt.id}
                    className="border-t"
                  >

                    <td className="px-6 py-4 font-medium">
                      {doubt.student}
                    </td>

                    <td className="px-6 py-4">
                      {doubt.subject}
                    </td>

                    <td className="px-6 py-4">
                      {doubt.doubt}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          doubt.status === "Matched"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {doubt.status}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      {doubt.status === "Matched" ? (
                        <span className="text-xs text-blue-600">
                          Tutor matched
                        </span>
                      ) : (
                        <span className="text-xs text-green-600">
                          AI processed
                        </span>
                      )}

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>

        {/* SUMMARY */}
        <section className="grid gap-5 md:grid-cols-2">

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="font-bold">
              AI Processing
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Questions are automatically analyzed and categorized
              using the AI question tagger.
            </p>

            <div className="mt-4 text-2xl font-bold text-indigo-600">
              {validatedCount}
            </div>

            <p className="text-xs text-slate-400">
              AI validated doubts
            </p>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="font-bold">
              Tutor Matching
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Validated doubts are routed to relevant peer tutors
              based on subject and topic.
            </p>

            <div className="mt-4 text-2xl font-bold text-indigo-600">
              {matchedCount}
            </div>

            <p className="text-xs text-slate-400">
              Doubts currently matched
            </p>

          </div>

        </section>

      </main>
    </div>
  );
}

function Stat({ icon: Icon, title, value }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Icon size={21} />
        </div>

      </div>

    </div>
  );
}