/* PROINGESCOM S.A.S. — interacciones del sitio */
const CONFIG={
  whatsapp:"+573205074383",   // PENDIENTE: número de WhatsApp Business con indicativo (ej. 573001234567)
  telefono:"+573205074383"   // PENDIENTE: teléfono de llamada directa
};
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const ok=()=>!/X/.test(CONFIG.whatsapp);
const toast=m=>{const t=$("#toast");t.textContent=m;t.hidden=false;clearTimeout(t._t);t._t=setTimeout(()=>t.hidden=true,5000)};
const waURL=txt=>`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(txt)}`;
const lb=$("#lightbox");

/* Tema claro/oscuro */
const root=document.documentElement,tb=$("#themeBtn");
const setTheme=t=>{root.dataset.theme=t;tb.setAttribute("aria-label",t==="dark"?"Cambiar a modo claro":"Cambiar a modo oscuro");try{localStorage.setItem("theme",t)}catch(e){}};
setTheme(root.dataset.theme||"light");
tb.addEventListener("click",()=>setTheme(root.dataset.theme==="dark"?"light":"dark"));

/* Menú móvil */
const bg=$("#burger"),nav=$("#nav");
bg.addEventListener("click",()=>{const o=nav.classList.toggle("open");bg.setAttribute("aria-expanded",o)});

/* Enlaces de WhatsApp y teléfono */
$$("[data-wa]").forEach(a=>{a.href=waURL(a.dataset.wa);a.target="_blank";a.rel="noopener";
  a.addEventListener("click",e=>{if(!ok()){e.preventDefault();toast("Falta configurar el número de WhatsApp en js/main.js")}})});
$$("[data-tel]").forEach(a=>{a.href="tel:"+CONFIG.telefono;a.addEventListener("click",e=>{if(/X/.test(CONFIG.telefono)){e.preventDefault();toast("Falta configurar el teléfono en js/main.js")}})});

/* Botón flotante y panel de preguntas frecuentes */
const fb=$("#fabBtn"),fm=$("#fabMenu"),panel=$("#faqPanel");
function closeFab(){fm.hidden=true;fb.setAttribute("aria-expanded",false)}
fb.addEventListener("click",()=>{const o=fm.hidden;fm.hidden=!o;fb.setAttribute("aria-expanded",o)});
$("#openFaq").addEventListener("click",()=>{closeFab();panel.hidden=false;$("button",panel).focus()});
$("#closeFaq").addEventListener("click",()=>{panel.hidden=true;fb.focus()});
document.addEventListener("click",e=>{if(!e.target.closest(".fab,.panel"))closeFab()});
document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;nav.classList.remove("open");bg.setAttribute("aria-expanded",false);closeFab();panel.hidden=true;if(lb)lb.hidden=true});

/* Aparición al desplazarse y contadores */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target)}}),{threshold:.1});
$$(".rv").forEach(el=>io.observe(el));
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);
  const el=e.target,n=+el.dataset.count,suf=el.dataset.suf||"";if(reduce){el.textContent=n+suf;return}
  const t0=performance.now();(function f(t){const p=Math.min((t-t0)/1200,1);el.textContent=Math.round(n*p)+suf;if(p<1)requestAnimationFrame(f)})(t0)}),{threshold:.6});
$$("[data-count]").forEach(el=>co.observe(el));

/* Galería: filtros y visor ampliado */
$$(".fl").forEach(b=>b.addEventListener("click",()=>{$$(".fl").forEach(x=>x.setAttribute("aria-pressed",x===b));
  $$(".gi").forEach(g=>g.hidden=b.dataset.f!=="all"&&g.dataset.c!==b.dataset.f)}));
$$(".gi .ph").forEach(p=>p.addEventListener("click",()=>{const im=$("img",p);if(!im)return;$("img",lb).src=im.src;$("img",lb).alt=im.alt;lb.hidden=false;$("button",lb).focus()}));
if(lb)lb.addEventListener("click",e=>{if(e.target===lb||e.target.closest("button"))lb.hidden=true});

/* Formulario de cotización: valida y abre WhatsApp con los datos (sin backend) */
const f=$("#quote");
if(f)f.addEventListener("submit",e=>{e.preventDefault();let bad=false;
  const chk=(id,fn,msg)=>{const el=$("#"+id),er=$("#e-"+id),v=el.value.trim(),g=fn(v);el.setAttribute("aria-invalid",!g);er.textContent=g?"":msg;if(!g)bad=true;return v};
  const n=chk("nombre",v=>v.length>=3,"Escriba su nombre completo."),
  t=chk("tel",v=>/^[\d\s+()-]{7,}$/.test(v),"Ingrese un teléfono válido."),
  s=chk("serv",v=>v!=="","Seleccione un servicio."),
  m=chk("msg",v=>v.length>=10,"Describa brevemente su proyecto (mínimo 10 caracteres)."),
  em=$("#email").value.trim(),ub=$("#ubic").value.trim();
  if(bad){$('[aria-invalid=true]').focus();return}
  if(!ok()){toast("Formulario válido, pero falta configurar el número de WhatsApp en js/main.js");return}
  const txt=`Solicitud de cotización — PROINGESCOM\nNombre: ${n}\nTeléfono: ${t}\n${em?"Correo: "+em+"\n":""}Servicio: ${s}\n${ub?"Ubicación de la obra: "+ub+"\n":""}Proyecto: ${m}`;
  window.open(waURL(txt),"_blank","noopener");
});
const y=$("#yr");if(y)y.textContent=new Date().getFullYear();
