import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function ErrorModal({ description, message, onExit }) {
  useEffect(() => {
    const handleKeypress = (event) => {
      event.stopPropagation();
      onExit();
    };

    window.addEventListener("keypress", handleKeypress);
    return () => {
      window.removeEventListener("keypress", handleKeypress);
    };
  });

  return (
    <AnimatePresence>
      {
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onExit}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={onExit}
            >
              Back
            </button>
            <h2 className="text-lg font-semibold text-red-600 mr-16">{description}</h2>
            <p className="mt-2 text-gray-700 whitespace-pre-line">{ (message?.includes('Failed to fetch')) ? 'Back-End Server Unreachable. Please try again in a few moments or contact the site administrator.' : message }</p>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>
  );
}
