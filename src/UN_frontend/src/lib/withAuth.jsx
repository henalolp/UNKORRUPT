import { LOGIN, LOGOUT, useAuth } from "./AuthContext";
import { useEffect } from "react";
import { createBackendActor, createClient } from "../helper/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { UN_backend } from "../../../declarations/UN_backend";

let actor = UN_backend;

/**
 * Higher order component to check if user is authenticated
 *
 * This ensures that the user is authenticated before rendering the component
 * If a user is authenticated but not a member, they are logged out
 * @param Component
 */
function withAuth(Component) {
  return function WithAuth(props) {
    const { state, dispatch } = useAuth();
    const toast = useToast();

    useEffect(() => {
      async function checkAuthenticated() {
        const authClient = await createClient();
        if (await authClient.isAuthenticated()) {
          const identity = authClient.getIdentity();
          actor = await createBackendActor(identity);
          const response = await actor.getProfile();
          const member = response.ok ?? null;
          if (!member) {
            const member = await actor.registerUser('', '', '');
            dispatch({
              type: LOGIN,
              payload: {
                principal: identity?.getPrincipal(),
                member: {},
              },
            })
          } else {
            dispatch({
              type: LOGIN,
              payload: {
                principal: identity.getPrincipal(),
                member,
              },
            });
          }
        } else {
          toast({
            title: "You are not logged in",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
      checkAuthenticated();
    }, [dispatch]);

    if (state.isAuthenticated) {
      return <Component {...props} />;
    } else {
      return <p>You are not logged in.</p>;
    }
  };
}

export default withAuth;
