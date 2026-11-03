(function(){
  var root=document.documentElement;
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body=document.body;

  // One-time typing of the name
  var h1=document.querySelector('.hc-hero h1');
  var chars=h1?h1.querySelectorAll('.ch'):[];
  function done(){body.classList.add('typed');startRoles();}
  if(!chars.length||reduced){done();}
  else{
    var caret=document.createElement('span');caret.className='hc-caret';caret.setAttribute('aria-hidden','true');
    chars[0].parentNode.insertBefore(caret,chars[0]);
    var i=0;
    (function step(){
      if(i>=chars.length){setTimeout(function(){caret.remove();done();},700);return;}
      var c=chars[i];c.classList.add('on');c.parentNode.insertBefore(caret,c.nextSibling);
      var ch=c.textContent,d=65+Math.random()*80;
      if(ch===',')d+=300;if(ch===' '&&i===7)d+=260;
      i++;setTimeout(step,d);
    })();
  }

  // Rotating role label
  function startRoles(){
    var el=document.querySelector('.hc-role-word');if(!el||reduced)return;
    var roles=(el.getAttribute('data-roles')||'').split('|'),n=0,paused=false;
    el.parentNode.addEventListener('mouseenter',function(){paused=true});
    el.parentNode.addEventListener('mouseleave',function(){paused=false});
    setInterval(function(){
      if(paused||document.hidden)return;
      el.classList.add('out');
      setTimeout(function(){n=(n+1)%roles.length;el.textContent=roles[n];el.classList.remove('out');},360);
    },3200);
  }

  // Scroll reveals
  var targets=document.querySelectorAll('.reveal,.hc-ocean');
  if(reduced||!('IntersectionObserver' in window)){targets.forEach(function(t){t.classList.add('in')});}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.15});
    targets.forEach(function(t){io.observe(t)});
  }

  // Project hover previews
  var rows=document.querySelectorAll('.hc-row'),frames=document.querySelectorAll('.hc-preview [data-p]');
  function show(k){
    frames.forEach(function(f){f.classList.toggle('on',f.getAttribute('data-p')===k)});
    rows.forEach(function(r){r.classList.toggle('active',r.getAttribute('data-p')===k)});
  }
  rows.forEach(function(r){
    r.addEventListener('mouseenter',function(){show(r.getAttribute('data-p'))});
    r.addEventListener('focus',function(){show(r.getAttribute('data-p'))});
  });
  var list=document.querySelector('.hc-list');
  if(list)list.addEventListener('mouseleave',function(){show('idle')});
})();
