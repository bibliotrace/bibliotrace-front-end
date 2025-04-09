import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import tailwindConfig from "../../tailwind.config";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function AuditList() {
  const [auditList, setAuditList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllAudits();
  }, []);

  async function getAllAudits() {
    try {
      const response = await fetch("http://localhost:8080/api/report/audit", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
      });
      const data = await response.json();
      if (data.object) {
        setAuditList(data.object.sort((a, b) => a.start_date - b.start_date));
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async function handleSelectAudit(audit) {
    navigate(`/audit-report`, { state: { audit: audit } });
  }

  return (
    <div className="search-bg w-full h-full">
      <NavBar useDarkTheme={true} showTitle={false} showNavButtons={true}></NavBar>
      <h1 className="text-center">Audit List</h1>
      <h2 className="text-lg text-center my-5">Select an audit to view report</h2>
      <div className="flex flex-column w-full justify-center">
        <ul className="flex-grow max-w-[80%] lg:max-w-[900px] bg-white border h-[70vh] p-10 overflow-y-scroll">
          <table className="border w-full">
            <tr>
              <th className="border w-[33%]">Audit #</th>
              <th className="border w-[33%]">Start Date</th>
              <th className="border w-[33%]">Completed Date</th>
            </tr>
            {auditList.map((audit, i) => {
              return (
                <>
                  <tr className="hover:bg-gray hover:cursor-pointer" onClick={() => handleSelectAudit(audit)}>
                    <td className="border p-5 text-center">Audit #{i + 1} </td>
                    <td className="border p-5 text-center">{audit.start_date.split("T")[0]}</td>
                    <td className="border p-5 text-center">
                      {audit.completed_date ? audit.completed_date.split("T")[0] : "In Progress"}
                    </td>
                  </tr>
                </>
              );
            })}
          </table>
        </ul>
      </div>
    </div>
  );
}
