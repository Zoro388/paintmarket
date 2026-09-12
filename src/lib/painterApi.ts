
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
  skills?: string[]; 
  services?: string[];
  profileImage?: File;
  portfolioImages?: File[]; 
  retainedPortfolioIds?: string[]; 
}