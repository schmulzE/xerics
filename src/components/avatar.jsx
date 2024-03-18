import useUserDetails from "../hooks/useUserDetail";

const Avatar = ({profileId, projectContributors}) => {
  const userDetails = useUserDetails(profileId, projectContributors);
  
  if (!userDetails) {
    return <div>Loading...</div>;
  }
  const { userInitials, colour } = userDetails || {};

  return (
    <div className="avatar-group -space-x-3 inline-flex">
      <div className="avatar">
        <div className="w-6 h-6">
          {/* <img src="https://images.pexels.com/photos/2380794/pexels-photo-2380794.jpeg?auto=compress&cs=tinysrgb&w=600" /> */}
          <div style={{ backgroundColor: colour }} className={"align-middle flex justify-center items-center flex-1 text-md text-white"}>
            <span>{userInitials}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Avatar