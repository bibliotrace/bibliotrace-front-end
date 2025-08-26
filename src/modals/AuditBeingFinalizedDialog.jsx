export default function AuditBeingFinalizedDialog({ auditBeingFinalizedDialog, onYes, onNo }) {
  return (
    <dialog className="rounded-md p-8 border-2 border-darkPeach" ref={auditBeingFinalizedDialog}>
      <h1 className="text-xl text-center font-rector font-bold text-darkBlue">
        The audit is being finalized. Please wait...
      </h1>
    </dialog>
  );
}
