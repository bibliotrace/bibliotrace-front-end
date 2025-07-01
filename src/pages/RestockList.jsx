import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import tailwindConfig from "../../tailwind.config";
import Cookies from "js-cookie";
import useSorttable from "../components/useSorttable";

export default function RestockList() {
  const [restockList, setRestockList] = useState([]);

  useEffect(() => {
    getRestockList();
  }, []);

  useSorttable();

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
          <table className="sortable border w-full print:text-xs">
            <thead>
              <tr>
                <th className="border hover:cursor-pointer">Title</th>
                <th className="border hover:cursor-pointer">Author</th>
                <th className="border hover:cursor-pointer">Genre</th>
                <th className="border hover:cursor-pointer print:hidden"></th>
              </tr>
            </thead>
            <tbody>
              {restockList.map((entry) => {
                return (
                  <>
                    <tr className="hover:bg-gray">
                      <td className="border p-5 text-center print:p-2">{entry.book_title}</td>
                      <td className="border p-5 text-center print:p-2">{entry.author}</td>
                      <td className="border p-5 text-center print:p-2">{entry.genre_name}</td>
                      <td className="border p-5 text-center print:hidden">
                        <button className="ml-5 border-black print:hidden" onClick={() => handleRemove(entry.id)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </ul>
      </div>

      {/* <div className="flex flex-col w-full items-center">
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
      </div> */}
    </div>
  );
}
