import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import tailwindConfig from "../../tailwind.config";
import Cookies from "js-cookie";

export default function ShoppingList() {
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    getShoppingList();
  }, []);

  async function getShoppingList() {
    try {
      const response = await fetch("http://localhost:8080/api/report/shopping-list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
      });
      const data = await response.json();
      if (data.object) {
        setShoppingList(data.object);
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async function handleMoveToRestock(book_id) {
    try {
      const response = await fetch("http://localhost:8080/api/report/shopping-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
        body: JSON.stringify({
          book_id: book_id,
        }),
      });
      if (response.ok) {
        getShoppingList();
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleRemove(book_id) {
    try {
      const response = await fetch("http://localhost:8080/api/report/shopping-list", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
        body: JSON.stringify({
          book_id: book_id,
        }),
      });
      if (response.ok) {
        getShoppingList();
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  return (
    <div className="search-bg h-full w-full">
      <NavBar
        useDarkTheme={true}
        showTitle={false}
        bgColor={tailwindConfig.theme.colors.white}
        showNavButtons={true}
      ></NavBar>
      <h1 className="text-center">Shopping List</h1>
      <div className="flex flex-column w-full justify-center">
        <ul className="flex-grow max-w-[80%] lg:max-w-[900px] border bg-white mt-10 h-[70vh] p-10 overflow-y-scroll">
          {shoppingList.map((obj) => {
            return (
              <li className="flex flex-row justify-between items-center mb-5">
                <p className="text-lg">
                  {obj.book_title} by {obj.author}
                </p>
                <div className="flex flex-row no-wrap">
                  <button className="border-black" onClick={() => handleMoveToRestock(obj.book_id)}>
                    Move to Restock
                  </button>
                  <button className="ml-5 border-black" onClick={() => handleRemove(obj.book_id)}>
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
