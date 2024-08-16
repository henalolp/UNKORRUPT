import { useState } from "react";
import { idlFactory, canisterId } from "../../../declarations/UN_backend";
import { useAuthClient } from "../../../index";
import { useNavigate } from "react-router-dom";


function Auth() {
  const navigate = useNavigate();
  const identityProvider =
    // eslint-disable-next-line no-undef
    process.env.DFX_NETWORK === "local"
      ? // eslint-disable-next-line no-undef
        `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`
      : "https://identity.ic0.app";

  const { isAuthenticated, login, logout, actor } = useAuthClient({
    loginOptions: {
      identityProvider,
    },
    actorOptions: {
      canisterId,
      idlFactory,
    },
  });

  const [greeting, setGreeting] = useState("");
  const [whoamiText, setWhoamiText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    actor.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <span className="font-bold text-60px leading-72-61px tracking-neg-0-04em text-purple">
        Patriot.ai
      </span>
      <br />
      <br />
      <br />

      <section id="greeting">{greeting}</section>
      <br />
      <section id="login-section">
        
        {/* <button id="login" onClick={login}>
         Login with Internet Identity
         <img src={logo} alt="Internet Identity Logo" />
       </button> */}
        <div className="buttons">
          <button
            className="bg-white glow text-purple font-semibold py-2 px-6 rounded hover-bg-purple-700 transition-colors"
            id="login"
            onClick={login}
          >
            Login with Internet Identity
          </button>
{/* 
          <button
            className="bg-white glow text-purple font-semibold py-2 px-6 rounded hover-bg-purple-700 transition-colors"
            id="logout"
            onClick={logout}
          >
            Logout
          </button> */}
        </div>

        {/* <button id="logout" onClick={logout} >
         logout
       </button> */}
        <p>{isAuthenticated ? navigate("/coursePage") : "You are not logged in"}</p>
        {/* <button
          onClick={async () => {
            const whoami = await actor.whoami();
            setWhoamiText(whoami);
          }}
        >
          My ID
        </button> */}
        <section id="whoami">{whoamiText.toString()}</section>
      </section>
    </main>
  );
}

export default Auth;
