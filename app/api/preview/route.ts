import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);


  const secret = searchParams.get("secret");
  const id = searchParams.get("id");
  const slug = searchParams.get("slug");
  const type = searchParams.get("type"); // ex: 'event', 'speaker', 'page'

  // 1. Validation de sécurité
  // WordPress peut envoyer uniquement le slug : on accepte id OU slug.
  if (secret !== process.env.WORDPRESS_PREVIEW_SECRET || (!id && !slug)) {
    return new Response("Requête de prévisualisation invalide", {
      status: 401,
    });
  }

  // 2. Logique d'aiguillage (URL Mapping)
  let destination = "/";

  switch (type) {
    case "event":
      destination = `/events/${slug || id}`;
      break;
    case "speaker":
      destination = `/speakers/${slug || id}`;
      break;
    case "post":
    case "page":
      destination = `/${slug || id}`;
      break;
    default:
      destination = `/${slug || id}`;
  }

  // 3. Activation du mode Draft
  (await draftMode()).enable();

  // 4. Redirection vers le bon chemin
  // On utilise 'replace' pour éviter que l'utilisateur revienne sur l'API avec le bouton "Précédent"
  redirect(destination);
}
