import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import AuditCompletedDialog from "../modals/AuditCompletedDialog";
import CompleteAuditDialog from "../modals/CompleteAuditDialog";
import CompleteLocationDialog from "../modals/CompleteLocationDialog";
import tailwindConfig from "../../tailwind.config";

export default function Audit() {
  const completeLocationDialog = useRef(null);
  const completeAuditDialog = useRef(null);
  const auditCompletedDialog = useRef(null);
  const [isAuditOngoing, setIsAuditOngoing] = useState(null);
  const [auditID, setAuditID] = useState(null);
  const [lastAuditCompletedDate, setLastAuditCompletedDate] = useState("");
  const [lastAuditStartDate, setLastAuditStartDate] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    //set isAuditOngoing
    async function getCurrentAudit() {
      try {
        const response = await fetch("http://localhost:8080/api/inventory/audit", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          setMessage(data.message);
        } else if (data.object) {
          setIsAuditOngoing(true);
          setAuditID(data.object.id);
          setLastAuditStartDate(data.object.start_date.split("T")[0]);
        } else {
          setIsAuditOngoing(false);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (isAuditOngoing == null) {
      getCurrentAudit();
    }
    if (Cookies.get("locationList")) {
      const locationList = JSON.parse(Cookies.get("locationList"));
      setLocations(locationList);
    }
  }, []);

  async function handleStartAudit() {
    //create new audit
    try {
      const response = await fetch("http://localhost:8080/api/inventory/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${Cookies.get("authToken")}` },
      });

      const data = await response.json();
      if (!response.ok) {
        console.log(response.message);
      } else {
        setIsAuditOngoing(true);
        setLastAuditStartDate(new Date().toLocaleDateString());
        setAuditID(data.object.id);

        const updatedLocations = locations.map((location) => {
          location.in_audit = 1;
          return location;
        });
        setLocations(updatedLocations);
        Cookies.set("locationList", JSON.stringify(updatedLocations));
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function handleScan(e) {
    if (e.key !== "Enter" || e.target.value === "") {
      return;
    }
    if (!currentLocation) {
      setMessage("Select a location before scanning");
      return;
    }
    //clear values
    setMessage("");
    setBookTitle("");
    setBookAuthor("");

    try {
      const response = await fetch("http://localhost:8080/api/inventory/auditEntry", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${Cookies.get("authToken")}` },
        body: JSON.stringify({ qr_code: e.target.value, location_id: currentLocation.id, audit_id: auditID }),
      });

      const data = await response.json();
      if (!response.ok || !data.object) {
        setMessage(data.message);
      } else {
        e.target.value = "";
        //set book data
        setBookTitle(data.object.book_title);
        setBookAuthor(data.object.author);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function handleCompleteLocation(location) {
    if (locations.filter((location) => location.in_audit === 1).length <= 1) {
      completeAuditDialog.current.showModal();
    } else {
      completeLocationDialog.current.showModal();
    }
  }

  async function completeLocation(location) {
    try {
      const response = await fetch("http://localhost:8080/api/inventory/audit/completeLocation", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${Cookies.get("authToken")}` },
        body: JSON.stringify({ location_id: location.id, audit_id: auditID }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message);
      } else {
        //cross off location
        location.in_audit = 0;
        setCurrentLocation("");
        Cookies.set("locationList", JSON.stringify(locations));
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function completeAudit() {
    try {
      const response = await fetch("http://localhost:8080/api/inventory/audit/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${Cookies.get("authToken")}` },
        body: JSON.stringify({ audit_id: auditID }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message);
      } else {
        setIsAuditOngoing(false);
        // setLastAuditCompletedDate(data.)
        completeAuditDialog.current.close();
        auditCompletedDialog.current.showModal();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      <svg
        className="-z-10 absolute left-0 top-0"
        width="100vw"
        height="80%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          className="fill-peachPink"
          d="
            M-0.5,12
            C7,10 12,14 17,16
            C22,18 27,14 32,12
            C37,10 42,14 47,16
            C52,18 57,14 62,12
            C67,10 72,14 77,16
            C82,18 87,14 92,12
            C97,10 102,14 107,16
            C110,17.5 114,16 117,14
            C120,12 124,10 127,11
            L132,11
            L132,0
            L0,0
            Z"
          transform="rotate(0, 50, 50) scale(1, 2)"
        />
      </svg>
      <NavBar useDarkTheme={true} showNavButtons={true} bgColor={tailwindConfig.theme.colors.peachPink}></NavBar>
      <h1 className="text-center mb-2">Audit</h1>
      {isAuditOngoing ? (
        <>
          <CompleteAuditDialog
            completeAuditDialog={completeAuditDialog}
            currentLocation={currentLocation}
            completeLocation={completeLocation}
            completeAudit={completeAudit}
          />
          <CompleteLocationDialog
            completeLocationDialog={completeLocationDialog}
            currentLocation={currentLocation}
            completeLocation={completeLocation}
          />
          <AuditCompletedDialog auditCompletedDialog={auditCompletedDialog} />
          <h2 className="text-center text-2xl mb-20">Started On: {lastAuditStartDate}</h2>
          <p className="text-center">{message}</p>
          <div className="flex flex-row justify-around h-[60%]">
            <section className="flex flex-col w-full mx-10">
              <h3 className="text-center text-xl mb-5">Current Location: {currentLocation.location_name}</h3>
              <ul className="border overflow-y-scroll w-full h-full p-5 text-lg">
                {locations.map((location) => {
                  return (
                    <li className="flex flex-row flex-nowrap justify-between items-center mb-7">
                      <label
                        className={"w-full" + (location.in_audit ? "" : " line-through")}
                        for={`${location.location_name}-radio`}
                      >
                        <input
                          id={`${location.location_name}-radio`}
                          className="mr-3"
                          type="radio"
                          name="location"
                          onClick={() => {
                            setCurrentLocation(location);
                          }}
                          disabled={location.in_audit ? false : true}
                        ></input>
                        {location.location_name}
                      </label>
                      {location.id === currentLocation.id ? (
                        <button className="text-sm" onClick={() => handleCompleteLocation(location)}>
                          Complete
                        </button>
                      ) : (
                        <></>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="flex flex-col w-full mx-10">
              <h3 className="text-center text-xl mb-5">.</h3>
              <input
                className="border p-2 mb-10"
                type="text"
                placeholder="Start Scanning"
                onKeyDown={(e) => handleScan(e)}
              ></input>
              <div className="flex flex-col w-full">
                <p className="text-lg mb-5 ml-5">Title: {bookTitle}</p>
                <p className="text-lg mb-5 ml-5">Author: {bookAuthor}</p>
              </div>
            </section>

            <section className="flex flex-col w-full mx-10">
              <h3 className="text-center text-xl mb-5">Instructions</h3>
              <ul className="text-lg">
                <li className="mb-5">1. Click to select a location</li>
                <li className="mb-5">2. Scan all books currently in that location</li>
                <li className="mb-5">
                  3. Click the 'Complete' button to mark location as done when all books have been scanned
                </li>
                <li className="mb-5">4. Repeat until all locations are done</li>
                <li className="mb-5">5. Mark audit as complete to generate a final report</li>
              </ul>
            </section>
          </div>
        </>
      ) : (
        <>
          {/* <h2 className="text-center text-2xl mb-20">Last Audit Completed: {lastAuditCompletedDate}</h2> */}
          <div className="flex flex-row justify-center items-center mt-32">
            <button className="m-5 border-black" onClick={handleStartAudit}>
              Start New Audit
            </button>
            <button
              className="m-5 border-black"
              onClick={() => {
                navigate("/audit-list");
              }}
            >
              View Audit Reports
            </button>
          </div>
        </>
      )}
    </>
  );
}
