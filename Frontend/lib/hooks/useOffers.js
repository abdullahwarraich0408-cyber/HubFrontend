import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export function usePublicOffers(params = {}) {
  const { category, search, city } = params;
  const queryString = new URLSearchParams();
  if (category && category !== "all") queryString.append("category", category);
  if (search) queryString.append("search", search);
  if (city) queryString.append("city", city);

  return useQuery({
    queryKey: ["offers", category, search, city],
    queryFn: async () => {
      const res = await api.get(`/offers?${queryString.toString()}`);
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.offers)) return res.offers;
      if (Array.isArray(res?.data?.offers)) return res.data.offers;
      return [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useOfferDetail(offerId) {
  return useQuery({
    queryKey: ["offer-detail", offerId],
    queryFn: async () => {
      if (!offerId) return null;
      const res = await api.get(`/offers/${offerId}`);
      return res?.offer || res?.data?.offer || res || null;
    },
    enabled: Boolean(offerId),
  });
}

export function useValidatePromoCode() {
  return useMutation({
    mutationFn: async ({ promoCode, subtotal, deliveryFee, items, city }) => {
      const res = await api.post("/offers/validate-code", {
        promoCode,
        subtotal,
        deliveryFee,
        items,
        city,
      });
      return res;
    },
  });
}

export function useEvaluateCartOffers() {
  return useMutation({
    mutationFn: async ({ items, subtotal, deliveryFee, city, paymentMethod, promoCodeInput }) => {
      const res = await api.post("/offers/evaluate", {
        items,
        subtotal,
        deliveryFee,
        city,
        paymentMethod,
        promoCodeInput,
      });
      return res;
    },
  });
}

export function useUpdateOfferAlerts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (preferences) => {
      const res = await api.post("/offers/alert-preference", preferences);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user-profile"]);
    },
  });
}
