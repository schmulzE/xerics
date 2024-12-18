/* eslint-disable no-unused-vars */
import { useTheme } from '../../../../context/themeContext';

function ProjectContributorList({ projectContributors, onlineUsers }) {
  const { theme } = useTheme();

  const getUserInitials = (username) => {
    // let userInitials = username.toUpperCase().replace(/['"]+/g, '').charAt(0)
    let userInitials = username?.toUpperCase().charAt(0)
    stringToColour(username)
    return userInitials;
  }

  const stringToColour = (str) => {
    let hash = 0;
    str?.split('').forEach(char => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })
    let colour = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      colour += value.toString(16).padStart(2, '0')
    }
    return colour
  }

  return (
    <>
      <ul className="avatar-group -space-x-3 rtl:space-x-reverse">
        {projectContributors.map((contributor) => (
          <li 
          className={`border-base-100 avatar ${theme === 'dark' ? 'text-base-100 border-[#191E24]' : 'text-base-100'}`} 
          key={contributor?.profiles?.id}
          >
            <div className="w-9">
              <div 
              style={{ backgroundColor: stringToColour(contributor?.profiles?.firstname) }} 
              className={"flex flex-col justify-center content-center py-1 text-lg"}
              >
                <p className='mx-auto'>{getUserInitials(contributor?.profiles?.firstname)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ProjectContributorList;