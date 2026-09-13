import { revalidatePath } from "next/cache";

/**
 * Pages publiques affichant le catalogue produits (rendues en ISR,
 * `export const revalidate = 60`).
 */
const PUBLIC_CATALOG_PATHS = [
  "/agriculture",
  "/pisciculture",
  "/porcherie",
  "/produits-animaux",
  "/tarifs",
];

/**
 * Invalide le cache ISR du catalogue public après une mutation admin
 * (création, édition, suppression, restauration, duplication, tri de
 * produits ou de catégories). Le catalogue change rarement : on
 * revalide toutes les pages concernées plutôt que de deviner laquelle.
 */
export function revalidatePublicCatalog() {
  for (const path of PUBLIC_CATALOG_PATHS) {
    revalidatePath(path);
  }
}
