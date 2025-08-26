export default function AuditCompletedDialog({ auditCompletedDialog, onOK }) {
  return (
    <dialog className="rounded-md p-8 border-2 border-darkPeach" ref={auditCompletedDialog}>
      <h1 className="text-xl text-center mb-5 font-rector font-bold text-darkBlue">
        Audit Completed
      </h1>
      <p className="text-center mb-5 ">The audit has been completed!</p>
      <div className="flex flex-row justify-center">
        <button
          className="mx-2 bg-darkBlue text-white"
          onClick={() => {
            auditCompletedDialog.current.close();
            onOK();
          }}
        >
          OK
        </button>
      </div>
    </dialog>
  );
}
