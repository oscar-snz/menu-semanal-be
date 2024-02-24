const axios = require('axios');
const yandexApiKey = process.env.yandexApiKey;

class TranslateText{

async translateText(text, lang = 'en-es') {
    try {
        const response = await axios.post(`https://translate.yandex.net/api/v1.5/tr.json/translate`, null, {
            params: {
                key: yandexApiKey,
                text: text,
                lang: lang,
                format: 'plain'
            }
        });

        if(response.data && response.data.text) {
            return response.data.text[0]; // Retorna el texto traducido
        }

        throw new Error('No se pudo traducir el texto');
    } catch (error) {
        console.error('Error al traducir el texto:', error);
        throw error;
    }
}
}

module.exports = new TranslateText();