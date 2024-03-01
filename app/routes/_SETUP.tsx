import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, redirect } from "react-router";
import { TEST_TYPE, getUser } from "~/auth/user";
import { formatLoaderReturnData } from "~/utils/loaderFunctions";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("HIT SETUP LOADER");
  //   const { user, sessionHeader } = await getUser(request);
  //   const { user, sessionHeader } = await getUser(request, "NONE");
  const { user, sessionHeader } = await getUser(request, TEST_TYPE);
  //   const { user, sessionHeader } = await getUser(request, "DONE");
  let forcedRedirectPath: string | undefined;

  const isVerifyPath = request.url.includes("/verify");
  const isConnectPath = request.url.includes("/connect");

  if (!user) {
    forcedRedirectPath = "/";
  } else if (user.verifyEmail && user.connected) {
    forcedRedirectPath = "/dash";
  } else if (isVerifyPath && user.verifyEmail && !user.connected) {
    forcedRedirectPath = "/connect";
  } else if (isConnectPath && !user.verifyEmail) {
    forcedRedirectPath = "/verify";
  } else {
    const formattedLoaderReturn = formatLoaderReturnData({ data: user });

    return json(formattedLoaderReturn, {
      headers: sessionHeader,
    });
  }

  return redirect(forcedRedirectPath, {
    headers: sessionHeader,
  });
}

export default function SetupRoute() {
  return <Outlet />;
}
