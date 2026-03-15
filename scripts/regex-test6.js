let markdown = `
Here is an image, at 50%
<img src="{{ '/assets/images/user-uploads/1773605747002-pxl_20251205_230859194.jpg' | url }}" alt="" style="width: 50%;">
And another ![alt]({{ '/assets/images/user-uploads/1773605747002-pxl_20251205_230859194.jpg' | url }})
With *italic* text and _italic_ text.
`;

let imageStash = [];
let htmlBody = markdown.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
    let cleanSrc = src;
    if (src.includes("{{") && src.includes("| url")) {
        cleanSrc = src.replace(/\{\{\s*['"](.*?)['"]\s*\|\s*url\s*\}\}/, "$1");
    }
    const fullSrc = cleanSrc;
    const imgHtml = `<img src="${fullSrc}" alt="${alt}">`;
    imageStash.push(imgHtml);
    return `[[[IMG_STASH_${imageStash.length - 1}]]]`;
});

htmlBody = htmlBody.replace(/<img[^>]*src=(["'])(.*?)\1[^>]*alt=(["'])(.*?)\3[^>]*style=(["'])[^"']*width:\s*(\d+)%[^"']*\5[^>]*>/g, (match, q1, src, q2, alt, q3, width) => {
    let cleanSrc = src;
    if (src.includes("{{") && src.includes("| url")) {
        cleanSrc = src.replace(/\{\{\s*['"](.*?)['"]\s*\|\s*url\s*\}\}/, "$1");
    }
    const fullSrc = cleanSrc;
    const imgHtml = `<img src="${fullSrc}" alt="${alt}" style="width: ${width}%;">`;
    imageStash.push(imgHtml);
    return `[[[IMG_STASH_${imageStash.length - 1}]]]`;
});

htmlBody = htmlBody
    .replace(/^### (.*)$/gim, "<h3>$1</h3>")
    .replace(/^## (.*)$/gim, "<h2>$1</h2>")
    .replace(/^# (.*)$/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>");

imageStash.forEach((markdown, index) => {
    htmlBody = htmlBody.replace(`[[[IMG_STASH_${index}]]]`, markdown);
});

console.log(htmlBody);
