import './App.css'
import { Routes, Route } from "react-router-dom";
import { LoginSignUp } from "./components/UserProfile/LoginSignUp/LoginSignUp.tsx"
import { NavBar } from './components/NavBar/NavBar.tsx';
import { HomePage } from './components/HomePage/HomePage.tsx'; 

function App() {

  return (
    <>
      <main>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login-signup" element={<LoginSignUp />} />
        </Routes>
      </main>
    </>
  )
}

export default App
