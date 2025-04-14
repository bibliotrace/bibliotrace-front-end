import React, { useState } from "react";
import NavBar from "../components/NavBar";
import ErrorModal from "../modals/ErrorModal";
import Cookies from "js-cookie";
import useSorttable from "../components/useSorttable";

export default function PopularReport() {
  const [popular, setPopular] = useState([]);
  const [message, setMessage] = useState("");

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
    if (start_date >= end_date) {
      setMessage("End date must be after start date");
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
      }
    } catch (e) {
      console.log(e.message);
    }
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
          <label className="print:hidden" for="start">
            Start date:{" "}
          </label>
          <input className="mr-5 border" type="date" id="start" name="popular-start" min="2025-01-01" />

          <label className="print:hidden" for="start">
            End date:{" "}
          </label>
          <input className="border" type="date" id="end" name="popular-end" min="2025-01-01" />
          <button className="border-black py-1 rounded-none ml-5 print:hidden" type="submit">
            Apply
          </button>
        </form>

        <button className="col-span-1 print:hidden border-black ml-auto" onClick={window.print}>
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
