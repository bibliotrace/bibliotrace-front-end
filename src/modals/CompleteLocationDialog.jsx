import React from "react";

export default function CompleteLocationDialog({ completeLocationDialog, currentLocation, completeLocation }) {
  return (
    <dialog className="rounded-md p-8 border-2 border-rubyRed" ref={completeLocationDialog}>
      <h1 className="text-xl text-center mb-5 font-rector font-bold text-darkBlue">
        Complete Audit for location: {currentLocation.location_name}
      </h1>
      <p className="text-center mb-5 ">
        Auditing for location {currentLocation.location_name} will be marked complete and cannot be undone.
      </p>
      <div className="flex flex-row justify-center">
        <button
          className="mx-2 bg-darkBlue text-white"
          onClick={() => {
            completeLocationDialog.current.close();
          }}
        >
          Cancel
        </button>
        <button
          className="mx-2 bg-darkBlue text-white"
          onClick={() => {
            completeLocation(currentLocation);
            completeLocationDialog.current.close();
          }}
        >
          Confirm
        </button>
      </div>
    </dialog>
  );
}
