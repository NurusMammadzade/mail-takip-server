// api/track.js
export default async function handler(req, res) {
    const { id } = req.query;
    
    // Eklentinin yazdığı tam adrese gidiyoruz
    const FIREBASE_URL = `https://mailtakip-default-rtdb.firebaseio.com/mailler/${id}.json`;

    if (id && id !== 'test_reis') {
        try {
            await fetch(FIREBASE_URL, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    acilmami: true, // Durumu güncelle!
                    acilmaTarihi: new Date().toISOString(),
                    durum: "Okundu"
                })
            });
        } catch (error) {
            console.error("Hata:", error);
        }
    }

    // Şeffaf piksel gönder
    const pixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    return res.status(200).send(pixel);
}
