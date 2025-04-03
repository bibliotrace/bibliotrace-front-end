import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { useRef, useState } from "react";

export default function BulkQrOnlyDump({ title, onExit, operationType }) {
  const [inputs, setInputs] = useState([""]);
  const [operationResults, setOperationResults] = useState(null);
  const inputRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (inputs[index].trim() != "") {
        setInputs(["", ...inputs]);

        setTimeout(() => {
          inputRefs.current[index - 1]?.focus();
        }, 0);
      }
    }
  };

  const handleChange = (e, index) => {
    const newInputs = [...inputs];
    newInputs[index] = e.target.value;
    setInputs(newInputs);
  };

  const handleRemove = (e, index) => {
    e.preventDefault();
    if (inputs.length > 1) {
      const newInputs = [...inputs];
      if (index == 0) {
        newInputs[0] = "";
      } else {
        newInputs.splice(index, 1);
      }
      setInputs(newInputs);
    } else {
      setInputs([""]);
    }
  };

  const onCheckAndValidate = async () => {
    const jwt = Cookies.get("authToken");
    const result = await fetch(`http://localhost:8080/api/inventory/bulk/${operationType}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ qrStrings: inputs }),
    });
    let resultString = "";
    if (result.ok) {
      // Do something?
      resultString = await result.text();
    } else {
      resultString = `API Returned ${result.status} Status: ${await result.text()}`;
    }

    setOperationResults(resultString);
  };

  const onSubmitAndProcess = async () => {
    const jwt = Cookies.get("authToken");
    const result = await fetch(`http://localhost:8080/api/inventory/bulk/${operationType}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ qrStrings: inputs }),
    });
    let resultString = "";
    if (result.ok) {
      // Do something?
      resultString = await result.text();
    } else {
      resultString = `API Returned ${result.status} Status: ${await result.text()}`;
    }

    setOperationResults(resultString);
  };

  return (
    <AnimatePresence>
      {
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between pb-4">
              <h3 className="text-2xl p-4">{title}</h3>
              <button onClick={onExit}>Cancel</button>
            </div>
            <div className="flex flex-col lg:flex-row">
              <div className="flex columns-1 bg-[#d6d6d6] rounded-xl min-h-72">
                <form className="flex flex-col overflow-y-auto max-h-[60vh] w-full">
                  {inputs.map((input, index) => (
                    <div
                      key={index}
                      className="bg-[#EEEEEE] rounded-lg m-4 flex flex-nowrap items-center justify-between"
                    >
                      <input
                        type="text"
                        placeholder="Start Scanning Here"
                        className="p-4 m-2 text-xl bg-[#EEEEEE] rounded-lg"
                        ref={(el) => (inputRefs.current[index] = el)}
                        value={input}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                      />
                      <button onClick={(e) => handleRemove(e, index)} className="mx-4">
                        Remove
                      </button>
                    </div>
                  ))}
                </form>
              </div>
              <div className="flex flex-col p-6 max-w-[50vw]">
                <button className="m-4 p-4" onClick={async () => onCheckAndValidate(inputs)}>
                  Check and Validate
                </button>
                <button className="m-4 p-4" onClick={async () => onSubmitAndProcess(inputs)}>
                  Submit and Process
                </button>

                {operationResults && (
                  <div className="p-6">
                    <p>{operationResults}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>
  );
}
