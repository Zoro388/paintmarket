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
export const apiGetData = () => 
  endpointRoute.get("/master-data").then((r) => r.data);




export const apiRegisterPainter = (formData: FormData) => 
  endpointRoute.post("/painters/register", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then((r) => r.data);


  export const painterGetStatus = (params?: { page?: number; status?: string }) =>
  endpointRoute.get("/painters/me/status", { params }).then((r) => r.data);

  export const painterUploadVerificationVideo = async (formData: FormData) => {
  const response = await endpointRoute.patch(
    "/painters/upload-verification-video",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};


export interface UpdatePainterProfileParams {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bio?: string;
  city?: string;
  state?: string;
  yearsOfExperience?: number;
  skills?: string[]; // ObjectIds
  services?: string[]; // ObjectIds
  profileImage?: File;
  portfolioImages?: File[]; // New image uploads
  retainedPortfolioIds?: string[]; // Existing image _ids to keep
}

export interface UpdatePainterProfileParams {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bio?: string;
  city?: string;
  state?: string;
  yearsOfExperience?: number;
  skills?: string[]; // Should be array of ObjectId strings expected by Mongoose
  services?: string[]; // Should be array of ObjectId strings expected by Mongoose
  profileImage?: File;
}

export const apiUpdatePainterProfile = (body: UpdatePainterProfileParams) => {
  if (body.profileImage) {
    const fd = new FormData();
    fd.append("firstName", body.firstName);
    fd.append("lastName", body.lastName);
    fd.append("phoneNumber", body.phoneNumber);

    if (body.bio !== undefined) fd.append("bio", body.bio);
    if (body.city !== undefined) fd.append("city", body.city);
    if (body.state !== undefined) fd.append("state", body.state);
    if (body.yearsOfExperience !== undefined) {
      fd.append("yearsOfExperience", String(body.yearsOfExperience));
    }

    // Append array items individually for FormData parsing
    if (body.skills) {
      body.skills.forEach((skillId) => fd.append("skills", skillId));
    }
    if (body.services) {
      body.services.forEach((serviceId) => fd.append("services", serviceId));
    }

    fd.append("profileImage", body.profileImage);
    return endpointRoute.put("/painters/profile", fd).then((r) => r.data);
  }

  const { profileImage: _, ...jsonBody } = body;
  return endpointRoute.put("/painters/profile", jsonBody).then((r) => r.data);
};

export const apiGetPainterProfile = () =>
  endpointRoute.get("/painters/dashboard").then((r) => r.data);

// Portfolio Endpoints
export const apiUploadPortfolioImages = (files: File[]) => {
  const fd = new FormData();
  files.forEach((file) => fd.append("images", file));
  return endpointRoute.post("/painters/portfolio", fd).then((r) => r.data);
};

export const apiDeletePortfolioImage = (imageId: string) => {
  return endpointRoute
    .delete(`/painters/portfolio/${imageId}`)
    .then((r) => r.data);
};