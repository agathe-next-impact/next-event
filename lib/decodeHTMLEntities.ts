// Utilitaire pour décoder les entités HTML (repris de events-list)
export function decodeHTMLEntities(text: string) {
  if (!text) return '';
  const entities: Record<string, string> = {
    amp: '&', apos: "'", lt: '<', gt: '>', quot: '"', nbsp: ' ', hellip: '…', eacute: 'é', egrave: 'è', ecirc: 'ê', agrave: 'à', ugrave: 'ù', ccedil: 'ç', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', mdash: '—', ndash: '–', oelig: 'œ', aelig: 'æ', euro: '€', copy: '©', reg: '®', deg: '°', plusmn: '±', sup2: '²', sup3: '³', frac12: '½', frac14: '¼', frac34: '¾', para: '¶', sect: '§', bull: '•', middot: '·', laquo: '«', raquo: '»', rsquor: '’', lsquor: '‘', ldquor: '“', rdquor: '”', ndash: '–', mdash: '—', nbsp: ' ', thinsp: ' ', ensp: ' ', emsp: ' ', zwnj: '', zwj: '', lrm: '', rlm: '', shy: '', times: '×', divide: '÷', trade: '™', yen: '¥', pound: '£', cent: '¢', dollar: '$', micro: 'µ', pi: 'π', mu: 'μ', alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', lambda: 'λ', omega: 'ω', sigma: 'σ', phi: 'φ', theta: 'θ', plusmn: '±', sup1: '¹', sup2: '²', sup3: '³', frac14: '¼', frac12: '½', frac34: '¾', para: '¶', sect: '§', bull: '•', middot: '·', laquo: '«', raquo: '»', rsquor: '’', lsquor: '‘', ldquor: '“', rdquor: '”', ndash: '–', mdash: '—', nbsp: ' ', thinsp: ' ', ensp: ' ', emsp: ' ', zwnj: '', zwj: '', lrm: '', rlm: '', shy: '', times: '×', divide: '÷', trade: '™', yen: '¥', pound: '£', cent: '¢', dollar: '$', micro: 'µ', pi: 'π', mu: 'μ', alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', lambda: 'λ', omega: 'ω', sigma: 'σ', phi: 'φ', theta: 'θ'
  };
  return text.replace(/&([a-zA-Z0-9#]+);/g, (match, entity) => {
    if (entity[0] === '#') {
      // Code point
      const code = entity[1] === 'x' || entity[1] === 'X'
        ? parseInt(entity.substr(2), 16)
        : parseInt(entity.substr(1), 10);
      if (!isNaN(code)) return String.fromCharCode(code);
    }
    return entities[entity] || match;
  });
}
