import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  productsApi,
  vendorsApi,
  cartApi,
  ordersApi,
  couponsApi,
  searchApi,
  categoriesApi,
  addressesApi,
  prescriptionsApi,
  prescriptionOrdersApi,
  usersApi,
  doctorsApi,
  labTestsApi,
  marketingApi,
  uploadApi,
  inventoryApi,
  returnsApi,
  adminGeneralApi,
  notificationsApi,
} from "@/lib/api/index";
import { mapProductsToMedicines, mapProductToMedicine, mapProductsToStoreProducts } from "@/lib/mappers/product";
import { mapVendorsToPharmacies, mapVendorToPharmacy } from "@/lib/mappers/vendor";
import { mapOrdersToFrontend, mapOrderToFrontend } from "@/lib/mappers/order";
import { mapCartToFrontend } from "@/lib/mappers/cart";
import {
  mapDoctorsToFrontend,
  mapDoctorToFrontend,
  mapDoctorReviewsToFrontend,
  mapDoctorAppointmentToFrontend,
  mapDoctorAppointmentsToFrontend,
} from "@/lib/mappers/doctor";
import {
  mapLabTestsToFrontend,
  mapLabTestToFrontend,
  mapLabTestBookingToFrontend,
} from "@/lib/mappers/labTest";
import { mapPrescriptionOrdersToFrontend } from "@/lib/mappers/prescriptionOrder";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const data = await productsApi.getAll();
      return mapProductsToMedicines(data.products || []);
    },
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const data = await productsApi.getAdminAll();
      return data.products || [];
    },
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ["products", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const data = await productsApi.getById(id);
      return mapProductToMedicine(data.product);
    },
  });
}

export function useProductReviews(id) {
  return useQuery({
    queryKey: ["product-reviews", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const data = await productsApi.getReviews(id);
      return data.reviews || [];
    },
  });
}

export function useVendors() {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const data = await vendorsApi.getAll();
      return mapVendorsToPharmacies(data.vendors || []);
    },
  });
}

export function useAdminVendors() {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["admin-vendors"],
    queryFn: async () => {
      const data = await vendorsApi.getAll({ all: 'true' });
      return data.vendors || [];
    },
  });
}

export function useVendor(id) {
  return useQuery({
    queryKey: ["vendors", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const data = await vendorsApi.getAll();
      const vendor = (data.vendors || []).find((v) => v.id === id);
      return mapVendorToPharmacy(vendor);
    },
  });
}

export function useVendorBySlug(slug) {
  return useQuery({
    queryKey: ["vendors", "slug", slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const data = await vendorsApi.getAll();
      const vendors = mapVendorsToPharmacies(data.vendors || []);
      return vendors.find((v) => v.slug === slug) ?? null;
    },
  });
}

export function useVendorProducts(vendorId) {
  return useQuery({
    queryKey: ["vendor-products-public", vendorId],
    enabled: Boolean(vendorId),
    queryFn: async () => {
      const data = await productsApi.getAll({ vendor_id: vendorId });
      return mapProductsToStoreProducts(data.products || []);
    },
  });
}

export function useVendorReviews(id) {
  return useQuery({
    queryKey: ["vendor-reviews", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const data = await vendorsApi.getReviews(id);
      return data.reviews || [];
    },
  });
}

export function useCreateVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => vendorsApi.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}

export function useUpdateVendorStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }) => vendorsApi.updateStatus(id, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}

export function useUpdateVendorCredentials() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => vendorsApi.updateCredentials(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}

export function useDeleteVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => vendorsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}

export function useUploadDocument() {
  return useMutation({
    mutationFn: (file) => uploadApi.uploadDocument(file).then(res => res.data || res),
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: (file) => uploadApi.uploadImage(file).then(res => res.data || res),
  });
}

export function useVendorProfile(options = {}) {
  return useQuery({
    queryKey: ["vendor-profile"],
    queryFn: async () => {
      const data = await vendorsApi.getProfile();
      return data.vendor || data;
    },
    ...options,
  });
}

export function useVendorAvailability(options = {}) {
  return useQuery({
    queryKey: ["vendor-availability"],
    queryFn: async () => {
      const data = await vendorsApi.getAvailability();
      return data.availability || data;
    },
    ...options,
  });
}

export function useVendorOperatingHours(options = {}) {
  return useQuery({
    queryKey: ["vendor-operating-hours"],
    queryFn: async () => {
      const data = await vendorsApi.getOperatingHours();
      return data.hours || [];
    },
    ...options,
  });
}

export function useVendorServiceAreas(options = {}) {
  return useQuery({
    queryKey: ["vendor-service-areas"],
    queryFn: async () => {
      const data = await vendorsApi.getServiceAreas();
      return data.areas || [];
    },
    ...options,
  });
}

export function useVendorOrders(params = {}, options = {}) {
  return useQuery({
    queryKey: ["vendor-orders", params],
    queryFn: async () => {
      const data = await ordersApi.getVendorOrders(params);
      return {
        orders: data.orders || [],
        page: data.page || 1,
        pageSize: data.pageSize || 20,
        total: data.total || (data.orders || []).length,
      };
    },
    ...options,
  });
}

export function useVendorOrder(id, options = {}) {
  return useQuery({
    queryKey: ["vendor-order", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const data = await ordersApi.getById(id);
      return data.order;
    },
    ...options,
  });
}

export function useVendorPrescriptionOrders(options = {}) {
  return useQuery({
    queryKey: ["vendor-prescription-orders"],
    queryFn: async () => {
      const data = await prescriptionOrdersApi.getVendorOrders();
      return mapPrescriptionOrdersToFrontend(data.orders || []);
    },
    refetchInterval: 3000,
    ...options,
  });
}

export function useVendorPrescriptionHistory(options = {}) {
  return useQuery({
    queryKey: ["vendor-prescription-history"],
    queryFn: async () => {
      const data = await prescriptionOrdersApi.getVendorHistory();
      return mapPrescriptionOrdersToFrontend(data.orders || []);
    },
    ...options,
  });
}

export function useAcceptPrescriptionOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => prescriptionOrdersApi.accept(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-prescription-orders"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-prescription-history"] });
    },
  });
}

export function useDeclinePrescriptionOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => prescriptionOrdersApi.decline(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-prescription-orders"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-prescription-history"] });
    },
  });
}

export function useConfirmPrescriptionStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => prescriptionOrdersApi.confirmStock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-prescription-orders"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-prescription-history"] });
    },
  });
}

export function useMarkPrescriptionPacked() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => prescriptionOrdersApi.markPacked(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-prescription-orders"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-prescription-history"] });
    },
  });
}

export function useMyVendorProducts(params = {}, options = {}) {
  return useQuery({
    queryKey: ["vendor-products", params],
    queryFn: async () => {
      const data = await vendorsApi.getMyProducts(params);
      return {
        products: data.products || [],
        page: data.page || 1,
        pageSize: data.pageSize || 20,
        total: data.total || (data.products || []).length,
      };
    },
    ...options,
  });
}

export function useMyVendorProduct(id, options = {}) {
  return useQuery({
    queryKey: ["vendor-product", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const data = await vendorsApi.getMyProduct(id);
      return data.product;
    },
    ...options,
  });
}

export function useVendorDashboardStats(options = {}) {
  return useQuery({
    queryKey: ["vendor-dashboard-stats"],
    queryFn: async () => {
      const data = await vendorsApi.getDashboardStats();
      return data.stats;
    },
    ...options,
  });
}

export function useUpdateVendorProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => vendorsApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-dashboard-stats"] });
    },
  });
}

export function useUpdateVendorAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => vendorsApi.updateAvailability(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-availability"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-dashboard-stats"] });
    },
  });
}

export function useUpdateVendorOperatingHours() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (hours) => vendorsApi.updateOperatingHours(hours),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-operating-hours"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-availability"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
    },
  });
}

export function useUpdateVendorServiceAreas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (areas) => vendorsApi.updateServiceAreas(areas),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-service-areas"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-availability"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
    },
  });
}

export function useVendorEarningsSummary(options = {}) {
  return useQuery({
    queryKey: ["vendor-earnings-summary"],
    queryFn: async () => {
      const data = await vendorsApi.getEarningsSummary();
      return data.summary || data;
    },
    ...options,
  });
}

export function useVendorSettlements(options = {}) {
  return useQuery({
    queryKey: ["vendor-settlements"],
    queryFn: async () => {
      const data = await vendorsApi.getSettlements();
      return data.settlements || [];
    },
    ...options,
  });
}

export function useVendorAnalyticsOverview(options = {}) {
  return useQuery({
    queryKey: ["vendor-analytics-overview"],
    queryFn: async () => {
      const data = await vendorsApi.getAnalyticsOverview();
      return data.overview || data;
    },
    ...options,
  });
}

export function useVendorAnalyticsPerformance(options = {}) {
  return useQuery({
    queryKey: ["vendor-analytics-performance"],
    queryFn: async () => {
      const data = await vendorsApi.getAnalyticsPerformance();
      return data.performance || data;
    },
    ...options,
  });
}

export function useVendorAuditLogs(options = {}) {
  return useQuery({
    queryKey: ["vendor-audit-logs"],
    queryFn: async () => {
      const data = await vendorsApi.getAuditLogs();
      return data.logs || [];
    },
    ...options,
  });
}

export function useVendorNotifications(options = {}) {
  return useQuery({
    queryKey: ["vendor-notifications"],
    queryFn: async () => {
      const data = await notificationsApi.getVendorNotifications();
      return data.notifications || [];
    },
    refetchInterval: 10000,
    ...options,
  });
}

export function useMarkVendorNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationsApi.markVendorNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-notifications"] });
    },
  });
}

export function useBulkImportProducts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileOrPayload) => {
      const file = fileOrPayload?.file || fileOrPayload;
      const importValidOnly = fileOrPayload?.importValidOnly !== false;
      return inventoryApi.bulkImport(file, { import_valid_only: importValidOnly ? "true" : "false" }).then((res) => res.data || res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-inventory"] });
    },
  });
}

export function useValidateBulkImport() {
  return useMutation({
    mutationFn: (file) => inventoryApi.validateImport(file).then((res) => res.data || res),
  });
}

export function useSearchVendorProducts(q, options = {}) {
  return useQuery({
    queryKey: ["vendor-product-search", q],
    enabled: Boolean(String(q || "").trim()),
    queryFn: async () => {
      const data = await vendorsApi.searchMyProducts(q);
      return data.products || [];
    },
    ...options,
  });
}

export function useAdjustInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => inventoryApi.adjust(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-inventory"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-dashboard-stats"] });
    },
  });
}

export function useExpiringBatches(options = {}) {
  return useQuery({
    queryKey: ["vendor-expiring"],
    queryFn: async () => {
      const data = await inventoryApi.expiring();
      return data.batches || [];
    },
    ...options,
  });
}

export function useMarkAllVendorNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllVendorRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["inbox-notifications"] });
    },
  });
}

export function usePrescriptionDocument(id, options = {}) {
  return useQuery({
    queryKey: ["vendor-prescription-document", id],
    enabled: Boolean(id),
    queryFn: async () => prescriptionOrdersApi.getDocument(id),
    ...options,
  });
}

export function useCreateVendorProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-dashboard-stats"] });
    },
  });
}

export function useUpdateVendorProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-dashboard-stats"] });
    },
  });
}

export function useDeleteVendorProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-dashboard-stats"] });
    },
  });
}

export function useUpdateVendorOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, ...extra }) => ordersApi.updateStatus(id, status, extra),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-order"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-dashboard-stats"] });
    },
  });
}

export function useCart(options = {}) {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const data = await cartApi.get();
      return mapCartToFrontend(data.cart);
    },
    ...options,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity = 1 }) =>
      cartApi.addItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }) => cartApi.updateItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId) => cartApi.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useOrders(options = {}) {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const data = await ordersApi.getAll();
      return mapOrdersToFrontend(data.orders || []);
    },
    ...options,
  });
}

export function useAdminOrders(options = {}) {
  return useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const data = await ordersApi.getAdminAll();
      return data.orders || [];
    },
    ...options,
  });
}

export function useOrder(id, options = {}) {
  return useQuery({
    queryKey: ["orders", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const data = await ordersApi.getById(id);
      return mapOrderToFrontend(data.order);
    },
    ...options,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => ordersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useCoupons(options = {}) {
  return useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const data = await couponsApi.getApplicable();
      return data.coupons || [];
    },
    ...options,
  });
}

export function useValidateCoupon() {
  return useMutation({
    mutationFn: ({ code, orderAmount }) => couponsApi.validate(code, orderAmount),
  });
}

export function useSearch(query, options = {}) {
  return useQuery({
    queryKey: ["search", query],
    enabled: Boolean(query?.trim()),
    queryFn: async () => {
      const data = await searchApi.search(query);
      return data.results || data;
    },
    ...options,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await categoriesApi.getAll();
      return data.categories || [];
    },
  });
}

export function useAddresses(options = {}) {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const data = await addressesApi.getAll();
      return data.addresses || [];
    },
    ...options,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => addressesApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => addressesApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => addressesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => usersApi.updateProfile(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user-profile"] }),
  });
}

export function usePrescriptions(options = {}) {
  return useQuery({
    queryKey: ["prescriptions"],
    queryFn: async () => {
      const data = await prescriptionsApi.getAll();
      return data.prescriptions || [];
    },
    ...options,
  });
}

export function useUploadPrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file) => prescriptionsApi.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
    },
  });
}

export function useUserProfile(options = {}) {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const data = await usersApi.getProfile();
      return data.user;
    },
    ...options,
  });
}

export function useAdminCustomers(options = {}) {
  return useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const data = await usersApi.getAdminCustomers();
      return data.customers || [];
    },
    ...options,
  });
}

// Marketing
export function useMarketingCoupons(options = {}) {
  return useQuery({
    queryKey: ["marketing-coupons"],
    queryFn: async () => {
      const data = await marketingApi.getCoupons();
      return data.coupons || [];
    },
    ...options,
  });
}

export function useMarketingOffers(options = {}) {
  return useQuery({
    queryKey: ["marketing-offers"],
    queryFn: async () => {
      const data = await marketingApi.getOffers();
      return data.offers || [];
    },
    ...options,
  });
}

export function useCreateCoupon(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: marketingApi.createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-coupons"] });
    },
    ...options,
  });
}

export function useDeleteCoupon(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: marketingApi.deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-coupons"] });
    },
    ...options,
  });
}

export function useDoctors(params = {}, options = {}) {
  return useQuery({
    queryKey: ["doctors", params],
    queryFn: async () => {
      const data = await doctorsApi.getAll(params);
      return mapDoctorsToFrontend(data.doctors || []);
    },
    ...options,
  });
}

export function useDoctorFilters() {
  return useQuery({
    queryKey: ["doctor-filters"],
    queryFn: async () => {
      const data = await doctorsApi.getFilters();
      return data.filters;
    },
  });
}

export function useDoctor(id, options = {}) {
  return useQuery({
    queryKey: ["doctors", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const data = await doctorsApi.getById(id);
      return mapDoctorToFrontend(data.doctor);
    },
    ...options,
  });
}

export function useDoctorReviews(id, options = {}) {
  return useQuery({
    queryKey: ["doctor-reviews", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const data = await doctorsApi.getReviews(id);
      return mapDoctorReviewsToFrontend(data.reviews || []);
    },
    ...options,
  });
}

export function useDoctorSlots(id, date, options = {}) {
  return useQuery({
    queryKey: ["doctor-slots", id, date],
    queryFn: async () => {
      const data = await doctorsApi.getSlots(id, date);
      return {
        slots: data.slots || [],
        booked: data.booked || [],
        ranges: data.ranges || [],
        day: data.day || "",
      };
    },
    enabled: Boolean(id && date),
    staleTime: 15_000,
    refetchInterval: 30_000,
    ...options,
  });
}

export function useBookDoctorAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => doctorsApi.bookAppointment(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-slots", variables.doctor_id] });
    },
  });
}

export function useDoctorAppointments(options = {}) {
  return useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: async () => {
      const data = await doctorsApi.getMyAppointments();
      return mapDoctorAppointmentsToFrontend(data.appointments || []);
    },
    ...options,
  });
}

export function useDoctorAppointment(id, options = {}) {
  return useQuery({
    queryKey: ["doctor-appointments", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const data = await doctorsApi.getMyAppointment(id);
      return mapDoctorAppointmentToFrontend(data.appointment);
    },
    ...options,
  });
}

export function useCancelDoctorAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => doctorsApi.cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-slots"] });
    },
  });
}

export function useRescheduleDoctorAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => doctorsApi.rescheduleAppointment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-slots"] });
    },
  });
}

export function useJoinDoctorConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => doctorsApi.joinConsultation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] }),
  });
}

export function useDoctorConsultation(meetingId, options = {}) {
  return useQuery({
    queryKey: ["doctor-consultation", meetingId],
    enabled: Boolean(meetingId),
    queryFn: async () => {
      const data = await doctorsApi.getConsultation(meetingId);
      return mapDoctorAppointmentToFrontend(data.appointment);
    },
    ...options,
  });
}

export function useSubmitDoctorReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ doctorId, ...payload }) => doctorsApi.submitReview(doctorId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-reviews", variables.doctorId] });
      queryClient.invalidateQueries({ queryKey: ["doctors", variables.doctorId] });
    },
  });
}

export function useLabTestCategories() {
  return useQuery({
    queryKey: ["lab-test-categories"],
    queryFn: async () => {
      const data = await labTestsApi.getCategories();
      return data.categories || [];
    },
  });
}

export function useLabTestTimeSlots() {
  return useQuery({
    queryKey: ["lab-test-time-slots"],
    queryFn: async () => {
      const data = await labTestsApi.getTimeSlots();
      return data.timeSlots || [];
    },
  });
}

export function useLabTests(params = {}, options = {}) {
  return useQuery({
    queryKey: ["lab-tests", params],
    queryFn: async () => {
      const data = await labTestsApi.getAll(params);
      return mapLabTestsToFrontend(data.tests || []);
    },
    ...options,
  });
}

export function usePopularLabTests(options = {}) {
  return useQuery({
    queryKey: ["lab-tests-popular"],
    queryFn: async () => {
      const data = await labTestsApi.getPopular();
      return mapLabTestsToFrontend(data.tests || []);
    },
    ...options,
  });
}

export function useLabTest(id, options = {}) {
  return useQuery({
    queryKey: ["lab-tests", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const data = await labTestsApi.getById(id);
      return mapLabTestToFrontend(data.test);
    },
    ...options,
  });
}

export function useBookLabTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => labTestsApi.book(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-test-bookings"] });
    },
  });
}

export function useLabTestBookings(options = {}) {
  return useQuery({
    queryKey: ["lab-test-bookings"],
    queryFn: async () => {
      const data = await labTestsApi.getMyBookings();
      return (data.bookings || []).map(mapLabTestBookingToFrontend);
    },
    ...options,
  });
}

// --- Admin General Hooks ---
export function useAdminDoctors(options = {}) {
  return useQuery({
    queryKey: ["admin-doctors"],
    queryFn: async () => {
      const data = await adminGeneralApi.getDoctors();
      return data.doctors || [];
    },
    ...options,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => adminGeneralApi.createDoctor(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-doctors"] }),
  });
}

export function useUpdateDoctorStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_active, note }) => adminGeneralApi.updateDoctorStatus(id, is_active, note),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-doctors"] }),
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => adminGeneralApi.deleteDoctor(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-doctors"] }),
  });
}

export function useAdminDoctorAppointments(doctorId, options = {}) {
  return useQuery({
    queryKey: ["admin-doctor-appointments", doctorId],
    enabled: Boolean(doctorId),
    queryFn: async () => {
      const data = await adminGeneralApi.getDoctorAppointments(doctorId);
      return {
        appointments: data.appointments || [],
        summary: data.summary || {},
      };
    },
    ...options,
  });
}

export function useAdminLabs(options = {}) {
  return useQuery({
    queryKey: ["admin-labs"],
    queryFn: async () => {
      const data = await adminGeneralApi.getLabs();
      return data.labs || [];
    },
    ...options,
  });
}

export function useCreateLab() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => adminGeneralApi.createLab(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-labs"] }),
  });
}

export function useUpdateLabStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }) => adminGeneralApi.updateLabStatus(id, status, note),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-labs"] }),
  });
}

export function useDeleteLab() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => adminGeneralApi.deleteLab(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-labs"] }),
  });
}

export function useAdminCreateVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => adminGeneralApi.createVendor(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-vendors"] }),
  });
}

export function useAuditLogs(options = {}) {
  return useQuery({
    queryKey: ["admin-audit-logs"],
    queryFn: async () => {
      const data = await adminGeneralApi.getAuditLogs();
      return data.logs || [];
    },
    ...options,
  });
}

export function useImpersonate() {
  return useMutation({
    mutationFn: ({ entity_id, role }) => adminGeneralApi.impersonate(entity_id, role),
  });
}

export function useVendorInventory(params = {}, options = {}) {
  return useQuery({
    queryKey: ["vendor-inventory", params],
    queryFn: async () => {
      const data = await inventoryApi.list(params);
      return {
        items: data.items || [],
        page: data.page || 1,
        pageSize: data.pageSize || 20,
        total: data.total || 0,
      };
    },
    ...options,
  });
}

export function useVendorBatches(params = {}, options = {}) {
  return useQuery({
    queryKey: ["vendor-batches", params],
    queryFn: async () => {
      const data = await inventoryApi.batches(params);
      return data.batches || [];
    },
    ...options,
  });
}

export function useAddBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => inventoryApi.addBatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-batches"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-inventory"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
    },
  });
}

export function useUpdateStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stock, reason }) => inventoryApi.updateStock(id, stock, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-inventory"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-dashboard-stats"] });
    },
  });
}

export function useVendorReturns(options = {}) {
  return useQuery({
    queryKey: ["vendor-returns"],
    queryFn: async () => {
      const data = await returnsApi.getVendorReturns();
      return data.returns || [];
    },
    ...options,
  });
}

export function useUpdateVendorReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => returnsApi.updateVendorReturn(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendor-returns"] }),
  });
}

export function useVendorSalesReport(params = {}, options = {}) {
  return useQuery({
    queryKey: ["vendor-sales-report", params],
    queryFn: async () => {
      const data = await vendorsApi.getSalesReport(params);
      return data.report;
    },
    ...options,
  });
}

export function useVendorPayouts(options = {}) {
  return useQuery({
    queryKey: ["vendor-payouts"],
    queryFn: async () => {
      const data = await vendorsApi.getPayoutOverview();
      return data.overview || data;
    },
    ...options,
  });
}

export function useVendorStaff(options = {}) {
  return useQuery({
    queryKey: ["vendor-staff"],
    queryFn: async () => {
      const data = await vendorsApi.getStaff();
      return data.staff || [];
    },
    ...options,
  });
}

export function useInviteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => vendorsApi.inviteStaff(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendor-staff"] }),
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => vendorsApi.updateStaff(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendor-staff"] }),
  });
}

export function useVendorLoginActivity(options = {}) {
  return useQuery({
    queryKey: ["vendor-login-activity"],
    queryFn: async () => {
      const data = await vendorsApi.getLoginActivity();
      return data.activities || [];
    },
    ...options,
  });
}

export function useChangeVendorPassword() {
  return useMutation({
    mutationFn: (data) => vendorsApi.changePassword(data),
  });
}

export function useSignOutOtherSessions() {
  return useMutation({
    mutationFn: () => vendorsApi.signOutOthers(),
  });
}

export function useVendorCatalog(options = {}) {
  return useQuery({
    queryKey: ["vendor-catalog"],
    queryFn: async () => vendorsApi.getCatalog(),
    ...options,
  });
}

export function useReviewPrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => prescriptionOrdersApi.review(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-prescription-orders"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-prescription-history"] });
    },
  });
}

export function usePrescriptionOrder(id, options = {}) {
  return useQuery({
    queryKey: ["vendor-prescription-order", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const data = await prescriptionOrdersApi.getById(id);
      return data.order;
    },
    ...options,
  });
}

export function useDuplicateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => productsApi.duplicate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendor-products"] }),
  });
}

export function useSetProductListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, listing_status }) => productsApi.setListing(id, listing_status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendor-products"] }),
  });
}
