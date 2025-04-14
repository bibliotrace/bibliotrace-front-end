import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Cookies from "js-cookie";

export default function StockReport() {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    //adds sorttable script
    getStock();
    const scriptEl = document.createElement("script");
    scriptEl.src = "../sorttable.js";
    scriptEl.async = true;
    document.body.appendChild(scriptEl);
    return () => {
      document.body.removeChild(scriptEl);
    };
  }, []);

  async function getStock() {
    try {
      const response = await fetch(`http://localhost:8080/api/report/stock`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
      });
      const data = await response.json();
      if (data.object) {
        setStock(data.object);
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  return (
    <div className="search-bg w-full h-full">
      <NavBar useDarkTheme={true} showTitle={false} showNavButtons={true} back={true}></NavBar>

      <h1 className="text-center print:text-xl">Stock Report</h1>

      <div className="w-[80%] mx-auto">
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
                <th className="border hover:cursor-pointer">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((entry) => {
                return (
                  <>
                    <tr className="hover:bg-gray">
                      <td className="border p-5 text-center print:p-2">{entry.book_title}</td>
                      <td className="border p-5 text-center print:p-2">{entry.author}</td>
                      <td className="border p-5 text-center print:p-2">{entry.quantity}</td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </ul>
      </div>
    </div>
  );
}
