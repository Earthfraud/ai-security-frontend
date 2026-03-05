import { useRef, useEffect, useState } from "react";

export default function LiveCameraFeed({ onFaceDetected }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    // Start the webcam
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }
      })
      .catch((err) => console.error("Error accessing camera:", err));
  }, []);

  useEffect(() => {
    if (!isStreaming) return;

    // Scan every 2 seconds
    const interval = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext("2d");
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        
        // Draw the current video frame onto the canvas
        context.drawImage(videoRef.current, 0, 0);
        
        // Convert to base64 string
        const base64Image = canvasRef.current.toDataURL("image/jpeg");

        // FIXED: Send to FastAPI Backend's /api/recognize route
        fetch("https://ai-security-backend-wyyl.onrender.com/api/recognize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Image })
        })
        .then(res => res.json())
        .then(data => {
          if (data.faces_found && data.faces_found > 0) {
            onFaceDetected({ ...data, frameImage: base64Image });
          }
        })
        .catch(err => console.error("Recognition Error:", err));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isStreaming, onFaceDetected]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
      <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
        <canvas ref={canvasRef} className="hidden"></canvas>
        
        {/* Overlay Recording Indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
            LIVE REC
          </span>
        </div>
      </div>
    </div>
  );
}