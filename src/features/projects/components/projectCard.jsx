import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import supabase from '../../../lib/supabase';
import Dropdown from '../../../components/ui/dropdown';
import BudgetProgressbar from "../../projectsTransactions/components/budgetProgressbar";
import { deleteProject, deleteProjectImageFromStorage } from "../../projects/projectThunks";

// eslint-disable-next-line no-unused-vars
const ProjectCard = ({ id, imagePath, name, description, status, icon, classes, progressValue, statusClass }) => {
  const dispatch = useDispatch()
  const [image, setImage] = useState()

  useEffect(() => {
    if(imagePath) {
      const { data } = supabase.storage.from('project_images').getPublicUrl(imagePath)
      setImage(data.publicUrl)
    }
  },[imagePath])

  const getStatusClasses = (status) => {
    switch (status) {
      case 'in review':
        return 'bg-red-50 text-red-400';
      case 'done':
        return 'bg-green-50 text-green-400';
      case 'in progress':
        return 'bg-orange-50 text-orange-400';
      default:
        return 'bg-base-300 text-gray-400';
    }
  };

  const deleteProjectHandler = (id) => {
    if (confirm(`Are you sure you want to delete the project "${name}"?`)) {
      dispatch(deleteProject(id));
      imagePath && deleteProjectImageFromStorage(imagePath);
    }
  }

  return (
    <div className="relative bg-base-100 p-4 h-44 rounded-sm">
      <Link to={`/projects/${id}`} className={`block ${classes}`}>
        <div className="flex justify-between">
          <div className="flex gap-x-2 items-center">
            {image && (
              <div className="avatar">
                <div className="w-7 h-7 rounded-full border border-base-300">
                  <img src={image} alt={name} />
                </div>
              </div>
            )}
            <h2 className="capitalize font-medium w-36 line-clamp-2">{name}</h2>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 line-clamp-3 mt-2">{description}</p>
          <BudgetProgressbar progressValue={progressValue} title={'progress'}/>
        </div>
      </Link>
      <div className="mb-4 absolute top-3 right-5">
        <div className="flex items-center">
        <span className={`rounded-sm text-xs p-1.5 uppercase ${getStatusClasses(status)} ${statusClass}`}>{status}</span>
        <Dropdown 
          type="action"
          icon="pi-ellipsis-v"
          actionItems={[
            { 
              label: 'edit', 
              link: `/projects/edit/${id}` 
            },
            { 
              label: 'delete', 
              onClick: () => deleteProjectHandler(id) 
            }
          ]}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;