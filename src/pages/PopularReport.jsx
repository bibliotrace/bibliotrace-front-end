import React, { useState } from "react";
import NavBar from "../components/NavBar";
import ErrorModal from "../modals/ErrorModal";
import Cookies from "js-cookie";
import useSorttable from "../components/useSorttable";

export default function PopularReport() {
  const [popular, setPopular] = useState([]);
  const [message, setMessage] = useState("");
  const [totalCheckouts, setTotalCheckouts] = useState(0);

  useSorttable();

  async function getPopular(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const start_date = formData.get("popular-start");
    const end_date = formData.get("popular-end");

    if (!start_date || !end_date) {
      setMessage("Please enter a date range");
      return;
    }
    if (start_date > end_date) {
      setMessage("Start date cannot be after end date");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/report/popular/${start_date}/${end_date}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
      });
      const data = await response.json();
      if (data.object) {
        setPopular(data.object);
        setTotalCheckouts(data.object.reduce((acc, entry) => acc + entry.num_checkouts, 0));
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
    <div className="search-bg w-full h-full">
      {message ? <ErrorModal description={"Error"} message={message} onExit={() => setMessage("")} /> : <></>}
      <NavBar useDarkTheme={true} showTitle={false} showNavButtons={true} back={true}></NavBar>

      <h1 className="text-center print:text-xl">Popular Report</h1>

      <div className="grid grid-cols-5 my-2 w-[80%] mx-auto">
        <section className="col-span-1"></section>

        <form
          className="col-span-3 flex flex-row justify-center items-center"
          onSubmit={(e) => {
            getPopular(e);
          }}
        >
          <label className="mr-1 whitespace-nowrap print:hidden" htmlFor="start">
            Start date:{" "}
          </label>
          <input className="mr-5 border rounded" type="date" id="start" name="popular-start" min="2025-01-01" />
          <label className="mr-1 whitespace-nowrap print:hidden" htmlFor="start">
            End date:{" "}
          </label>
          <input className="border rounded" type="date" id="end" name="popular-end" min="2025-01-01" />
          <button className="border-black py-1 rounded ml-5 print:hidden" type="submit">
            Apply
          </button>
          <button className="whitespace-nowrap border-black py-1 rounded ml-5 print:hidden" onClick={(e) => { printReport(e) }}>
            <i className="fa-solid fa-print mr-2"></i>
            Print Report
          </button>
        </form>
      </div>

      <div className="flex flex-col w-full items-center">
        <ul className="flex-grow w-[80%] border mt-2 h-[70vh] bg-white p-10 overflow-y-scroll print:border-none print:w-full print:p-0 print:overflow-visible">
          <div className="text-right mt-2 mr-2">
            <span className="font-bold">Total Checkouts:&nbsp;&nbsp;</span>
            <span>{totalCheckouts}</span>
          </div>
          <table className="sortable border w-full print:text-xs">
            <thead>
              <tr>
                <th className="border hover:cursor-pointer">Title</th>
                <th className="border hover:cursor-pointer">Author</th>
                <th className="border hover:cursor-pointer">Genre</th>
                <th className="border hover:cursor-pointer"># of Checkouts</th>
              </tr>
            </thead>
            <tbody>
              {popular.map((entry) => {
                return (
                  <>
                    <tr className="hover:bg-gray">
                      <td className="border p-5 text-center print:p-2">{entry.book_title}</td>
                      <td className="border p-5 text-center print:p-2">{entry.author}</td>
                      <td className="border p-5 text-center print:p-2">{entry.genre_name}</td>
                      <td className="border p-5 text-center print:p-2">{entry.num_checkouts}</td>
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
