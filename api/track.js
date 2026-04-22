export default async function handler(req, res) {
    const { id } = req.query;
    if (!id) return res.status(400).send("ID eksik");

    const FIREBASE_URL = `https://mailtakip-default-rtdb.firebaseio.com/mailler/${id}.json`;

    // 🛡️ BEKÇİ KONTROLÜ
    if (data && data.aktif === false) {
        // Eğer kilit henüz açılmadıysa, sessizce çık. 
        // Bu sayede senin tarayıcının tetiklemeleri Firebase'i güncellemez.
        return res.status(200).send(pixel); 
    }
    
    // Eğer aktif: true ise, o zaman 'Okundu' işlemini yap...
    if (data && data.aktif === true && data.acilmami === false) {
        // Firebase'i güncelleme kodları buraya...
    }
    
    try {
        const response = await fetch(FIREBASE_URL);
        const data = await response.json();

        // 🛡️ KRİTİK KONTROL: Eğer aktif değilse veya zaten okunduysa hiçbir şey yapma
        if (data && data.aktif === true && data.acilmami === false) {
            await fetch(FIREBASE_URL, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    acilmami: true, 
                    acilmaTarihi: new Date().toISOString(),
                    durum: "Okundu",
                    detay: req.headers['user-agent'] // Kim açtı görelim
                })
            });
        }
    } catch (error) {
        console.error("Firebase Hatası:", error);
    }

    const pixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    return res.status(200).send(pixel);
}
