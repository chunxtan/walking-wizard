import './App.css'
import { Routes, Route } from "react-router-dom";
import { LoginSignUp } from "./components/UserProfile/LoginSignUp/LoginSignUp.tsx"
import { NavBar } from './components/NavBar/NavBar.tsx';
import { HomePage } from './components/HomePage/HomePage.tsx'; 
import { LoginUserStore } from './components/UserProfile/LoginSignUp/LoginUserStore.ts'; 

function App() {
  const userStore = new LoginUserStore();

  return (
    <>
      <main>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login-signup" element={<LoginSignUp userStore={userStore} />} />
        </Routes>
      </main>
    </>
  )
}

export default App
