import { Link } from 'react-router-dom';

const Breadcrumbs = ({links}) => {
  return (
    <div className="text-sm breadcrumbs">
      <ul>
        {links.map((link, index) => (
          <li key={index}><Link to={link.url}>{link.text}</Link></li> 
        ))}
      </ul>
    </div>
  )
}

export default Breadcrumbs;