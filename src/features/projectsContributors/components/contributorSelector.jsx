import supabase from "../../../lib/supabase";
import { useEffect, useRef, useState } from "react"; 
import { getUserInitials, stringToColour } from "@/utils/stringUtils";

const ContributorSelector = ({
  selected,
  setSelected,
}) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contributors, setContributors] = useState([]);

  const inputRef = useRef(null);

  useEffect(() => {
    const fetchData = async (query) => {
      try {
        setMenuOpen(true);
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select()
          .textSearch('firstname', query);
        if (!error && data) {
          setContributors(data);
        }
      } catch (error) {
        throw new Error("Error fetching contributors:", error);
      } finally {
        setLoading(false);
      }
    };

    const debouncedFetchData = debounce(fetchData, 500);

    if (query) {
      debouncedFetchData(query);
    } else {
      setContributors([]);
    }
  }, [query]);

  const toggleContributor = (contributor) => {
    setSelected(prev => 
      prev.some(c => c.id === contributor.id)
        ? prev.filter(c => c.id !== contributor.id)
        : [...prev, contributor]
    );
  }

  return (
    <div className="relative w-full space-y-2">
      <ul className="flex flex-wrap gap-2">
        {selected?.map((contributor) => { 
        

        if(contributor.role == 'admin') return null;

        const id = contributor.id || contributor.profiles?.id;
        const firstname = contributor.firstname || contributor.profiles?.firstname;
        const lastname = contributor.lastname || contributor.profiles?.lastname;
        
          
        return(
          <li key={id} className="inline-flex items-center gap-x-1 bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
            <span>{firstname} {lastname}</span>
              <button
              className="h-4 w-4"
              onClick={() => toggleContributor(id)}
            >
              <span className="sr-only">Remove {firstname}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </li>
        )})}
      </ul>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value.trimStart())}
          placeholder="Search contributors"
          className="pl-10 w-full py-2 outline-base-300 border"
          onFocus={() => setMenuOpen(true)}
          onBlur={() => setTimeout(() => setMenuOpen(false), 200)}
        />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
      </div>
      {menuOpen && (
        <div className="absolute z-10 w-full bg-background border rounded-md shadow-lg mt-1">
            {loading ? (
              <div className="p-2 text-muted-foreground bg-base-100">Loading...</div>
            ) : contributors.length > 0 ? (
              <ul className="p-2 space-y-1 bg-base-100">
                {contributors.map((contributor) => (
                  <li
                    key={contributor.id}
                    className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => toggleContributor(contributor)}
                  >
                    <div className="flex items-center gap-x-2 z-10">
                      <div className="avatar">
                        { contributor.avatar ? <img src={contributor.avatar || undefined} alt={contributor.firstname} /> :
                          <span className="flex w-7 h-7 rounded-full content-center flex-1 justify-center items-center" style={{ backgroundColor: stringToColour(contributor.firstname) }}>
                            {getUserInitials(contributor.firstname)}
                          </span>
                        }
                      </div>
                      <span className="capitalize">{contributor.firstname} {contributor.lastname}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selected.some(s => s.id === contributor.id)}
                      onChange={() => toggleContributor(contributor)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-2 text-grsy-foreground bg-base-100">No contributors found</div>
            )}
        </div>
      )}
    </div>
  );
};

function debounce(func, wait = 500) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default ContributorSelector;