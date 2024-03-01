export function formatLoaderReturnData<T>({
  data,
  toastErrors,
  toastSuccesses,
}: {
  data: T;
  toastErrors?: string[];
  toastSuccesses?: string[];
}): { data: T; toastErrors?: string[]; toastSuccesses?: string[] } {
  return { data, toastErrors, toastSuccesses };
}
