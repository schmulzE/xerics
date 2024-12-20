import { useState, useEffect } from 'react';

const Tab = ({ tabs, tabContainerClass, tabContentClass, tablistClass, tabClass, activeTabClass, tabButtonClass }) => {
  const [activeTab, setActiveTab] = useState(() => {
    // Load active tab from localStorage if available
    const storedActiveTab = localStorage.getItem('activeTab');
    const parsedTab = storedActiveTab ? parseInt(storedActiveTab, 10) : 0;
    return parsedTab < tabs.length ? parsedTab : 0;
  });

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  useEffect(() => {
    // Save active tab to localStorage
    localStorage.setItem('activeTab', activeTab.toString());
  }, [activeTab])

  return (
    <>
      <div className={tabContainerClass }>
        <ul className={tablistClass} role='tablist'>
          <li role='tab' className={tabClass}>
            {tabs.map((tab, index) => (
              <button
                aria-current="tab"
                key={index}
                onClick={() => handleTabClick(index)}
                className={index === activeTab ? activeTabClass : tabButtonClass + ' capitalize'}
              >
                {tab.title}
              </button>
            ))}
          </li>
        </ul>
      </div>
      <div className={tabContentClass}>
        {tabs.length > 0 && tabs[activeTab] ? tabs[activeTab].content : null}
      </div>
    </>
  );
};

export default Tab;
