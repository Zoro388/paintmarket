import endpointRoute from "@/lib/endpointRoute";

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const apiSignup = (body: {
  firstName: string; lastName: string;
  email: string; phoneNumber: string; password: string;
}) => endpointRoute.post("/auth/signup", body).then((r) => r.data);

export const apiLogin = (body: { email: string; password: string }) =>
  endpointRoute.post("/auth/login", body).then((r) => r.data);

export const apiLogout = () =>
  endpointRoute.post("/auth/logout").then((r) => r.data);

export const apiChangePassword = (body: {
  currentPassword: string; newPassword: string;
}) => endpointRoute.put("/auth/change-password", body).then((r) => r.data);

export const apiForgotPassword = (body: { email: string }) =>
  endpointRoute.post("/auth/forgot-password", body).then((r) => r.data);

// export const apiResetPassword = (body: { token: string; password: string }) =>
//   endpointRoute.post("/auth/reset-password", body).then((r) => r.data);

// ── USER PROFILE ──────────────────────────────────────────────────────────────
export const apiGetProfile = () =>
  endpointRoute.get("/users/profile").then((r) => r.data);

// export const apiUpdateProfile = (body: {
//   firstName?: string; lastName?: string;
//   email?: string; phoneNumber?: string; profileImage?: string;
// }) => endpointRoute.put("/users/profile", body).then((r) => r.data);

// ── PRODUCTS ──────────────────────────────────────────────────────────────────
export const apiGetProducts = (params?: {
  category?: string; search?: string; page?: number; limit?: number;
}) => endpointRoute.get("/products", { params }).then((r) => r.data);

export const apiGetProduct = (id: string) =>
  endpointRoute.get(`/products/${id}`).then((r) => r.data);

// ── ORDERS ────────────────────────────────────────────────────────────────────
// export const apiCreateOrder = (body: {
//   customerName: string; email: string; phoneNumber: string;
//   deliveryAddress: string; state: string; city: string;
//   orderedProducts: { productId: string; quantity: number; selectedColour: string }[];
//   paymentMethod: string; notes?: string;
  
// }) => endpointRoute.post("/orders", body).then((r) => r.data);
export const apiCreateOrder = (body: {
  deliveryAddress: string; state: string; city: string;
  orderedProducts: { productId: string; selectedColour: string; quantity: number }[];
  paymentMethod: "paystack" | "bank-transfer";
  notes?: string;
  paymentReference?: string;
}) => endpointRoute.post("/orders", body).then((r) => r.data);

export const apiGetMyOrders = () =>
  endpointRoute.get("/users/orders").then((r) => r.data);

export const apiGetOrder = (id: string) =>
  endpointRoute.get(`/orders/${id}`).then((r) => r.data);

// ── LEADS ─────────────────────────────────────────────────────────────────────
export const apiCreateLead = (body: {
  fullName: string; emailAddress: string; phoneNumber: string;
  location: string;
  leadSource: "Newsletter" | "Quote Request" | "Painter Request" | "Estimator Request";
  message?: string;
}) => endpointRoute.post("/leads", body).then((r) => r.data);

// ── PAINTER REQUEST ───────────────────────────────────────────────────────────
export const apiSubmitPainterRequest = (body: {
  fullName: string; phoneNumber: string; email: string;
  propertyLocation: string; projectType: string; propertyType: string;
  projectDescription: string; preferredStartDate: string; additionalNotes?: string;
}) => endpointRoute.post("/painter-requests ", body).then((r) => r.data);

// ── SITE ESTIMATOR ────────────────────────────────────────────────────────────
export const apiCreateSiteEstimator = (body: {
  fullName: string; phoneNumber: string; email: string;
  propertyLocation: string; propertyType: string;
  preferredInspectionDate: string; additionalNotes?: string;
  numberOfRooms?: number; 
}) => endpointRoute.post("/site-estimator", body).then((r) => r.data);

// ── PORTFOLIO ─────────────────────────────────────────────────────────────────
export const apiGetPortfolio = () =>
  endpointRoute.get("/portfolio").then((r) => r.data);

export const apiGetPortfolioProject = (id: string) =>
  endpointRoute.get(`/portfolio/${id}`).then((r) => r.data);

// ── BLOG ──────────────────────────────────────────────────────────────────────
export const apiGetBlogs = (params?: {
  tag?: string; search?: string; page?: number;
}) => endpointRoute.get("/blogs", { params }).then((r) => r.data);

export const apiGetBlog = (id: string) =>
  endpointRoute.get(`/blogs/${id}`).then((r) => r.data);

// ── NEWSLETTER ────────────────────────────────────────────────────────────────
export const apiSubscribeNewsletter = (body: { email: string }) =>
  endpointRoute.post("/newsletter/subscribe", body).then((r) => r.data);

// ── CONTACT ───────────────────────────────────────────────────────────────────
export const apiSubmitContact = (body: {
  fullName: string; email: string; phoneNumber: string;
  subject: string; message: string;
}) => endpointRoute.post("/contact", body).then((r) => r.data);

// ── PAYMENTS ──────────────────────────────────────────────────────────────────
export const apiInitializePayment = (body: {
  orderId: string; amount: number; email: string;
}) => endpointRoute.post("/payments/initialize", body).then((r) => r.data);

export const apiVerifyPayment = (body: { reference: string }) =>
  endpointRoute.post("/payments/verify", body).then((r) => r.data);

export const apiGetPaymentHistory = () =>
  endpointRoute.get("/payments/history").then((r) => r.data);

// cart
// ── PORTFOLIO ─────────────────────────────────────────────────────────────────
export const apiAddToCart = (body: { productId: string; quantity: number; selectedColour: string }) =>
  endpointRoute.post("/cart", body).then((r) => r.data);

export const apiGetCart = () =>
  endpointRoute.get("/cart").then((r) => r.data);

export const apiUpdateCartItem = (id: string, body: { quantity: number }) =>
  endpointRoute.put(`/cart/${id}`, body).then((r) => r.data);

export const apiRemoveFromCart = (id: string) =>
  endpointRoute.delete(`/cart/${id}`).then((r) => r.data);

// 
// ════════════════════════════════════════════════════════════════════════════
// ADD THESE TO src/lib/userApi.ts
// ════════════════════════════════════════════════════════════════════════════

// ── PROFILE ───────────────────────────────────────────────────────────────────

export const apiUpdateProfile = (body: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}) => endpointRoute.put("/users/profile", body).then((r) => r.data);


export const userGetStatus = () =>
  endpointRoute.get(`/auth/status`).then((r) => r.data);

export const userGetOrderss = () =>
  endpointRoute.get(`/orders/my-orders`).then((r) => r.data);


export const apiResetPassword = (body: {
  email: string;
  
}) => endpointRoute.put("auth/forgot-password", body).then((r) => r.data);

export const apiSetNewPassword = (body: { token: string; password: string }) =>
  endpointRoute.put("auth/reset-password", body).then((r) => r.data);