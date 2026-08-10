import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

const locales = ['uz', 'ru', 'en'];

export default getRequestConfig(async ({requestLocale}) => {
    // Next.js 15 da buni await qilib olishimiz shart!
    let locale = await requestLocale;
    
    if (!locale || !locales.includes(locale as any)) {
        notFound();
    }
    
    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default
    };
});