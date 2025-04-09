import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import tailwindConfig from "../../tailwind.config";
import Cookies from "js-cookie";

export default function RestockList() {
  const [restockList, setRestockList] = useState([]);

  useEffect(() => {
    getRestockList();
  }, []);

  async function getRestockList() {
    try {
      const response = await fetch("http://localhost:8080/api/report/restock-list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
      });
      const data = await response.json();
      if (data.object) {
        console.log(data.object);
        setRestockList(data.object);
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async function handleRemove(book_id) {
    try {
      const response = await fetch("http://localhost:8080/api/report/restock-list", {
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
        getRestockList();
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
      <h1 className="text-center">Restock List</h1>
      <div className="flex flex-column w-full justify-center">
        <ul className="flex-grow max-w-[80%] lg:max-w-[900px] bg-white border mt-10 h-[70vh] p-10 overflow-y-scroll">
          {restockList.map((obj) => {
            return (
              <li className="flex flex-row justify-between items-center mb-5">
                <p className="text-lg">
                  {obj.book_title} by {obj.author} - {obj.quantity > 0 ? obj.quantity : "from Shopping List"}
                </p>
                <div>
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
