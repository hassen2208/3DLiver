import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/home/Home'
import Quiz from './pages/quiz/Quiz'
import QuizHistory from './pages/quiz/QuizHistory'
import PublicResults from './pages/quiz/PublicResults'
import NotFound from './pages/not-found/NotFound'
import Contact from './pages/contact/Contact'
import Resources from './pages/resources/Resources'
import AboutUs from './pages/about-us/AboutUs'
import Liver from './pages/liver/Liver'
import LiverCancer from './pages/liver/liver-cancer/LiverCancer'
import ViralHepatitis from './pages/liver/viral-hepatitis/ViralHepatitis'
import Layout from './layout/Layout'
import LiverCirrhosis from './pages/liver/liver-cirrhosis/LiverCirrhosis'
import FattyLiver from './pages/liver/fatty-liver/FattyLiver'
import Login from './pages/auth/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/SupabaseAuthContext'


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Authentication routes without Layout */}
          <Route path='login' element={<Login/>}/>
          
          {/* Main application routes with Layout */}
          <Route path='/*' element={
            <Layout>
              <Routes>
                <Route index path='/' element = {<Home/>}/>
                <Route path='quiz' element = {
                  <ProtectedRoute>
                    <Quiz/>
                  </ProtectedRoute>
                }/>
                <Route path='quiz-history' element = {
                  <ProtectedRoute>
                    <QuizHistory/>
                  </ProtectedRoute>
                }/>
                <Route path='resultados-publicos' element={<PublicResults/>}/>
                <Route path='contacto' element={<Contact/>}/>
                <Route path='recursos' element={<Resources/>}/>
                <Route path='sobre-nosotros' element={<AboutUs/>}/>
                <Route path='higado' element = {<Liver/>}/>
                <Route path='higado/cancer-higado' element = {<LiverCancer/>}/>
                <Route path='higado/hepatitis-viral' element = {<ViralHepatitis/>}/>
                <Route path='higado/cirrosis-hepatica' element = {<LiverCirrhosis/>}/>
                <Route path='higado/higado-graso' element = {<FattyLiver/>}/>
                <Route path='*' element = {<NotFound/>}/>
              </Routes>
            </Layout>
          }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
