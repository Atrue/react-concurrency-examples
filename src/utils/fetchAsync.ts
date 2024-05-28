export default async function fetchAsync<T>(...args: Parameters<typeof fetch>): Promise<T> {
  const response = await fetch(...args);
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(response.statusText);
  }
}
