<?php
/*
Plugin Name: WP Event Portal
Description: Plugin pour gérer les événements, speakers et réservations pour le portail Next.js.
Version: 1.0.0
Author: Généré par Copilot
*/

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// CPT Events
function wp_event_portal_register_cpt_events() {
    $labels = array(
        'name' => 'Événements',
        'singular_name' => 'Événement',
        'add_new' => 'Ajouter un événement',
        'add_new_item' => 'Ajouter un nouvel événement',
        'edit_item' => 'Modifier l\'événement',
        'new_item' => 'Nouvel événement',
        'view_item' => 'Voir l\'événement',
        'search_items' => 'Rechercher un événement',
        'not_found' => 'Aucun événement trouvé',
        'not_found_in_trash' => 'Aucun événement dans la corbeille',
        'menu_name' => 'Événements',
    );
    $args = array(
        'labels' => $labels,
        'public' => true,
        'has_archive' => true,
        'rewrite' => array('slug' => 'events'),
        'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'),
        'show_in_rest' => true,
    );
    register_post_type('events', $args);
}
add_action('init', 'wp_event_portal_register_cpt_events');

// CPT Speakers
function wp_event_portal_register_cpt_speakers() {
    $labels = array(
        'name' => 'Speakers',
        'singular_name' => 'Speaker',
        'add_new' => 'Ajouter un speaker',
        'add_new_item' => 'Ajouter un nouveau speaker',
        'edit_item' => 'Modifier le speaker',
        'new_item' => 'Nouveau speaker',
        'view_item' => 'Voir le speaker',
        'search_items' => 'Rechercher un speaker',
        'not_found' => 'Aucun speaker trouvé',
        'not_found_in_trash' => 'Aucun speaker dans la corbeille',
        'menu_name' => 'Speakers',
    );
    $args = array(
        'labels' => $labels,
        'public' => true,
        'has_archive' => true,
        'rewrite' => array('slug' => 'speakers'),
        'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'),
        'show_in_rest' => true,
    );
    register_post_type('speakers', $args);
}
add_action('init', 'wp_event_portal_register_cpt_speakers');

// CPT Reservation
function wp_event_portal_register_cpt_reservation() {
    $labels = array(
        'name' => 'Réservations',
        'singular_name' => 'Réservation',
        'add_new' => 'Ajouter une réservation',
        'add_new_item' => 'Ajouter une nouvelle réservation',
        'edit_item' => 'Modifier la réservation',
        'new_item' => 'Nouvelle réservation',
        'view_item' => 'Voir la réservation',
        'search_items' => 'Rechercher une réservation',
        'not_found' => 'Aucune réservation trouvée',
        'not_found_in_trash' => 'Aucune réservation dans la corbeille',
        'menu_name' => 'Réservations',
    );
    $args = array(
        'labels' => $labels,
        'public' => false,
        'show_ui' => true,
        'has_archive' => false,
        'rewrite' => false,
        'supports' => array('title', 'custom-fields'),
        'show_in_rest' => true,
    );
    register_post_type('reservation', $args);
}
add_action('init', 'wp_event_portal_register_cpt_reservation');

// Taxonomy pour les catégories d'événements
function wp_event_portal_register_taxonomy_event_category() {
    $labels = array(
        'name' => 'Catégories',
        'singular_name' => 'Catégorie',
        'search_items' => 'Rechercher une catégorie',
        'all_items' => 'Toutes les catégories',
        'edit_item' => 'Modifier la catégorie',
        'update_item' => 'Mettre à jour la catégorie',
        'add_new_item' => 'Ajouter une nouvelle catégorie',
        'new_item_name' => 'Nom de la nouvelle catégorie',
        'menu_name' => 'Catégories',
    );
    register_taxonomy('event_category', 'events', array(
        'hierarchical' => true,
        'labels' => $labels,
        'show_ui' => true,
        'show_admin_column' => true,
        'query_var' => true,
        'rewrite' => array('slug' => 'event-category'),
        'show_in_rest' => true,
    ));
}
add_action('init', 'wp_event_portal_register_taxonomy_event_category');

// Taxonomy pour les expertises des speakers
function wp_event_portal_register_taxonomy_expertise() {
    $labels = array(
        'name' => 'Expertises',
        'singular_name' => 'Expertise',
        'search_items' => 'Rechercher une expertise',
        'all_items' => 'Toutes les expertises',
        'edit_item' => 'Modifier l\'expertise',
        'update_item' => 'Mettre à jour l\'expertise',
        'add_new_item' => 'Ajouter une nouvelle expertise',
        'new_item_name' => 'Nom de la nouvelle expertise',
        'menu_name' => 'Expertises',
    );
    register_taxonomy('expertise', 'speakers', array(
        'hierarchical' => false,
        'labels' => $labels,
        'show_ui' => true,
        'show_admin_column' => true,
        'query_var' => true,
        'rewrite' => array('slug' => 'expertise'),
        'show_in_rest' => true,
    ));
}
add_action('init', 'wp_event_portal_register_taxonomy_expertise');

// Inclusion des custom fields (voir plus bas)
require_once plugin_dir_path(__FILE__) . 'inc/custom-fields.php';
