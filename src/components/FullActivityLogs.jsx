import { useState } from "react";

export default function FullActivityLogs({ logs }) {
  // --- NEW: State to remember what the user is searching for ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // --- NEW: The Filter Logic ---
  // This looks at every log. If it doesn't match the name OR the date, it hides it!
  const filteredLogs = logs.filter((log) => {
    const matchesName = log.name.toLowerCase().includes(searchTerm.toLowerCase());
    // If no date is selected, show all dates. If a date is selected, only show matches.
    const matchesDate = filterDate ? log.date === filterDate : true; 
    
    return matchesName && matchesDate;
  });

  return (
    <div className="animate-fade-in-down">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">System Activity Logs</h2>
        <p className="text-slate-500 text-sm mt-1">Complete historical record of all camera detections.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* --- UPDATED: Search & Filter Bar --- */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-4">
          <input 
            type="text" 
            placeholder="Search by name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          
          {/* Replaced the button with a real Date Input! */}
          <input 
            type="date" 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          />

          {/* A quick button to clear the filters */}
          {(searchTerm || filterDate) && (
            <button 
              onClick={() => { setSearchTerm(""); setFilterDate(""); }}
              className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">User Profile</th>
                <th className="p-4 font-semibold">Match Status</th>
                <th className="p-4 font-semibold">Confidence</th>
                <th className="p-4 font-semibold">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* --- UPDATED: We now map over filteredLogs instead of all logs --- */}
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    No matching activity found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      {log.image ? (
                        <img src={log.image} alt="Face" className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                          {log.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium text-slate-800">{log.name}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${log.status === 'Alert' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 text-sm">{log.match}</td>
                    {/* We now show Date AND Time in the table */}
                    <td className="p-4 text-slate-500 text-sm">
                      {log.date ? `${log.date} at ` : ''}{log.time}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}