import { Routes, Route } from 'react-router-dom'
//import Album from './components/Album'
import LoginPage from './pages/LoginPage'
import AlbumPage from './pages/AlbumPage'
// import Page from './components/Page'
import './App.css'

function App() {

  return (
    <Routes>
      {/* <Album /> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/album" element={<AlbumPage />} />
      {/* <Page /> */}
    </Routes>
  )
}

export default App
