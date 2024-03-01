import { createCookie } from "@remix-run/node";

export type User = {
  name: string;
  verifyEmail: boolean;
  connected: boolean;
};

type UserType = "NONE" | "PARTIAL" | "DONE";

export const TEST_TYPE: UserType | undefined = "DONE";

const users: { [type in UserType]: User } = {
  NONE: {
    name: "NONE",
    verifyEmail: false,
    connected: false,
  },
  PARTIAL: {
    name: "PARTIAL",
    verifyEmail: true,
    connected: false,
  },
  DONE: {
    name: "DONE",
    verifyEmail: true,
    connected: true,
  },
};

type GetUserResponse = {
  user?: User;
  sessionHeader: Headers;
};

export const userSessionCookie = createCookie("session", {
  maxAge: 60 * 60 * 24 * 400,
});

export function getUser(request: Request, type?: UserType) {
  return new Promise<GetUserResponse>(async (res) => {
    const newSessionHeader = new Headers();

    const cookies = request.headers.get("Cookie");

    const userOnSessionCookie = await userSessionCookie.parse(cookies);

    console.log(userOnSessionCookie);

    if (userOnSessionCookie) {
      return res({
        user: userOnSessionCookie as User,
        sessionHeader: newSessionHeader,
      });
    }

    setTimeout(async () => {
      if (type) {
        //Grab user from service
        const user = users[type];

        //Get set-cookie header from response from service and add it to our new headers
        newSessionHeader.append(
          "Set-Cookie",
          await userSessionCookie.serialize(user)
        );

        res({ user, sessionHeader: newSessionHeader });
      }

      //If there is no user make sure to remove set the cookie to be removed
      newSessionHeader.append(
        "Set-Cookie",
        await userSessionCookie.serialize(undefined, {
          maxAge: -1,
        })
      );

      return res({ sessionHeader: newSessionHeader });
    }, 1000);
  });
}
