export const validateProjectForm = (formData) => {
  const errors = {};
  
  if (!formData.get('name')?.trim()) {
    errors.name = "Project name is required";
  }
  
  if (!formData.get('description')?.trim()) {
    errors.description = "Description is required";
  }
  
  if (!formData.get('due_date')) {
    errors.due_date = "Due date is required";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};