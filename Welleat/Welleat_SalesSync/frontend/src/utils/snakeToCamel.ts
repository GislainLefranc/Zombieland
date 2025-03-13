/**
 * Convertit une chaîne en camelCase à partir d'une chaîne en snake_case.
 * @param s - Chaîne en snake_case.
 * @returns Chaîne convertie en camelCase.
 */
export function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convertit récursivement toutes les clés d'un objet (ou d'un tableau) de snake_case en camelCase.
 * @param obj - Objet ou tableau à convertir.
 * @returns L'objet ou le tableau avec les clés en camelCase.
 */
export function convertKeysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = snakeToCamel(key);
      acc[camelKey] = convertKeysToCamelCase(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}
