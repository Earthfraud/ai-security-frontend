import { useState, useEffect } from "react";

export default function ManageUsers({ onUserDeleted }) {
  const [users, setUsers] = useState([]);
  
  // --- NEW: Password Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // ---------------------------------

  const fetchUsers = () => {
    fetch("https://ai-security-backend-wyyl.onrender.com/api/users")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setUsers(data.users);
        }
      })
      .catch(err => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Opens the popup and remembers WHICH user we are trying to delete
  const initiateRevoke = (userName) => {
    setSelectedUser(userName);
    setErrorMessage("");
    setAdminPassword("");
    setIsModalOpen(true);
  };

  // Sends the password to Python for verification
  const confirmRevoke = async () => {
    setErrorMessage(""); // Clear old errors

    try {
      const response = await fetch(`https://ai-security-backend-wyyl.onrender.com/api/users/${selectedUser}`, {
        method: "DELETE",
        headers: {
          "X-Admin-Password": adminPassword // Send the password secretly in the headers!
        }
      });

      const data = await response.json();

      if (!response.ok) {
        // Python rejected the password (401 error)
        setErrorMessage(data.detail || "Wrong password!");
        return;
      }

      // If it passes, close the modal and refresh the list
      setIsModalOpen(false);
      fetchUsers();
      if (onUserDeleted) onUserDeleted();
      
    } catch (err) {
      setErrorMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="animate-fade-in-down max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Manage Access</h2>
        <p className="text-slate-500 text-sm mt-1">Review registered identities and revoke system access.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
              <th className="p-4">Identity Name</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-8 text-center text-slate-400">No users registered yet.</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    {user.name}
                  </td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Active</span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => initiateRevoke(user.name)}
                      className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Revoke Access
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- PASSWORD AUTHENTICATION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Admin Authentication</h2>
            <p className="text-sm text-slate-500 mb-4">
              Enter the master password to revoke access for <strong>{selectedUser}</strong>.
            </p>
            
            <input 
              type="password" 
              placeholder="Admin Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            
            {/* Show error message if password is wrong */}
            {errorMessage && <p className="text-red-500 text-sm font-bold mb-4">❌ {errorMessage}</p>}

            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRevoke}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors"
              >
                Confirm Revoke
              </button>
            </div>
          </div>
        </div>
      )}
      {/* -------------------------------------- */}

    </div>
  );
}