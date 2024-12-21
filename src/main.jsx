import './index.css';
import App from './App';
import store from './store';
import 'primeicons/primeicons.css';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { persistStore } from "redux-persist";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '../context/themeContext';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


let persistor = persistStore(store);
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Optional: configure default query settings
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <App />
          <Toaster />
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  </ThemeProvider>
)
