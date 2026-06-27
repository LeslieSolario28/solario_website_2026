(function(){
  'use strict';
  var topbar=document.querySelector('nav.topbar');
  var toggle=document.querySelector('.nav-toggle');
  var navlinks=document.querySelector('.navlinks');

  var darkSections=document.querySelectorAll('.section-navy,.hero');
  window.addEventListener('scroll',function(){
    var sy=window.scrollY;
    topbar.classList.toggle('scrolled',sy>8);
    var onHero=document.querySelector('.hero').getBoundingClientRect().bottom>60;
    var onDark=false;
    if(!onHero){
      darkSections.forEach(function(s){
        var r=s.getBoundingClientRect();
        if(r.top<60&&r.bottom>60)onDark=true;
      });
    }
    topbar.classList.toggle('nav-dark',!onHero&&onDark);
    topbar.classList.toggle('nav-light',!onHero&&!onDark&&sy>8);
  },{passive:true});
  toggle.addEventListener('click',function(){
    var open=navlinks.classList.toggle('open');
    toggle.classList.toggle('active');
    toggle.setAttribute('aria-expanded',open);
  });
  navlinks.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){navlinks.classList.remove('open');toggle.classList.remove('active');toggle.setAttribute('aria-expanded','false');});});
  window.addEventListener('load',function(){document.body.classList.add('loaded');});
})();
