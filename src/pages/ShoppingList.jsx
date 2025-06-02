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

  async function printReport(e) {
    e.preventDefault();
    window.print();
  }

  return (
    <div className="search-bg h-full w-full">
      <NavBar useDarkTheme={true} showTitle={false} showNavButtons={true} back={true}></NavBar>

      <h1 className="text-center print:text-xl">Shopping List</h1>

      <div className="w-[80%] mx-auto">
        &nbsp;
        <button className="print:hidden border-black rounded float-right" onClick={(e) => { printReport(e) }}>
          Print Report
        </button>
      </div>

      <div className="flex flex-col w-full items-center">
        <ul className="flex-grow w-[80%] border mt-2 h-[70vh] bg-white p-10 overflow-y-scroll print:border-none print:w-full print:p-0 print:overflow-visible">
          {shoppingList.map((obj) => {
            return (
              <li className="flex flex-row justify-between items-center mb-5">
                <p className="text-lg">
                  {obj.book_title} by {obj.author}
                </p>
                <div className="flex flex-row no-wrap">
                  <button className="border-black print:hidden" onClick={() => handleMoveToRestock(obj.id)}>
                    Move to Restock
                  </button>
                  <button className="ml-5 border-black print:hidden" onClick={() => handleRemove(obj.id)}>
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
