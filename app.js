const KEY="rareWearSiteDataV1";
const defaultData = {
  settings:{brand:"RARE WEAR",subbrand:"T-SHIRT PRINTING",tagline:"Custom gifts made just for you!",phone:"6362619930",instagram:"_rare__wear_official",address:"Parvathi Nagar, Medahalli, Bangalore 560049",heroTitle:"RARE CUSTOM GIFTS",heroText:"Premium quality • Vibrant prints • Made with care",footerText:"Thank you for supporting small business!",adminPassword:"rare123"},
  banner:"assets/banner.png",
  products:[]
};
async function getData(){
  try{
    const saved=localStorage.getItem(KEY);
    if(saved) return JSON.parse(saved);
    const r=await fetch("assets/default-data.json"); const d=await r.json(); localStorage.setItem(KEY,JSON.stringify(d)); return d;
  }catch(e){return defaultData}
}
function waUrl(phone,msg){return "https://wa.me/"+phone.replace(/\D/g,"")+"?text="+encodeURIComponent(msg)}
function money(v){if(v===null||v===undefined||String(v).trim()==="")return "Price on request"; return "₹"+String(v)}
async function render(){
 const d=await getData(), s=d.settings;
 document.title=`${s.brand} | Custom Printing & Gifts`;
 document.getElementById("heroBanner").src=d.banner||"assets/banner.png";
 document.getElementById("heroTitle").innerHTML=(s.heroTitle||"RARE CUSTOM GIFTS").replace(/ /g," ").replace("CUSTOM","<em>CUSTOM</em>");
 document.getElementById("heroText").textContent=s.heroText||s.tagline;
 document.getElementById("phoneText").textContent=s.phone;
 document.getElementById("phoneLink").href="tel:"+s.phone.replace(/\s/g,"");
 document.getElementById("instaText").textContent="@"+s.instagram;
 document.getElementById("instaLink").href="https://instagram.com/"+s.instagram.replace(/^@/,"");
 document.getElementById("addressText").textContent=s.address;
 document.getElementById("footerText").textContent=s.footerText;
 document.getElementById("year").textContent=new Date().getFullYear();
 const generalMsg=`Hello Rare Wear! I would like to place a custom printing order.`;
 document.getElementById("heroWhatsApp").href=waUrl(s.phone,generalMsg);
 document.getElementById("contactWhatsApp").href=waUrl(s.phone,generalMsg);
 const cats=["All",...new Set(d.products.map(p=>p.category).filter(Boolean))];
 document.getElementById("filters").innerHTML=cats.map((c,i)=>`<button class="filter ${i===0?"active":""}" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join("");
 const grid=document.getElementById("productGrid");
 const draw=(cat="All")=>{
   grid.innerHTML=d.products.filter(p=>cat==="All"||p.category===cat).map(p=>`
    <article class="product">
      <div class="product-img"><img src="${escapeAttr(p.image||"assets/logo.png")}" alt="${escapeAttr(p.name)}" onerror="this.src='assets/logo.png'"></div>
      <div class="product-body">
        <small>${escapeHtml(p.category||"Custom")}</small>
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.description||"Custom printed product made for you.")}</p>
        <div class="price">${money(p.price)}</div>
        <a class="btn gold" href="${waUrl(s.phone,`Hello Rare Wear! I am interested in: ${p.name}. Please share details and pricing.`)}" target="_blank">Order / Enquire</a>
      </div>
    </article>`).join("") || `<p>No products yet. Add products from the Admin Panel.</p>`;
 };
 draw();
 document.querySelectorAll(".filter").forEach(btn=>btn.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");draw(btn.dataset.cat)});
 document.getElementById("customForm").onsubmit=(e)=>{e.preventDefault();const n=document.getElementById("custName").value,ph=document.getElementById("custPhone").value,pr=document.getElementById("custProduct").value,dt=document.getElementById("custDetails").value;window.open(waUrl(s.phone,`Hello Rare Wear! Custom order request.\nName: ${n}\nCustomer WhatsApp: ${ph}\nProduct: ${pr}\nDetails: ${dt}`),"_blank")};
}
function escapeHtml(x){return String(x??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function escapeAttr(x){return escapeHtml(x)}
render();