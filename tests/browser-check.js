window.addEventListener('load', async () => {
  const results = [];
  const check = (name, pass) => results.push({ name, pass: !!pass });
  const pause = () => new Promise(resolve => setTimeout(resolve, 70));
  try {
    const frame = document.createElement('iframe');
    frame.style.cssText = 'border:0;height:1000px;display:block';
    document.body.append(frame);
    for (const page of ['index', 'stay', 'experiences', 'about', 'getting-here', 'contact']) {
      await new Promise(resolve => { frame.onload = resolve; frame.src = '../' + page + '.html?lang=en'; });
      const d = frame.contentDocument, w = frame.contentWindow;
      check(page + ': English default', d.documentElement.lang === 'en');
      for (const width of [320, 390, 768, 1440]) {
        frame.style.width = width + 'px'; await pause();
        for (const lang of ['en', 'mn']) {
          d.querySelector('[data-language=' + lang + ']').click(); await pause();
          check(page + ': ' + width + ' ' + lang + ' no overflow', d.documentElement.scrollWidth <= w.innerWidth);
          check(page + ': ' + width + ' ' + lang + ' translations', [...d.querySelectorAll('[data-en]')].every(el => el.textContent === el.getAttribute('data-' + lang)));
        }
      }
      frame.style.width = '390px'; await pause();
      const menu=d.querySelector('.menu-toggle'); menu.click();
      check(page + ': mobile menu opens', menu.getAttribute('aria-expanded') === 'true');
      d.dispatchEvent(new w.KeyboardEvent('keydown', {key:'Escape'}));
      check(page + ': escape closes menu', menu.getAttribute('aria-expanded') === 'false');
      check(page + ': language follows links', [...d.querySelectorAll('a[href*=".html"]')].every(a => a.href.includes('lang=mn')));
      d.querySelector('[data-social]').click(); check(page + ': social dialog opens', d.querySelector('dialog').open);
      d.querySelector('#close-dialog').click(); check(page + ': social dialog closes', !d.querySelector('dialog').open);
      if (page === 'getting-here') { const summary=d.querySelector('summary'); summary.click(); check('FAQ opens', summary.parentElement.open); }
      if (page === 'contact') {
        // Never use the real site's credentials or send a real email in this harness.
        w.TSAGAAN_GARID_CONFIG = { emailjs: { publicKey: '', serviceId: '', templateId: '' } };
        const form=d.querySelector('form');
        const fill=()=>{ form.elements.from_name.value='Test Guest'; form.elements.reply_to.value='guest@example.com'; form.elements.arrival_date.value='2099-01-01'; form.elements.guests.value='4'; form.elements.traveller_type.value='Family'; form.elements.accommodation.value='Cabin'; };
        fill();
        const submit=()=>form.dispatchEvent(new w.Event('submit',{cancelable:true}));
        d.querySelector('[data-language=en]').click();submit();
        check('unconfigured form honest English status',d.querySelector('#form-status').textContent.includes('have not been sent'));
        d.querySelector('[data-language=mn]').click();
        check('status switches to Mongolian',d.querySelector('#form-status').textContent.includes('илгээгдээгүй'));
        check('language switch keeps entered values',form.elements.from_name.value==='Test Guest');
        w.TSAGAAN_GARID_CONFIG.emailjs={publicKey:'mock',serviceId:'mock',templateId:'mock'};
        w.emailjs={send:async()=>{throw new Error('mock failure')}}; submit();await pause();
        check('failure keeps values',form.elements.from_name.value==='Test Guest' && d.querySelector('#form-status').textContent.includes('илгээгдсэнгүй'));
        let calls=0, params, resolveRequest;
        w.emailjs={send:async(a,b,p)=>{calls++;params=p;await new Promise(r=>resolveRequest=r);}};
        submit();submit();check('duplicate submission blocked',calls===1);check('pending button disabled',form.querySelector('[type=submit]').disabled);
        d.querySelector('[data-language=en]').click();check('pending state translated',d.querySelector('#submit-label').textContent==='Sending…');
        resolveRequest();await pause();
        check('success explains not confirmed',d.querySelector('#form-status').textContent.includes('not yet confirmed'));
        check('email includes inquiry details',params.guests==='4'&&params.traveller_type==='Family'&&params.accommodation==='Cabin'&&params.nights==='2'&&params.language==='mn');
        check('form resets on success',form.elements.from_name.value==='');
        fill();form.elements.arrival_date.value='2000-01-01';submit();check('past date blocked',!form.elements.arrival_date.validity.valid&&calls===1);
      }
    }
    await new Promise(resolve => {frame.onload=resolve;frame.src='../contact.html?stay=ger&lang=mn'});
    check('stay preference survives page navigation',frame.contentDocument.querySelector('#accommodation').value==='Ger');
    check('language query restored',frame.contentDocument.documentElement.lang==='mn');
  } catch (error) { results.push({name:'EXCEPTION: '+error.message,pass:false}); }
  const pre=document.createElement('pre');pre.id='test-results';pre.textContent=JSON.stringify(results);document.body.append(pre);
});
