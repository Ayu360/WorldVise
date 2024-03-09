import { useEffect, createContext, useContext, useReducer } from "react";

const CitiesContext = createContext();

const SERVER_ADD="http://localhost:9000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: ""
}

function reducer(state, action){
  switch(action.type){
    case "loading":
      return {
        ...state, isLoading: true,
      }
    case "cities/loaded":
      return {
        ...state, isLoading: false, cities: action.payload,
      }
    case "city/loaded":
      return {
        ...state, isLoading:false, currentCity: action.payload,
      }
    case "city/created":
      return {
        ...state, isLoading:false, cities: [...state.cities, action.payload], currentCity: action.payload,
      }
    case "city/deleted":
      return {
        ...state, isLoading:false, cities: state.cities.filter(city=>city.id!==action.payload), currentCity: {},
      }
    case "rejected":
      return {
        ...state, isLoading: false, error: action.payload,
      }
    default:
      throw new Error("Unknown action type")
  }

}

function CitiesProvider({children}){
  const [{currentCity, cities, isLoading}, dispatch]=useReducer(reducer, initialState);
  

  useEffect(function(){
    async function citiesData(){
      dispatch({type:"loading"});
      try{
      const res = await fetch(`${SERVER_ADD}/cities`);
      const data = await res.json();
      dispatch({type:"cities/loaded", payload:data});
      }catch(e){
        dispatch({type:"rejected",payload:"There was an error fetching the cities in citiesData!"})
      }
    }
    citiesData();
  },[])

  async function getCity(id){
    if(Number(id)===currentCity.id){
      return;
    }
    dispatch({type:"loading"});
    try{
    const res = await fetch(`${SERVER_ADD}/cities/${id}`);
    const data = await res.json();
    dispatch({type:"city/loaded", payload: data});
    }catch(e){
      dispatch({type:"rejected",payload:"There was an error fetching the city in getCity!"})
    }
  }

  async function createCity(newCity){
    dispatch({type:"loading"});
    try{
    const res = await fetch(`${SERVER_ADD}/cities`,{
      method: "POST",
      body: JSON.stringify(newCity),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const data = await res.json();
    dispatch({type:"city/created",payload:data});
    }catch(e){
      dispatch({type:"rejected",payload:"There was an error creating new city in createCity!"})
    }
  }

  async function deleteCity(id){
    dispatch({type:"loading"});
    try{
    await fetch(`${SERVER_ADD}/cities/${id}`,{
      method: "DELETE",
    });
    
    dispatch({type:"city/deleted", payload:id});
    }catch(e){
      dispatch({type:"rejected",payload:"There was an error deleting city in deleteCity!"})
    }
  }

  return <CitiesContext.Provider value={{
    cities, 
    isLoading, 
    currentCity, 
    getCity,
    createCity,
    deleteCity,
  }}>{children}</CitiesContext.Provider>
}

function useCities(){
    const context = useContext(CitiesContext);
    
    //the error will occur if we used usecities anywhere outside <CitiesContext.Provider>
    //In this application since everything (except the <App/>) is inside the <CitiesContext.Provider/>,
    //There won't be any such error. But we will cause error, if we used useCities() in the non-render logic
    //(state logic) of <App/> component.
    if(context === undefined) throw new Error("useContext is used outside the CitiesProvider");
    
    return context;
}

export {CitiesProvider, useCities};