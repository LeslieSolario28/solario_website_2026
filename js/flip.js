(function(){
  'use strict';
  // Mouse devices flip on :hover (CSS). Touch devices have no reliable hover,
  // so let a tap toggle the card. Only wire this up where hover is unavailable.
  if(!(window.matchMedia && window.matchMedia('(hover: none)').matches)) return;

  var cards = document.querySelectorAll('.flip-card');
  cards.forEach(function(card){
    card.addEventListener('click', function(e){
      // let real links inside the card work normally
      if(e.target.closest('a')) return;
      cards.forEach(function(c){ if(c !== card) c.classList.remove('flipped'); });
      card.classList.toggle('flipped');
    });
  });
})();
