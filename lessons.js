(function(){
  var root=document.querySelector('[data-bm]');if(!root)return;
  var tabs=[].slice.call(root.querySelectorAll('[role="tab"]')),count=root.querySelector('.bm-count'),next=root.querySelector('.bm-next'),cur=0,read={};
  function select(i,focus){
    cur=(i+tabs.length)%tabs.length;read[cur]=1;
    tabs.forEach(function(t,k){var on=k===cur;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;if(read[k])t.setAttribute('data-read','');document.getElementById(t.getAttribute('aria-controls')).hidden=!on;});
    var r=Object.keys(read).length;
    count.textContent=r===tabs.length?'All six read':r+' of '+tabs.length+' read';
    next.textContent=cur===tabs.length-1?'Back to the first →':'Next lesson →';
    if(focus)tabs[cur].focus();
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){select(i)});
    t.addEventListener('keydown',function(e){
      var k={ArrowRight:i+1,ArrowLeft:i-1,Home:0,End:tabs.length-1}[e.key];
      if(k!==undefined){e.preventDefault();select(k,true);}
    });
  });
  next.addEventListener('click',function(){select(cur+1)});
  select(0);
})();
