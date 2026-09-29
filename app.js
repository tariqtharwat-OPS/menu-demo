const DATA = fetch('menu.json').then(r => r.json());
let english = false, all = [], cart = new Map(), menuData = null;
const money = n => 'Rp' + new Intl.NumberFormat('id-ID').format(n);
const dict = { 'Coto Makassar':'Makassar beef soup', 'Konro Bakar':'Grilled beef ribs', 'Pallubasa':'Pallubasa beef soup', 'Es Pisang Ijo':'Green banana dessert' };
const descriptions = { 'Coto Makassar':'Beef and spiced broth, served with ketupat.', 'Konro Bakar':'Spiced beef ribs, grilled and served warm.', 'Pallubasa':'Traditional spiced soup with beef and toasted coconut.', 'Es Pisang Ijo':'Banana wrapped in pandan dough, ice and syrup.' };
function orderMessage(d) {
  const lines = [...cart].filter(([,qty]) => qty > 0).map(([name,qty]) => {
    const item = all.find(x => x.name === name);
    return `- ${qty} x ${english ? (dict[name]||name) : name} — ${money(item.price * qty)}`;
  });
  if (!lines.length) return '';
  const total = [...cart].reduce((sum,[name,qty]) => sum + all.find(x => x.name === name).price * qty, 0);
  return english ? `Hello, I would like to order from Warung Coto Daeng (DEMO):\n${lines.join('\n')}\nSimulated total: ${money(total)}\nFictional demo draft; nothing is sent automatically and it is not addressed to the restaurant. Choose and verify the recipient, then check items, quantities and prices before sending.` : `Halo Warung Coto Daeng (DEMO), saya ingin memesan:\n${lines.join('\n')}\nTotal simulasi: ${money(total)}\nCatatan: Ini hanya draf demo fiktif; tidak terkirim otomatis dan belum ditujukan ke restoran. Pilih dan pastikan penerima, lalu cek menu, jumlah, dan harga sebelum mengirim.`;
}
function updateCart() {
  const count = [...cart.values()].reduce((a,b) => a+b, 0);
  const bar = document.querySelector('#cartbar');
  bar.hidden = count === 0;
  document.querySelector('#cartSummary').textContent = english ? `${count} ${count===1?'item':'items'} selected · simulated total ${money([...cart].reduce((s,[n,q]) => s+all.find(x=>x.name===n).price*q,0))}` : `${count} item dipilih · total simulasi ${money([...cart].reduce((s,[n,q]) => s+all.find(x=>x.name===n).price*q,0))}`;
  document.querySelectorAll('.compose-order').forEach(a => {
    if (count) { const phone=(menuData.whatsappPhone||'').replace(/\D/g,''); a.href = `https://wa.me/${phone}?text=${encodeURIComponent(orderMessage())}`; a.target = '_blank'; a.rel = 'noopener'; }
    else { a.href = '#menu'; a.removeAttribute('target'); }
  });
}
function render() {
  document.documentElement.lang = english ? 'en' : 'id';
  const q = document.querySelector('#search').value.toLocaleLowerCase();
  const items = all.filter(x => (x.name+' '+(dict[x.name]||'')+' '+x.description+' '+x.category).toLocaleLowerCase().includes(q));
  document.querySelector('#search').placeholder = english ? 'Search menu…' : 'Cari menu… / Search menu…';
  document.querySelector('.hero .eyebrow').textContent = english ? 'FROM THE MAKASSAR KITCHEN' : 'DARI DAPUR MAKASSAR';
  document.querySelector('#tagline').textContent = english ? 'Warm Makassar flavors, ready to share.' : menuData.tagline;
  document.querySelector('#menu .eyebrow').textContent = english ? 'TODAY’S MENU' : 'PILIHAN HARI INI';
  document.querySelector('#menu .small').textContent = english ? 'Simulated prices in IDR' : 'Harga contoh dalam rupiah';
  document.querySelector('.info > div:first-child .eyebrow').textContent = english ? 'VISIT US' : 'KUNJUNGI KAMI';
  document.querySelector('.info > div:first-child h2').textContent = english ? 'Hours & location' : 'Jam & lokasi';
  document.querySelector('.info > div:first-child .button').textContent = english ? 'Open map ↗' : 'Buka peta ↗';
  document.querySelector('.order-card .eyebrow').textContent = english ? 'WANT TO ORDER?' : 'MAU MEMESAN?';
  document.querySelector('.order-card h2').textContent = english ? 'Build your order' : 'Susun pesanan';
  document.querySelector('.order-card p').textContent = english ? 'Choose items and quantities. WhatsApp opens an unsent draft without a restaurant recipient; choose and verify the recipient, then check items, quantities and prices before sending.' : 'Pilih item dan jumlahnya. WhatsApp hanya membuka draf yang belum ditujukan ke restoran; pilih dan periksa penerima, item, jumlah, serta harga sebelum mengirim.';
  document.querySelectorAll('.compose-order').forEach(a => a.textContent = english ? 'Open WhatsApp draft' : 'Buka draf WhatsApp');
  document.querySelector('#hours').textContent = english ? 'Daily · 10.00–22.00 (example)' : menuData.hours;
  document.querySelector('#address').textContent = english ? 'Example Street No. 10, Makassar (fictional address)' : menuData.address;
  document.querySelector('#disclaimer').textContent = english ? 'FICTIONAL DEMO. Business name, contact, location, hours, prices, menu, tags and images are examples only. The halal tag is a placeholder, not a certification claim. AI photos are illustrative and do not show food sold by a real business. WhatsApp only prepares a draft; check the recipient, items and quantities before sending.' : menuData.disclaimer;
  document.querySelector('#categories').innerHTML = ['Semua',...new Set(all.map(x=>x.category))].map(x=>`<button data-category="${x}">${english ? ({'Semua':'All','Makanan':'Food','Minuman & pencuci mulut':'Drinks & dessert'}[x]||x) : x}</button>`).join('');
  document.querySelectorAll('#categories button').forEach(b=>b.onclick=()=>{document.querySelector('#search').value=b.dataset.category==='Semua'?'':b.dataset.category;render()});
  document.querySelector('#items').innerHTML = items.map(x => {
    const qty = cart.get(x.name) || 0;
    const tags = english ? 'Example tag only · not a halal certification claim' : x.tags.join(' · ');
    return `<article class="card"><img loading="lazy" src="${x.image}" alt="Foto AI ilustrasi ${x.name}; bukan foto produk"><div class="card-content"><h3>${english?(dict[x.name]||x.name):x.name}</h3><p>${english?(descriptions[x.name]||'Illustrative description · demo only'):x.description}</p><div class="price">${money(x.price)}</div><div class="tags">${tags}</div><div class="item-controls"><button class="button outline" data-add="${x.name}" aria-label="${english?'Remove 1':'Kurangi 1'} ${english?(dict[x.name]||x.name):x.name}">${qty ? '−' : '+'}</button><span>${qty}</span><button class="button outline" data-plus="${x.name}">${english?'Add':'Tambah'}</button></div></div></article>`;
  }).join('');
  document.querySelector('#empty').hidden = items.length > 0;
  document.querySelector('#menuHeading').textContent = english ? 'Browse the menu' : 'Menu lengkap';
  document.querySelectorAll('[data-plus]').forEach(b => b.onclick = () => { const n=b.dataset.plus; cart.set(n,(cart.get(n)||0)+1); render(); updateCart(); });
  document.querySelectorAll('[data-add]').forEach(b => b.onclick = () => { const n=b.dataset.add, q=cart.get(n)||0; if(q>1)cart.set(n,q-1);else cart.delete(n); render(); updateCart(); });
}
DATA.then(d => {
  menuData = d;
  all = d.menu;
  document.querySelector('#name').textContent = d.businessName;
  document.querySelector('#tagline').textContent = d.tagline;
  document.querySelector('#hours').textContent = d.hours;
  document.querySelector('#address').textContent = d.address;
  document.querySelector('#map').href = d.locationUrl;
  document.querySelector('#disclaimer').textContent = d.disclaimer;
  document.querySelector('#lang').onclick=()=>{english=!english;document.querySelector('#lang').textContent=english?'Bahasa Indonesia':'English';render();updateCart()};
  document.querySelector('#search').oninput=render;
  render(); updateCart();
});
