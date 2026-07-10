(function(){
  'use strict';

  /* vals carousel clone for loop */
  var valsTrack=document.getElementById('vals-track');
  if(valsTrack){var valsCards=valsTrack.querySelectorAll('.val-card');valsCards.forEach(function(c){valsTrack.appendChild(c.cloneNode(true));});}

  /* cases carousel */
  var casesTrack=document.getElementById('cases-track');
  var casesPrev=document.getElementById('cases-prev');
  var casesNext=document.getElementById('cases-next');
  var casesBarFill=document.getElementById('cases-bar-fill');
  var casesCurrent=document.getElementById('cases-current');
  if(casesTrack){
    var caseCards=casesTrack.querySelectorAll('.case-card');
    var casesTotal=caseCards.length;
    function updateCasesCounter(){
      var scrollL=casesTrack.scrollLeft;
      var cardW=caseCards[0].offsetWidth+20;
      var idx=Math.round(scrollL/cardW);
      if(casesCurrent)casesCurrent.textContent=('0'+(idx+1)).slice(-2);
      if(casesBarFill)casesBarFill.style.width=((idx+1)/casesTotal*100)+'%';
    }
    casesTrack.addEventListener('scroll',updateCasesCounter,{passive:true});
    updateCasesCounter();
    if(casesNext)casesNext.addEventListener('click',function(){casesTrack.scrollBy({left:440,behavior:'smooth'});});
    if(casesPrev)casesPrev.addEventListener('click',function(){casesTrack.scrollBy({left:-440,behavior:'smooth'});});
  }

  /* tarifas carousel */
  var track=document.getElementById('tarifas-track'),dotsC=document.getElementById('carousel-dots');
  if(track&&dotsC){var cards=track.querySelectorAll('.tarifa-card');
    cards.forEach(function(_,i){var d=document.createElement('button');d.type='button';d.className='carousel-dot'+(i===0?' active':'');d.setAttribute('aria-label','Tarifa '+(i+1));d.addEventListener('click',function(){cards[i].scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});});dotsC.appendChild(d);});
    var dots=dotsC.querySelectorAll('.carousel-dot');track.addEventListener('scroll',function(){var a=Math.round(track.scrollLeft/(cards[0].offsetWidth+18));dots.forEach(function(d,j){d.classList.toggle('active',j===a);});},{passive:true});
  }
})();
