import { useState, useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
import LiveCameraFeed from "./components/LiveCameraFeed";
import StatsOverview from "./components/StatsOverview";
import RecentActivity from "./components/RecentActivity";
import AddUserModal from "./components/AddUserModal";
import FullActivityLogs from "./components/FullActivityLogs";
import ManageUsers from "./components/ManageUsers";

export default function App() {
  const [logs, setLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [activeTab, setActiveTab] = useState('dashboard');

  const [recognizedNames, setRecognizedNames] = useState(new Set());
  const [alertCount, setAlertCount] = useState(0);
  const [registeredCount, setRegisteredCount] = useState(0);

  // Settings State
  const [aiStrictness, setAiStrictness] = useState(85);

  const fetchDatabaseHistory = () => {
    // FIXED: Now points to /api/logs
    fetch("https://ai-security-backend-wyyl.onrender.com/api/logs")
      .then(res => res.json())
      .then(data => {
        // FIXED: The logs route returns an array directly
        if (data && Array.isArray(data)) {
          const formattedLogs = data.map(log => ({
            id: log.id,
            name: log.name,
            status: log.status,
            time: log.time, 
            date: log.date,
            match: log.match,
            image: null 
          }));
          
          setLogs(formattedLogs);

          const today = new Date().toLocaleDateString('en-CA');
          const todaysLogs = formattedLogs.filter(log => log.date === today);
          
          const uniqueNames = new Set();
          let alerts = 0;
          
          todaysLogs.forEach(log => {
             if (log.status === "Recognized") {
                 uniqueNames.add(log.name);
             } else {
                 alerts++;
             }
          });
          
          setRecognizedNames(uniqueNames);
          setAlertCount(alerts);
        }
      })
      .catch(err => console.error("Error fetching logs:", err));
  };

  const fetchRegisteredCount = () => {
    // FIXED: Now points to /api/users
    fetch("https://ai-security-backend-wyyl.onrender.com/api/users")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success" && data.users) {
          setRegisteredCount(data.users.length); 
        }
      })
      .catch(err => console.error("Error fetching user count:", err));
  };

  useEffect(() => {
    fetchRegisteredCount();
    fetchDatabaseHistory();
  }, []);

  const playAlarm = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'square'; 
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
  };

  const handleFaceDetected = (faceData) => {
    const name = faceData.name || "Unknown Person";
    const isRecognized = faceData.match_status === "Recognized" || faceData.match_status === "success";

    const newLog = {
      id: Date.now(),
      name: name, 
      status: faceData.match_status || (isRecognized ? "Recognized" : "Alert"),
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString('en-CA'),
      match: faceData.match_confidence || (isRecognized ? "98%" : "Low"),
      image: faceData.frameImage, 
    };

    setLogs((prevLogs) => [newLog, ...prevLogs]);

    if (isRecognized && name !== "Unknown Person") {
      setRecognizedNames((prev) => new Set(prev).add(name));
    } else {
      setAlertCount((prev) => prev + 1);
      playAlarm();
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      
      {activeTab === 'dashboard' && (
        <div className="animate-fade-in-down">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">System Dashboard</h2>
              <p className="text-slate-500 text-sm mt-1">Real-time attendance monitoring and security feeds.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span> Add New Face
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <LiveCameraFeed onFaceDetected={handleFaceDetected} />
            </div>
            <div className="space-y-6 flex flex-col h-full">
              <StatsOverview 
                presentCount={recognizedNames.size} 
                alertCount={alertCount} 
                registeredCount={registeredCount} 
              />
              <RecentActivity logs={logs.slice(0, 5)} /> 
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <FullActivityLogs logs={logs} />
      )}

      {activeTab === 'users' && (
        <ManageUsers onUserDeleted={fetchRegisteredCount} />
      )}

      {activeTab === 'settings' && (
        <div className="animate-fade-in-down">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
            <p className="text-slate-500 text-sm mt-1">Configure your AI models.</p>
          </div>

          <div className="space-y-6 max-w-3xl">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-800">🧠 AI Confidence Threshold: {aiStrictness}%</h3>
                <p className="text-sm text-slate-500">The minimum match percentage required for the system to grant access. A higher number increases security but may cause false rejections.</p>
              </div>
              <input 
                type="range" 
                min="50" max="99" 
                value={aiStrictness} 
                onChange={(e) => setAiStrictness(e.target.value)} 
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>
      )}

      <AddUserModal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        fetchRegisteredCount(); 
      }} />

    </DashboardLayout>
  );
}