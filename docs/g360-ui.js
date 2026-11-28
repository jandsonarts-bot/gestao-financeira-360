(function(){
  function $(i){return document.getElementById(i);}
  var css=document.createElement('style');
  css.textContent=
    '.brand,.hero,main>.sub{display:none!important}'+
    '.tabs{display:none!important}'+
    'main{padding-bottom:92px!important}'+
    '.card{border-radius:18px!important}'+
    '#g360Nav{position:fixed;left:0;right:0;bottom:0;z-index:50;display:flex;justify-content:space-around;background:var(--card);border-top:1px solid var(--bd);padding:8px 4px calc(10px + env(safe-area-inset-bottom))}'+
    '#g360Nav button{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;background:none;border:0;color:var(--tx2);font:inherit;font-size:11px;font-weight:600;padding:4px 0;cursor:pointer}'+
    '#g360Nav button svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}'+
    '#g360Nav button.on{color:var(--ac)}'+
    '#g360Mais{position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.45);display:none;align-items:flex-end}'+
    '#g360Mais.open{display:flex}'+
    '#g360Mais div{width:100%;background:var(--card);border-radius:20px 20px 0 0;padding:14px 14px calc(18px + env(safe-area-inset-bottom));display:grid;grid-template-columns:1fr 1fr;gap:8px}'+
    '#g360Mais button{font:inherit;font-weight:600;color:var(--tx);background:var(--bg);border:1px solid var(--bd);border-radius:12px;padding:14px 10px;cursor:pointer}'+
    '#g360Ver{margin-bottom:70px}';
  document.head.appendChild(css);
  var IC={
    reg:'<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/></svg>',
    ag:'<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/></svg>',
    gr:'<svg viewBox="0 0 24 24"><path d="M5 20V10M12 20V4M19 20v-7"/></svg>',
    mais:'<svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h14"/></svg>'
  };
  var nav=document.createElement('nav');nav.id='g360Nav';nav.setAttribute('aria-label','Menu principal');
  var itens=[['sim','Registro',IC.reg],['agenda','Agenda',IC.ag],['graf','Gráficos',IC.gr],['mais','Mais',IC.mais]];
  itens.forEach(function(it){
    var b=document.createElement('button');b.type='button';b.id='nv-'+it[0];b.innerHTML=it[2]+'<span>'+it[1]+'</span>';
    b.onclick=function(){if(it[0]==='mais'){sheet.classList.add('open');}else{window.tab(it[0]);window.scrollTo(0,0);}};
    nav.appendChild(b);
  });
  document.body.appendChild(nav);
  var sheet=document.createElement('div');sheet.id='g360Mais';
  var box=document.createElement('div');sheet.appendChild(box);
  [['gastos','Leitura de gastos'],['extrato','Extrato'],['cartoes','Cartões'],['poup','Poupança'],['casal','Dívidas do casal'],['calc','Calculadora'],['config','Configurações']].forEach(function(x){
    var b=document.createElement('button');b.type='button';b.textContent=x[1];
    b.onclick=function(){sheet.classList.remove('open');window.tab(x[0]);window.scrollTo(0,0);};box.appendChild(b);
  });
  sheet.addEventListener('click',function(e){if(e.target===sheet)sheet.classList.remove('open');});
  document.body.appendChild(sheet);
  var ids=['sim','agenda','graf'];
  function marca(n){
    ids.forEach(function(i){var b=$('nv-'+i);if(b)b.className=(i===n)?'on':'';});
    var m=$('nv-mais');if(m)m.className=ids.indexOf(n)<0?'on':'';
  }
  var _tab=window.tab;
  window.tab=function(n){
    var ag=$('tab-agenda');
    if(n==='agenda'){
      ['sim','gastos','extrato','graf','cartoes','poup','casal','calc','config'].forEach(function(t){var e=$('tab-'+t);if(e)e.style.display='none';});
      if(ag)ag.style.display='block';
      var mb=document.querySelectorAll('.mesbar');
    }else{
      if(ag)ag.style.display='none';
      _tab(n);
    }
    marca(n);
  };
  marca('sim');
})();
