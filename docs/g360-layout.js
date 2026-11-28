(function(){
  var $=function(i){return document.getElementById(i);};
  var MN=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  var css=document.createElement('style');
  css.textContent=
    '#cats{display:grid!important;grid-template-columns:1fr 1fr;gap:8px 10px}'+
    '#cats .row{display:grid!important;grid-template-columns:1fr auto;grid-template-areas:"nm nm" "vl pc" "sl sl";gap:3px 6px;align-items:center;margin:0!important;padding:8px;border:1px solid #dfe6fb;border-radius:12px;background:#f7f9ff}'+
    '#cats .row .ci{grid-area:nm;font-size:13px;display:flex;align-items:center;gap:5px;white-space:nowrap}'+
    '#cats .row .ci .ic{width:15px;height:15px}'+
    '#cats .row input[type=number]{grid-area:vl;width:100%!important;min-width:0;padding:6px 8px!important;font-size:15px!important;height:auto!important}'+
    '#cats .row input[type=range]{grid-area:sl;width:100%!important;min-width:0;margin:0}'+
    '#cats .row .pct{grid-area:pc;font-size:13px;min-width:34px;text-align:right}'+
    '#g360Chips::-webkit-scrollbar{display:none}#g360Chips{scrollbar-width:none}'+
    '#g360Chips{display:flex;align-items:center;gap:6px;margin-top:8px;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:2px}'+
    '#g360Chips button{flex:0 0 auto;padding:6px 10px;border-radius:999px;border:1px solid #2f6bff;background:#fff;color:#2f6bff;font-weight:600;font-size:13px;cursor:pointer}'+
    '#g360Chips button.on{background:#2f6bff;color:#fff}'+
    '#g360Chips .yr{font-weight:700;font-size:14px;min-width:42px;text-align:center}'+
    '#g360Resumo{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px 14px;margin:0 0 10px;border-radius:14px;background:#eaf0ff;border:1px solid #cfdcff;font-size:14px}'+
    '#g360Resumo b{font-size:18px;color:#1d4ed8}'+
    '#tab-sim .card{padding-top:12px;padding-bottom:12px}';
  document.head.appendChild(css);

  var ano=(new Date()).getFullYear();
  function sel(){return $('gMes');}
  function cur(){var s=sel();return s?s.value:'';}
  function setMes(v){
    var s=sel();if(!s)return;
    var has=false;for(var i=0;i<s.options.length;i++)if(s.options[i].value===v)has=true;
    if(!has){var o=document.createElement('option');o.value=v;o.textContent=v.slice(5)+'/'+v.slice(0,4);s.appendChild(o);}
    s.value=v;s.dispatchEvent(new Event('change',{bubbles:true}));
    s.dispatchEvent(new Event('input',{bubbles:true}));
    pintar();
  }
  function pintar(){
    var box=$('g360Chips');if(!box)return;
    var c=cur();if(/^\d{4}-\d{2}$/.test(c))ano=+c.slice(0,4);
    var h='<button data-a="-1">‹</button><span class="yr">'+ano+'</span><button data-a="1">›</button>';
    for(var m=1;m<=12;m++){var v=ano+'-'+(m<10?'0':'')+m;h+='<button data-m="'+v+'" class="'+(c===v?'on':'')+'">'+MN[m-1]+'</button>';}
    box.innerHTML=h;
    var on=box.querySelector('.on');if(on&&on.scrollIntoView){try{box.scrollLeft=on.offsetLeft-box.clientWidth/2+on.clientWidth/2;}catch(e){}}
  }
  function chips(){
    var s=sel();if(!s)return;var bar=s.closest('.mesbar')||s.parentElement;
    if($('g360Chips')&&bar.contains($('g360Chips')))return;
    var box=document.createElement('div');box.id='g360Chips';bar.appendChild(box);
    box.addEventListener('click',function(e){
      var b=e.target.closest('button');if(!b)return;
      if(b.dataset.m){setMes(b.dataset.m);}
      else if(b.dataset.a){ano+=+b.dataset.a;pintar();}
    });
    s.addEventListener('change',pintar);
    pintar();
  }
  function fmt(n){return 'R$ '+Math.round(n).toLocaleString('pt-BR');}
  function resumo(){
    var cats=$('cats');if(!cats)return;
    var card=cats.parentElement;
    var r=$('g360Resumo');
    if(!r){
      var kp=card.nextElementSibling;var av=$('aviso');
      r=document.createElement('div');r.id='g360Resumo';
      card.parentElement.insertBefore(r,card);
      if(kp&&kp.classList.contains('grid'))card.parentElement.insertBefore(kp,card);
      if(av)card.parentElement.insertBefore(av,card);
      cats.addEventListener('input',resumo);cats.addEventListener('change',resumo);
    }
    var t=0;cats.querySelectorAll('input[type=number]').forEach(function(i){t+=(+i.value||0);});
    r.innerHTML='<span>Total de gastos por mês</span><b>'+fmt(t)+'</b>';
    var kp2=card.parentElement.querySelector(':scope > .grid');
    if(kp2&&kp2.compareDocumentPosition(card)&4){}
    else if(kp2){card.parentElement.insertBefore(kp2,card);}
    var av2=$('aviso');if(av2&&(av2.compareDocumentPosition(card)&2)){card.parentElement.insertBefore(av2,card);}
    if(r.nextElementSibling!==kp2&&kp2)card.parentElement.insertBefore(r,kp2);
  }
  function tick(){chips();resumo();}
  tick();
  setInterval(tick,1000);
  document.addEventListener('input',function(e){if(e.target&&/^v\d+$/.test(e.target.id))resumo();});
})();
