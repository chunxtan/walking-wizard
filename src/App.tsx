import './App.css'
import { Routes, Route } from "react-router-dom";
import { LoginSignUp } from "./components/UserProfile/LoginSignUp/LoginSignUp.tsx"
import { NavBar } from './components/NavBar/NavBar.tsx';
import { HomePage } from './components/HomePage/HomePage.tsx'; 
import { LoginUserStore, UserPayload } from './components/UserProfile/LoginSignUp/LoginUserStore.ts'; 
import { Datasets } from './components/Datasets/Datasets.tsx';
import { useEffect } from 'react';
import { getToken } from './util/security.ts';
import { Scenarios } from './components/Scenarios/Scenarios.tsx';

function App() {
  const userStore = new LoginUserStore();
  
  useEffect(() => {
    const token = getToken();
    const payload: UserPayload = token ? JSON.parse(atob(token.split(".")[1])).payload : null;
    console.log("payload", payload);
    if (payload && payload.email) {
        console.log("payload set");
        userStore.setUser(payload);
    }
  }, [userStore.login]);

  return (
    <>
      <main>
        <NavBar userStore={userStore} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/datasets" element={<Datasets userStore={userStore} />} />
          {/* <Route path="/scenarios" element={<Scenarios userStore={userStore} />} /> */}
          <Route path="/login-signup" element={<LoginSignUp userStore={userStore} />} />
        </Routes>
      </main>
    </>
  )
}

export default App
