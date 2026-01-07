import { useState } from 'react';
import { Plus, Trash2, User as UserIcon, Shield } from 'lucide-react';
import type { User, Role } from '../hooks/useRBAC';

interface UsersViewProps {
  users: User[];
  roles: Role[];
  onAddUser: (user: User) => void;
  onUpdateUser: (id: string, user: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
}

export function UsersView({ users, roles, onAddUser, onDeleteUser }: UsersViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', roles: [] as string[] });

  const handleAdd = () => {
    if (!newUser.name || !newUser.email) return;
    const id = newUser.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    onAddUser({ id, ...newUser });
    setNewUser({ name: '', email: '', roles: [] });
    setIsAdding(false);
  };

  const toggleRole = (roleId: string, currentRoles: string[], onChange: (roles: string[]) => void) => {
    if (currentRoles.includes(roleId)) {
      onChange(currentRoles.filter(r => r !== roleId));
    } else {
      onChange([...currentRoles, roleId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Users & Principals</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign Roles</label>
            <div className="flex flex-wrap gap-2">
              {roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => toggleRole(role.id, newUser.roles, (r) => setNewUser({ ...newUser, roles: r }))}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                    newUser.roles.includes(role.id)
                      ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  {role.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newUser.name || !newUser.email}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              Save User
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{user.name}</h4>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {user.roles.map(roleId => {
                  const role = roles.find(r => r.id === roleId);
                  return (
                    <span key={roleId} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {role ? role.name : roleId}
                    </span>
                  );
                })}
              </div>
              <button onClick={() => onDeleteUser(user.id)} className="text-gray-400 hover:text-red-500 p-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
