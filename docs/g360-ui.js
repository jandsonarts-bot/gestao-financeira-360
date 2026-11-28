(function(){
  function $(i){return document.getElementById(i);}
  var ORIG=['sim','gastos','extrato','graf','cartoes','poup','casal','calc','config'];
  var CUSTOM=['home','pg','agenda'];
  var css=document.createElement('style');
  css.textContent=
    '.brand,.hero,main>.sub{display:none!important}'+
    '.tabs{display:none!important}'+
    'main{padding-bottom:92px!important}'+
    '.card{border-radius:18px!important}'+
    '#g360Nav{position:fixed;left:0;right:0;bottom:0;z-index:50;display:flex;justify-content:space-around;background:var(--card);border-top:1px solid var(--bd);padding:8px 2px calc(10px + env(safe-area-inset-bottom))}'+
    '#g360Nav button{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;background:none;border:0;color:var(--tx2);font:inherit;font-size:11px;font-weight:600;padding:4px 0;cursor:pointer;box-shadow:none}'+
    '#g360Nav button svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}'+
    '#g360Nav button.on{color:var(--ac)}'+
    '#g360Mais{position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.45);display:none;align-items:flex-end}'+
    '#g360Mais.open{display:flex}'+
    '#g360Mais div{width:100%;background:var(--card);border-radius:20px 20px 0 0;padding:14px 14px calc(18px + env(safe-area-inset-bottom));display:grid;grid-template-columns:1fr 1fr;gap:8px}'+
    '#g360Mais button{font:inherit;font-weight:600;color:var(--tx);background:var(--bg);border:1px solid var(--bd);border-radius:12px;padding:14px 10px;cursor:pointer}'+
    '#g360Ver{margin-bottom:70px}'+
    '#hmHead{padding:4px 4px 10px}#hmHead small{display:block;color:var(--tx2);font-size:13px}#hmHead h2{margin:0;font-size:22px}'+
    '#hmHero{border-radius:18px;padding:16px 18px;background:rgba(var(--glowc),.14);border:1px solid var(--bd);margin-bottom:10px}'+
    '#hmHero small{color:var(--ac);font-size:13px}#hmHero .big{font-size:32px;font-weight:700;color:var(--ac);margin:2px 0 10px}'+
    '#hmHero .bar{height:7px;border-radius:4px;background:var(--card)}#hmHero .bar i{display:block;height:7px;border-radius:4px;background:var(--ac);width:0}'+
    '#hmHero p{margin:8px 0 0;font-size:13px;color:var(--ac)}#hmHero.neg .big,#hmHero.neg small,#hmHero.neg p{color:#e5484d}#hmHero.neg .bar i{background:#e5484d}'+
    '#hmMet{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}'+
    '#hmMet div{background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:10px 12px}#hmMet small{display:block;color:var(--tx2);font-size:12px}#hmMet b{font-size:17px}'+
    '#hmCats{display:grid;grid-template-columns:1fr 1fr;gap:8px}'+
    '#hmCats .ct{background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:10px 12px;cursor:pointer}'+
    '#hmCats .ct .n{display:flex;align-items:center;gap:6px;color:var(--tx2);font-size:13px}#hmCats .ct .n svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}'+
    '#hmCats .ct .v{font-size:17px;font-weight:700;margin-top:2px}'+
    '#hmCats .ct .ed{display:none;margin-top:8px}#hmCats .ct.open .ed{display:block}#hmCats .ct.open{grid-column:1/-1;border-color:var(--ac)}'+
    '#hmCats .ct .ed input[type=number]{width:100%;box-sizing:border-box}#hmCats .ct .ed input[type=range]{width:100%;margin-top:8px}#hmCats .ct .ed small{color:var(--tx2)}'+
    '#hmTit{margin:14px 4px 8px;font-size:15px;font-weight:700}';
  document.head.appendChild(css);

  var IC={
    ini:'<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8M5 10v10h14V10"/></svg>',
    reg:'<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/></svg>',
    ag:'<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/></svg>',
    gr:'<svg viewBox="0 0 24 24"><path d="M5 20V10M12 20V4M19 20v-7"/></svg>',
    mais:'<svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h14"/></svg>'
  };
  var nav=document.createElement('nav');nav.id='g360Nav';nav.setAttribute('aria-label','Menu principal');
  var sheet=document.createElement('div');sheet.id='g360Mais';
  [['home','Início',IC.ini],['pg','Registro',IC.reg],['agenda','Agenda',IC.ag],['graf','Gráficos',IC.gr],['mais','Mais',IC.mais]].forEach(function(it){
    var b=document.createElement('button');b.type='button';b.id='nv-'+it[0];b.innerHTML=it[2]+'<span>'+it[1]+'</span>';
    b.onclick=function(){if(it[0]==='mais'){sheet.classList.add('open');}else{window.tab(it[0]);window.scrollTo(0,0);}};
    nav.appendChild(b);
  });
  document.body.appendChild(nav);
  var box=document.createElement('div');sheet.appendChild(box);
  [['sim','Planejamento'],['gastos','Leitura de gastos'],['extrato','Extrato'],['cartoes','Cartões'],['poup','Poupança'],['casal','Dívidas do casal'],['calc','Calculadora'],['config','Configurações']].forEach(function(x){
    var b=document.createElement('button');b.type='button';b.textContent=x[1];
    b.onclick=function(){sheet.classList.remove('open');window.tab(x[0]);window.scrollTo(0,0);};box.appendChild(b);
  });
  sheet.addEventListener('click',function(e){if(e.target===sheet)sheet.classList.remove('open');});
  document.body.appendChild(sheet);

  var main=document.querySelector('main');
  var home=document.createElement('section');home.id='tab-home';home.style.display='none';
  home.innerHTML='<div id="hmHead"><small id="hmOla">Olá</small><h2 id="hmMes"></h2></div>'
    +'<div id="hmHero"><small>Sobra do mês</small><div class="big" id="hmSobra">R$ 0</div><div class="bar"><i id="hmBar"></i></div><p id="hmTxt"></p></div>'
    +'<div id="hmMet"><div><small>Receitas extras</small><b id="hmExtra">R$ 0</b></div><div><small id="hmAcL">Acumulado</small><b id="hmAc">R$ 0</b></div></div>'
    +'<div id="hmTit">Gastos</div><div id="hmCats"></div>';
  main.appendChild(home);
  var pg=document.createElement('section');pg.id='tab-pg';pg.style.display='none';main.appendChild(pg);
  var card=$('cardPG');if(card)pg.appendChild(card);

  function brlx(n){return 'R$ '+Math.round(n).toLocaleString('pt-BR');}
  var sig='';
  function linhas(){return Array.prototype.slice.call(document.querySelectorAll('#cats .row, #cats2 .row'));}
  function nomeDe(r){var c=r.querySelector('.ci');return c?c.textContent.trim():'Gasto';}
  function build(rows){
    var H=$('hmCats');H.innerHTML='';
    rows.forEach(function(r){
      var num=r.querySelector('input[type=number]'),rg=r.querySelector('input[type=range]');
      if(!num)return;
      var ct=document.createElement('div');ct.className='ct';
      var n=document.createElement('div');n.className='n';
      var ic=r.querySelector('.ci svg');if(ic)n.appendChild(ic.cloneNode(true));
      var t=document.createElement('span');t.textContent=nomeDe(r);n.appendChild(t);
      var v=document.createElement('div');v.className='v';
      var ed=document.createElement('div');ed.className='ed';
      var inp=document.createElement('input');inp.type='number';inp.min='0';inp.step='10';inp.setAttribute('aria-label','Valor de '+nomeDe(r));
      ed.appendChild(inp);
      var rr=null,lab=null;
      if(rg){lab=document.createElement('small');lab.style.display='block';lab.style.marginTop='8px';
        rr=document.createElement('input');rr.type='range';rr.min='0';rr.max='100';rr.step='5';rr.setAttribute('aria-label','Corte em '+nomeDe(r));
        ed.appendChild(lab);ed.appendChild(rr);}
      ct.appendChild(n);ct.appendChild(v);ct.appendChild(ed);
      ct._num=num;ct._rg=rg;ct._v=v;ct._inp=inp;ct._rr=rr;ct._lab=lab;
      ct.addEventListener('click',function(e){if(e.target.closest('.ed'))return;ct.classList.toggle('open');});
      inp.addEventListener('input',function(){num.value=inp.value;num.dispatchEvent(new Event('input',{bubbles:true}));});
      if(rr)rr.addEventListener('input',function(){rg.value=rr.value;rg.dispatchEvent(new Event('input',{bubbles:true}));});
      H.appendChild(ct);
    });
  }
  function sync(){
    var rows=linhas();
    var s=rows.map(nomeDe).join('|');
    if(s!==sig){sig=s;build(rows);}
    var renda=(+($('renda')||{}).value||0)+(window.extraRenda?window.extraRenda():0),atual=0;
    Array.prototype.forEach.call($('hmCats').children,function(ct){
      var v=+ct._num.value||0;atual+=v;
      ct._v.textContent=brlx(v);
      if(document.activeElement!==ct._inp)ct._inp.value=ct._num.value;
      if(ct._rr){if(document.activeElement!==ct._rr)ct._rr.value=ct._rg.value;ct._lab.textContent='Corte: '+ct._rg.value+'%';}
    });
    var sobra=renda-atual;
    $('hmSobra').textContent=brlx(sobra);
    $('hmHero').className=sobra<0?'neg':'';
    $('hmBar').style.width=(renda>0?Math.min(100,atual/renda*100):(atual>0?100:0))+'%';
    $('hmTxt').textContent='Gastou '+brlx(atual)+' de '+brlx(renda);
    $('hmExtra').textContent=brlx(window.extraRenda?window.extraRenda():0);
    var ac=$('m4'),al=$('m4l');$('hmAc').textContent=ac?ac.textContent:'';$('hmAcL').textContent=al?al.textContent:'Acumulado';
    var g=$('gMes'),k=g&&g.value?g.value:(window.hojeMes?hojeMes():'');
    var NM=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    $('hmMes').textContent=/^\d{4}-\d{2}$/.test(k)?(NM[+k.slice(5)-1].charAt(0).toUpperCase()+NM[+k.slice(5)-1].slice(1)+' '+k.slice(0,4)):'Todos os meses';
    var nm='',els=document.querySelectorAll('body *');
    if(!sync._nome){for(var i=0;i<els.length;i++){var e=els[i];if(e.children.length===0&&/^Conectado:/.test(e.textContent)){sync._nome=e.textContent.replace(/^Conectado:\s*/,'').trim().split(/\s+/)[0];break;}}}
    $('hmOla').textContent=sync._nome?'Olá, '+sync._nome:'Olá';
    var f=$('g360AgFaixa');if(f&&f.parentNode!==home)home.insertBefore(f,$('hmHero'));
  }
  document.addEventListener('input',function(){setTimeout(sync,30);});
  setInterval(sync,1500);
  var _rt=window.renderTudo;
  window.renderTudo=function(){_rt();try{sync();}catch(e){}};

  var ids=['home','pg','agenda','graf'];
  function marca(n){
    ids.forEach(function(i){var b=$('nv-'+i);if(b)b.className=(i===n)?'on':'';});
    var m=$('nv-mais');if(m)m.className=ids.indexOf(n)<0?'on':'';
  }
  var _tab=window.tab;
  window.tab=function(n){
    if(CUSTOM.indexOf(n)>=0){
      ORIG.forEach(function(t){var e=$('tab-'+t);if(e)e.style.display='none';});
      CUSTOM.forEach(function(t){var e=$('tab-'+t);if(e)e.style.display=t===n?'block':'none';});
      if(n==='home')try{sync();}catch(e){}
    }else{
      CUSTOM.forEach(function(t){var e=$('tab-'+t);if(e)e.style.display='none';});
      _tab(n);
    }
    marca(n);
  };
  window.tab('home');
  sync();
})();
