import SortComponent from "../../../components/ui/sortComponent";
import SearchInputWithIcon from "../../../components/shared/searchInput";
export default function projectToolbar({ setSortConfig, searchQuery, setSearchQuery}) {

  return (
    <div className='hidden lg:flex gap-x-1 absolute -top-1.5 right-0 items-center'>
      <SearchInputWithIcon searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>

      <SortComponent setSortConfig={setSortConfig}/>
    </div> 
  )
}

