export default async function handler(req, res) {
    const { id } = req.query; // Mailin benzersiz ID'si
    const FIREBASE_URL = "SENİN_FIREBASE_LİNKİN/mailler/" + id + ".json";

    if (id) {
        // Firebase'deki veriyi güncelle: 'acilmami' -> true, 'acilmaSayisi' -> +1
        // (Burada basitlik için sadece durumu güncelliyoruz)
        await fetch(FIREBASE_URL, {
            method: 'PATCH',
            body: JSON.stringify({ 
                acilmami: true, 
                sonAcilma: new Date().toLocaleString() 
            })
        });
    }

    // Kullanıcıya 1x1 şeffaf bir PNG resmi gönderiyoruz (Sihir burada!)
    const pixel = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        "base64"
    );
    
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.send(pixel);
}