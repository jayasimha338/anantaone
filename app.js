const config = window.ANANTA_CONFIG;
document.querySelectorAll('.team-email').forEach(link => { link.textContent = config.TEAM_EMAIL; link.href = `mailto:${config.TEAM_EMAIL}`; });
document.querySelectorAll('.team-mobile').forEach(link => { link.textContent = config.TEAM_MOBILE; link.href = `tel:${config.TEAM_MOBILE}`; });
const appUrl = config.PUBLIC_APP_URL || window.location.href.split('#')[0];
document.querySelector('#qrCode').src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(appUrl)}`;
document.querySelector('#copyLink').addEventListener('click', async e => { await navigator.clipboard.writeText(appUrl); e.currentTarget.textContent = 'Link copied'; });
document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => { document.querySelector('#bookingService').value = button.dataset.service; document.querySelector('#booking').scrollIntoView({behavior:'smooth'}); }));
let installPrompt;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e; document.querySelector('#installButton').hidden = false; });
document.querySelector('#installButton').addEventListener('click', async () => { if (!installPrompt) return; installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; document.querySelector('#installButton').hidden = true; });
function submitForm(form) {
  form.addEventListener('submit', async event => {
    event.preventDefault(); const status = form.querySelector('.form-status'); const submit = form.querySelector('.submit');
    if (!config.APPS_SCRIPT_URL) { status.textContent = 'Setup pending: add the Google Apps Script web-app URL in config.js.'; status.className = 'form-status error'; return; }
    const data = new URLSearchParams(new FormData(form)); if (form.id === 'providerForm') data.set('pan', data.get('pan').toUpperCase());
    submit.disabled = true; status.textContent = 'Sending your details…'; status.className = 'form-status';
    try { await fetch(config.APPS_SCRIPT_URL, {method:'POST', mode:'no-cors', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:data}); form.reset(); status.textContent = form.id === 'customerForm' ? 'Request sent. We will connect you with your assigned provider.' : 'Registration received. Our team will verify your documents.'; status.className = 'form-status success'; }
    catch { status.textContent = 'Could not send the form. Please call the team for assistance.'; status.className = 'form-status error'; }
    finally { submit.disabled = false; }
  });
}
submitForm(document.querySelector('#customerForm')); submitForm(document.querySelector('#providerForm'));
if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js');
