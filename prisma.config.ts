import "dotenv/config"; // <-- Mana shu qator hamma narsani hal qiladi

export default {
    datasource: {
        url: process.env.DATABASE_URL,
    },
};