import { useState } from 'react';
import { Layout } from './components/Layout';
import { useRBAC } from './hooks/useRBAC';
import { RolesView } from './components/RolesView';
import { ResourcesView } from './components/ResourcesView';
import { UsersView } from './components/UsersView';
import { PreviewView } from './components/PreviewView';
import { PolicyMatrix } from './components/PolicyMatrix';
import { Shield, Users, Lock } from 'lucide-react';

type View = 'dashboard' | 'roles' | 'users' | 'resources' | 'preview';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const rbac = useRBAC();

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Roles</p>
                    <h3 className="text-2xl font-bold text-gray-900">{rbac.roles.length}</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg text-green-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <h3 className="text-2xl font-bold text-gray-900">{rbac.users.length}</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Permissions</p>
                    <h3 className="text-2xl font-bold text-gray-900">{rbac.permissions.length}</h3>
                  </div>
                </div>
              </div>
            </div>
            
            <PolicyMatrix rbac={rbac} />
          </div>
        );
      case 'roles':
        return (
          <RolesView 
            roles={rbac.roles} 
            onAdd={rbac.addRole} 
            onUpdate={rbac.updateRole} 
            onDelete={rbac.deleteRole} 
          />
        );
      case 'users':
        return (
          <UsersView 
            users={rbac.users} 
            roles={rbac.roles}
            onAddUser={rbac.addUser}
            onUpdateUser={rbac.updateUser}
            onDeleteUser={rbac.deleteUser}
          />
        );
      case 'resources':
        return (
          <ResourcesView 
            resources={rbac.resources} 
            actions={rbac.actions}
            onAddResource={rbac.addResource}
            onDeleteResource={rbac.deleteResource}
          />
        );
      case 'preview':
        return <PreviewView rbac={rbac} />;
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
          {currentView === 'dashboard' ? 'Overview' : currentView}
        </h2>
        {/* We remove the container wrapper for dashboard to let it use grid properly, 
            but keep it for other views if needed. Actually the other views are fine in a container.
            Let's wrap everything except dashboard or just wrap everything and dashboard handles its layout.
        */}
        {currentView === 'dashboard' ? (
          renderContent()
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {renderContent()}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;
