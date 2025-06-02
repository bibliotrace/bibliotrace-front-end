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
      <NavBar useDarkTheme={true} showTitle={false} showNavButtons={true} back={true}></NavBar>

      <h1 className="text-center print:text-xl">Restock List</h1>

      <div className="w-[80%] mx-auto">
        &nbsp;
        <button className="print:hidden border-black float-right" onClick={window.print}>
          Print Report
        </button>
      </div>

      <div className="flex flex-col w-full items-center">
        <ul className="flex-grow w-[80%] border mt-2 h-[70vh] bg-white p-10 overflow-y-scroll print:border-none print:w-full print:p-0 print:overflow-visible">
          {restockList.map((obj) => {
            return (
              <li className="flex flex-row justify-between items-center mb-5">
                <p className="text-lg">
                  {obj.book_title} by {obj.author} - {obj.quantity > 0 ? obj.quantity : "from Shopping List"}
                </p>
                <div>
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
