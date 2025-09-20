import Home from './pages/home/Home';
import Projects from './pages/projects/Projects';
import DesignStudio from './pages/designStudio/DesignStudio';
import FashionStudio from './pages/fashionStudio/FashionStudio';
import VideoStudio from './pages/videoStudio/VideoStudio';
import { BrowserRouter, Routes, Route } from 'react-router';
import { useAuth } from 'react-oidc-context';
import Header from './components/common/Header';
import HomeLayout from './pages/home/HomeLayout';
import Generations from './pages/generations/Generations';
import Templates from './pages/templates/Templates';
import proshootaiLogo from '/proshootai-dark-mode.svg';
import ProfilePage from './pages/Profile/Profile';
import { useLogout } from './features/auth/hooks/useLogout';
import Subscription from './pages/subscription/Subscription';

function App() {
  const auth = useAuth();

  const { handleLogout } = useLogout();

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950"></div>
    );
  }

  if (auth.isAuthenticated) {
    return (
      <div className="w-screen h-screen flex flex-col overflow-hidden">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<HomeLayout />}>
              <Route index element={<Home />} />
              <Route path="projects" element={<Projects />} />
              <Route path="generations" element={<Generations />} />
              <Route path="templates" element={<Templates />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="susbsription" element={<Subscription />} />
            </Route>
            <Route path="studios">
              <Route index element={<Projects />} />
              <Route path="design-studio/:id" element={<DesignStudio />} />
              <Route path="fashion-studio/:id" element={<FashionStudio />} />
              <Route path="video-studio/:id" element={<VideoStudio />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="bg-neutral-900 p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img
            src={proshootaiLogo}
            alt="proshootai logo"
            className="w-32 h-32"
            draggable="false"
          />
        </div>

        <h1 className="text-neutral-50 text-3xl font-bold text-center mb-8">
          Welcome Back
        </h1>

        <div className="space-y-4">
          <button
            onClick={() => auth.signinRedirect()}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-neutral-900 font-medium">
              Continue with Google
            </span>
          </button>

          <button
            onClick={() => handleLogout()}
            className="w-full py-3 px-4 border border-neutral-50 text-neutral-50 hover:bg-neutral-50 hover:text-neutral-950 font-semibold rounded-lg transition-colors duration-200"
          >
            Sign out
          </button>
        </div>

        <p className="mt-6 text-center text-neutral-50 text-sm opacity-80">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default App;
