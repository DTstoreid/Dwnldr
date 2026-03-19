const axios = require('axios');

export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "URL mana bos?" });

    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 5000
        });
        const html = response.data;
        const regex = /https?:\/\/[^"']+\.(?:mp4|m3u8)[^"']*/g;
        const matches = html.match(regex);

        if (matches) {
            res.status(200).json({ success: true, downloadUrl: matches[0].replace(/\\/g, '') });
        } else {
            res.status(404).json({ success: false, error: "Link video nggak ketemu" });
        }
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
}        res.status(500).json({ success: false, error: "Server Vidoy menolak akses." });
    }
}
