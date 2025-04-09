import React, { useState, useEffect } from 'react';

const ResponsiveModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on window resize
  useEffect(() => {
    const checkSize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setIsModalOpen(true);
      } else {
        setIsMobile(false);
        setIsModalOpen(false);
      }
    };

    checkSize();
    window.addEventListener('resize', checkSize);

    return () => {
      window.removeEventListener('resize', checkSize);
    };
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg border-4 border-rubyRed max-w-sm w-full">
            <h2 className="text-lg font-bold">Screen Size Not Supported</h2>
            <p>This message appears on screens smaller than tablet size please use a diffrent device or screen.</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-darkBlue text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ResponsiveModal;
