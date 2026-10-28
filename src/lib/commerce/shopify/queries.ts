/**
 * Storefront API documents. Product metafields use the `thl` namespace; the
 * expected definitions are listed in docs/SHOPIFY.md.
 */
const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    productType
    description
    publishedAt
    availableForSale
    tags
    options { name optionValues { name swatch { color } } }
    collections(first: 10) { nodes { handle } }
    featuredImage { id url altText width height }
    images(first: 12) { nodes { id url altText width height } }
    variants(first: 100) {
      nodes {
        id
        sku
        title
        availableForSale
        selectedOptions { name value }
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        image { id }
      }
    }
    shortDescription: metafield(namespace: "thl", key: "short_description") { value }
    features: metafield(namespace: "thl", key: "features") { value }
    materials: metafield(namespace: "thl", key: "materials") { value }
    materialFamilies: metafield(namespace: "thl", key: "material_families") { value }
    dimensions: metafield(namespace: "thl", key: "dimensions") { value }
    weight: metafield(namespace: "thl", key: "weight_kg") { value }
    care: metafield(namespace: "thl", key: "care") { value }
    assembly: metafield(namespace: "thl", key: "assembly") { value }
    colourFamilies: metafield(namespace: "thl", key: "colour_families") { value }
    category: metafield(namespace: "thl", key: "category") { value }
    related: metafield(namespace: "thl", key: "related_products") {
      references(first: 8) { nodes { ... on Product { handle } } }
    }
  }
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query Products($cursor: String, $country: CountryCode) @inContext(country: $country) {
    products(first: 100, after: $cursor, sortKey: BEST_SELLING) {
      pageInfo { hasNextPage endCursor }
      nodes { ...ProductFields }
    }
  }
`;

export const PRODUCT_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query Product($handle: String!, $country: CountryCode) @inContext(country: $country) {
    product(handle: $handle) { ...ProductFields }
  }
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($input: CartInput!, $country: CountryCode) @inContext(country: $country) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        discountCodes { code applicable }
        cost { subtotalAmount { amount currencyCode } }
      }
      userErrors { field message code }
      warnings { code message }
    }
  }
`;

export const VARIANTS_QUERY = /* GraphQL */ `
  query Variants($ids: [ID!]!, $country: CountryCode) @inContext(country: $country) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        id
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
      }
    }
  }
`;
