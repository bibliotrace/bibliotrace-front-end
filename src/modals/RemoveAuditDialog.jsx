import React from "react";
import { useNavigate } from "react-router-dom";

export default function RemoveAuditDialog({ removeAuditDialog, onConfirm, onCancel }) {
  const navigate = useNavigate();

  return (
    <dialog className="rounded-md p-8 border-2 border-darkPeach" ref={removeAuditDialog}>
      <h1 className="text-xl text-center mb-5 font-rector font-bold text-darkBlue">
        Remove Audit
      </h1>
      <p className="text-center mb-5 ">
        Are you sure you want to remove this audit? Removing it will permanently erase 
        all information about the audit and cannot be undone.
      </p>
      <div className="flex flex-row justify-center">
        <button
          className="mx-2 bg-darkBlue text-white"
          onClick={() => {
            removeAuditDialog.current.close();
            onCancel();
          }}
        >
          Cancel
        </button>
        <button
          className="mx-2 bg-darkBlue text-white"
          onClick={() => {
            removeAuditDialog.current.close();
            onConfirm();
          }}
        >
          Confirm
        </button>
      </div>
    </dialog>
  );
}
