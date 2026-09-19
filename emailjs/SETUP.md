# EmailJS template тохируулах

Service ID, Template ID, Public Key-ийг `emailjs.txt`-ээс `config.js` руу холбосон. Доорх тохиргоог EmailJS dashboard дээр өөрөө хадгална. Код өөрчилсөн нь dashboard дээрх template-ийг автоматаар өөрчлөхгүй.

1. EmailJS → Email Templates → `config.js` дахь Template ID-тай тохирох template-ээ нээнэ.
2. Content хэсгийн HTML/code засварлагчид `emailjs/template.html` файлын бүх агуулгыг хуулж тавина. `preview.html` бол жишээ мэдээлэлтэй харагдах загвар; template болгож хуулж болохгүй.
3. Дараах талбаруудыг тохируулна:

| Талбар | Утга |
|---|---|
| Subject | `New trip inquiry — {{from_name}} · {{arrival_date}} · {{guests}} guests` |
| To Email | Танай хүсэлт хүлээн авах бодит имэйл хаяг |
| From Name | `TSAGAAN GARID Website` |
| From Email | **Use Default Email Address** — холбосон service-ийн имэйл |
| Reply To | `{{reply_to}}` |
| CC / BCC | Шаардлагагүй бол хоосон |

4. Save дарна. Домэйн хязгаарлалт ашиглаж байгаа бол сайт ажиллах хаяг, турших localhost хаягаа зөвшөөрнө.
5. Сайтаа `python3 -m http.server 8000` командаар ажиллуулаад http://localhost:8000/contact.html дээрээс өөрийн мэдээллээр нэг хүсэлт илгээж, Inbox/Spam дотор ирснийг шалгана. `Reply` дарж үзэхэд хүлээн авагч нь хүсэлт гаргагчийн имэйл байх ёстой.

Template нь баазын ажилтанд ирэх мэдэгдэл. Зочинд автоматаар хариу илгээх тусдаа template биш.

## Хувьсагчид

`from_name`, `reply_to`, `phone`, `arrival_date`, `nights`, `guests`, `traveller_type`, `accommodation`, `message`, `language` — бүгд сайтаас илгээгддэг нэртэй таарсан.

- `traveller_type`: Solo / Couple / Family / Group.
- `accommodation`: Undecided / Ger / Cabin / Mixed.
- `language`: en / mn.
- `phone`, `message` нь бөглөөгүй бол хоосон байж болно.

Хэрэглэгчийн бичсэн мэдээллийг `{{message}}` зэрэг хоёр хаалттайгаар оруулсан. EmailJS эдгээрийг HTML болгон ажиллуулахгүйгээр escape хийдэг. Гурван хаалт болгон сольж болохгүй.

Бодит имэйл одоогоор илгээгээгүй. Browser тест нь зөвхөн mock хариу ашигладаг.

Албан ёсны баримт:
- https://www.emailjs.com/docs/tutorial/creating-email-template/
- https://www.emailjs.com/docs/user-guide/dynamic-variables-templates/
