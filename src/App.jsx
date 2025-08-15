import UserRegister from "./pages/UserRegister"
import { ToastContainer } from 'react-toastify';
import RouteConfig from "./routes/routeConfig";
function App() {
  

  return (
    <>
  <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"
  toastClassName={() =>
    "w-60 h-14 p-2 bg-[#f29f67] text-black rounded-lg shadow-lg" // Tailwind example
  }
  

/>

      <RouteConfig/>
    </>
  )
}

export default App
