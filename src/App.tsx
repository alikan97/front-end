import Header from './views/components/header';
import { Route, Routes } from 'react-router-dom';
import {AllItemsPage,RequestItemPage, MyItemsPage, LoginPage, RegisterPage} from './views/pages/index';
import { useAuth } from './hooks/use-auth';
import { AuthStatus } from './types/auth';

function App() {
  const {state} = useAuth();

  return (
    <div className="App font-main">
      <Header />
      <Routes>
        <Route path="/" element={<AllItemsPage/>}/>
        <Route path="/create-item" element={<RequestItemPage/>}/>
        {state?.status === AuthStatus.AUTHENTICATED ? 
        <Route path='/add-role' element={<MyItemsPage/>}/>
        : null}
        <Route path="/login" element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
