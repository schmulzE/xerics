/* eslint-disable no-unused-vars */
import image from '@/assets/images/image.png';
import word from '@/assets/images/word.png';
import pdf from '@/assets/images/pdf.png';
import excel from '@/assets/images/excel.png';
import text from '@/assets/images/txt.png';
import FileDeleteButton from '../../projectsFiles/components/fileDeleteButton';

         
const FileList = ({ files, buttons, selectedFiles, setSelectedFiles, loading}) => {                
  
  function bytesToSize(bytes) {
    const kilobytes = bytes / 1024;
    const megabytes = kilobytes / 1024;
    return megabytes >= 1 ? megabytes.toFixed(2) + " MB" : kilobytes.toFixed(2) + " KB";
  }
  

  function handleIconBasedOnFileType(fileType) {
    let imageSource;
     // Determine the image source based on the file type
     switch (fileType) {
      case 'image/jpg':
      case 'image/jpeg':
      case 'image/png':
        imageSource = image;
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        imageSource = word;
        break;
      case 'application/pdf':
        imageSource = pdf;
        break;
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        imageSource = excel;
        break;
      default:
        // Provide a default image source if the file type is not recognized
       imageSource = text;
    }
    return imageSource;
  }


  const selectFiles = (e) => {
    const { value } = e.target;
    const newSelectedValues = selectedFiles.includes(value)
      ? selectedFiles.filter((val) => val !== value)
      : [...selectedFiles, value];
    setSelectedFiles(newSelectedValues);
  }
  
  // if(files == loading) return <div>loading...</div>

  return (
    <ul className='flex gap-2'>
      {files.length > 0 ? files.map((file) => (
        <li 
        className="bg-base-100 flex justify-between items-center rounded-md border border-base-300 p-2 w-80" 
        key={file.lastModified || file.id}
        >
          <input
          name='checkbox'
          value={file.id} 
          type="checkbox" 
          checked={selectedFiles.includes(file.id)}
          onChange={selectFiles} 
          className='cursor-pointer'
          />
          <div className='flex items-center gap-x-1'>
            <img src={handleIconBasedOnFileType(file.type)} alt='image of file type' className='w-10 h-10 m-1'/>
            <div className='flex flex-col gap-y-1 text-center'>
              <span className="text-xs font-medium ">{file.name}</span>
              <span className="text-xs text-gray-600">{ bytesToSize(file.size) }</span>
            </div>
          </div>
          <div>
          {buttons?.map((button, index) => (
            <FileDeleteButton button={button} file={file} key={index}/>
          ))}
          </div>
        </li>
      )): <div className='text-center p-4 lg:p-16'>
         <p>No projects files found. Check back later or add a file to an existing project.</p>
        </div>}
    </ul>
  )
}

export default FileList
