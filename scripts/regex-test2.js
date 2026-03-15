let text = `here is an image, at 50%\n\n<img src="{{ '/assets/images/user-uploads/1773605747002-pxl_20251205_230859194.jpg' | url }}" alt="" style="width: 50%;">`;
let clean = text.replace(/<img[^>]*src=(["'])(.*?)\1[^>]*alt=(["'])(.*?)\3[^>]*style=(["'])[^"']*width:\s*(\d+)%[^"']*\5[^>]*>/g, (match, q1, src, q2, alt, q3, width) => { return `MATCHED: ${width}%`; }); 
console.log(clean);
