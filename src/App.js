import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import CreateBook from "./pages/CreateBook";
import BookStore from "./pages/BookStore";
import EditBook from "./pages/EditBook";
import BookDetail from "./components/BookDetail";
import ClientManage from "./pages/ClientManage";
import CreateFeedback from "./pages/CreateFeedback";
import FeedbackPage from "./pages/FeedbackPage";
import CreateClient from "./pages/CreateClient";
import ClientDetailPage from "./pages/ClientDetailPage";

function App() {
  return (
    <>
      <BrowserRouter>
        {/* <Header /> */}
        <Routes>
          {/* HOME  */}
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
          </Route>

          {/* PROFILE  */}
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* SIGN-IN SIGN-UP FORGET-PASSWORD OFFERS  */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />


          {/* FEEDBACK  */}
          <Route path="/feedback" element={<PrivateRoute />}>
            <Route path="/feedback" element={<FeedbackPage />} />
          </Route>
          <Route path="/create-feedback" element={<PrivateRoute />}>
            <Route path="/create-feedback" element={<CreateFeedback />} />
          </Route>

          {/* BOOK  */}
          <Route path="/book-store" element={<PrivateRoute />}>
            <Route path="/book-store" element={<BookStore />} />
          </Route>
          <Route path="/create-book" element={<PrivateRoute />}>
            <Route path="/create-book" element={<CreateBook />} />
          </Route>
          <Route
            path="/category/:categoryName/:bookId"
            element={<PrivateRoute />}
          >
            <Route
              path="/category/:categoryName/:bookId"
              element={<BookDetail />}
            />
          </Route>
          <Route path="/edit-book" element={<PrivateRoute />}>
            <Route path="/edit-book/:bookId" element={<EditBook />} />
          </Route>

          {/* CLIENT  */}
          <Route path="/create-client" element={<PrivateRoute />}>
            <Route path="/create-client" element={<CreateClient />} />
          </Route>
          <Route path="/client-manage" element={<PrivateRoute />}>
            <Route path="/client-manage" element={<ClientManage />} />
          </Route>
          <Route path="/client-manage/:clientId" element={<PrivateRoute />}>
            <Route path="/client-manage/:clientId" element={<ClientDetailPage />} />
          </Route>


        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
