(function(){
  'use strict';
  var svcSection=document.querySelector('.svc-scroll');
  if(!svcSection)return;

  var panels=svcSection.querySelectorAll('.svc-panel');
  var imgs=svcSection.querySelectorAll('.svc-img');
  var tabs=svcSection.querySelectorAll('.svc-tab');

  function setActive(i){
    panels.forEach(function(p,j){p.classList.toggle('active',j===i);});
    imgs.forEach(function(im,j){im.classList.toggle('active',j===i);});
    tabs.forEach(function(t,j){
      var on=j===i;
      t.classList.toggle('active',on);
      t.setAttribute('aria-selected',on?'true':'false');
    });
  }

  tabs.forEach(function(btn){
    btn.addEventListener('click',function(){
      setActive(parseInt(btn.dataset.slide,10));
    });
  });
})();
