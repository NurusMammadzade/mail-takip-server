export default async function handler(req, res) {
    const { id } = req.query;
    const userAgent = req.headers['user-agent'] || '';
    
    // 🛡️ BOT KALKANI: Gmail botlarını ve diğer proxy servislerini engelle
    const isBot = 
        userAgent.includes('GoogleImageProxy') || 
        userAgent.includes('Gmail') || 
        userAgent.includes('bot') || 
        userAgent.includes('spider') || 
        userAgent.includes('crawl');

    const FIREBASE_URL = `https://mailtakip-default-rtdb.firebaseio.com/mailler/${id}.json`;

    // Sadece ID varsa VE gelen istek bir BOT DEĞİLSE Firebase'i güncelle
    if (id && !isBot && id !== 'test_reis' && id !== 'undefined') {
        try {
            await fetch(FIREBASE_URL, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    acilmami: true, 
                    acilmaTarihi: new Date().toISOString(),
                    durum: "Okundu",
                    // Hangi tarayıcıdan açıldığını görerek test edebilirsin
                    detay: userAgent.substring(0, 50) 
                })
            });
        } catch (error) {
            console.error("Firebase Hatası:", error);
        }
    }

    // Şeffaf 1x1 piksel gönder
    const pixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    return res.status(200).send(pixel);
}
