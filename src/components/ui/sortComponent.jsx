import Dropdown from './dropdown';

function SortComponent({setSortConfig}) {

  return (
    <div className="flex items-center gap-2">
      <Dropdown
      type="select"
      icon="pi pi-sort-alt"
      tooltipText="sort by"
      options={['Alphabetical', 'Due date']}
      onSelect={(selected) => {
        setSortConfig((prev) => {
          const updated = { ...prev, sortBy: selected.toLowerCase() };
          return updated;
        });
      }}
      />
      {/* <Dropdown 
      type="select"
      icon="pi pi-sort-amount-up-alt"
      tooltipText="sort order"
      options={['Ascending', 'Descending']}
      onSelect={(selected) => {
        setSortConfig((prev) => {
          const updated = { ...prev, sortOrder: selected };
          return updated;
        });
      }}
      /> */}
    </div>
  );
}

export default SortComponent;