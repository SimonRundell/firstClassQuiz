import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CMFloatAd from './cmFloatAd';
import { AuthProvider } from './context/AuthContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { AlertProvider } from './context/AlertContext';
import AdminLayout from './components/AdminLayout';
import QuizCodeLanding from './pages/QuizCodeLanding';
import StudentQuiz from './pages/StudentQuiz';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminQuizEditor from './pages/AdminQuizEditor';
import AdminResults from './pages/AdminResults';
import AdminAccounts from './pages/AdminAccounts';
import AdminMyAccount from './pages/AdminMyAccount';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConfirmProvider>
          <AlertProvider>
            <Routes>
              <Route path="/" element={<QuizCodeLanding />} />
              <Route path="/quiz/:token" element={<StudentQuiz />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="quiz/:id" element={<AdminQuizEditor />} />
                <Route path="quiz/:id/results" element={<AdminResults />} />
                <Route path="admins" element={<AdminAccounts />} />
                <Route path="account" element={<AdminMyAccount />} />
              </Route>
            </Routes>
          </AlertProvider>
        </ConfirmProvider>
      </AuthProvider>
      <CMFloatAd />
    </BrowserRouter>
  );
}

export default App;
