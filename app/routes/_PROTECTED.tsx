import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { TEST_TYPE, getUser } from "~/auth/user";
import { formatLoaderReturnData } from "~/utils/loaderFunctions";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("HIT");
  //================================================================
  //Get user information from service
  //   const { user, sessionHeader } = await getUser(request);
  //   const { user, sessionHeader } = await getUser(request, "NONE");
  const { user, sessionHeader } = await getUser(request, TEST_TYPE);
  //   const { user, sessionHeader } = await getUser(request, "DONE");

  //================================================================
  //Check if user must be redirected to a different path
  let forcedRedirectPath: string | undefined;

  if (!user) {
    forcedRedirectPath = "/";
  } else if (!user.verifyEmail) {
    forcedRedirectPath = "/verify";
  } else if (!user.connected) {
    forcedRedirectPath = "/connect";
  } else {
    //Use the standardized data format of route return data => {data, toastErrors, toastSuccesses}
    const formattedLoaderReturn = formatLoaderReturnData({ data: user });

    //If no redirect condition was met just return the user with the header to update the cookie
    return json(formattedLoaderReturn, { headers: sessionHeader });
  }

  //Redirect the user to forced path with cookie to update header;
  return redirect(forcedRedirectPath, { headers: sessionHeader });
}

export default function ProtectedRoute() {
  const { data } = useLoaderData<typeof loader>();
  return <Outlet />;
}
