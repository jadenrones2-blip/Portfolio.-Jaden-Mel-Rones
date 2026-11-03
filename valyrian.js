(function(){
  var root=document.querySelector('[data-vdex]');if(!root)return;
  var imgs=root.querySelectorAll('.vd-ex-stage img'),btns=root.querySelectorAll('.vd-ex-list button');
  var fine=window.matchMedia('(hover: hover)').matches;
  function sel(i){
    imgs.forEach(function(m){m.classList.toggle('on',m.dataset.i===i)});
    btns.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.i===i?'true':'false')});
  }
  btns.forEach(function(b){
    b.addEventListener('click',function(){sel(b.dataset.i)});
    b.addEventListener('focus',function(){sel(b.dataset.i)});
    if(fine)b.addEventListener('mouseenter',function(){sel(b.dataset.i)});
  });
})();
