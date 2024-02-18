import './App.css'
import { Routes, Route } from "react-router-dom";
import { SignUpForm } from "./components/UserProfile/SignUpForm/SignUpForm"
import { NavBar } from './components/NavBar/NavBar.tsx';
import { HomePage } from './components/HomePage/HomePage.tsx'; 

function App() {

  return (
    <>
      <main>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Routes>
      </main>
    </>
  )
}

export default App
