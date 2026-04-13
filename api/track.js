export default async function handler(req, res) {
    // 1. Gelen ID'yi alıyoruz
    const { id } = req.query; 

    // 2. Kendi Firebase linkini buraya yaz (Sonundaki /mailler/ ve .json kısımlarına DİKKAT!)
    const FIREBASE_DATABASE_URL = "https://mailtakip-XXXXX-default-rtdb.firebaseio.com";
    const fullUrl = `${FIREBASE_DATABASE_URL}/mailler/${id}.json`;

    try {
        // 3. Sadece ID varsa ve test değilse Firebase'e yaz
        if (id && id !== "test_reis") {
            await fetch(fullUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    acilmami: true, 
                    sonAcilma: new Date().toISOString(),
                    user_agent: req.headers['user-agent'] || 'Bilinmiyor'
                })
            });
        }
    } catch (err) {
        // Hata olsa bile sessizce devam et ki resim yüklensin, karşı taraf çakmasın
        console.error("Firebase baglanti hatasi:", err);
    }

    // 4. 1x1 Şeffaf PNG Pikseli (Dünyanın en küçük resmi)
    const pixel = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        "base64"
    );
    
    // 5. Yanıtı gönder
    res.setHeader("Content-Type", "image/png");
    // Google'ın resmi cache (belleğe) almasını engellemek için:
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    
    return res.status(200).send(pixel);
}
