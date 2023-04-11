import './App.css';
import Dashboard from './components/Dashboard';
import { useState, createContext } from "react";
import { Layout } from 'antd';

export const UserContext = createContext(null);

function App() {
  const [loadTable, setLoadTable] = useState(false);
  return (
    <UserContext.Provider
      value={{
        // logged,
        // setLogged,
        // emailAuthUserObj,
        // setEmailAuthUserObj,
        // googleUserObj,
        // setGoogleUserObj,
        // loggedEmail,
        // setLoggedEmail,
        // selectedId,
        // setSelectedId,
        loadTable,
        setLoadTable,
      }}
    >
      <Layout>
        <Dashboard />
      </Layout>
    </UserContext.Provider>    
  );
}

export default App;
