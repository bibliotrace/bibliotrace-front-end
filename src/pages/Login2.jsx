import Cookies from "js-cookie";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import ErrorModal from "../modals/ErrorModal";
import loginBackground from "../assets/pattern-backgroup.svg";
import girlSwinging from "../assets/swing-girl.svg";

export default function Login2() {
  const [campuses, setCampusList] = useState([]);
  const [message, setMessage] = useState("");
  const errorModalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getCampuses() {
      const response = await fetch(`http://localhost:8080/api/metadata/campuses`);
      if (response.ok) {
        const data = await response.json();
        if (data.results) {
          setCampusList(data.results);
          return;
        }
      }
      console.log("Error fetching campuses");
    }
    getCampuses();
  }, []);

  function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return jsonPayload;
  }

  async function setUpCookies(authToken) {
    Cookies.set("authToken", authToken, { expires: 7, secure: true });
    const jwtDataString = parseJwt(authToken);
    const jwtData = JSON.parse(jwtDataString);
    Cookies.set("jwtData", jwtDataString);

    // Get Genre List
    let genreResponse = await fetch("http://localhost:8080/api/metadata/genre", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const genreData = await genreResponse.json();
    if (!genreResponse.ok) {
      setMessage(`Error Fetching Metadata: ${genreData.message}`);
    } else {
      Cookies.set(
        "genreList",
        genreData.object.map((genre) => {
          return genre.genre_name;
        })
      );
    }

    // Get Tag List
    let tagResponse = await fetch("http://localhost:8080/api/metadata/tag", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const tagData = await tagResponse.json();
    if (!tagResponse.ok) {
      setMessage(`Error Fetching Metadata: ${tagData.message}`);
    } else {
      Cookies.set(
        "tagList",
        tagData.object.map((tag) => {
          return tag.tag_name;
        })
      );
    }

    // Get Audience List
    let response = await fetch("http://localhost:8080/api/metadata/audiences", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (!response.ok) {
      const responseText = await response.text();
      setMessage(`Error Fetching Metadata: ${responseText}`);
    } else {
      const jsonResult = await response.json();
      if (jsonResult != null && jsonResult.object != null) {
        const audiences = jsonResult.object;
        Cookies.set("audienceList", audiences);
      }
    }

    //Get Location List
    const location_response = await fetch("http://localhost:8080/api/metadata/locations", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await location_response.json();
    if (!location_response.ok) {
      setMessage(`Error Fetching Metadata: ${data.message}`);
    } else {
      if (data.object) {
        Cookies.set("locationList", JSON.stringify(data.object));
      }
    }

    //Get campus List
    const campus_response = await fetch("http://localhost:8080/api/metadata/campuses", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const campusData = await campus_response.json();
    if (!campus_response.ok) {
      setMessage(`Error Fetching Metadata: ${campusData.message}`);
    } else {
      if (campusData.results) {
        Cookies.set("campusList", JSON.stringify(campusData.results));
      }
    }
    // console.log("test");
    // const campusList = Cookies.get('campusList')
    // console.log("campus data: ", campusList);
    return jwtData;
  }

  async function campusLogin(campusName) {
    try {
      const response = await fetch("http://localhost:8080/api/auth/campuslogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ campus: campusName }),
      });

      if (!response.ok) {
        setMessage(await JSON.parse(await response.text()).message);
      } else {
        const jsonResult = await response.json();
        if (jsonResult != null && jsonResult.message === "Token generated successfully") {
          const jwtData = await setUpCookies(jsonResult.object);
          navigate("/");
        } else {
          setMessage(`Error: ${jsonResult}`);
        }
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  }

  function handleClick(event) {
    if (event.shiftKey || event.ctrlKey) {
      navigate("/adminlogin");
      return false;
    }
    else {
      return true;
    }
  }

  return (
    <>
      <div className="p-2 w-full" style={{ backgroundColor: "white" }}>
        <NavBar
          useDarkTheme={false}
          showTitle={false}
          bgColor={"transparent"}
          textColor={"#110057"}
          showNavButtons={false}
        />
      </div>
      <div
        className="bg-cover bg-center bg-no-repeat"
        style={{
          width: "100%",
          height: "90%",
          backgroundImage: `url("${girlSwinging}"), url("${loginBackground}")`,
          backgroundSize: "70% 70%, 100% 100%",
          backgroundPosition: "100% top, top",
        }}
        onClick={handleClick}
      >
        <div className="h-[calc(100%-64px)] flex items-center px-6 sm:px-12 lg:px-24 overflow-x-hidden">
          <div className="flex flex-col max-w-lg text-white">
            <p className="text-base font-semibold mb-2">Children&rsquo;s Health</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Bibliotrace</h1>
            <p className="text-base mb-8 leading-relaxed">
              Something about the purpose of this site. Should be about two to three lines of
              information and why they should choose from locations below.
            </p>
            <div className="flex flex-row flex-wrap gap-4">
              {campuses.map((campusName, index) => (
                <button
                  key={index}
                  onClick={() => campusLogin(campusName)}
                  className="flex items-center gap-2 bg-white text-[#110057] font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow"
                >
                  <MapPin size={18} />
                  {campusName}
                </button>
              ))}
            </div>
          </div>
          <div id="error-modal" ref={errorModalRef}>
            {message ? (
              <ErrorModal
                id="error-modal"
                tabIndex="-1"
                description={"Error during Login"}
                message={message}
                onExit={() => {
                  setMessage(null);
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
      <p className="fixed bottom-4 left-6 text-xs text-gray-500">
        Copyright &copy;2026, Intermountain Health, all rights reserved.
      </p>
    </>
  );
}
