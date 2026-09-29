const DATA = fetch('menu.json').then(r => { if (!r.ok) throw new Error('menu.json unavailable'); return r.json(); });
let english = false, dark = false, all = [], cart = new Map(), menuData = null, activeCategory = 'Semua', activeItem = null;
const $ = s => document.querySelector(s);
const money = n => 'Rp' + new Intl.NumberFormat('id-ID').format(n);
const dict = {'Coto Makassar':'Makassar beef soup','Konro Bakar':'Grilled beef ribs','Pallubasa':'Pallubasa beef soup','Es Pisang Ijo':'Green banana dessert','Makanan':'Main dishes','Minuman & pencuci mulut':'Drinks & dessert'};
const descEN = {'Coto Makassar':'Beef in a spiced broth, served with ketupat.','Konro Bakar':'Smoky grilled beef ribs with a rich Makassar spice rub.','Pallubasa':'Silky spiced broth with beef and toasted coconut.','Es Pisang Ijo':'Banana wrapped in pandan dough, shaved ice and syrup.'};
const quantity = name => cart.get(name) || 0;
const safe = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label = item => english ? (dict[item.name] || item.name) : item.name;
const description = item => english ? (descEN[item.name] || 'Illustrative description · demo only') : item.description;
const categoryLabel = cat => english ? (cat==='Semua'?'All':safe(dict[cat]||cat)) : (cat==='Minuman & pencuci mulut'?'Minuman & camilan':safe(cat));
const qtyTotal = () => [...cart.values()].reduce((a,b)=>a+b,0);
const totalPrice = () => [...cart].reduce((sum,[name,q])=>sum+(all.find(x=>x.name===name)?.price||0)*q,0);

function makeMessage() {
  const lines=[...cart].filter(([,q])=>q>0).map(([name,q])=>`• ${q} × ${english ? (dict[name]||name) : name} — ${money(all.find(x=>x.name===name).price*q)}`);
  if(!lines.length)return '';
  return english ? `Hello, I would like to order from Warung Coto Daeng (DEMO):\n${lines.join('\n')}\nSimulated total: ${money(totalPrice())}\nThis is a fictional demo draft. Nothing is sent automatically or addressed to the restaurant. Choose and verify the recipient, then check items, quantities and prices before sending.` : `Halo Warung Coto Daeng (DEMO), saya ingin memesan:\n${lines.join('\n')}\nTotal simulasi: ${money(totalPrice())}\nIni hanya draf demo fiktif. Tidak ada pesan yang terkirim otomatis atau ditujukan ke restoran. Pilih dan pastikan penerima, lalu periksa item, jumlah, dan harga sebelum mengirim.`;
}
function updateOrder() {
  const count=qtyTotal();
  $('#cartbar').hidden=count===0;
  document.body.classList.toggle('has-cart',count>0);
  $('#cartCount').textContent=english?`${count} ${count===1?'item':'items'}`:`${count} item dipilih`;
  $('#cartTotal').textContent=english?`Simulated total ${money(totalPrice())}`:`Total simulasi ${money(totalPrice())}`;
  document.querySelectorAll('.compose-order').forEach(a=>{
    if(count){a.href=`https://wa.me/${(menuData.whatsappPhone||'').replace(/\D/g,'')}?text=${encodeURIComponent(makeMessage())}`;a.target='_blank';a.rel='noopener';}
    else{a.href='#menu';a.removeAttribute('target');}
  });
  refreshSheet();
}
function tagsFor(item){
  const tags=[];
  if(item.name==='Coto Makassar')tags.push(`<span class="badge best">${english?'BEST SELLER':'TERLARIS'}</span>`);
  if(item.tags.some(t=>/pedas/i.test(t)))tags.push(`<span class="badge hot">${english?'SPICY':'PEDAS'}</span>`);
  if(item.tags.some(t=>/halal/i.test(t)))tags.push(`<span class="badge halal">${english?'HALAL · EXAMPLE':'HALAL · CONTOH'}</span>`);
  return tags.join('');
}
function renderCategories(){
  const categories=['Semua',...new Set(all.map(x=>x.category))];
  $('#categories').innerHTML=categories.map(cat=>`<button class="category-chip ${cat===activeCategory?'active':''}" type="button" data-category="${safe(cat)}">${categoryLabel(cat)}</button>`).join('');
  document.querySelectorAll('.category-chip').forEach(btn=>btn.addEventListener('click',()=>{activeCategory=btn.dataset.category;$('#search').value='';render();btn.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});}));
}
function render(){
  document.documentElement.lang=english?'en':'id';
  const q=$('#search').value.trim().toLocaleLowerCase();
  const shown=all.filter(item=>{
    const inCategory=activeCategory==='Semua'||item.category===activeCategory;
    const haystack=[item.name,dict[item.name],item.description,descEN[item.name],item.category,dict[item.category]].filter(Boolean).join(' ').toLocaleLowerCase();
    return inCategory&&haystack.includes(q);
  });
  $('#heroOverline').textContent=english?'A WARM MAKASSAR KITCHEN':'DAPUR HANGAT · MAKASSAR';
  $('#heroBest').textContent=english?'A local favorite':'Favorit warga';
  $('#heroCta').textContent=english?'Explore the menu':'Jelajahi menu';
  $('#welcomeHeading').textContent=english?'What are you craving today?':'Ada rasa yang ingin dicoba?';
  $('#search').placeholder=english?'Find a dish…':'Cari menu…';
  $('#menuOverline').textContent=english?'FROM OUR KITCHEN':'DARI DAPUR KAMI';
  $('#menuHeading').textContent=english?'Made to be loved':'Yang jadi kesukaan';
  $('#priceNote').textContent=english?'Example prices in IDR':'Harga contoh dalam rupiah';
  $('#visitOverline').textContent=english?'COME ON BY':'SINGGAH SEBENTAR';
  $('#visitTitle').textContent=english?'There is always a place at our table.':'Selalu ada tempat di meja kami.';
  $('#map').textContent=english?'Open map ↗':'Buka peta ↗';
  $('#orderTitle').textContent=english?'Build your order.':'Racik pesananmu.';
  $('#orderBody').textContent=english?'Choose your favorites. WhatsApp will open an unsent order draft.':'Pilih hidangan favorit. WhatsApp hanya membuka draf pesanan yang belum terkirim.';
  $('#orderCta').textContent=english?'Choose dishes':'Mulai pilih menu';
  $('#cartCta').textContent=english?'Review order':'Lihat pesanan';
  $('#disclaimer').textContent=english?'FICTIONAL DEMO. Business, hours, location, prices, dishes, tags and images are examples only. The halal badge is a placeholder, not a certification claim. AI food photos are illustrative and do not show products sold by a real business. WhatsApp only opens an unsent draft; choose and verify the recipient, then check the order before sending.':'DEMO FIKTIF. Nama usaha, jam, lokasi, harga, menu, tag, dan gambar hanya contoh. Lencana halal adalah placeholder, bukan klaim sertifikasi. Foto makanan AI bersifat ilustratif dan bukan produk yang dijual usaha nyata. WhatsApp hanya membuka draf yang belum terkirim; pilih dan pastikan penerima, lalu periksa pesanan sebelum mengirim.';
  renderCategories();
  $('#items').innerHTML=shown.map((item,i)=>`<article class="food-card" data-open="${safe(item.name)}" style="animation-delay:${Math.min(i*55,220)}ms" tabindex="0" aria-label="${english?'See details for':'Lihat detail'} ${safe(label(item))}"><div class="food-photo"><img src="${safe(item.image)}" alt="Foto ilustrasi ${safe(label(item))}; bukan foto produk" loading="lazy" decoding="async"><div class="badge-row">${tagsFor(item)}</div></div><div class="food-info"><div class="food-title-row"><h3>${safe(label(item))}</h3><button class="add-mini" type="button" data-add="${safe(item.name)}" aria-label="${english?'Add':'Tambah'} ${safe(label(item))} to order">+</button></div><p>${safe(description(item))}</p><div class="food-foot"><strong class="food-price">${money(item.price)}</strong><span class="tap-note">${english?'VIEW DETAIL':'LIHAT DETAIL'} ↗</span></div></div></article>`).join('');
  $('#empty').hidden=shown.length>0;
  document.querySelectorAll('.food-card').forEach(card=>{
    const open=()=>openSheet(card.dataset.open);
    card.addEventListener('click',e=>{if(!e.target.closest('[data-add]'))open();});
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
  });
  document.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const n=b.dataset.add;cart.set(n,quantity(n)+1);updateOrder();render();}));
}
function openSheet(name){
  activeItem=all.find(x=>x.name===name);if(!activeItem)return;
  refreshSheet();const dialog=$('#itemSheet');if(!dialog.open)dialog.showModal();
}
function refreshSheet(){
  if(!activeItem)return;
  $('#sheetImage').src=activeItem.image;$('#sheetImage').alt=`Foto ilustrasi ${label(activeItem)}; bukan foto produk`;
  $('#sheetBadges').innerHTML=tagsFor(activeItem);$('#sheetName').textContent=label(activeItem);$('#sheetDescription').textContent=description(activeItem);$('#sheetPrice').textContent=money(activeItem.price);
  $('#sheetQty').textContent=quantity(activeItem.name);
}
function mutate(name,delta){const n=quantity(name)+delta;if(n>0)cart.set(name,n);else cart.delete(name);updateOrder();render();}
DATA.then(d=>{
  menuData=d;all=d.menu;
  $('#name').textContent=d.businessName.replace(/^Warung\s+/,'').replace(' — DEMO','');$('#brandName').textContent=d.businessName.replace('Warung ','').replace(' — DEMO','');$('#footerName').textContent=d.businessName.replace(' — DEMO','');
  $('#tagline').textContent=d.tagline;$('#heroHours').textContent=d.hours.replace('Setiap hari · ','').replace(' (contoh)','');$('#hours').textContent=d.hours;$('#address').textContent=d.address;$('#map').href=d.locationUrl;
  $('#lang').addEventListener('click',()=>{english=!english;$('#lang').textContent=english?'ID':'EN';render();updateOrder();});
  $('#theme').addEventListener('click',()=>{dark=!dark;document.body.classList.toggle('dark-theme',dark);$('#theme').textContent=dark?'☼':'◐';$('#theme').setAttribute('aria-label',dark?'Gunakan tema terang':'Gunakan tema gelap');});
  $('#search').addEventListener('input',()=>{activeCategory='Semua';render();});
  $('#sheetClose')?.addEventListener('click',()=>$('#itemSheet').close());
  $('.sheet-close').addEventListener('click',()=>$('#itemSheet').close());
  $('#itemSheet').addEventListener('click',e=>{if(e.target===$('#itemSheet'))$('#itemSheet').close();});
  $('#sheetPlus').addEventListener('click',()=>activeItem&&mutate(activeItem.name,1));
  $('#sheetMinus').addEventListener('click',()=>activeItem&&mutate(activeItem.name,-1));
  render();updateOrder();
}).catch(err=>{console.error(err);$('#items').innerHTML='<p class="empty">Menu sedang tidak tersedia. Coba muat ulang.</p>';});
