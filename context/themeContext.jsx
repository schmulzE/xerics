import{ useState, createContext, useContext, useEffect} from 'react';

const ThemeContext = createContext(undefined);

const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const localTheme = localStorage.getItem('theme');
    document.querySelector('html').setAttribute('data-theme', localTheme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevState =>  (prevState ==  'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  )
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}


// eslint-disable-next-line react-refresh/only-export-components
export { ThemeProvider, useTheme};