export default async function handler(req, res) {
    const { id } = req.query;
    const userAgent = req.headers['user-agent'] || '';

    // Gmail botlarını ve önizleme servislerini engelle
    const isBot = userAgent.includes('GoogleImageProxy') || 
                  userAgent.includes('Gmail') || 
                  userAgent.includes('bot');

    const FIREBASE_URL = `https://mailtakip-default-rtdb.firebaseio.com/mailler/${id}.json`;

    // Sadece ID varsa VE gelen istek bir bot değilse Firebase'i güncelle
    if (id && !isBot && id !== 'test_reis') {
        try {
            await fetch(FIREBASE_URL, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    acilmami: true, 
                    acilmaTarihi: new Date().toISOString(),
                    durum: "Okundu",
                    cihaz: userAgent // Kimin açtığını görmek için ekledik
                })
            });
        } catch (error) {
            console.error("Hata:", error);
        }
    }

    const pixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    return res.status(200).send(pixel);
}
