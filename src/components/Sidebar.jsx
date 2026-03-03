export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-indigo-400">AI Sentry</h2>
        <p className="text-sm text-slate-400 mt-1">Attendance System</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <a href="#" className="block px-4 py-3 bg-indigo-600 rounded-lg font-medium transition-colors">
          Dashboard
        </a>
        <a href="#" className="block px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg font-medium transition-colors">
          Manage Users
        </a>
        <a href="#" className="block px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg font-medium transition-colors">
          Activity Logs
        </a>
        <a href="#" className="block px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg font-medium transition-colors">
          Settings
        </a>
      </nav>
    </div>
  );
}