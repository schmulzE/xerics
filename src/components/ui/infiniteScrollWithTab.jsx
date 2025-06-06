import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useTheme } from "../../../context/themeContext";
import ProjectList from '../../features/projects/components/projectList';
import ProjectToolbar from '../../features/projects/components/projectToolbar';
import { useInfiniteScroll } from '../../features/projects/hooks/useInfiniteScroll';

const TABS = ['all', 'todo', 'in progress', 'in review', 'done'];

const InfiniteScrollWithTab = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [ searchQuery, setSearchQuery ] = useState("");
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'alphabetical', // Default sort by alphabetical order
  });
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetching, 
    isLoading, 
    isError
   } = useInfiniteScroll('projects',undefined, activeTab, searchQuery, sortConfig);

  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    }
  });

  // Flatten the pages to check if there are any projects
  const allPosts = data?.pages.flatMap(page => page.data) || [];
  const totalPosts = allPosts.length;

  // Render methods for different states
  const renderContent = () => {
    // Loading state
    if (isLoading) {
      return (
        <div className="text-center p-8 my-auto">
          <span className='pi pi-spin pi-spinner text-gray-500 text-3xl'></span>
        </div>
      );
    }

    // Error state
    if (isError) {
      return (
        <div className="text-center p-4 lg:p-16">
          <p>Error loading projects. Please try again later.</p>
        </div>
      );
    }

    // No projects state
    if (totalPosts === 0) {
      return (
        <div className="text-center p-4 lg:p-16">
          <p>No projects found in the <span className='uppercase font-medium'>{activeTab}</span> category.</p>
          <p>Check back later or try a different category.</p>
        </div>
      );
    }

    // Posts list
    return (
      <>
        <div className="projects-list">
          {data?.pages.map((page, i) => (
            <React.Fragment key={i}>
              <React.Fragment key={i}>
                <ProjectList projects={page?.data}/>
              </React.Fragment>
            </React.Fragment>
          ))}
        </div>

        {/* Infinite Scroll Trigger */}
        {hasNextPage && (
          <div ref={ref} className='text-center' style={{ height: '20px' }}>
            <span className='pi pi-spin pi-spinner text-gray-500 text-3xl'></span>
          </div>
        )}
      </>
    );
  };


  return (
    <div>
      <div className="flex justify-between">
        {/* Tab Navigation */}
        <div className="tabs tabs-boxed bg-base-100 border border-gray-300 w-[300] lg:w-[440px] capitalize">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? `${theme == 'dark' ? `bg-[#191E24] text-blue-500` : 'bg-blue-100 text-blue-400'} tab capitalize` : 'tab capitalize hover:text-blue-400 px-2.5 lg:px-4'}
              >
              {tab}
            </button>
          ))}
        </div>
        <ProjectToolbar setSearchQuery={setSearchQuery} sortConfig={sortConfig} setSortConfig={setSortConfig}/>
      </div>

      {renderContent()}

      {isFetching && !isLoading && <div>Refreshing...</div>}
    </div>
  );
};

export default InfiniteScrollWithTab;