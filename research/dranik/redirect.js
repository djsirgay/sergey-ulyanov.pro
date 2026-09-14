// Short share address. Never forward body mass or arbitrary query parameters.
const incoming=new URL(location.href);
const target=new URL('/research/playground/dranik-meter/',incoming.origin);
const language=incoming.searchParams.get('lang');
if(['en','be','ru'].includes(language))target.searchParams.set('lang',language);
if(/^#[a-zA-Z][a-zA-Z0-9_-]{0,79}$/.test(incoming.hash))target.hash=incoming.hash;
location.replace(target.pathname+target.search+target.hash);
