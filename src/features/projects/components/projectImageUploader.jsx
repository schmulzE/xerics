import { useState } from "react";
import CardWrapper from "../../../components/ui/cardWrapper";

const ProjectImageUploader = ({ onImageChange }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
        onImageChange(reader.result);
      };
      reader.readAsDataURL(droppedFile);
    } else {
      alert("Please drop an image file.");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
        onImageChange(file);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <CardWrapper title="Files Attachment" containerClass={'w-full capitalize'} >
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text text-xs">Images</span>
          </div>
          <input type="file" placeholder="Type project title here" onChange={handleImageChange} className="hidden bg-base-200" />
          <div 
            onDragOver={handleDragOver} 
            onDrop={handleDrop}  
            className="label bg-base-200 flex flex-col justify-center content-center space-y-4 py-4"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="project image" className="w-12 h-12"/>
            ) : (
            <div className="px-4 py-3 bg-blue-500 rounded-md">
              <i className="pi pi-image bg-blue-500 text-base-100"></i>
            </div>
            )}
            <span className="text-xs text-center lowercase">drag and drop images here, <br/> or click to add images</span>
            <span className="label-text-alt text-md btn-ghost text-blue-600 bg-blue-200 p-1 hover:bg-blue-200 rounded-md">
              Add image
            </span>
          </div>
        </label>
      </CardWrapper>
  )
}

export default ProjectImageUploader
