import {
  json,
  redirect,
  type MetaFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { TEST_TYPE, getUser } from "~/auth/user";
import { formatLoaderReturnData } from "~/utils/loaderFunctions";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  //   const { user, sessionHeader } = await getUser(request);
  //   const { user, sessionHeader } = await getUser(request, "NONE");
  const { user, sessionHeader } = await getUser(request, TEST_TYPE);
  //   const { user, sessionHeader } = await getUser(request, "DONE");
  let forceRedirectPath: string | undefined;

  if (user) {
    if (!user.verifyEmail) {
      forceRedirectPath = "/verify";
    } else if (!user.connected) {
      forceRedirectPath = "/connect";
    } else {
      forceRedirectPath = "/dash";
    }
  } else {
    const returnData = formatLoaderReturnData({ data: undefined });

    return json(returnData, {
      headers: sessionHeader,
    });
  }

  return redirect(forceRedirectPath, {
    headers: sessionHeader,
  });
}

export default function Index() {
  return <div>HOME, FUCK YEAH!</div>;
}
