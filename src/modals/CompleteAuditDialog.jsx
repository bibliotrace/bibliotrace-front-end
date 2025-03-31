import React from "react";

export default function CompleteAuditDialog({ completeAuditDialog, currentLocation, completeLocation, completeAudit }) {
  return (
    <dialog className="rounded-md p-8 border-2 border-rubyRed" ref={completeAuditDialog}>
      <h1 className="text-xl text-center mb-5 font-rector font-bold text-darkBlue">Complete Audit</h1>
      <p className="text-center mb-5 ">
        {currentLocation.location_name} is the last location to be audited. The entire audit will be marked complete and
        cannot be undone.
      </p>
      <div className="flex flex-row justify-center">
        <button
          className="mx-2 bg-darkBlue text-white"
          onClick={() => {
            completeAuditDialog.current.close();
          }}
        >
          Cancel
        </button>
        <button
          className="mx-2 bg-darkBlue text-white"
          onClick={() => {
            completeLocation(currentLocation);
            completeAudit();
          }}
        >
          Confirm
        </button>
      </div>
    </dialog>
  );
}
