import { Text, Button } from "@react-email/components";
import { EmailLayout } from "@/emails/components/layout";

interface OrderStatusEmailProps {
  customerName: string;
  orderNumber: string;
  status: "SHIPPED" | "DELIVERED" | "CANCELLED";
  orderUrl: string;
}

const COPY: Record<OrderStatusEmailProps["status"], { heading: string; body: string }> = {
  SHIPPED: {
    heading: "Your order has shipped",
    body: "Good news — your order is on its way!",
  },
  DELIVERED: {
    heading: "Your order was delivered",
    body: "Your order has been delivered. We hope you love it!",
  },
  CANCELLED: {
    heading: "Your order was cancelled",
    body: "Your order has been cancelled. If this wasn't expected, please contact support.",
  },
};

export function OrderStatusEmail({ customerName, orderNumber, status, orderUrl }: OrderStatusEmailProps) {
  const { heading, body } = COPY[status];

  return (
    <EmailLayout preview={`${heading} — order #${orderNumber}`} heading={heading}>
      <Text style={{ fontSize: "14px", color: "#3f3f46" }}>
        Hi {customerName}, {body}
      </Text>
      <Text style={{ fontSize: "14px", fontWeight: 600, marginTop: "16px" }}>
        Order #{orderNumber}
      </Text>
      <Button
        href={orderUrl}
        style={{
          backgroundColor: "#4f46e5",
          color: "#ffffff",
          padding: "10px 20px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 600,
          marginTop: "24px",
        }}
      >
        View order
      </Button>
    </EmailLayout>
  );
}
