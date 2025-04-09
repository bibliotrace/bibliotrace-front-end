import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import tailwindConfig from "../../tailwind.config";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";

export default function AuditReport() {
  const [auditEntries, setAuditEntries] = useState([]);
  const [numMissing, setNumMissing] = useState(0);
  const [numFound, setNumFound] = useState(0);
  const [numMisplaced, setNumMisplaced] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state?.audit) {
      navigate(-1);
    }
    getAuditEntries(location.state?.audit);

    //adds sorttable script
    const scriptEl = document.createElement("script");
    scriptEl.src = "../sorttable.js";
    scriptEl.async = true;
    document.body.appendChild(scriptEl);
    return () => {
      document.body.removeChild(scriptEl);
    };
  }, []);

  async function getAuditEntries(audit) {
    try {
      const response = await fetch(`http://localhost:8080/api/report/auditEntry/${audit.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
      });
      const data = await response.json();
      if (data.object) {
        setAuditEntries(data.object);
        setNumMissing(data.object.filter((entry) => entry.state === "Missing").length);
        setNumMisplaced(data.object.filter((entry) => entry.state === "Misplaced").length);
        setNumFound(data.object.filter((entry) => entry.state === "Found").length);
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  return (
    <div className="search-bg w-full h-full">
      <NavBar
        useDarkTheme={true}
        showTitle={false}
        bgColor={tailwindConfig.theme.colors.white}
        showNavButtons={true}
        back={true}
      ></NavBar>

      <h1 className="text-center print:text-xl">Audit Report</h1>
      <p className="text-xl text-center my-2 print:text-md print:mt-0">
        {location.state?.audit.start_date.split("T")[0]} to {location.state?.audit.completed_date.split("T")[0]}
      </p>
      <div
        className="flex flex-col w-full items-center
      "
      >
        <div className="flex-grow flex flex-row w-[80%] justify-between items-center text-lg print:text-xs">
          <p>
            Missing Books: {numMissing} ({((numMissing / auditEntries.length) * 100).toFixed(0)}%)
          </p>
          <p>
            Misplaced Books: {numMisplaced} ({((numMisplaced / auditEntries.length) * 100).toFixed(0)}%)
          </p>
          <p>
            Found Books: {numFound} ({((numFound / auditEntries.length) * 100).toFixed(0)}%)
          </p>
          <button className="print:hidden border-black" onClick={window.print}>
            Print Report
          </button>
        </div>
        <ul className="flex-grow w-[80%] border mt-2 h-[70vh] bg-white p-10 overflow-y-scroll print:border-none print:w-full print:p-0 print:overflow-visible">
          <table className="sortable border w-full print:text-xs">
            <thead>
              <tr>
                <th className="border hover:cursor-pointer">Status</th>
                <th className="border hover:cursor-pointer">Title</th>
                <th className="border hover:cursor-pointer">Author</th>
                <th className="border hover:cursor-pointer">QR Code</th>
                <th className="border hover:cursor-pointer">Location</th>
              </tr>
            </thead>
            <tbody>
              {auditEntries.map((entry) => {
                return (
                  <>
                    <tr className="hover:bg-gray" onClick={() => {}}>
                      <td className="border p-5 text-center print:p-2">{entry.state}</td>
                      <td className="border p-5 text-center print:p-2">{entry.book_title}</td>
                      <td className="border p-5 text-center print:p-2">{entry.author}</td>
                      <td className="border p-5 text-center print:p-2">{entry.qr}</td>
                      <td className="border p-5 text-center print:p-2">{entry.location_name}</td>
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
