import { User } from "./user";

type PathRedirect = "/" | "/setup" | "/connect" | "/dash";

export function checkForceRedirectPath(
  user: User | null
): PathRedirect | undefined {
  if (!user) {
    return "/";
  } else if (!user.verifyEmail) {
    return "/setup";
  } else if (!user.connected) {
    return "/connect";
  }

  return;
}
