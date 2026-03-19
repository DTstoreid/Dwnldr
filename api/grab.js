export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "URL mana?" });

    try {
        // Pake fetch bawaan Node.js, TANPA instal library apapun
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Referer': 'https://vidoy.com/'
            }
        });

        const html = await response.text();

        // Teknik Grabber Lanjut: Cari pola video di dalam script
        // Kita cari link .mp4 atau .m3u8 (HLS)
        const regex = /https?:\/\/[^"']+\.(?:mp4|m3u8)[^"']*/g;
        const matches = html.match(regex);

        if (matches && matches.length > 0) {
            // Kita ambil link pertama dan bersihkan karakter aneh
            const videoUrl = matches[0].replace(/\\/g, '');
            res.status(200).json({ success: true, downloadUrl: videoUrl });
        } else {
            res.status(404).json({ success: false, error: "Link video ga ketemu di HTML" });
        }
    } catch (e) {
        res.status(500).json({ success: false, error: "System Error: " + e.message });
    }
}
