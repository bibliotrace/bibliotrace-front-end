import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Genre from "../pages/MobileGenrePage.jsx";
import Age from "../pages/MobileAgePage.jsx";
import SearchPage from "../pages/Search";
import SuggestPage from "../pages/SuggestPage";
import NotFound from "../pages/NotFound";
import Cookies from "js-cookie";
import Filter from "../pages/MobileFilterPage.jsx";

import Login from "../pages/Login";
import AdminHome from "../pages/AdminHome";
import AddScannedBooks from "../pages/AddScannedBooks";
import RemoveBook from "../pages/RemoveBook.jsx";
import Checkout from "../pages/BookCheckOut.jsx";
import CheckIn from "../pages/BookCheckIn.jsx";
import ShoppingList from "../pages/ShoppingList.jsx";
import RestockList from "../pages/RestockList.jsx";
import SetLocation from "../pages/SetLocation.jsx";
import CreateUser from "../pages/CreateNewUser.jsx";
import ManageLocations from "../pages/ManageLocations.jsx";

const AppRoutes = () => {
  const getToken = () => {
    const tokenString = Cookies.get("jwtData");
    if (tokenString == null) {
      return null;
    } else {
      return JSON.parse(tokenString);
    }
  };

  const checkJwtIsExpired = (expirationString) => {
    const currentTime = Math.floor(Date.now() / 1000);
    if (Number(expirationString) < currentTime) {
      Cookies.remove("jwtData");
      Cookies.remove("authToken");
      return true;
    } else {
      // console.log(expirationString);
      // console.log(currentTime);
      return false;
    }
  };

  const PublicRoute = () => {
    const token = getToken();
    if (token == null || token.userRole == null || checkJwtIsExpired(token.exp)) {
      return <Navigate to="/login" />;
    } else {
      return <Outlet />;
    }
  };

  const PrivateRoute = () => {
    const token = getToken();
    if (token == null || token.userRole == null || checkJwtIsExpired(token.exp)) {
      return <Navigate to="/login" />;
    } else if (String(token.userRole.roleType) === "Admin") {
      return <Outlet />;
    } else {
      return <Navigate to="/" />;
    }
  };

  return (
    <Router basename={"/"}>
      {/*PLEASE do not change the basename, the default name is what the deployment pipeline expects.-->*/}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PublicRoute />}>
          {/*public pages*/}
          <Route path="/" element={<Home />} />
          <Route path="/genre" element={<Genre />} />
          <Route path="/age" element={<Age />} />
          <Route path="/filter" element={<Filter />} />
          <Route path="/suggest" element={<SuggestPage />} />
          <Route path="/search" element={<SearchPage />} />
          {/*private pages*/}
          <Route element={<PrivateRoute />}>
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/add-scanned" element={<AddScannedBooks />} />
            <Route path="/remove-book" element={<RemoveBook />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
            <Route path="/restock-list" element={<RestockList />} />
            <Route path="/set-location" element={<SetLocation />} />
            <Route path="/manage-locations" element={<ManageLocations />} />
            <Route path="/create-user" element={<CreateUser />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
