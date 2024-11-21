import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Auth/authContext";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import router from "./routes/router";

const App = () => {
  return (
    <AuthProvider>
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
