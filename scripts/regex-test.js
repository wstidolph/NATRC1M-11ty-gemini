let body = `<p><img src="{{ '/assets/images/user-uploads/123.jpg' | url }}" alt="my alt" style="width: 50%;"></p>`;
let htmlBody = body.replace(/<img[^>]*src=(["'])(.*?)\1[^>]*alt=(["'])(.*?)\3[^>]*style=(["'])[^"']*width:\s*(\d+)%[^"']*\5[^>]*>/g, (match, q1, src, q2, alt, q3, width) => {
    let cleanSrc = src;
    if (src.includes("{{") && src.includes("| url")) {
        cleanSrc = src.replace(/\{\{\s*['"](.*?)['"]\s*\|\s*url\s*\}\}/, "$1");
    }
    const fullSrc = `https://githubusercontent...${cleanSrc}`;
    return `<img src="${fullSrc}" alt="${alt}" style="width: ${width}%;">`;
});

console.log(htmlBody);
