import './App.css'
import { Routes, Route } from "react-router-dom";
import { SignUpForm } from "./components/UserProfile/SignUpForm/SignUpForm"
import { NavBar } from './components/NavBar/NavBar.tsx';


function App() {

  return (
    <>
      <main>
        <NavBar />
        <Routes>
          <Route path="/signup" element={<SignUpForm />} />
        </Routes>
      </main>
    </>
  )
}

export default App
