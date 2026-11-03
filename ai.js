(function(){
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}

$$('[data-tabs]').forEach(function(group){
  var tabs=$$('[role="tab"]',group);
  function select(t,focus){
    tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;document.getElementById(x.getAttribute('aria-controls')).hidden=!on;});
    if(focus)t.focus();
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){select(t)});
    t.addEventListener('keydown',function(e){
      var n=null;
      if(e.key==='ArrowRight')n=tabs[(i+1)%tabs.length];
      if(e.key==='ArrowLeft')n=tabs[(i-1+tabs.length)%tabs.length];
      if(e.key==='Home')n=tabs[0];
      if(e.key==='End')n=tabs[tabs.length-1];
      if(n){e.preventDefault();select(n,true);}
    });
  });
});

var plan=document.getElementById('plan');
if(plan)plan.onStage=function(i){
  var pool=plan.querySelector('.pl-pool');
  $$('.pl-task',plan).sort(function(a,b){return i?a.dataset.order-b.dataset.order:a.dataset.i-b.dataset.i}).forEach(function(t){
    (i?plan.querySelector('[data-slot-list="'+t.dataset.slot+'"]'):pool).appendChild(t);
  });
};

$$('[data-stepper]').forEach(function(el){
  var own=function(s){return $$(s,el).filter(function(x){return x.closest('[data-stepper]')===el})};
  var gos=own('[data-go]');
  var keys={};gos.forEach(function(b){keys[b.dataset.go]=1});
  var n=+el.dataset.count||Object.keys(keys).length;
  var visited={},cur=-1;
  function set(i,user){
    i=Math.max(0,Math.min(n-1,i));
    var items=own('[data-flip-item]');
    var first=items.map(function(x){return x.getBoundingClientRect()});
    el.dataset.stage=i;cur=i;visited[i]=1;
    gos.forEach(function(b){var k=+b.dataset.go;b.toggleAttribute('data-visited',!!visited[k]);if(k===i)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
    own('[data-prev]').forEach(function(b){b.disabled=i===0});
    own('[data-next]').forEach(function(b){b.disabled=i===n-1});
    var c=Object.keys(visited).length;
    own('[data-progress]').forEach(function(p){p.textContent=c+' of '+n+' explored'});
    if(c===n&&!el.hasAttribute('data-complete')){
      el.setAttribute('data-complete','');
      var pan=el.closest('[role="tabpanel"]');
      if(pan){var t=document.querySelector('[aria-controls="'+pan.id+'"]');if(t)t.setAttribute('data-done','');}
    }
    if(el.onStage)el.onStage(i);
    if(!reduce&&user)items.forEach(function(x,k){
      var a=first[k],b=x.getBoundingClientRect();
      if(!a.width||!b.width)return;
      var dx=a.left-b.left,dy=a.top-b.top;
      if(dx||dy)x.animate([{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'none'}],{duration:480,easing:'cubic-bezier(.2,.7,.2,1)'});
    });
  }
  gos.forEach(function(b){b.addEventListener('click',function(){set(+b.dataset.go,true)})});
  own('[data-prev]').forEach(function(b){b.addEventListener('click',function(){set(cur-1,true)})});
  own('[data-next]').forEach(function(b){b.addEventListener('click',function(){set(cur+1,true)})});
  set(0,false);
});

$$('[data-checklist]').forEach(function(l){
  var boxes=$$('input[type="checkbox"]',l),out=l.querySelector('[data-check-status]');
  function u(){
    var c=boxes.filter(function(x){return x.checked}).length,all=c===boxes.length;
    l.toggleAttribute('data-all',all);
    if(out)out.textContent=all?l.dataset.doneText:c+' of '+boxes.length+' checked';
  }
  boxes.forEach(function(x){x.addEventListener('change',u)});u();
});
})();

(function(){
  var els=[].slice.call(document.querySelectorAll('[data-rv]'));
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')});return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('is-in');io.unobserve(x.target);}});},{rootMargin:'0px 0px -10% 0px',threshold:.1});
  els.forEach(function(e){var i=[].indexOf.call(e.parentElement.children,e);e.style.transitionDelay=Math.min(i,3)*80+'ms';io.observe(e);});
})();
