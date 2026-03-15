const fs = require('fs');

const testCases = [
    `<img src="{{ '/assets/images/user-uploads/1773605747002-pxl_20251205_230859194.jpg' | url }}" alt="" style="width: 50%;">`,
    `<img src="{{ '/assets/images/user-uploads/1773603950895-crystaldiskmark_t7_20251020152906.png' | url }}" alt="test" style="width: 25%;">`
];

const regex = /<img[^>]*src=(["'])(.*?)\1[^>]*alt=(["'])(.*?)\3[^>]*style=(["'])[^"']*\bwidth:\s*(\d+)%[^"']*\5[^>]*>/g;

for (const body of testCases) {
    let replaced = body.replace(regex, (match, q1, src, q2, alt, q3, width) => {
        return `MATCH! ${width}%`;
    });
    console.log(replaced);
}
