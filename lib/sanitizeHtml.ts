// lib/sanitizeHtml.ts
// Nettoie le HTML pour supprimer les attributs data-* et autres indésirables
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  // Supprime les attributs data-*
  let cleaned = html.replace(/ data-[^=]+="[^"]*"/g, '');
  // Supprime les autres attributs inutiles (sauf class, href, src, alt, target, rel)
  cleaned = cleaned.replace(/<([a-zA-Z0-9]+)([^>]*)>/g, (match, tag, attrs) => {
    // Garde uniquement certains attributs
    const allowed = attrs.match(/ (class|href|src|alt|target|rel)="[^"]*"/g);
    return `<${tag}${allowed ? allowed.join('') : ''}>`;
  });
  return cleaned;
}
