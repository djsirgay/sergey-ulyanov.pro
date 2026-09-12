import {parseQuery} from './core.js';
// Use documented genre facets only when they explain the entire request.
// A residual adjective, theme or lyric-like phrase must not become a fact.
export function isSourceGenreRequest(query){
 const intent=parseQuery(query);
 return Boolean(intent.genres?.length)&&!intent.text?.length&&!intent.topics?.length&&!intent.sound?.length&&!intent.types?.length&&!intent.excluded?.length&&!intent.alternatives&&!intent.diagnostics?.length&&!intent.unsupportedOperators?.length&&!intent.literalTitle&&intent.mode!=='exact-title';
}
export const sourceGenreCopy={
 en:{heading:'Matched published genre labels',message:'This request can be checked against the catalogue’s documented labels without AI. The exact results are below, with the selected language and date filters preserved. A genre label does not establish mood or audio characteristics.'},
 ru:{heading:'Поиск по жанровым меткам источников',message:'Этот запрос можно проверить по документированным меткам без ИИ. Точные результаты — ниже; выбранные язык и даты сохранены. Метка жанра не доказывает настроение или свойства звучания.'},
 be:{heading:'Пошук паводле жанравых пазнак крыніц',message:'Гэты запыт можна праверыць паводле дакументаваных пазнак без ІІ. Дакладныя вынікі — ніжэй; выбраныя мова і даты захаваныя. Жанравая пазнака не даказвае настрой або ўласцівасці гучання.'}
};
