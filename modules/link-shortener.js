ShortURL = {
    'www.google.com': {
        shortUrl: "shortUrl",
        count: 0
    }
}

const randomString = function () {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 4; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const linkShortner = {

    storeUrl: (fullURL) => {
        const randomText = randomString();
        ShortURL[fullURL] = {};

        ShortURL[fullURL]['shortUrl'] = `ragnar/${randomText}`;
        ShortURL[fullURL]['count'] = 0;
    },


    getUrl: (URL) => {
        return ShortURL[URL].shortUrl
    },

    getCount: (URL) => {
        return ShortURL[URL].count;
    },


    incrCount: (URL) => {
        let count = ShortURL[URL].count++;
        return count;
    },

    getAll: () => {
        for (item in ShortURL){
            console.log(ShortURL[item].shortUrl + "  " + ShortURL[item].count);
        }
    }
}
module.exports = linkShortner;