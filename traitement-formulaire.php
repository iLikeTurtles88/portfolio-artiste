<?php
// Vérifier que le formulaire a été soumis en méthode POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupérer et nettoyer les données du formulaire
    $name    = strip_tags(trim($_POST["name"]));
    $email   = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);

    // Vérifier que les champs requis ne sont pas vides et que l'email est valide
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // En cas d'erreur, vous pouvez rediriger vers une page d'erreur ou afficher un message
        http_response_code(400);
        echo "Merci de remplir correctement le formulaire.";
        exit;
    }

    // Adresse email de destination (remplacez par votre adresse)
    $recipient = "nelson.dayez@gmaiil.com";

    // Sujet de l'email prédéfini
    $subject = "Nouveau message de portfolio";

    // Construction du contenu de l'email
    $email_content  = "Nom : $name\n";
    $email_content .= "Email : $email\n\n";
    $email_content .= "Message :\n$message\n";

    // En-têtes de l'email
    $email_headers = "From: $name <$email>";

    // Envoi de l'email
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        // Succès : vous pouvez rediriger vers une page de remerciement ou afficher un message
        http_response_code(200);
        echo "Merci ! Votre message a bien été envoyé.";
    } else {
        // Erreur lors de l'envoi de l'email
        http_response_code(500);
        echo "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.";
    }
} else {
    // Si le formulaire n'est pas soumis en POST
    http_response_code(403);
    echo "Il y a eu un problème avec votre soumission, veuillez réessayer.";
}
?>
