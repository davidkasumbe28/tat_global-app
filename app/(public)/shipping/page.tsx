"use client";

import ShippingDeliveryConditions from "@/components/shipping/shipping-delivery-conditions";
import ShippingHeader from "@/components/shipping/shipping-header";
import ShippingOrderStatus from "@/components/shipping/shipping-order-status";
import ShippingZones from "@/components/shipping/shipping-zones";
import { useTheme } from "@/hooks/use-theme";

export default function ShippingPage() {
  const { isloading } = useTheme();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ShippingHeader emuted={isloading} />

      <ShippingZones emuted={isloading} />

      <ShippingOrderStatus emuted={isloading} />

      <ShippingDeliveryConditions emuted={isloading} />
    </main>
  );
}
