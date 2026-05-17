/*
 * DEPRECATED — every handler that lived here was either duplicated
 * elsewhere or queried selectors that no longer exist:
 *
 *   - grid-variant-option click handler  → superseded by
 *     window.selectGridVariant in layout/theme.liquid (script #4),
 *     which is invoked via onclick from snippets/product-card.liquid.
 *
 *   - paint matrix filter (#color-search-input)
 *                                        → reimplemented inside
 *     sections/product.liquid where it has access to the right scope.
 *
 *   - selectMatrixVariant(id, price, element)
 *                                        → called from nowhere.
 *
 * File kept as an empty stub so any cached asset_url reference
 * resolves without 404. Safe to delete after a cache cycle.
 */
