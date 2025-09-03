import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import ErrorModal from "../modals/ErrorModal";
import loginBackground from "../assets/login-background.png";
import CustomButton from "../components/ButtonComponent";
//Icons
import PeachColorIcon from "../assets/CheckInIcon.jpg";
import OrangeIcon from "../assets/ExploreByAge.jpg";
import BlueIcon from "../assets/ExploreByGenre.jpg";
import YellowIcon from "../assets/NewArrivalsIcon.jpg";
import RedIcon from "../assets/SuggestBook.jpg";
import PinkIcon from "../assets/WhatsPopular.jpg";
import PurpleIcon from "../assets/checkoutIcon.jpg";

const buttonStyles = [
  {
    imageSrc: PurpleIcon,
    borderColor: "#4b00e3",
  },
  {
    imageSrc: PeachColorIcon,
    borderColor: "#fbb7a4",
  },
  {
    imageSrc: RedIcon,
    borderColor: "#e12502",
  },
  {
    imageSrc: PinkIcon,
    borderColor: "#ff50df",
  },
  {
    imageSrc: YellowIcon,
    borderColor: "#FFD700",
  },
  {
    imageSrc: OrangeIcon,
    borderColor: "#fa8804",
  },
  {
    imageSrc: BlueIcon,
    borderColor: "#669bff",
  },
];

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
      <div
        className="size-full bg-cover bg-center bg-no-repeat "
        style={{ backgroundImage: `url(${loginBackground})` }}
        onClick={handleClick}
      >
        <NavBar
          useDarkTheme={false}
          showTitle={true}
          bgColor={"#ff50e0"}
          textColor={"white"}
          showNavButtons={false}
        />
        <div className="h-[calc(100%-64px)] flex flex-col items-center">
          <h1 className="text-white mb-10 mt-20">{location.state?.loginType ?? ""}</h1>
          <div className="flex flex-col w-1/2 items-center">
            {campuses.map((campusName, index) => (
              <CustomButton
                key={index}
                imageSrc={buttonStyles[index % buttonStyles.length].imageSrc}
                text={campusName}
                textColor="#FFFFFF"
                onClick={() => campusLogin(campusName)}
                borderColor={buttonStyles[index % buttonStyles.length].borderColor}
                bgColor="#110057"
                layout="row"
                textSize="1.25rem"
              />
            ))}
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
    </>
  );
}
