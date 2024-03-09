import Spinner from "./Spinner"
import styles from './CountryList.module.css'
import CountryItem from "./CountryItem"
import Message from "./Message"
import { useCities } from "../contexts/CitiesContext"


function CountryList() {
    const {cities, isLoading} = useCities()

    if(isLoading) return <Spinner/>
    if(!cities) return <Message message="Add your first visited 
    city by clicking on the city on the map"/>

    const countries = cities.reduce((arr, city)=>{
        if(!arr.map((el)=>el.country).includes(city.country))
        return [...arr, {country: city.country, emoji: city.emoji}]
        else return arr;
    },[])

    return (
        <ul className={styles.countryList}>
            {
                countries.map((country, idx)=><CountryItem country={country} key={idx}/>)
            }
        </ul>
    )
}
 
export default CountryList;
