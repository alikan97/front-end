import Header from './views/components/header';
import { Route, Routes } from 'react-router-dom';
import {AllItemsPage,RequestItemPage, MyItemsPage, LoginPage, RegisterPage} from './views/pages/index';

function App() {
  return (
    <div className="App font-main">
      <Header />
      <Routes>
        <Route path="/" element={<AllItemsPage/>}/>
        <Route path="/request-item" element={<RequestItemPage/>}/>
        <Route path='/my-items' element={<MyItemsPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
