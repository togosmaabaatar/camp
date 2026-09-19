'use strict';
const translations = {
  unavailable: ['Online inquiries are not active yet. Your details have not been sent. Please call +976 9494 7544 to plan your trip.', 'Онлайн хүсэлт хараахан идэвхжээгүй тул таны мэдээлэл илгээгдээгүй. +976 9494 7544 дугаарт залгаж аяллаа төлөвлөөрэй.'],
  network: ['The email connection could not load. Check your connection or call +976 9494 7544.', 'Имэйл холболт ачаалагдсангүй. Интернэтээ шалгах эсвэл +976 9494 7544 дугаарт залгаарай.'],
  failed: ['Your inquiry could not be sent. Please try again or call +976 9494 7544.', 'Хүсэлт илгээгдсэнгүй. Дахин оролдох эсвэл +976 9494 7544 дугаарт залгаарай.'],
  sent: ['Your inquiry has been sent. We’ll contact you to discuss availability, price and arrangements. Your booking is not yet confirmed.', 'Таны хүсэлт илгээгдлээ. Бид сул байр, үнэ, нөхцөлийг ярилцахаар эргэн холбогдоно. Захиалга хараахан баталгаажаагүй.'],
  sending: ['Sending…', 'Илгээж байна…'],
  submit: ['Send trip inquiry', 'Аяллын хүсэлт илгээх'],
  required: ['Please complete this field.', 'Энэ талбарыг бөглөнө үү.'],
  email: ['Please enter a valid email address.', 'Зөв и-мэйл хаяг оруулна уу.'],
  phone: ['Use 7–30 characters: digits, +, spaces, parentheses or hyphens.', '7–30 тэмдэгт ашиглана уу: тоо, +, зай, хаалт эсвэл зураас.'],
  date: ['Please choose today or a future date.', 'Өнөөдөр эсвэл ирээдүйн өдөр сонгоно уу.'],
  number: ['Enter a whole number within the allowed range.', 'Зөвшөөрөгдсөн хязгаарт багтах бүхэл тоо оруулна уу.']
};
let language = 'en';
try { if (localStorage.getItem('tsagaan-language') === 'mn') language = 'mn'; } catch { /* Language still works when storage is blocked. */ }
const query = new URLSearchParams(location.search);
if (['en', 'mn'].includes(query.get('lang'))) language = query.get('lang');
const tr = key => translations[key][language === 'mn' ? 1 : 0];
let statusKey = '';
let sending = false;
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
function setLanguage(next) {
  language = next;
  document.documentElement.lang = next;
  document.querySelectorAll('[data-en]').forEach(el => { el.textContent = el.getAttribute('data-' + next); });
  ['alt', 'placeholder', 'aria-label', 'content'].forEach(attr => {
    document.querySelectorAll('[data-en-' + attr + ']').forEach(el => el.setAttribute(attr, el.getAttribute('data-' + next + '-' + attr)));
  });
  document.querySelectorAll('[data-language]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.language === next)));
  // Keep the language on navigation even when storage is unavailable or pages are opened as local files.
  document.querySelectorAll('a[href]').forEach(a => {
    const raw = a.getAttribute('href');
    if (!/^[\w-]+\.html(?:[?#]|$)/.test(raw)) return;
    const url = new URL(raw, location.href);
    url.searchParams.set('lang', next);
    a.setAttribute('href', url.pathname.split('/').pop() + url.search + url.hash);
  });
  if (form) {
    form.querySelectorAll('input,textarea,select').forEach(el => el.setCustomValidity(''));
    document.querySelector('#submit-label').textContent = tr(sending ? 'sending' : 'submit');
    if (statusKey) status.textContent = tr(statusKey);
  }
  try { localStorage.setItem('tsagaan-language', next); } catch { /* URL links preserve the choice. */ }
}
document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
setLanguage(language);
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') { if (nav.classList.contains('open')) { closeMenu(); menu.focus(); } } });
const desktop = matchMedia('(min-width: 1101px)');
desktop.addEventListener('change', event => { if (event.matches) closeMenu(); });
document.querySelector('#year').textContent = new Date().getFullYear();
const dialog = document.querySelector('#social-dialog');
document.querySelectorAll('[data-social]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#social-title').textContent = button.dataset.social;
  dialog.showModal();
}));
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
});
function todayLocal() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
if (form) {
  const date = form.elements.arrival_date;
  date.min = todayLocal();
  const selectedStay = { ger: 'Ger', cabin: 'Cabin' }[query.get('stay')];
  if (selectedStay) form.elements.accommodation.value = selectedStay;
  form.addEventListener('input', event => event.target.setCustomValidity?.(''));
  form.addEventListener('change', event => event.target.setCustomValidity?.(''));
  form.addEventListener('invalid', event => {
    const input = event.target;
    if (input.validity.customError) return;
    const key = input.validity.valueMissing ? 'required' : input.type === 'email' ? 'email' : input.type === 'date' ? 'date' : input.type === 'tel' ? 'phone' : 'number';
    input.setCustomValidity(tr(key));
  }, true);
  function showStatus(key, kind = 'notice') { statusKey = key; status.textContent = tr(key); status.className = kind; }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    const data = Object.fromEntries(new FormData(form));
    if (data.website) return;
    date.min = todayLocal();
    if (data.arrival_date < todayLocal()) { date.setCustomValidity(tr('date')); date.reportValidity(); return; }
    if (!form.reportValidity()) return;
    const config = window.TSAGAAN_GARID_CONFIG?.emailjs;
    if (!config?.publicKey || !config?.serviceId || !config?.templateId) { showStatus('unavailable'); return; }
    if (!window.emailjs) { showStatus('network'); return; }
    const button = form.querySelector('[type=submit]');
    sending = true; button.disabled = true;
    document.querySelector('#submit-label').textContent = tr('sending');
    statusKey = ''; status.textContent = '';
    try {
      const { website, ...params } = data;
      await window.emailjs.send(config.serviceId, config.templateId, { ...params, language }, { publicKey: config.publicKey });
      showStatus('sent', 'success'); form.reset();
    } catch { showStatus('failed'); }
    finally { sending = false; button.disabled = false; document.querySelector('#submit-label').textContent = tr('submit'); }
  });
}
