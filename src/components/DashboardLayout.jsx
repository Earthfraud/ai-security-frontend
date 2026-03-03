export default function DashboardLayout({ children, activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'users', label: 'Manage Users' },
    { id: 'logs', label: 'Activity Logs' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#0B1121] text-white flex flex-col">
        <div className="p-6 mb-4">
          <h1 className="text-3xl font-bold text-indigo-500 tracking-tight">AI Sentry</h1>
          <p className="text-slate-400 text-sm mt-1">Attendance System</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === item.id 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}