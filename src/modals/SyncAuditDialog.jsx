import React from "react";
import { useNavigate } from "react-router-dom";

export default function SyncAuditDialog({ syncAuditDialog, onYes, onNo }) {
  const navigate = useNavigate();

  return (
    <dialog className="rounded-md p-8 border-2 border-darkPeach" ref={syncAuditDialog}>
      <h1 className="text-xl text-center mb-5 font-rector font-bold text-darkBlue">
        Sync Inventory with Audit Results
      </h1>
      <p className="text-center mb-5 ">
        Do you want to sync the inventory with the results of this audit? This will mark
        all books not found during the audit as "checked out".
      </p>
      <div className="flex flex-row justify-center">
        <button
          className="mx-2 bg-darkBlue text-white"
          onClick={() => {
            syncAuditDialog.current.close();
            onNo();
          }}
        >
          No
        </button>
        <button
          className="mx-2 bg-darkBlue text-white"
          onClick={() => {
            syncAuditDialog.current.close();
            onYes();
          }}
        >
          Yes
        </button>
      </div>
    </dialog>
  );
}
