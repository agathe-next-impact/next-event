<?php
/**
 * Supprime la valeur du champ personnalisé 'event' dans les CPT 'participant'
 * lorsque l'ID de l'event de la réservation supprimée correspond.
 */
function supprimer_event_participant_lors_suppression_reservation($post_id) {
    // Vérifie que le post supprimé est une réservation
    if (get_post_type($post_id) !== 'reservation') {
        return;
    }

    // Récupère l'ID de l'event lié à la réservation supprimée
    $event_id = get_post_meta($post_id, 'event', true);
    if (!$event_id) {
        return;
    }

    // Recherche tous les participants ayant ce même event_id
    $args = [
        'post_type'  => 'participant',
        'post_status'=> 'any',
        'meta_query' => [
            [
                'key'   => 'event',
                'value' => $event_id,
                'compare' => '='
            ]
        ],
        'fields' => 'ids'
    ];
    $participants = get_posts($args);

    foreach ($participants as $participant_id) {
    // Récupère toutes les valeurs du champ 'event'
    $events = get_post_meta($participant_id, 'event', false);

    // Si la valeur à supprimer existe, on la retire
    if (($key = array_search($event_id, $events)) !== false) {
        unset($events[$key]);
        // Supprime toutes les valeurs existantes
        delete_post_meta($participant_id, 'event');
        // Réenregistre les valeurs restantes
        foreach ($events as $remaining_event) {
            add_post_meta($participant_id, 'event', $remaining_event);
        }
    }
}
}
add_action('before_delete_post', 'supprimer_event_participant_lors_suppression_reservation');