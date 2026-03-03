// Accept the live data props from App.jsx
export default function StatsOverview({ presentCount, alertCount, registeredCount }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Live Statistics</h3>
      <div className="space-y-4">
        
        {/* Total Present */}
        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
              ✓
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Total Present</p>
              <p className="text-xs text-slate-500">Unique Users Today</p>
            </div>
          </div>
          <span className="text-xl font-bold text-emerald-700">{presentCount}</span>
        </div>

        {/* Alerts */}
        <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg border border-rose-100 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold">
              !
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Unrecognized</p>
              <p className="text-xs text-slate-500">Security Alerts</p>
            </div>
          </div>
          <span className="text-xl font-bold text-rose-700">{alertCount}</span>
        </div>

        {/* Registered */}
        <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              #
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Total Registered</p>
              <p className="text-xs text-slate-500">Database Records</p>
            </div>
          </div>
          <span className="text-xl font-bold text-indigo-700">{registeredCount}</span>
        </div>

      </div>
    </div>
  );
}