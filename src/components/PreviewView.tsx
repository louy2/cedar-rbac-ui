import React from 'react';
import { useRBAC } from '../hooks/useRBAC';
import { Copy, Check } from 'lucide-react';

interface PreviewViewProps {
  rbac: ReturnType<typeof useRBAC>;
}

export function PreviewView({ rbac }: PreviewViewProps) {
  const [copied, setCopied] = React.useState(false);

  // Generate Cedar Policy
  const generatePolicy = () => {
    const lines: string[] = [];

    lines.push('// Cedar Policies Generated from RBAC UI');
    lines.push('');

    // 1. Role Definitions (Implicit in assignments, but maybe we want comments)
    // Cedar doesn't really "define" roles separately unless using a schema, but here we generate policies.

    // 2. Permission Grants
    // For each role, list the permissions
    
    rbac.roles.forEach(role => {
      const rolePermissions = rbac.permissions.filter(p => p.roleId === role.id);
      
      // Group by resource type to condense
      const resourceGroups: Record<string, string[]> = {};
      
      rolePermissions.forEach(p => {
        if (!resourceGroups[p.resourceId]) {
          resourceGroups[p.resourceId] = [];
        }
        resourceGroups[p.resourceId].push(p.actionId);
      });

      if (Object.keys(resourceGroups).length > 0) {
        lines.push(`// Permissions for Role: ${role.name}`);
        
        Object.entries(resourceGroups).forEach(([resourceId, actionIds]) => {
            const resource = rbac.resources.find(r => r.id === resourceId);
            const resourceName = resource ? resource.name : resourceId;
            
            // Format actions
            // Action::"view", Action::"edit"
            const actionList = actionIds.map(a => {
                const action = rbac.actions.find(act => act.id === a);
                const actionName = action ? action.name : a;
                return `Action::"${actionName}"`;
            });

            // If actions cover all available actions for the resource, we could simplify (optional)

            let actionsStr = "";
            if (actionList.length === 1) {
                actionsStr = `action == ${actionList[0]}`;
            } else {
                actionsStr = `action in [${actionList.join(', ')}]`;
            }

            lines.push(`permit(`);
            lines.push(`  principal in Role::"${role.name}",`);
            lines.push(`  ${actionsStr},`);
            lines.push(`  resource is ${resourceName}`);
            lines.push(`);`);
            lines.push('');
        });
      }
    });

    lines.push('// User Role Assignments (Usually handled by the application context, but shown here for clarity)');
    lines.push('/*');
    rbac.users.forEach(user => {
      if (user.roles.length > 0) {
         const roleNames = user.roles.map(rid => {
             const r = rbac.roles.find(role => role.id === rid);
             return r ? `Role::"${r.name}"` : rid;
         }).join(', ');
         lines.push(`User::"${user.id}" has roles: [${roleNames}]`);
      }
    });
    lines.push('*/');

    return lines.join('\n');
  };

  const policy = generatePolicy();

  const handleCopy = () => {
    navigator.clipboard.writeText(policy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Generated Cedar Policies</h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </div>

      <div className="relative">
        <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed shadow-lg">
          <code>{policy}</code>
        </pre>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-1">Note</h4>
        <p className="text-sm text-blue-800">
          This generator assumes a Cedar schema where Principals are in Roles, and Resources have types corresponding to the names defined here. 
          The policy `resource is Type` matches any resource of that type.
        </p>
      </div>
    </div>
  );
}
