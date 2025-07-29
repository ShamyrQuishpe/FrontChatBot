import {BrowserRouter,Routes,Route} from 'react-router-dom'

import {Login}  from './Pages/Login'
import { AuthProvider } from './context/AuthProvider'
import Dashboard from './Layout/Dashboard'
import Products from './Pages/Products'
import Categories from './Pages/Categories';
import Clients from './Pages/Clients';
import Tradein from './Pages/Tradein'

function App () {
  return (
    <>
    <BrowserRouter>
       <AuthProvider>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="products" element={<Products/>} />
            <Route path="categories" element={<Categories/>} />
            <Route path="clients" element={<Clients/>} />
            <Route path="tradein" element={<Tradein/>} />
          </Route>
        </Routes>
        </AuthProvider>
    </BrowserRouter>
    </>
  )
}

export default App