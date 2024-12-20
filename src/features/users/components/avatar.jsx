const Avatar = ({avatar, firstname, className, backgroundClass}) => {

  const getUserInitials = (username) => {
    // let userInitials = username.toUpperCase().replace(/['"]+/g, '').charAt(0)
    let userInitials = username.toUpperCase().charAt(0)
    stringToColour(username)
    return userInitials;
  }

  const stringToColour = (str) => {
    let hash = 0;
    str.split('').forEach(char => {
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
    <div className="avatar-group -space-x-3 inline-flex">
       <div className="avatar">
         <div className={className}>
          { avatar ? <img src={avatar} alt="user avatar" /> :
            <div style={{ backgroundColor: stringToColour(firstname) }} className={backgroundClass +  " flex content-center justify-center items-center flex-1 text-base-100"}>
             <div>{getUserInitials(firstname)}</div>
           </div>
          }
         </div>
       </div>
    </div>
  )
}

export default Avatar
