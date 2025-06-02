import React, { useEffect, useState, useRef } from "react";
import NavBar from "../components/NavBar";
import tailwindConfig from "../../tailwind.config";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import RemoveAuditDialog from "../modals/RemoveAuditDialog";

export default function AuditList() {
  const [auditList, setAuditList] = useState([]);
  const [audit_id_to_delete, setAuditIdToDelete] = useState(undefined);
  const removeAuditDialog = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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
        setAuditList(data.object.sort((a, b) => new Date(b.start_date) - new Date(a.start_date)));
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async function handleSelectAudit(audit) {
    navigate(`/audit-report`, { state: { audit: audit } });
  }

  async function deleteAudit() {
    try {
      if (audit_id_to_delete !== undefined) {
        const response = await fetch(`http://localhost:8080/api/inventory/audit`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
          body: JSON.stringify({
            audit_id: audit_id_to_delete,
          }),
        });
        if (response.ok) {
          getAllAudits();
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async function cancelDeleteAudit() {
    setAuditIdToDelete(undefined);
  }

  async function handleRemoveAudit(audit_id) {
    setAuditIdToDelete(audit_id);
    removeAuditDialog.current.showModal();
  }

  return (
    <div className="search-bg w-full h-full">
      <NavBar useDarkTheme={true} showTitle={false} showNavButtons={true} back={true}></NavBar>

      <h1 className="text-center">Audit List</h1>

      <h2 className="text-lg text-center my-5">Select an audit to view report</h2>
      <div className="flex flex-column w-full justify-center">
        <ul className="flex-grow max-w-[80%] lg:max-w-[900px] bg-white border h-[70vh] p-10 overflow-y-scroll">
          <table className="border w-full">
            <tr>
              <th className="border w-[25%]">Audit #</th>
              <th className="border w-[25%]">Start Date</th>
              <th className="border w-[25%]">Completed Date</th>
              <th className="border w-[25%]"></th>
            </tr>
            {auditList.map((audit, i) => {
              return (
                <>
                  <tr className="hover:bg-gray hover:cursor-pointer">
                    <td className="border p-5 text-center" onClick={() => handleSelectAudit(audit)}>Audit #{i + 1} </td>
                    <td className="border p-5 text-center" onClick={() => handleSelectAudit(audit)}>{audit.start_date.split("T")[0]}</td>
                    <td className="border p-5 text-center" onClick={() => handleSelectAudit(audit)}>
                      {audit.completed_date ? audit.completed_date.split("T")[0] : "In Progress"}
                    </td>
                    <td className="border p-5 item-center">
                      <button className="ml-5 border-black print:hidden" onClick={() => handleRemoveAudit(audit.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                </>
              );
            })}
          </table>
          <RemoveAuditDialog
            removeAuditDialog={removeAuditDialog}
            onConfirm={deleteAudit}
            onCancel={cancelDeleteAudit} />
        </ul>
      </div>
    </div>
  );
}
