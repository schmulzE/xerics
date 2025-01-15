const SearchInputWithIcon = ({query, setQuery, placeholder}) => {
  return (
    <div className='bg-base-100 flex border border-gray-300 items-center p-1'>
      <i className='pi pi-search align-middle items-baseline text-gray-400 p-2'></i>
      <input 
      className='outline-none text-sm bg-base-100' 
      placeholder={placeholder} 
      id="search-project"
      value={query}
      onChange={(e) => setQuery(e.target?.value.trimStart())}
      />
    </div>
  )
}

export default SearchInputWithIcon;