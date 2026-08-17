/* ============================================================
   CONQUEST — theme behaviour
   Preloader (first-visit, homepage-only), nav solidify + burger,
   GSAP hero entrance + scroll reveals. Degrades without GSAP.
   ============================================================ */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---- Preloader: only on homepage, only once per session ---- */
  var loader = document.getElementById('cq-loader');
  var curtain = document.getElementById('cq-curtain');
  var seen = false;
  try { seen = sessionStorage.getItem('cq_seen') === '1'; } catch(e){}

  // The preloader snippet only renders on the homepage, so its mere
  // presence means we're home. Skip it on repeat visits this session.
  if(loader){
    if(seen){
      loader.parentNode && loader.parentNode.removeChild(loader);
      curtain && curtain.parentNode && curtain.parentNode.removeChild(curtain);
      heroIn();
    } else {
      runLoader();
    }
  } else {
    heroIn();
  }

  function runLoader(){
    var pctEl = loader.querySelector('.cq-pct');
    var bar = loader.querySelector('.cq-bar span');
    var dur = reduce ? 200 : 1500, start = null;
    function tick(t){
      if(!start) start = t;
      var p = Math.min((t - start)/dur, 1);
      var val = Math.floor(p*100);
      if(pctEl) pctEl.innerHTML = val + '<span style="font-size:2rem;vertical-align:top">%</span>';
      if(bar) bar.style.width = val + '%';
      if(p < 1){ requestAnimationFrame(tick); } else { done(); }
    }
    requestAnimationFrame(tick);
  }

  function done(){
    try { sessionStorage.setItem('cq_seen','1'); } catch(e){}
    if(window.gsap){
      gsap.to(loader,{yPercent:-100,duration:.7,ease:'power4.inOut',onComplete:function(){ loader.style.display='none'; }});
      gsap.to(curtain,{yPercent:-100,duration:.9,delay:.08,ease:'power4.inOut',onStart:heroIn,onComplete:function(){ curtain.style.display='none'; }});
    } else {
      loader.style.display='none';
      if(curtain) curtain.style.display='none';
      heroIn();
    }
  }

  /* ---- Hero entrance ---- */
  function heroIn(){
    if(reduce || !window.gsap) return;
    var h1 = document.querySelector('.cq-hero h1');
    if(!h1) return;
    gsap.set('.cq-hero .cq-eyebrow, .cq-hero h1 .line > *, .cq-hero .sub, .cq-hero .actions',{yPercent:110,opacity:0});
    var tl = gsap.timeline({defaults:{ease:'power4.out',duration:.9}});
    tl.to('.cq-hero .cq-eyebrow',{yPercent:0,opacity:1,duration:.6})
      .to('.cq-hero h1 .line > *',{yPercent:0,opacity:1,stagger:.12},'-=.2')
      .to('.cq-hero .sub',{yPercent:0,opacity:1,duration:.7},'-=.5')
      .to('.cq-hero .actions',{yPercent:0,opacity:1,duration:.7},'-=.55');
  }

  /* ---- Nav solidify + burger ---- */
  var hdr = document.querySelector('.cq-header');
  if(hdr){
    window.addEventListener('scroll', function(){ hdr.classList.toggle('solid', window.scrollY > 60); }, {passive:true});
  }
  var burger = document.querySelector('.cq-burger');
  var mm = document.querySelector('.cq-mobile');
  if(burger && mm){
    burger.addEventListener('click', function(){ mm.classList.toggle('open'); });
    mm.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ mm.classList.remove('open'); }); });
  }

  /* ---- Scroll reveals ---- */
  function initReveals(){
    if(window.gsap && window.ScrollTrigger && !reduce){
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray('.cq-reveal').forEach(function(el){
        gsap.to(el,{opacity:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%'}});
      });
      gsap.utils.toArray('.cq-grid-prod .cq-card, .cq-grid-col .cq-tile').forEach(function(el,i){
        gsap.set(el,{opacity:0,y:40});
        gsap.to(el,{opacity:1,y:0,duration:.7,ease:'power3.out',delay:(i%4)*0.06,scrollTrigger:{trigger:el.parentElement,start:'top 82%'}});
      });
    } else {
      document.querySelectorAll('.cq-reveal').forEach(function(el){ el.style.opacity=1; el.style.transform='none'; });
    }
  }
  if(document.readyState !== 'loading'){ initReveals(); }
  else { document.addEventListener('DOMContentLoaded', initReveals); }

  /* ---- Quick add to cart (catalogue) ---- */
  function cqToast(msg){
    var t = document.getElementById('cq-toast');
    if(!t){ t = document.createElement('div'); t.id = 'cq-toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(function(){ t.classList.remove('show'); }, 2200);
  }
  function cqUpdateCount(n){
    document.querySelectorAll('[data-cq-cart-count]').forEach(function(el){ el.textContent = n; });
  }
  document.addEventListener('submit', function(e){
    var form = e.target.closest && e.target.closest('form[data-cq-add]');
    if(!form) return;
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    var label = btn ? btn.textContent : '';
    if(btn){ btn.disabled = true; btn.textContent = '…'; }
    fetch(form.action, { method:'POST', headers:{ 'Accept':'application/javascript' }, body:new FormData(form) })
      .then(function(r){ if(!r.ok){ throw new Error('add failed'); } return r.json(); })
      .then(function(){ return fetch('/cart.js', { headers:{ 'Accept':'application/json' } }); })
      .then(function(r){ return r.json(); })
      .then(function(cart){
        cqUpdateCount(cart.item_count);
        if(btn){ btn.textContent = 'Added ✓'; }
        cqToast('Added to cart');
        setTimeout(function(){ if(btn){ btn.disabled = false; btn.textContent = label; } }, 1500);
      })
      .catch(function(){
        if(btn){ btn.disabled = false; btn.textContent = label; }
        cqToast('Could not add — open the product');
      });
  });
})();

/* ---- Force add-to-cart enabled on the product page ----
   Shopify's `available` flag is stuck false on this store, so Dawn keeps
   disabling the buy button + labelling it "Sold out". Re-enable it and keep
   it enabled even when Dawn's variant JS tries to disable it again. ---- */
(function(){
  function enable(btn){
    if(!btn) return;
    if(btn.hasAttribute('disabled')) btn.removeAttribute('disabled');
    btn.disabled = false;
    var span = btn.querySelector('span') || btn;
    if(/sold out|unavailable/i.test(span.textContent)) span.textContent = 'Add to cart';
  }
  function run(){
    var btns = document.querySelectorAll('.product-form__submit, button[name="add"]');
    btns.forEach(function(btn){
      enable(btn);
      new MutationObserver(function(){ enable(btn); })
        .observe(btn, { attributes:true, attributeFilter:['disabled'], childList:true, subtree:true });
    });
  }
  if(document.readyState !== 'loading') run();
  else document.addEventListener('DOMContentLoaded', run);
})();

/* ---- Responsive ---- */
@media(max-width:1200px){
  .cq-cat-grid{ grid-template-columns:repeat(3,1fr); }
}
@media(max-width:960px){
  .cq-cat-grid{ grid-template-columns:repeat(2,1fr); }
  .cq-grid-prod{grid-template-columns:repeat(2,1fr)}
  .cq-creed .cq-wrap{grid-template-columns:1fr; gap:2.5rem}
}
@media(max-width:640px){
  .cq-nav ul, .cq-nav .cq-cta{display:none}
  .cq-burger{display:flex}
  .cq-grid-col{grid-template-columns:repeat(2,1fr)}
  .cq-cat-grid{grid-template-columns:1fr}
  .cq-cat{padding:6rem 0 4rem}
  .cq-sec{padding:4.5rem 0}
  .cq-marquee span{font-size:1.15rem}
}
@media(min-width:1100px){
  .cq-marquee span{ font-size:1.9rem; }
}

@media(prefers-reduced-motion:reduce){
  .cq-reveal{opacity:1; transform:none}
  *{animation-duration:.001ms!important; transition-duration:.001ms!important}
}

/* Increase nav link font size */
nav.header-nav-left a,
nav.boutique-menu a,
.header-nav-container nav a {
  font-size: 3.1rem !important;
  font-style: italic !important;}




