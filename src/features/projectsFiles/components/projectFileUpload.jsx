import ProjectFileList from "./projectFileList";
import { useToast } from "@/components/ui/use-toast";
import CardWrapper from "../../../components/ui/cardWrapper";

const ProjectFileUpload = ({buttons, uploadedFiles, setUploadedFiles, selectedFiles, setSelectedFiles}) => {
  const { toast } = useToast();
  
  function uploadFiles(event) {
    event.preventDefault();
    const selectedFiles = event.target.files;

    if (selectedFiles.length === 0) {
      toast({
        variant: 'destructive', 
        description: "Please select at least one file to upload."
      });
      return;
    }
    const filesArray = Array.from(selectedFiles);
    setUploadedFiles([...filesArray]);
  }


  return (
    <CardWrapper title="Files Attachment" classes={'w-full'}>
      <label className="form-control w-64">
        <div className="label">
          <span className="label-text text-xs">Files</span>
        </div>
        <div className="label">
        <input 
        type="file"
        name="files"
        multiple 
        onChange={uploadFiles}
        className="hidden bg-base-200" 
        />
          <span
          className="label-text-alt text-md btn-ghost text-blue-600 bg-blue-200 p-1 hover:bg-blue-200 rounded-md"
          >
            Add Files
          </span>
        </div>
      </label>
      <ProjectFileList 
      files={uploadedFiles} 
      buttons={buttons} 
      selectedFiles={selectedFiles} 
      setSelectedFiles={setSelectedFiles}
      />
    </CardWrapper>
  )
}

export default ProjectFileUpload;
