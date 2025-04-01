import React from "react";
import { useNavigate } from "react-router-dom";

export default function AuditCompletedDialog({ auditCompletedDialog }) {
  const navigate = useNavigate();

  return (
    <dialog className="rounded-md p-8 border-2 border-rubyRed" ref={auditCompletedDialog}>
      <h1 className="text-xl text-center mb-5 font-rector font-bold text-darkBlue">Audit Completed</h1>
      <p className="text-center mb-5 ">The audit has been completed. Thank you!</p>
      <div className="flex flex-row justify-center">
        <button
          className="mx-2 bg-darkBlue text-white"
          onClick={() => {
            navigate("/");
          }}
        >
          Go to Home
        </button>
        <button
          className="mx-2 bg-darkBlue text-white"
          onClick={() => {
            navigate("/audit-list");
          }}
        >
          View Audit Reports
        </button>
      </div>
    </dialog>
  );
}
