import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    locales: ['uz', 'ru', 'en'],
    defaultLocale: 'uz'
});

export const config = {
    // Bu qator Next.js'ning ichki fayllari va rasmlarni tarjima tizimidan aylanib o'tishga majbur qiladi (Infinite Loop'ni yo'qotadi)
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};