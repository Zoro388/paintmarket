import endpointRoute from "@/lib/endpointRoute";

// ── PRODUCTS ──────────────────────────────────────────────────────────────────
export const adminCreateProduct = (body: {
  productName: string; productCategory: string; productDescription: string;
  productImages: string[]; colourCode: string; colourName: string;
  price: number; stockQuantity: number; coverageInformation: string;
  productFeatures: string[]; status: "active" | "inactive";
}) => endpointRoute.post("/products", body).then((r) => r.data);

export const adminGetProducts = (params?: { page?: number; limit?: number; search?: string }) =>
  endpointRoute.get("/products", { params }).then((r) => r.data);

export const adminUpdateProduct = (id: string, body: Partial<{
  productName: string; productCategory: string; productDescription: string;
  productImages: string[]; colourCode: string; colourName: string;
  price: number; stockQuantity: number; coverageInformation: string;
  productFeatures: string[]; status: string;
}>) => endpointRoute.put(`/products/${id}`, body).then((r) => r.data);

export const adminDeleteProduct = (id: string) =>
  endpointRoute.delete(`/products/${id}`).then((r) => r.data);

// ── ORDERS ────────────────────────────────────────────────────────────────────
export const adminGetOrders = (params?: { page?: number; status?: string }) =>
  endpointRoute.get("/orders", { params }).then((r) => r.data);

export const adminGetOrder = (id: string) =>
  endpointRoute.get(`/orders/${id}`).then((r) => r.data);

export const adminUpdateOrderStatus = (id: string, body: { orderStatus: string }) =>
  endpointRoute.patch(`/orders/${id}/status`, body).then((r) => r.data);


// ── LEADS ─────────────────────────────────────────────────────────────────────
export const adminGetLeads = (params?: { page?: number; source?: string }) =>
  endpointRoute.get("/leads", { params }).then((r) => r.data);

export const adminExportLeads = () =>
  endpointRoute.get("/leads/export", { responseType: "blob" }).then((r) => r.data);

// ── PAINTER REQUESTS ──────────────────────────────────────────────────────────
export const adminGetPainterRequests = (params?: { page?: number; status?: string }) =>
  endpointRoute.get("/painter-requests", { params }).then((r) => r.data);

export const adminGetPainterRequest = (id: string) =>
  endpointRoute.get(`/painter-requests/${id}`).then((r) => r.data);

export const adminUpdatePainterRequestStatus = (id: string, body: { status: string }) =>
  endpointRoute.patch(`/painter-requests/${id}`, body).then((r) => r.data);

export const adminReplyPainterRequest = (id: string, body: { message: string }) =>
  endpointRoute.patch(`/painter-requests/${id}/respond`, body).then((r) => r.data);

// ── SITE ESTIMATOR ────────────────────────────────────────────────────────────
export const adminGetSiteEstimators = (params?: { page?: number; status?: string }) =>
  endpointRoute.get("/site-estimator", { params }).then((r) => r.data);

export const adminGetSiteEstimator = (id: string) =>
  endpointRoute.get(`/site-estimators/${id}`).then((r) => r.data);

export const adminUpdateSiteEstimatorStatus = (id: string, body: { status: string }) =>
  endpointRoute.patch(`/site-estimator/${id}`, body).then((r) => r.data);

// export const adminReplySiteEstimator = (id: string, body: { adminResponse: string; status: string; estimateAmount: number }) =>
//   endpointRoute.patch(`/site-estimator/${id}/respond`, body).then((r) => r.data);

// ── PORTFOLIO ─────────────────────────────────────────────────────────────────
// export const adminCreatePortfolioProject = (body: {
//   projectTitle: string; projectDescription: string; projectLocation: string;
//   beforeImages: string[]; workInProgressImages: string[]; completedImages: string[];
//   materialsUsed: string[]; customerTestimonial?: string;
//   completionDate: string; featuredProject: boolean;
// }) => endpointRoute.post("/portfolio", body).then((r) => r.data);

// export const adminGetPortfolio = () =>
//   endpointRoute.get("/portfolio").then((r) => r.data);

// export const adminUpdatePortfolioProject = (id: string, body: object) =>
//   endpointRoute.put(`/portfolio/${id}`, body).then((r) => r.data);

// export const adminDeletePortfolioProject = (id: string) =>
//   endpointRoute.delete(`/portfolio/${id}`).then((r) => r.data);

// ── BLOG ──────────────────────────────────────────────────────────────────────
export const adminCreateBlog = (body: {
  title: string; featuredImages: string[]; shortDescription: string;
  content: string; author: string; status: "draft" | "published"; tags: string[];
}) => endpointRoute.post("/blogs", body).then((r) => r.data);

export const adminGetBlogs = (params?: { page?: number; status?: string }) =>
  endpointRoute.get("/blogs", { params }).then((r) => r.data);

export const adminUpdateBlog = (id: string, body: object) =>
  endpointRoute.put(`/blogs/${id}`, body).then((r) => r.data);

export const adminDeleteBlog = (id: string) =>
  endpointRoute.delete(`/blogs/${id}`).then((r) => r.data);

// ── NEWSLETTER ────────────────────────────────────────────────────────────────
// export const adminGetSubscribers = (params?: { page?: number }) =>
//   endpointRoute.get("/newsletter/subscribers", { params }).then((r) => r.data);

export const adminExportSubscribers = () =>
  endpointRoute.get("/newsletter/export", { responseType: "blob" }).then((r) => r.data);

// ── CONTACT ───────────────────────────────────────────────────────────────────
export const adminGetEnquiries = (params?: { page?: number; status?: string }) =>
  endpointRoute.get("/contact", { params }).then((r) => r.data);

export const adminGetEnquiry = (id: string) =>
  endpointRoute.get(`/contact/${id}`).then((r) => r.data);

// ── PAYMENTS ──────────────────────────────────────────────────────────────────
export const adminGetPayments = (params?: { page?: number }) =>
  endpointRoute.get("/payments/history", { params }).then((r) => r.data);


// portfolio
// export const adminCreatePortfolioProject = (formData: FormData) =>
//   endpointRoute.post("/portfolio", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   }).then((r) => r.data);
//   export const adminCreatePortfolioProject = (formData: FormData) =>
//   endpointRoute.post("/portfolio", formData) // Let Axios auto-detect FormData
//     .then((r) => r.data);
 
// export const adminGetPortfolio = () =>
//   endpointRoute.get("/portfolio").then((r) => r.data);
 
// export const adminUpdatePortfolioProject = (id: string, body: object) =>
//   endpointRoute.put(`/portfolio/${id}`, body).then((r) => r.data);
 
// export const adminDeletePortfolioProject = (id: string) =>
//   endpointRoute.delete(`/portfolio/${id}`).then((r) => r.data);

// ── PORTFOLIO ─────────────────────────────────────────────────────────────────
export const adminCreatePortfolioProject = (formData: FormData) =>
  endpointRoute.post("/portfolio", formData, {
    headers: { "Content-Type": undefined }, // Let Axios/browser set multipart boundary automatically
  }).then((r) => r.data);
 
export const adminGetPortfolio = () =>
  endpointRoute.get("/portfolio").then((r) => r.data);
 
export const adminUpdatePortfolioProject = (id: string, body: object) =>
  endpointRoute.put(`/portfolio/${id}`, body).then((r) => r.data);
 
export const adminDeletePortfolioProject = (id: string) =>
  endpointRoute.delete(`/portfolio/${id}`).then((r) => r.data);
 

// get dashboard stats
export const adminGetDashboardStats = ( ) =>
  endpointRoute.get("/admin/dashboard").then((r) => r.data);


// 
// ── NEWSLETTER SUBSCRIBERS ───────────────────────────────────────────────────────
export const adminGetSubscribers = () =>
  endpointRoute.get("/newsletter/subscribers").then((r) => r.data);
// Response shape: { subscribers: true, count: 2, subscribers: [{ id, email, createdAt }] }

export const adminReplyContact = (id: string, body: { adminResponse: string;  }) =>
  endpointRoute.patch(`/contact/${id}/respond`, body).then((r) => r.data);


export const adminUpdateContactResponse = (id: string, body: { adminResponse: string; status: string }) =>
  endpointRoute.patch(`/contact/${id}/respond`, body).then((r) => r.data);

//  ,  


  // ✅ Fix: Let Axios handle it completely by removing the headers object
export const apiCreateTool = (formData: FormData) =>
  endpointRoute.post("/tools", formData).then((r) => r.data);
  // export const apiUpdateTool = (id: string, body: { name: string; description: string }) =>
  // endpointRoute.put(`/tools/${id}/`, body).then((r) => r.data);

  // Update your API helper definition to allow FormData
export const apiUpdateTool = (id: string, formData: FormData) =>
  endpointRoute.put(`/tools/${id}`, formData).then((r) => r.data);

  export const apiDeleteTool = (id: string) =>
  endpointRoute.put(`/tools/${id}/`).then((r) => r.data);

  export const apiGetTools = () =>
  endpointRoute.get("/tools").then((r) => r.data);


  // omoh
  
  // send campaign,
  export const apiSendCampaign = (body: {
  title: string; message: string; buttonText: string;
  buttonLink: string;
}) => endpointRoute.post("/newsletter/send-campaign", body).then((r) => r.data);


// get all users
export const adminGetAllUsers = () =>
  endpointRoute.get("/admin/users").then((r) => r.data);
// Response shape: { subscribers: true, count: 2, subscribers: [{ id, email, createdAt }] }
