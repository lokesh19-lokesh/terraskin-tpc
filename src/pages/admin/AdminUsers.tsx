import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ShieldAlert, ShieldCheck, Download } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast.error('Failed to load users profile data');
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockStatus = async (userId: string, currentStatus: boolean, role: string) => {
    if (role === 'admin') {
      toast.warning("Cannot block fellow Superadmins.");
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_blocked: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success(currentStatus ? "User successfully unblocked." : "User successfully blocked.");
      fetchUsers();
    } catch (error: any) {
      toast.error("You don't have permission to modify profiles. Check RLS policies.");
    }
  };

  const exportToCSV = () => {
    if (users.length === 0) {
      toast.warning("No user data to export.");
      return;
    }

    try {
      const headers = ["User ID", "First Name", "Last Name", "Email", "Phone", "Gender", "Role", "Status", "Created At"];
      const csvData = users.map(user => [
        user.id,
        user.first_name || 'N/A',
        user.last_name || 'N/A',
        user.email || 'N/A',
        user.phone_number || 'N/A',
        user.gender || 'N/A',
        user.role || 'user',
        user.is_blocked ? 'Blocked' : 'Active',
        user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'
      ]);

      const csvContent = [headers, ...csvData]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `terraskin_users_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("User data exported successfully.");
    } catch (error) {
      toast.error("Failed to export user data.");
      console.error("Export error:", error);
    }
  };

  if (loading) return <div className="text-gray-500">Loading user profiles...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 border-b pb-4 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-['Playfair_Display']">User Security & Profiles</h1>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-[#8d4745] text-white px-4 py-2 rounded-lg hover:bg-[#7a3f3d] transition-colors shadow-sm text-sm font-medium"
        >
          <Download size={18} />
          Download Data
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm -mx-4 sm:mx-0 mb-6">
        <table className="min-w-[800px] w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">User UID</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Moderation</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className={user.is_blocked ? "bg-red-50" : ""}>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-500">
                   {user.id.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                  {user.first_name || 'N/A'} {user.last_name || ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_blocked ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.is_blocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  <button 
                    onClick={() => toggleBlockStatus(user.id, user.is_blocked, user.role)} 
                    className={`p-2 rounded flex items-center gap-1 justify-end ml-auto transition-colors ${user.is_blocked ? 'text-green-600 hover:bg-green-50' : 'text-red-500 hover:bg-red-50'}`}
                  >
                    {user.is_blocked ? <><ShieldCheck size={16}/> Unblock</> : <><ShieldAlert size={16}/> Block</>}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No users found in profiles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
