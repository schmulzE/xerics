export const BREADCRUMB_LINKS = (projectId) => [
  {
    text: 'Dashboard',
    url: '/dashboard',
  },
  {
    text: 'Project Lists',
    url: '/projects',
  },
  {
    text: 'Add Project',
    url: `/add-project/${projectId}`,
  },
];

export const FILE_ACTION_BUTTONS = (removeFile) => [
  {
    icon: 'pi pi-times text-gray-500',
    onClick: (fileName) => removeFile(fileName)
  }
];