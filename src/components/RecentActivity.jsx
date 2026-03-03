export default function RecentActivity({ logs }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">Recent Scans</h3>
        <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-md animate-pulse">
          Live Updates Active
        </span>
      </div>
      
      <div className="space-y-4 overflow-y-auto pr-2">
        {logs.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">Waiting for camera detections...</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 animate-fade-in-down">
              
              <div className="flex items-center gap-3">
                {/* NEW: The Face Thumbnail Logic */}
                {log.image ? (
                  <img 
                    src={log.image} 
                    alt={log.name} 
                    className="h-10 w-10 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold bg-indigo-500">
                    {log.name.charAt(0)}
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-slate-800">{log.name}</p>
                  <p className="text-xs text-slate-500">{log.time}</p>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${log.status === 'Alert' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {log.status}
                </span>
                <p className="text-xs text-slate-400 mt-1">Match: {log.match}</p>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}