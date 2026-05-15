const Parser = require("rss-parser");

const parser = new Parser();

const getFeed = async (url, source) => {
    try {
        const feed = await parser.parseURL(url);

        return feed.items.slice(0, 5).map((item) => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            source,
            contentSnippet: item.contentSnippet || item.content || "",
        }));
    } catch (error) {
        console.log(`${source} RSS alınamadı:`, error.message);
        return [];
    }
};

exports.getNews = async (req, res) => {
    try {
        const [dunya, bloomberg, ekonomim] = await Promise.all([
            getFeed("https://www.dunya.com/rss", "Dünya"),
            getFeed("https://www.bloomberght.com/rss", "BloombergHT"),
            getFeed("https://www.ekonomim.com/rss", "Ekonomim"),
        ]);

        res.status(200).json({
            success: true,
            news: {
                dunya,
                bloomberg,
                ekonomim,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Haberler alınırken hata oluştu.",
            error: error.message,
        });
    }
};