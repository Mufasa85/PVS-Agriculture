/**
 * Injecte un bloc de données structurées JSON-LD (schema.org).
 * `application/ld+json` est un bloc de données non exécutable : il n'est
 * pas soumis à la directive CSP script-src (pas besoin de nonce).
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
