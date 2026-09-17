import { Text, Section, Row, Column, Hr, Button } from "@react-email/components";
import { EmailLayout } from "@/emails/components/layout";
import { formatPrice } from "@/lib/format";

interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: string;
  items: { productName: string; quantity: number; price: number; variant?: string | null }[];
  subtotal: number;
  shipping: number;
  total: number;
  orderUrl: string;
}

export function OrderConfirmationEmail({
  customerName,
  orderNumber,
  items,
  subtotal,
  shipping,
  total,
  orderUrl,
}: OrderConfirmationEmailProps) {
  return (
    <EmailLayout preview={`Your order #${orderNumber} is confirmed`} heading="Order confirmed">
      <Text style={{ fontSize: "14px", color: "#3f3f46" }}>
        Hi {customerName}, thanks for your order! We&apos;re getting it ready to ship.
      </Text>

      <Text style={{ fontSize: "14px", fontWeight: 600, marginTop: "24px" }}>
        Order #{orderNumber}
      </Text>

      <Section style={{ marginTop: "12px" }}>
        {items.map((item, index) => (
          <Row key={index} style={{ marginBottom: "8px" }}>
            <Column>
              <Text style={{ fontSize: "13px", margin: 0 }}>
                {item.productName}
                {item.variant ? ` (${item.variant})` : ""} × {item.quantity}
              </Text>
            </Column>
            <Column align="right">
              <Text style={{ fontSize: "13px", margin: 0 }}>
                {formatPrice(item.price * item.quantity)}
              </Text>
            </Column>
          </Row>
        ))}
      </Section>

      <Hr style={{ margin: "16px 0", borderColor: "#e4e4e7" }} />

      <Row>
        <Column>
          <Text style={{ fontSize: "13px", color: "#71717a", margin: "4px 0" }}>Subtotal</Text>
        </Column>
        <Column align="right">
          <Text style={{ fontSize: "13px", margin: "4px 0" }}>{formatPrice(subtotal)}</Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Text style={{ fontSize: "13px", color: "#71717a", margin: "4px 0" }}>Shipping</Text>
        </Column>
        <Column align="right">
          <Text style={{ fontSize: "13px", margin: "4px 0" }}>
            {shipping === 0 ? "Free" : formatPrice(shipping)}
          </Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Text style={{ fontSize: "14px", fontWeight: 700, margin: "4px 0" }}>Total</Text>
        </Column>
        <Column align="right">
          <Text style={{ fontSize: "14px", fontWeight: 700, margin: "4px 0" }}>
            {formatPrice(total)}
          </Text>
        </Column>
      </Row>

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
