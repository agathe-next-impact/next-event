<?php
// Déclaration des custom fields pour les CPT events, speakers, reservation
// Utilisation de register_post_meta pour chaque champ clé du projet

if (!defined('ABSPATH')) {
    exit;
}

// Helper pour déclarer un champ meta
function wp_event_portal_register_meta($post_type, $meta_key, $args) {
    register_post_meta($post_type, $meta_key, array_merge([
        'show_in_rest' => true,
        'single' => true,
        'type' => $args['type'] ?? 'string',
        'auth_callback' => '__return_true',
    ], $args));
}

// Champs pour events
add_action('init', function() {
    $fields = [
        ['start_date', 'string'],
        ['end_date', 'string'],
        ['location', 'string'],
        ['city', 'string'],
        ['max_attendees', 'integer'],
        ['current_attendees', 'integer'],
        ['registration_deadline', 'string'],
        ['price', 'number'],
        ['is_free', 'boolean'],
        ['prerequisites', 'string'],
        ['material_provided', 'string'],
        ['agenda', 'array'], // JSON (array d'objets)
        ['speakers', 'array'], // IDs des speakers (array)
        // SEO
        ['meta_title', 'string'],
        ['meta_description', 'string'],
        ['og_image', 'string'],
        ['keywords', 'string'],
    ];
    foreach ($fields as [$key, $type]) {
        wp_event_portal_register_meta('events', $key, ['type' => $type]);
    }
});

// Champs pour speakers
add_action('init', function() {
    $fields = [
        ['bio', 'string'],
        ['company', 'string'],
        ['job_title', 'string'],
        ['linkedin', 'string'],
        ['twitter', 'string'],
        ['github', 'string'],
        ['website', 'string'],
        ['expertises', 'array'], // taxonomy
        ['skills', 'array'], // repeater (array)
        ['certifications', 'array'], // repeater (array)
        ['achievements', 'array'], // repeater (array)
        ['talks', 'array'], // repeater (array)
        // SEO
        ['meta_title', 'string'],
        ['meta_description', 'string'],
        ['og_image', 'string'],
        ['keywords', 'string'],
    ];
    foreach ($fields as [$key, $type]) {
        wp_event_portal_register_meta('speakers', $key, ['type' => $type]);
    }
});

// Champs pour reservation
add_action('init', function() {
    $fields = [
        ['participant', 'integer'], // ID utilisateur ou email
        ['event', 'integer'], // ID event
        ['status', 'string'],
        ['confirmation_code', 'string'],
        ['notes', 'string'],
    ];
    foreach ($fields as [$key, $type]) {
        wp_event_portal_register_meta('reservation', $key, ['type' => $type]);
    }
});
