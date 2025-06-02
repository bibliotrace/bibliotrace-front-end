import Cookies from "js-cookie";
import { useState } from "react";
import tailwindConfig from "../../tailwind.config";
import NavBar from "../components/NavBar";
import ErrorModal from "../modals/ErrorModal";

export default function ManageLocations() {
  const locationCookieData = JSON.parse(Cookies.get("locationList"));

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [locations, setLocations] = useState(locationCookieData ?? []);
  const [newLocation, setNewLocation] = useState("");
  const authToken = Cookies.get("authToken");

  // TODO: refactor these functions to use async/await for readability
  const handleAddNewLocation = () => {
    if (newLocation == "") {
      return;
    }
    setNewLocation("");
    fetch("http://localhost:8080/api/metadata/locations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        locationName: newLocation,
      }),
    }).then((response) => {
      if (response.ok) {
        response.json().then((json) => {
          // Then refresh the location data
          setSuccessMessage(json.message);
          updateLocationList();
        });
      } else {
        console.error(response);
        setErrorMessage("Response not ok from setting location.");
      }
    });

    setNewLocation("");
  };

  const updateLocationList = () => {
    fetch("http://localhost:8080/api/metadata/locations", {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((json) => {
        if (!response.ok) {
          setErrorMessage(`Error Fetching Metadata: ${json.message}`);
        } else {
          if (json.object) {
            Cookies.set("locationList", JSON.stringify(json.object));
            setLocations(json.object);
          }
        }
      });
    });
  };

  const handleUpdateExistingLocation = (existingLocation, value) => {
    console.log(existingLocation);
    console.log(value);
    const fetchBody = {
      locationName: value,
    };
    fetch(`http://localhost:8080/api/metadata/locations/${existingLocation.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fetchBody),
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          // Then refresh the location data
          setSuccessMessage(data.message);
          updateLocationList();
        });
      }
    });
  };

  const handleRemoveExistingLocation = async (existingLocation) => {
    console.log(existingLocation);

    try {
      const response = await fetch(
        `http://localhost:8080/api/metadata/locations/${existingLocation.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message);
        updateLocationList();
      } else {
        setErrorMessage(`${data.message}`);
      }
    } catch (error) {
      setErrorMessage(`${error}`);
    }
  };

  return (
    <>
      <svg
        className="-z-10 absolute left-0 top-0"
        width="100vw"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          className="fill-purple"
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
          transform="rotate(0, 50, 50) scale(1, 1.75)"
        />
      </svg>

      <NavBar
        useDarkTheme={false}
        showTitle={true}
        textColor={tailwindConfig.theme.colors.white}
        showNavButtons={true}
        back={true}
      />

      <div className="flex flex-col justify-between h-5/6">
        <h1 className="text-center my-10 text-white font-rector pb-20 text-5xl">Manage Locations</h1>

        {errorMessage && (
          <ErrorModal
            description={"Error Submitting Locations"}
            message={errorMessage}
            onExit={() => {
              setErrorMessage(null);
            }}
          />
        )}
        {successMessage && (
          <ErrorModal
            description={"Success"}
            message={successMessage}
            onExit={() => {
              setSuccessMessage(null);
            }}
          />
        )}
        <div className="flex flex-row pb-20">
          <div
            className="m-auto bg-darkBlue bg-opacity-80 p-4 rounded-xl"
            style={{ width: "calc(max(50rem, 50vw))" }}
          >
            {locations.map((location, index) => {
              return (
                <div
                  key={index}
                  className="flex justify-between bg-white bg-opacity-50 items-center p-4 rounded-xl m-4"
                >
                  <input
                    type="text"
                    className="text-2xl p-4 rounded-xl flex-1"
                    value={location.location_name}
                    onChange={(e) => {
                      const updatedLocations = [...locations];
                      updatedLocations[index] = {
                        ...location,
                        location_name: e.target.value,
                      };
                      setLocations(updatedLocations);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUpdateExistingLocation(location, e.target.value);
                      }
                    }}
                  />
                  <div className="h-full flex">
                    <button
                      className="bg-lightBlue mx-4 text-white h-full"
                      onClick={(e) => {
                        const inputElement =
                          e.target.parentElement.parentElement.querySelector("input");
                        if (inputElement) {
                          handleUpdateExistingLocation(location, inputElement.value);
                        }
                      }}
                    >
                      Update
                    </button>
                    <button
                      className="bg-peachPink"
                      onClick={(e) => handleRemoveExistingLocation(location)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="flex justify-between bg-white bg-opacity-50 items-center p-4 rounded-xl m-4">
              <input
                type="text"
                className="text-2xl p-4 rounded-xl flex-1"
                placeholder="+ New Location"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddNewLocation();
                  }
                }}
              />
              <div className="h-full">
                <button
                  className="bg-lightBlue mx-4 text-white h-full"
                  onClick={() => handleAddNewLocation()}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
