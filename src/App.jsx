import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { CitiesProvider } from "./contexts/CitiesContext"
import { AuthProvider } from "./contexts/FakeAuthContext"

import HomePage from "./pages/Homepage"
import Pricing from "./pages/Pricing"
import Product from "./pages/Product"
import Login from "./pages/Login"
import AppLayout from "./pages/AppLayout";
import PageNotFound from "./pages/PageNotFound"

import CityList from "./components/CityList"
import CountryList from "./components/CountryList"
import City from "./components/City"
import Form from "./components/Form"
import ProtectedRoutes from "./pages/ProtectedRoutes"




function App() {
  
  return (
      <CitiesProvider>
        <BrowserRouter>
          <AuthProvider>
          <Routes>
            <Route index element={<HomePage/>}/>
            <Route path="pricing" element={<Pricing/>}/>
            <Route path="product" element={<Product/>}/>
              <Route path="login" element={<Login/>}/>
              <Route path="app" 
              element={
                <ProtectedRoutes>
                  <AppLayout/>
                </ProtectedRoutes>
              }>
                    <Route 
                      index 
                      element={<Navigate repalce to="cities"/>}/>
                    <Route 
                      path="cities" 
                      element={<CityList />}/>
                    <Route 
                      path="cities/:id" 
                      element={<City/>}
                      />
                    <Route 
                      path="countries" 
                      element={<CountryList />}
                      />
                    <Route 
                      path="form" 
                      element={<Form/>}
                      />
              </Route>
            <Route path="*" element={<PageNotFound/>}/>
          </Routes>
          </AuthProvider>
        </BrowserRouter>
      </CitiesProvider>
    
  )
}

export default App
