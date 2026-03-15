let htmlBody = `<img src="https://raw.githubusercontent.com/wstidolph/NATRC1M-11ty-gemini/draft/slug/src/assets/images/user-uploads/1773605747002-pxl_20251205_230859194.jpg" alt="" style="width: 50%;">`;

htmlBody = htmlBody
    .replace(/^### (.*)$/gim, "<h3>$1</h3>")
    .replace(/^## (.*)$/gim, "<h2>$1</h2>")
    .replace(/^# (.*)$/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>");

console.log(htmlBody);
