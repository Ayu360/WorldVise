// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useUrlPosition } from "../hooks/useUrlPosition";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";

import styles from "./Form.module.css";
import Button from "./Button";
import Spinner from "./Spinner"
import Message from "./Message"

import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";
import ButtonBack from "./ButtonBack";


export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const flagemojiToPNG = (flag) => {
  var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt()).map(char => String.fromCharCode(char-127397).toLowerCase()).join('')
  return (<img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt='flag' />)
}

const BASE_URL="https://api.bigdatacloud.net/data/reverse-geocode-client"

function Form() {
  const [lat, lng] = useUrlPosition();
  const {createCity, isLoading} = useCities()
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false)
  const [geoCodingError, setGeoCodingError] = useState()
  const [emoji, setEmoji] = useState("");
  const x = useRef();

  useEffect(function (){
    if(!lat && !lng) return;
    async function fetchCity(){
      setIsLoadingGeoCoding(true);
      setGeoCodingError("")
      try{
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
        const data= await res.json();
        console.log(data)
 
        if(!data.countryCode) 
        throw new Error("This is not a city. Select some other place!")

        setCityName(data.city || data.locality || "")

        setCountry(data.countryName|| "") 
        x.current=convertToEmoji(data.countryCode);
        setEmoji(flagemojiToPNG(convertToEmoji(data.countryCode)))
        console.log(convertToEmoji(data.countryCode))
      }catch(e){
        setGeoCodingError(e.message);
      }finally{
        setIsLoadingGeoCoding(false);
      }

    }
    fetchCity();
  },[lat, lng])

  async function handleFormSubmit(e){
    e.preventDefault();
    if(!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji: x.current,
      date,
      notes,
      position: {lat, lng},
    }
    await console.log((createCity(newCity)))
    navigate("/app/cities")
  }
  
  if(isLoadingGeoCoding) return <Spinner />
  if(!lat && !lng) return <Message message={"Start by clicking on the map"}/>
  if(geoCodingError) return <Message message={geoCodingError}/>

  return (
    <form className={`${styles.form} ${isLoading?
     styles.loading :"" }`} 
     onSubmit={handleFormSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          onChange={date=>setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack >
          &larr; Back
        </ButtonBack>
      </div>
    </form>
  );
}

export default Form;
