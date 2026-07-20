import endpointRoute from "./endpointRoute";


export const painterGetDashboardStats = ( ) =>
  endpointRoute.get("/painters/dashboard").then((r) => r.data);

export const painterRequests = ( ) =>
  endpointRoute.get("/painter-requests/my-requests").then((r) => r.data);

export const acceptPainterRequest = (id: string) => 
  endpointRoute.patch(`/painter-requests/${id}/accept`).then((r) => r.data);

export const declinePainterRequest = (id: string, reason: string) => 
  endpointRoute.patch(`/painter-requests/${id}/decline`, { reason }).then((r) => r.data)


export const painterReviews = ( ) =>
  endpointRoute.get("/reviews/my-reviews").then((r) => r.data);



// 1. Fetch MasterData Lookups
export const apiGetSkills = () => 
  endpointRoute.get("/masterdata/skills").then((r) => r.data);

export const apiGetServices = () => 
  endpointRoute.get("/masterdata/services").then((r) => r.data);

export const apiGetPreferredBrands = () => 
  endpointRoute.get("/masterdata/brands").then((r) => r.data);

// 2. Register Painter (Multipart Form-Data Request)
export const apiRegisterPainter = (formData: FormData) => 
  endpointRoute.post("/painters/register", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then((r) => r.data);