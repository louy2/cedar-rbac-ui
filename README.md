# Cedar RBAC UI

A modern React-based user interface for managing Role-Based Access Control (RBAC) policies, designed to work with [Cedar](https://www.cedarpolicy.com/) policy language concepts. This application allows you to visually manage roles, users, resources, and permissions, and preview the resulting policies.

## Features

- **Dashboard Overview**: Get a quick snapshot of total roles, users, and active permissions.
- **Role Management**: Create, update, and delete roles.
- **User Management**: Manage users and assign them to roles.
- **Resource Management**: Define resources and actions available in the system.
- **Policy Matrix**: Visual representation of permissions across roles and resources.
- **Policy Preview**: Generate and preview the Cedar policy code based on your configuration.

## Tech Stack

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cedar-rbac-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Type-checks and builds the application for production.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Runs ESLint to check for code quality issues.

## Deployment

This project is configured to deploy to **GitHub Pages** automatically via GitHub Actions.

### Workflow Details

The deployment workflow is defined in `.github/workflows/deploy.yml`. It performs the following steps:
1. Checks out the code.
2. Sets up Node.js.
3. Installs dependencies (`npm ci`).
4. Builds the project (`npm run build`).
5. **Injects Google Analytics**: The workflow automatically injects the Google Analytics tracking tag into `dist/index.html` post-build, ensuring that analytics are present in the deployed version without cluttering the source code.
6. Uploads the build artifact and deploys it to GitHub Pages.

## License

[MIT](LICENSE)
