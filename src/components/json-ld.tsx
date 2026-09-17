/**
 * Renders a JSON-LD <script> tag. Escapes "<" so a value containing
 * "</script>" (e.g. a product description) can't break out of the tag —
 * this data can originate from admin-entered product content.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
