import React from 'react';
import { useRBAC } from '../hooks/useRBAC';
import { Lock, Unlock } from 'lucide-react';

interface PolicyMatrixProps {
  rbac: ReturnType<typeof useRBAC>;
}

export function PolicyMatrix({ rbac }: PolicyMatrixProps) {
  const { roles, resources, actions, permissions, togglePermission } = rbac;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Permission Matrix</h3>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                Resource / Action
              </th>
              {roles.map(role => (
                <th key={role.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {role.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {resources.map(resource => (
              <React.Fragment key={resource.id}>
                {/* Resource Header Row */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-2 text-sm font-bold text-gray-900 sticky left-0 bg-gray-50" colSpan={roles.length + 1}>
                    {resource.name}
                  </td>
                </tr>
                {/* Action Rows */}
                {resource.actions.map(actionId => {
                  const action = actions.find(a => a.id === actionId);
                  return (
                    <tr key={`${resource.id}-${actionId}`} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-600 pl-10 sticky left-0 bg-white">
                        {action ? action.name : actionId}
                      </td>
                      {roles.map(role => {
                        const isPermitted = permissions.some(
                          p => p.roleId === role.id && p.resourceId === resource.id && p.actionId === actionId
                        );
                        return (
                          <td key={`${role.id}-${resource.id}-${actionId}`} className="px-6 py-3 text-center">
                            <button
                              onClick={() => togglePermission(role.id, resource.id, actionId)}
                              className={`p-2 rounded-full transition-colors ${
                                isPermitted
                                  ? 'text-green-600 bg-green-50 hover:bg-green-100'
                                  : 'text-gray-300 hover:text-gray-400'
                              }`}
                            >
                              {isPermitted ? (
                                <Unlock className="w-5 h-5" />
                              ) : (
                                <Lock className="w-5 h-5" />
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
