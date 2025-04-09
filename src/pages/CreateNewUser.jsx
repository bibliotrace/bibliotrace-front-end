import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import tailwindConfig from "../../tailwind.config";
import NavBar from "../components/NavBar";

export default function CreateNewUser() {
  const roles = ["Admin", "User"];
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const emailRef = useRef(null);
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [email, setEmail] = useState("");
  let [role, setRole] = useState("");
  let [campus, setCampus] = useState("");
  const [campuses, setCampusList] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [failedMessage, setFailedMessage] = useState("");

  async function createAccount(jwt, accountData) {
    try {
      const response = await fetch("http://localhost:8080/api/auth/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(accountData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
      } else {
        setFailedMessage("*" + data.message);
      }
      return data;
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSubmit();
    }
  };

  useEffect(() => {
    async function getCampuses() {
      const campusList = await JSON.parse(Cookies.get("campusList"));
      setCampusList(campusList);
    }
    getCampuses();
  }, []);

  const testClick = () => {
    console.log("clicked");
  };

  const onSubmit = () => {
    setSuccessMessage(null);
    setFailedMessage(null);
    const jwt = Cookies.get("authToken");
    if (username === "") username = null;
    if (password == "") password = null;
    if (role == "Admin") {
      if (email == "") email = null;
    }
    if (role == "") role = null;
    if (campus == "") campus = null;
    const accountData = {
      username: username,
      password: password,
      email: email,
      roleType: role,
      campus: campus,
    };
    createAccount(jwt, accountData);
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
          transform="rotate(0, 50, 50) scale(1, 1.5)"
        />
      </svg>
      <NavBar
        useDarkTheme={false}
        showTitle={true}
        bgColor={tailwindConfig.theme.colors.purple}
        textColor={tailwindConfig.theme.colors.white}
        homeNavOnClick="/admin"
      />

      <h1 className="text-center 5xl:my-16 3xl:my-8 lg:my-4 4xl:text-[6rem] 3xl:text-5xl xl:text-2xl  text-white font-rector">
        Create User
      </h1>
      <div className="flex flex-row">
        <section className="2xl:p-20 p-10 mt-14 flex-1 flex flex-col 3xl:text-3xl xl:text-lg">
          <p>1. Please only create an account if the location you are at has no account.</p>
          <p>
            2. Please do not use a username or login information related to your id or health
            information.
          </p>
          <p>3. You must specify the campus associated with the user.</p>
          {
            //We don't have docs yet so it doesn't make sense to have a link that goes nowhere
            /*<p
            className="self-center mt-10 underline text-lightBlue hover:cursor-pointer hover:opacity-80 active:text-darkBlue"
            onClick={testClick}
          >
            Help
          </p>*/
          }
        </section>

        <section className="2xl:p-20 xl:p-5 flex-1">
          <div className="flex flex-col min-h-48 h-full 5xl:text-[3rem] 3xl:text-[1.25rem] 2xl:text-3xl xl:text-2xl lg:text-lg">
            <div className="flex-1 items-center mb-3 mt-4">
              <label className="text-purple">Email: </label>
              <input
                ref={emailRef}
                className={`border-2 border-purple border-solid rounded-md h-14 w-full p-4 placeholder-purple placeholder:font-bold text-lg
                      ${role === "User" ? "opacity-50 cursor-not-allowed" : ""}`}
                placeholder="Email"
                type="text"
                value={role === "User" ? "" : email}
                onChange={(e) => {
                  if (role !== "User") {
                    setEmail(e.target.value);
                  }
                }}
                onKeyDown={(e) => {
                  if (role === "User") {
                    e.preventDefault();
                  } else {
                    handleKeyDown(e);
                  }
                }}
                disabled={role === "User"}
                readOnly={role === "User"}
              />
            </div>
            <div className="flex-1 items-center mb-3 mt-4">
              <label className="text-purple">Username: </label>
              <input
                ref={usernameRef}
                className="border-2 border-purple border-solid rounded-md h-14 w-full p-4 placeholder-purple placeholder:font-bold text-lg"
                placeholder="Username"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="flex-1 items-center mb-3">
              <label className="text-purple">Password: </label>
              <input
                ref={passwordRef}
                className="border-2 border-purple border-solid rounded-md h-14 w-full p-4 placeholder-purple placeholder:font-bold text-lg"
                placeholder="Password"
                type="text"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="flex-1 items-center">
              <label className="text-purple">Role: </label>
              <select
                value={role || ""}
                onChange={(e) => {
                  const selectedRole = e.target.value; // Get the selected role name
                  setRole(selectedRole); // Store the role name directly in the state
                }}
              >
                <option value="" disabled>
                  -- Choose a role --
                </option>
                {roles.map((roleName, index) => (
                  <option key={index} value={roleName}>
                    {roleName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 items-center">
              <label className="text-purple">Campus: </label>
              <select
                value={campus || ""}
                onChange={(e) => {
                  const selectedCampus = e.target.value; // Get the selected campus name
                  setCampus(selectedCampus); // Store the campus name directly in the state
                }}
              >
                <option value="" disabled>
                  -- Choose an option --
                </option>
                {campuses.map((campus_name, index) => (
                  <option key={index} value={campus_name}>
                    {campus_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 items-center pt-12">
              <button
                className="self-center w-full mb-10 border-2 border-purple hover:bg-purple hover:scale-105 text-purple hover:text-white"
                onClick={onSubmit}
              >
                Create Account
              </button>
              <p className="text-purple">{successMessage}</p>
              <p className="text-darkPeach">{failedMessage}</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
