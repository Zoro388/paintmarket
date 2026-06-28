import axios from "axios";

const endpointRoute = axios.create({
  baseURL: "https://paint-market-backend.onrender.com/api",
  // headers: { "Content-Type": "application/json" },
});

// Attach JWT token from localStorage on every request
endpointRoute.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("sc_token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Surface backend error messages cleanly
// endpointRoute.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     const msg =
//       err?.response?.data?.message ||
//       err?.response?.data?.error ||
//       err?.message ||
//       "Something went wrong";
//     return Promise.reject(new Error(msg));
//   }
// );

// Surface backend error messages cleanly without crashing
endpointRoute.interceptors.response.use(
  (res) => res,
  (err) => {
    // ✅ Added critical optional chaining lines here to stop interceptor crashes
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.response?.statusText ||
      err?.message ||
      "Something went wrong";
    return Promise.reject(new Error(msg));
  }
);

export default endpointRoute;

// ── Token helpers ─────────────────────────────────────────────────────────────
export const saveToken = (token: string) =>
  typeof window !== "undefined" && localStorage.setItem("sc_token", token);
export const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("sc_token") : null;
export const clearToken = () =>
  typeof window !== "undefined" && localStorage.removeItem("sc_token");
