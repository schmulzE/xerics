/* eslint-disable no-unused-vars */
import image from '../assets/images/image.png';
import word from '../assets/images/word.png';
import pdf from '../assets/images/pdf.png';
import excel from '../assets/images/excel.png';
import text from '../assets/images/txt.png';
import Button from './button';

         
const FileList = ({ files, buttons, selectedFiles, setSelectedFiles}) => {                
  
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

  // const handleRemoveFile = (fileName) => {
  //   removeFile(fileName); // Assuming removeFile takes the file name as an argument
  // };

  const selectFiles = (e) => {
    const { value } = e.target;
    const newSelectedValues = selectedFiles.includes(value)
      ? selectedFiles.filter((val) => val !== value)
      : [...selectedFiles, value];
    setSelectedFiles(newSelectedValues);
  }
  

  return (
    <ul className='flex gap-2'>
      {files && files.map((file) => (
        <li className="bg-base-100 flex justify-around items-center rounded-md border p-2 w-80" key={file.lastModified || file.id}>
          <input
          name='checkbox'
          value={file.id} 
          type="checkbox" 
          checked={selectedFiles.includes(file.id)}
          onChange={selectFiles} 
          className='cursor-pointer'
          />
            <img src={handleIconBasedOnFileType(file.type)} alt='image of file type' className='w-10 h-10 m-1'/>
          <div className='flex flex-col gap-y-1 text-center'>
            <span className="text-xs font-medium ">{file.name}</span>
            <span className="text-xs text-gray-600">{ bytesToSize(file.size) }</span>
          </div>
         {buttons.map((button, index) => (
           <Button button={button} file={file} key={index}/>
          ))}
        </li>
      ))}
    </ul>
  )
}

export default FileList
