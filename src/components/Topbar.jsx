export default function Topbar() {
  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8">
      <h1 className="text-xl font-semibold text-slate-800">Live Overview</h1>
      <div className="flex items-center gap-4">
        <div className="text-sm text-right">
          <p className="font-medium text-slate-700">Admin User</p>
          <p className="text-xs text-green-500 font-medium">System Online</p>
        </div>
        <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-200">
          A
        </div>
      </div>
    </header>
  );
}