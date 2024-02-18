
import './App.css'
import { Routes, Route } from "react-router-dom";
import { SignUpForm } from "./components/UserProfile/SignUpForm"


function App() {

  return (
    <main>

      <Routes>
        <Route path="/" element={<SignUpForm />} />
      </Routes>
    </main>
  )
}

export default App
