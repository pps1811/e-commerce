import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";

interface EmailLayoutProps {
  preview: string;
  heading: string;
  children: React.ReactNode;
}

export function EmailLayout({ preview, heading, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: "#f4f4f5", fontFamily: "Helvetica, Arial, sans-serif" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            margin: "40px auto",
            padding: "32px",
            borderRadius: "12px",
            maxWidth: "480px",
          }}
        >
          <Text style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 24px" }}>Aurelle</Text>
          <Heading style={{ fontSize: "20px", margin: "0 0 16px" }}>{heading}</Heading>
          <Section>{children}</Section>
          <Hr style={{ margin: "32px 0 16px", borderColor: "#e4e4e7" }} />
          <Text style={{ fontSize: "12px", color: "#71717a" }}>
            Aurelle — Modern essentials, thoughtfully made.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
