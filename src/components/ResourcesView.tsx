import { useState } from 'react';
import { Plus, Trash2, Box } from 'lucide-react';
import type { Resource, Action } from '../hooks/useRBAC';

interface ResourcesViewProps {
  resources: Resource[];
  actions: Action[];
  onAddResource: (resource: Resource) => void;
  onDeleteResource: (id: string) => void;
}

export function ResourcesView({ resources, actions, onAddResource, onDeleteResource }: ResourcesViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newResource, setNewResource] = useState({ name: '', actions: [] as string[] });

  const handleAdd = () => {
    if (!newResource.name) return;
    const id = newResource.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    onAddResource({ id, ...newResource });
    setNewResource({ name: '', actions: [] });
    setIsAdding(false);
  };

  const toggleAction = (actionId: string) => {
    setNewResource(prev => {
      const isSelected = prev.actions.includes(actionId);
      if (isSelected) {
        return { ...prev, actions: prev.actions.filter(a => a !== actionId) };
      } else {
        return { ...prev, actions: [...prev.actions, actionId] };
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Resources & Actions</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Resource
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Name</label>
            <input
              type="text"
              value={newResource.name}
              onChange={e => setNewResource({ ...newResource, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Photo"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Supported Actions</label>
            <div className="flex flex-wrap gap-2">
              {actions.map(action => (
                <button
                  key={action.id}
                  onClick={() => toggleAction(action.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                    newResource.actions.includes(action.id)
                      ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {action.name}
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
              disabled={!newResource.name}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              Save Resource
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <div key={resource.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Box className="w-5 h-5 text-indigo-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{resource.name}</h4>
              </div>
              <button onClick={() => onDeleteResource(resource.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Actions</p>
              <div className="flex flex-wrap gap-1.5">
                {resource.actions.map(actionId => {
                  const action = actions.find(a => a.id === actionId);
                  return (
                    <span key={actionId} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {action ? action.name : actionId}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
