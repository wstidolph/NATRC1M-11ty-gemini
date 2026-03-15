let body = `![]({{ '/assets/images/user-uploads/1773603950895-crystaldiskmark_t7_20251020152906.png' | url }})`;
let htmlBody = body.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
    let cleanSrc = src;
    if (src.includes("{{") && src.includes("| url")) {
        cleanSrc = src.replace(/\{\{\s*['"](.*?)['"]\s*\|\s*url\s*\}\}/, "$1");
    }
    const fullSrc = `https://raw.githubusercontent.com/wstidolph/NATRC1M-11ty-gemini/draft/crystaldiskmark/src${cleanSrc}`;
    return `<img src="${fullSrc}" data-original-src="${cleanSrc}" alt="${alt}">`;
});
console.log(htmlBody);
