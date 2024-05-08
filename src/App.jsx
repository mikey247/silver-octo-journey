// eslint-disable-next-line no-unused-vars
import { useState } from 'react'
import './App.css'
import FilmsList from './assets/pages/FilmsList';
import { BrowserRouter, Route, Routes } from 'react-router-dom'


function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<FilmsList />}/>
        </Routes> 
  </BrowserRouter>
    );
}

export default App
