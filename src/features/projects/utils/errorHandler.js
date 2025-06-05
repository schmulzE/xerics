export const handleError = (error, toast) => {
  toast({
    variant: "destructive",
    title: "Error",
    description: error.message || "An unexpected error occurred",
  });
};

export const showSuccess = (toast, message) => {
  toast({
    variant: "success",
    title: "Success",
    description: message,
  });
};