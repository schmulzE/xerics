export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export const getStatusClasses = (status) => {
  switch (status) {
    case 'In Review':
      return 'bg-red-50 text-red-400';
    case 'Done':
      return 'bg-green-50 text-green-400';
    case 'In Progress':
      return 'bg-orange-50 text-orange-400';
    default:
      return 'bg-base-100 text-gray-400';
  }
};

export const getBreadcrumbLinks = (projectId) => [
  {
    text: 'Dashboard',
    url: '/dashboard',
  },
  {
    text: 'Project Lists',
    url: '/projects',
  },
  {
    text: 'Project Details',
    url: `/project/${projectId}`,
  },
];