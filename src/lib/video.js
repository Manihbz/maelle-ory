// Reconnaissance des adresses vidéo. Plateformes autorisées par la spec :
// YouTube et Vimeo, rien d'autre. Toute autre adresse renvoie null, et
// VideoEmbed affiche alors un message plutôt qu'un lecteur vide.

const YOUTUBE_ID = /^[\w-]{11}$/;

export function parseVideoUrl(raw) {
  if (typeof raw !== 'string' || raw.trim() === '') return null;

  let url;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, '');

  if (host === 'youtu.be') {
    const id = url.pathname.slice(1);
    return YOUTUBE_ID.test(id) ? youtube(id) : null;
  }

  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    const id = url.searchParams.get('v') ?? url.pathname.split('/').pop();
    return YOUTUBE_ID.test(id ?? '') ? youtube(id) : null;
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const parts = url.pathname.split('/').filter(Boolean);
    const id = parts.find((p) => /^\d+$/.test(p));
    if (!id) return null;
    // Lien non répertorié : /<id>/<clé d'accès>
    const key = parts[parts.indexOf(id) + 1] ?? url.searchParams.get('h');
    return vimeo(id, key);
  }

  return null;
}

function youtube(id) {
  return {
    platform: 'youtube',
    id,
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0`,
  };
}

function vimeo(id, key) {
  const query = key ? `?h=${key}&dnt=1` : '?dnt=1';
  return {
    platform: 'vimeo',
    id,
    embedUrl: `https://player.vimeo.com/video/${id}${query}`,
  };
}
