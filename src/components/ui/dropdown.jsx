/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Dropdown = ({
  type = 'filter', // 'filter', 'select', or 'action'
  options = [], // for select and filter types
  buttonContent, // custom button content
  icon, // icon for the button
  tooltipText,
  tooltipPosition = 'top',
  className = '',
  onSelect, // callback for selection
  activeFilter, // for filter type to highlight active item
  actionItems, // for action type (edit/delete)
  actionProps // additional props for action items
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const renderFilterDropdown = () => (
    <div className={`dropdown ${className}`}>
      <button 
        tabIndex={0} 
        className='p-2 w-24 bg-base-100 rounded-md border border-gray-300'
        onClick={toggleDropdown}
      >
        <i className='pi pi-sliders-h mx-2 align-middle'></i>
        <span>Filter</span>
      </button>
      {isOpen && (
        <ul 
          tabIndex={0} 
          className="dropdown-content menu bg-base-100 rounded-box z-[1] right-0 w-52 p-2 shadow"
        >
          {options.map((option, index) => (
            <li 
              key={index} 
              className={activeFilter === option.value ? 'bg-base-300 text-blue-500' : ''}
            >
              <a 
                className='hover:text-blue-500' 
                onClick={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderSelectDropdown = () => (
    <details 
      className={`dropdown dropdown-left dropdown-bottom ${className}`}
      open={isOpen}
      onClick={(e) => {
        e.preventDefault();
        toggleDropdown();
      }}
    >
      <summary 
        tabIndex={0} 
        className="m-1 btn btn-md py-0 px-1.5 rounded-md"
      >
        <div 
          className={`tooltip tooltip-${tooltipPosition} capitalize`} 
          data-tip={tooltipText}
        >
          <i className={`${icon} align-middle text-gray-400`}></i>
        </div>
      </summary>
      {isOpen && (
        <ul 
          tabIndex={0} 
          className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-48 capitalize"
        >
          {options.map((option, index) => (
            <li key={index}>
              <a onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}>{option}</a>
            </li>
          ))}
        </ul>
      )}
    </details>
  );

  const renderActionDropdown = () => (
    <details 
      className="dropdown"
      open={isOpen}
      onClick={(e) => {
        e.preventDefault();
        toggleDropdown();
      }}
    >
      <summary className="btn btn-sm bg-transparent border-0 p-1 m-1">
        <i className={`pi ${icon}`}></i>
      </summary>
      {isOpen && (
        <ul className="menu dropdown-content bg-base-100 rounded-box capitalize z-[1] w-52 p-2 shadow">
          {actionItems.map((item, index) => (
            <li key={index}>
              {item.link ? (
                <Link to={item.link}>{item.label}</Link>
              ) : (
                <a onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}>{item.label}</a>
              )}
            </li>
          ))}
        </ul>
      )}
    </details>
  );

  switch (type) {
    case 'filter':
      return renderFilterDropdown();
    case 'select':
      return renderSelectDropdown();
    case 'action':
      return renderActionDropdown();
    default:
      return null;
  }
};

export default Dropdown;