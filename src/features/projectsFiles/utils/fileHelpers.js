export const validateFileSize = (files, maxSizeMB = 5) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return files.filter(file => file.size < maxSizeBytes);
};

export const getFileTypeOptions = () => [
  { value: "all", label: "All types" },
  { value: "image", label: "Images" },
  { value: "application/pdf", label: "PDFs" },
  { 
    value: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
    label: "Word Documents" 
  },
  { 
    value: "application/vnd.openxmlformats-officedocument.presentationml.presentation", 
    label: "Excel Sheets" 
  },
  { value: "text/csv", label: "CSV" }
];