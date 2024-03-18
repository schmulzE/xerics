import { useEffect, useRef, useState } from "react";
import supabase from "../lib/supabase";

const MultiSelect = ({contributors, setContributors}) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false)

  const inputRef = useRef(null);

  useEffect(() => {
    const fetchData = async (query) => {
      try {
        setMenuOpen(true)
        setLoading(true);
        const { data, error } = await supabase
        .from('profiles')
        .select()
        .textSearch('username', query)
        if(!error) {
          console.log(data)
          setContributors(data)
        }
      } catch (error) {
        console.log(error);
      }finally {
        setLoading(false);
      }
    }

    function debounce(func, wait = 500) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    }

    const debouncedFetchData = debounce(fetchData, 500);

    
    if (query) {
      debouncedFetchData(query);
    } else {
      setContributors([]); // Clear users if search term is empty
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  // const isDisable =
  //   !query?.trim() ||
  //   selected.filter(
  //     (item) =>
  //       item?.toLocaleLowerCase()?.trim() === query?.toLocaleLowerCase()?.trim()
  //   )?.length;


  const selectContributors = (e) => {
    const { value } = e.target;
    const newSelectedValues = selected.includes(value)
      ? selected.filter((val) => val !== value)
      : [...selected, value];
    setSelected(newSelectedValues);
  }

  return (
      <div className="relative w-full h-auto text-sm">
        <div className="flex items-center justify-between p-3 w-full gap-2.5 border">
          <i className="pi pi-search" />
          <input
            ref={inputRef}
            type="text"
            id="search-box"
            value={query}
            onChange={(e) => setQuery(e.target.value.trimStart())}
            placeholder="Search contributors"
            className="bg-transparent text-sm flex-1 caret-rose-600 outline-none"
            onFocus={() => setMenuOpen(true)}
            onBlur={() => setMenuOpen(false)}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter" && !isDisable) {
            //     setSelected((prev) => [...prev, query]);
            //     setQuery("");
            //   }
            // }}
            onKeyDown={e => e.preventDefault()}
          />
        </div>

        {/* Menu's */}
        {menuOpen ? (
          <div className="bg-base-100 py-2 absolute w-full max-h-52 mt-2 p-1 flex overflow-y-auto scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-slate-200">
            <ul className="w-full">
              {loading ? <li className="p-2 text-gray-500">loading...</li> : (
                // eslint-disable-next-line no-unused-vars
                contributors.map((contributor, i) => (
                  <li
                    key={contributor.id}
                    className="p-2 cursor-pointer hover:bg-blue-50 hover:text-blue-500 rounded-md w-full flex justify-between items-center"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <div className="flex space-x-2 items-center">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                        </div>
                      </div>
                      <span>{contributor.username.replace(/['"]+/g, '')}</span>
                    </div>
                    <input 
                    type="checkbox" 
                    className="w-4 h-4  cursor-pointer" 
                    value={contributor.id} 
                    checked={selected.includes(contributor.id)}
                    onChange={selectContributors}
                    />
                  </li>
                ))
              ) }
            </ul>
          </div>
        ) : null }
      </div>
  );
};

export default MultiSelect;