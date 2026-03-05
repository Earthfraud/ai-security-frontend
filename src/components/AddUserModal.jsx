import { useEffect, useRef, useState } from 'react';

export default function AddUserModal({ isOpen, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    let stream = null;
    if (isOpen) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((s) => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch((err) => console.error("Modal camera error:", err));
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRegister = async () => {
    if (!name.trim()) {
      setStatus("⚠️ Please enter a name first.");
      return;
    }

    setIsRegistering(true);
    setStatus("Capturing face...");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const base64Image = canvas.toDataURL('image/jpeg');

    try {
      // 🛑 FIXED: Pointing to /api/users to match the backend!
      const response = await fetch("https://ai-security-backend-wyyl.onrender.com/api/users", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, image: base64Image })
      });

      const data = await response.json();
      
      if (response.ok && data.status === "success") {
        setStatus("✅ Successfully registered: " + name);
        setTimeout(() => {
          onClose(); 
          setName("");
          setStatus("");
          setIsRegistering(false);
        }, 2000);
      } else {
        // Updated to catch standard FastAPI errors safely
        setStatus("❌ Failed: " + (data.detail || data.message || "Server Error"));
        setIsRegistering(false);
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Server connection error.");
      setIsRegistering(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">Register New Face</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 font-bold text-xl">
            &times;
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video border border-slate-300">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-40 border-2 border-dashed border-white/50 rounded-full"></div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Shivam"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              disabled={isRegistering}
            />
          </div>

          {status && (
            <p className={`text-sm font-medium text-center ${status.includes('❌') || status.includes('⚠️') ? 'text-red-500' : 'text-green-600'}`}>
              {status}
            </p>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
            disabled={isRegistering}
          >
            Cancel
          </button>
          <button 
            onClick={handleRegister} 
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            disabled={isRegistering}
          >
            {isRegistering ? "Saving..." : "Capture & Register"}
          </button>
        </div>
      </div>
    </div>
  );
}