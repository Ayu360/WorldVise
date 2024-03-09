import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../contexts/FakeAuthContext";
import Button from "../components/Button";

import PageNav from "../components/PageNav";
import styles from "./Login.module.css";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("Ayush@example.com");
  const [password, setPassword] = useState("qwerty2");
  
  const {isAuthenticated,login}=  useAuth(); 

  useEffect(function(){
    if(isAuthenticated) navigate("/app", { replace:
      true });      
  },[isAuthenticated, navigate])

  function handleSubmit(e){
    e.preventDefault();
    
    if(email && password) login({email,password})
    
  }

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
