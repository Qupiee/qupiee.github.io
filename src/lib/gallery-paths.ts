/** Общие для сервера и клиента константы галереи (без доступа к файловой системе). */
export const PER_PAGE = 10;

/** Первая страница живёт по адресу /gallery/, остальные — /gallery/2/, /gallery/3/… */
export const pageHref = (n: number) => (n <= 1 ? "/gallery/" : `/gallery/${n}/`);
