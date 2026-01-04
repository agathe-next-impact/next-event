# WP Event Portal Plugin

Ce plugin WordPress ajoute les Custom Post Types (CPT) et champs personnalisés nécessaires pour connecter un portail Next.js à WordPress :

- **CPT "events"** : événements (conférences, ateliers, etc.)
- **CPT "speakers"** : intervenants
- **CPT "reservation"** : réservations d'événements
- **Taxonomies** : catégories d'événements, expertises des speakers
- **Champs personnalisés** : toutes les métadonnées nécessaires (dates, lieux, SEO, relations, etc.)

## Installation
1. Copier le dossier `wp-event-portal-plugin` dans le dossier `wp-content/plugins/` de votre site WordPress.
2. Activer le plugin depuis l'admin WordPress.

## Personnalisation
- Les champs personnalisés sont déclarés dans `inc/custom-fields.php`.
- Les taxonomies et CPT sont déclarés dans `wp-event-portal-plugin.php`.

## Utilisation
- Les CPT et champs sont exposés à l'API REST WordPress (`/wp-json/wp/v2/`).
- Les relations (ex: speakers d'un event) sont stockées sous forme d'ID (array ou JSON).

## À adapter
- Pour des besoins avancés (validation, interface admin améliorée, etc.), compléter le code PHP ou utiliser un plugin comme ACF en complément.

---

Plugin généré automatiquement pour le projet Event Portal.
