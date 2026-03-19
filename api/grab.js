
const axios = require('axios');

export default async function handler(req, res) {
    const { url } = req.query;

    // Set Header biar nggak kedeteksi bot
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://vidoy.com/'
    };

    if (!url) return res.status(400).json({ error: "Input URL kosong!" });

    try {
        // Ambil HTML dari Vidoy
        const response = await axios.get(url, { headers });
        const html = response.data;

        // REGEX MAGIC: Mencari pola link video di dalam script Vidoy
        // Biasanya link video diakhiri .mp4 atau ada di variabel 'file'
        const regex = /https?:\/\/[^"']+\.(?:mp4|m3u8)[^"']*/g;
        const matches = html.match(regex);

        if (matches && matches.length > 0) {
            // Kita ambil link pertama yang ketemu, biasanya itu yang paling valid
            const finalLink = matches[0].replace(/\\/g, ''); 
            res.status(200).json({ 
                success: true, 
                title: "Video Found",
                downloadUrl: finalLink 
            });
        } else {
            res.status(404).json({ success: false, error: "Link video gagal diekstrak. Mungkin link sudah mati." });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: "Server Vidoy menolak akses." });
    }
}
