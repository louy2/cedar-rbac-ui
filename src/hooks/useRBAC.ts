import { useState } from 'react';

// Types
export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface Action {
  id: string;
  name: string; // e.g., "view", "edit"
}

export interface Resource {
  id: string;
  name: string; // e.g., "Album", "Photo"
  actions: string[]; // List of Action IDs
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[]; // List of Role IDs
}

export interface Permission {
  roleId: string;
  resourceId: string;
  actionId: string; // Or "all"
}

// Initial Data
const INITIAL_ROLES: Role[] = [
  { id: 'admin', name: 'Admin', description: 'Administrator with full access' },
  { id: 'viewer', name: 'Viewer', description: 'Can only view content' },
];

const INITIAL_ACTIONS: Action[] = [
  { id: 'view', name: 'View' },
  { id: 'create', name: 'Create' },
  { id: 'update', name: 'Update' },
  { id: 'delete', name: 'Delete' },
];

const INITIAL_RESOURCES: Resource[] = [
  { id: 'document', name: 'Document', actions: ['view', 'create', 'update', 'delete'] },
  { id: 'report', name: 'Report', actions: ['view'] },
];

const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Alice', email: 'alice@example.com', roles: ['admin'] },
  { id: 'u2', name: 'Bob', email: 'bob@example.com', roles: ['viewer'] },
];

const INITIAL_PERMISSIONS: Permission[] = [
  { roleId: 'admin', resourceId: 'document', actionId: 'view' },
  { roleId: 'admin', resourceId: 'document', actionId: 'create' },
  { roleId: 'admin', resourceId: 'document', actionId: 'update' },
  { roleId: 'admin', resourceId: 'document', actionId: 'delete' },
  { roleId: 'viewer', resourceId: 'document', actionId: 'view' },
];

export function useRBAC() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [actions] = useState<Action[]>(INITIAL_ACTIONS);
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [permissions, setPermissions] = useState<Permission[]>(INITIAL_PERMISSIONS);

  // Role Management
  const addRole = (role: Role) => setRoles([...roles, role]);
  const updateRole = (id: string, updates: Partial<Role>) =>
    setRoles(roles.map(r => (r.id === id ? { ...r, ...updates } : r)));
  const deleteRole = (id: string) => {
    setRoles(roles.filter(r => r.id !== id));
    setPermissions(permissions.filter(p => p.roleId !== id));
    setUsers(users.map(u => ({ ...u, roles: u.roles.filter(rid => rid !== id) })));
  };

  // Resource Management
  const addResource = (resource: Resource) => setResources([...resources, resource]);
  const deleteResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
    setPermissions(permissions.filter(p => p.resourceId !== id));
  };

  // User Management
  const addUser = (user: User) => setUsers([...users, user]);
  const updateUser = (id: string, updates: Partial<User>) =>
    setUsers(users.map(u => (u.id === id ? { ...u, ...updates } : u)));
  const deleteUser = (id: string) => setUsers(users.filter(u => u.id !== id));

  // Permission Management
  const togglePermission = (roleId: string, resourceId: string, actionId: string) => {
    const exists = permissions.find(
      p => p.roleId === roleId && p.resourceId === resourceId && p.actionId === actionId
    );
    if (exists) {
      setPermissions(permissions.filter(p => p !== exists));
    } else {
      setPermissions([...permissions, { roleId, resourceId, actionId }]);
    }
  };

  return {
    roles,
    actions,
    resources,
    users,
    permissions,
    addRole,
    updateRole,
    deleteRole,
    addResource,
    deleteResource,
    addUser,
    updateUser,
    deleteUser,
    togglePermission,
  };
}
