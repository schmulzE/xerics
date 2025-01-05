import NoNotification from '../../../src/assets/images/no-notifications.png';

const Notifications = ({notifications, markAsRead}) => {

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const datePart = date.toLocaleDateString('en-US', options);
    const timePart = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  
    return `${datePart} at ${timePart}`;
  }


  return (
    <>
     { notifications.length > 0 ? (notifications.map((notification) => (
        <ul key={notification.id} className='bg-base-100 z-50 h-72 flex flex-col border-t space-y-2 shadow-md overflow-y-auto'>
          <li style={{ opacity: notification.read ? 0.5 : 1 }} className='border-l-4 border-l-blue-500 p-2 bg-base-200/10'>
            <div className='flex justify-between'>
              <h6 className='text-sm font-semibold'>{notification.title}</h6>
              <span className='text-xs'>{formatDate(notification.created_at)}</span>
            </div>
            <div className="flex items-center">
              <p className='text-xs'>{notification.message}</p>
              {!notification.read && (
                <button className='text-xs text-blue-500' onClick={() => markAsRead(notification.id)}>Mark as Read</button>
              )}
            </div>
          </li>
        </ul>
        ))) : 
        ( <div className='p-4 h-72 rounded-md justify-center content-center flex flex-col items-center gap-y-2'>
            <img src={NoNotification} className='w-24'/>
            <h1 className='capitalize'>no notification</h1>
          </div>
        )
      } 
    </>
  )
}

export default Notifications;