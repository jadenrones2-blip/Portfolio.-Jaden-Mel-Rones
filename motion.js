(function(){
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vt='onpagereveal' in window;
  if(vt)document.documentElement.classList.add('mo-vt');
  // Soft page transitions for internal links
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href]');
    if(!a||reduce||vt||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.button!==0)return;
    if(a.target==='_blank'||a.hasAttribute('download'))return;
    var url=new URL(a.href,location.href);
    if(url.origin!==location.origin||/^(mailto|tel):/.test(a.href))return;
    if(url.pathname===location.pathname&&url.hash)return;
    if(!/\.html$|\/$/.test(url.pathname))return;
    e.preventDefault();
    document.body.classList.add('mo-out');
    setTimeout(function(){location.href=a.href},320);
  });
  window.addEventListener('pageshow',function(){document.body.classList.remove('mo-out')});
  // Section reveals (skip pages with their own reveal system)
  if(!document.querySelector('[data-rv]')&&'IntersectionObserver' in window&&!reduce){
    var vh=window.innerHeight;
    var els=[].slice.call(document.querySelectorAll('main > section, main > .pj-sec, .hp-feat')).filter(function(el){return el.getBoundingClientRect().top>vh*.9});
    var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('is-in');io.unobserve(x.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.06});
    els.forEach(function(el){el.classList.add('mo-rv');io.observe(el)});
  }
  // Homepage photo parallax (desktop)
  var img=document.querySelector('.hp-photo img');
  if(img&&!reduce&&window.matchMedia('(min-width: 821px)').matches){
    var t=false;
    var cur=0;function f(){var y=Math.min(window.scrollY,800)*.12;cur+=(y-cur)*.18;img.style.transform='translate3d(0,'+cur.toFixed(2)+'px,0) scale(1.04)';if(Math.abs(y-cur)>.1){requestAnimationFrame(f)}else{t=false}}
    setTimeout(function(){img.classList.add('px');window.addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(f)}},{passive:true});f()},2200);
  }
})();
