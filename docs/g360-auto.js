(function(){
  function $(i){return document.getElementById(i);}
  var pronto=false,t=null,tt=null;
  setTimeout(function(){pronto=true;},3000);
  var css=document.createElement('style');
  css.textContent=
    '#cats .row input[type=range],#cats2 .row input[type=range],#cats .row .pct,#cats2 .row .pct{display:none!important}'+
    '#hmCats .ct .ed input[type=range],#hmCats .ct .ed>small{display:none!important}'+
    '#hmCats .pb{font-size:12px;font-weight:600;color:var(--ac);margin-top:3px}'+
    '#hmCats .pcw small{display:block;margin-top:8px;color:var(--tx2)}#hmCats .pcw input{width:100%;box-sizing:border-box}'+
    '#hmDash .dc{background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:12px 14px;margin-bottom:10px}'+
    '#hmDash h3{margin:0 0 8px;font-size:14px}#hmDash .cv{position:relative;height:230px}'+
    '#hmDash .pr{margin:0 0 10px}#hmDash .pr .l{display:flex;justify-content:space-between;font-size:13px;gap:8px}'+
    '#hmDash .pr .bar{height:7px;border-radius:4px;background:var(--bg);margin-top:4px}#hmDash .pr .bar i{display:block;height:7px;border-radius:4px;background:var(--ac)}'+
    '#hmDash .pr small{color:var(--tx2);font-size:12px}';
  document.head.appendChild(css);

  function guardar(){
    var o={id:'p1',renda:+$('renda').value||0,taxa:+$('taxa').value||0,meta:+$('meta').value||0,meses:+$('meses').value||0,
      cats:CATN.map(function(c,i){return +$('v'+i).value||0;}),
      cortes:CATN.map(function(){return 0;}),
      atualizado:new Date().toISOString()};
    Promise.resolve().then(function(){return saveDoc(o);}).then(function(){mostrar('Salvo automaticamente');}).catch(function(){mostrar('Não consegui salvar');});
  }
  function mostrar(x){
    var e=$('g360AutoMsg');
    if(!e){e=document.createElement('div');e.id='g360AutoMsg';e.style.cssText='position:fixed;left:50%;transform:translateX(-50%);bottom:84px;z-index:70;background:var(--card,#fff);color:var(--tx2,#678);border:1px solid var(--bd,#ccc);border-radius:999px;padding:6px 14px;font:600 12px system-ui,sans-serif;transition:opacity .3s';document.body.appendChild(e);}
    e.textContent=x;e.style.opacity='1';clearTimeout(tt);tt=setTimeout(function(){e.style.opacity='0';},1800);
  }
  document.addEventListener('input',function(ev){
    var id=ev.target&&ev.target.id;
    if(!id||!/^(renda|taxa|meta|meses|v\d+)$/.test(id))return;
    if(!pronto)return;
    clearTimeout(t);t=setTimeout(guardar,1200);
  });

  function zerarCortes(){
    var mud=false;
    document.querySelectorAll('#cats .row input[type=range],#cats2 .row input[type=range]').forEach(function(r){if(r.value!=='0'){r.value='0';mud=true;}});
    if(mud&&window.calc)try{calc();}catch(e){}
    ['m2','m3'].forEach(function(i){var e=$(i);if(e&&e.parentNode)e.parentNode.style.display='none';});
  }

  function nomeCard(ct){var s=ct.querySelector('.n span');return s?s.textContent:'';}
  function cards(){var H=$('hmCats');return H?Array.prototype.filter.call(H.children,function(c){return !c._head;}):[];}
  function organizar(){
    var H=$('hmCats');if(!H)return;
    var cs=cards(),rows=Array.prototype.slice.call(document.querySelectorAll('#cats .row, #cats2 .row'));
    var nb=window.CATN?CATN.length:9;
    if(cs.length===rows.length){cs.forEach(function(ct,i){var n=rows[i].querySelector('input[type=number]');if(n&&ct._num!==n){ct._num=n;ct._rg=rows[i].querySelector('input[type=range]');}});}
    cs.forEach(function(ct,i){
      if(!ct._fix){ct._fix=1;ct._inp.addEventListener('input',function(){ct._num.value=ct._inp.value;ct._num.dispatchEvent(new Event('input',{bubbles:true}));});}
      if(!ct._ok){ct._ok=1;var bt=document.createElement('button');bt.type='button';bt.className='btn';bt.textContent='OK';bt.style.cssText='margin-top:10px;width:100%';ct.querySelector('.ed').appendChild(bt);
        var fim=function(e){if(e)e.stopPropagation();clearTimeout(t);ct._num.value=ct._inp.value;
          if(i>=nb){var e2=(window.extras||[])[i-nb];if(e2)saveDoc(Object.assign({},e2,{valor:+ct._num.value||0,parcAtual:Math.round(+(ct._pa||{}).value||0),parcTotal:Math.round(+(ct._pt||{}).value||0)}));}else guardar();
          ct.classList.remove('open');if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();};
        bt.addEventListener('click',fim);ct._inp.addEventListener('keydown',function(e){if(e.key==='Enter')fim(e);});}
      if(i<nb){ct.style.order=0;return;}
      ct.style.order=2;ct._idx=i-nb;
      var ex=(window.extras||[])[ct._idx];if(!ex)return;
      if(!ct._pb){
        var pb=document.createElement('div');pb.className='pb';var v=ct.querySelector('.v');v.parentNode.insertBefore(pb,v.nextSibling);ct._pb=pb;
        var w=document.createElement('div');w.className='pcw';
        w.innerHTML='<small>Parcela atual</small><input type="number" min="0" step="1" class="pa"><small>Total de parcelas</small><input type="number" min="0" step="1" class="pt">';
        ct.querySelector('.ed').appendChild(w);ct._pa=w.querySelector('.pa');ct._pt=w.querySelector('.pt');
        var salvar=function(){clearTimeout(ct._st);ct._st=setTimeout(function(){
          var e2=(window.extras||[])[ct._idx];if(!e2)return;
          saveDoc(Object.assign({},e2,{valor:+ct._num.value||0,parcAtual:Math.round(+ct._pa.value||0),parcTotal:Math.round(+ct._pt.value||0)}));
        },900);};
        ct._pa.addEventListener('input',salvar);ct._pt.addEventListener('input',salvar);ct._inp.addEventListener('input',salvar);
      }
      var N=+ex.parcTotal||0,a=+ex.parcAtual||0;
      ct._pb.textContent=N>1?('Parcela '+Math.min(a||1,N)+'/'+N+(ex.pagoEm?' · paga em '+ex.pagoEm.slice(8,10)+'/'+ex.pagoEm.slice(5,7):'')):'';
      if(document.activeElement!==ct._pa)ct._pa.value=ex.parcAtual||'';
      if(document.activeElement!==ct._pt)ct._pt.value=ex.parcTotal||'';
    });
    var hd=$('hmExtHd');
    if(!hd||!H.contains(hd)){
      hd=document.createElement('div');hd.id='hmExtHd';hd._head=1;hd._num={value:'0'};hd._v=document.createElement('span');hd._inp=document.createElement('input');hd._rr=null;
      hd.style.cssText='grid-column:1/-1;order:1;font-weight:700;font-size:15px;margin:10px 4px 0';hd.textContent='Parcelas e compras avulsas';H.appendChild(hd);
    }
    hd.style.display=cs.length>nb?'':'none';
  }

  var todas=false;
  function filtrar(){
    var H=$('hmCats');if(!H)return;
    var vazias=0;
    Array.prototype.forEach.call(H.children,function(ct){
      if(!ct._num||ct._head)return;
      var z=!(+ct._num.value>0)&&ct._idx===undefined;if(z)vazias++;
      ct.style.display=(z&&!todas&&!ct.classList.contains('open'))?'none':'';
    });
    var b=$('hmToggle');
    if(!b){b=document.createElement('button');b.id='hmToggle';b.type='button';b.className='btn sec';b.style.cssText='margin-top:10px;width:100%';
      b.onclick=function(){todas=!todas;filtrar();};H.parentNode.insertBefore(b,H.nextSibling);}
    b.style.display=(vazias||todas)?'':'none';
    b.textContent=todas?'Ocultar categorias sem valor':'Mostrar categorias sem valor ('+vazias+')';
  }

  var pz=null,ln=null,sigP='',sigL='';
  function cor(i){var P=['#2f6bff','#00d4ff','#7c5cff','#18c29c','#f5a524','#ff6b6b','#9ad1ff','#c084fc','#34d399','#fb923c'];return P[i%P.length];}
  function brl0(n){return 'R$ '+Math.round(n).toLocaleString('pt-BR');}
  function dash(){
    var M=$('hmMet');if(!M||!window.Chart)return;
    var box=$('hmDash');
    if(!box){
      box=document.createElement('div');box.id='hmDash';
      box.innerHTML='<div class="dc"><h3>Para onde vai o dinheiro</h3><div class="cv"><canvas id="dcPizza"></canvas></div></div>'
        +'<div class="dc"><h3>Parcelas em andamento</h3><div id="dcParc"></div></div>'
        +'<div class="dc"><h3>Dinheiro acumulado</h3><div class="cv"><canvas id="dcLinha"></canvas></div></div>';
      M.parentNode.insertBefore(box,($('hmRend')||M).nextSibling);
    }
    var tx=getComputedStyle(document.body).getPropertyValue('--tx2').trim()||'#8fa6c9';
    var lab=[],dat=[],atual=0;
    cards().forEach(function(ct){var v=+ct._num.value||0;atual+=v;if(v>0){lab.push(nomeCard(ct));dat.push(v);}});
    var s1=JSON.stringify([lab,dat]);
    if(s1!==sigP){
      sigP=s1;
      if(pz){pz.destroy();pz=null;}
      pz=new Chart($('dcPizza'),{type:'doughnut',data:{labels:lab,datasets:[{data:dat,backgroundColor:lab.map(function(x,i){return cor(i);}),borderWidth:0}]},
        options:{responsive:true,maintainAspectRatio:false,cutout:'62%',plugins:{legend:{position:'bottom',labels:{color:tx,boxWidth:12,font:{size:11}}},tooltip:{callbacks:{label:function(c){return c.label+': '+brl0(c.parsed);}}}}}});
    }
    var P=$('dcParc');P.innerHTML='';
    var ex=(window.extras||[]).filter(function(e){return (+e.parcTotal||0)>1;}),mes=0,rest=0;
    ex.forEach(function(e){
      var N=+e.parcTotal,a=Math.min(Math.max(+e.parcAtual||1,1),N),v=+e.valor||0;mes+=v;rest+=v*(N-a);
      var d=document.createElement('div');d.className='pr';
      var l=document.createElement('div');l.className='l';var n1=document.createElement('span');n1.textContent=e.nome||'Compra';var n2=document.createElement('b');n2.textContent=a+'/'+N;l.appendChild(n1);l.appendChild(n2);
      var b=document.createElement('div');b.className='bar';var i=document.createElement('i');i.style.width=Math.round(a/N*100)+'%';b.appendChild(i);
      var s=document.createElement('small');s.textContent=brl0(v)+' por mês · faltam '+(N-a)+' parcelas ('+brl0(v*(N-a))+')';
      d.appendChild(l);d.appendChild(b);d.appendChild(s);P.appendChild(d);
    });
    if(ex.length){var tt2=document.createElement('div');tt2.style.cssText='font-size:13px;margin-top:4px';tt2.textContent='Em parcelas: '+brl0(mes)+' por mês · ainda a pagar '+brl0(rest);P.appendChild(tt2);}
    else{var nt=document.createElement('div');nt.className='note';nt.textContent='Toque em uma compra (Perfume, Shopee…) e informe a parcela atual e o total.';P.appendChild(nt);}
    var renda=(+($('renda')||{}).value||0)+(window.extraRenda?window.extraRenda():0),taxa=(+($('taxa')||{}).value||0)/100,meses=+($('meses')||{}).value||12;
    var fx=+($('renda')||{}).value||0,m0=($('gMes')||{}).value||(window.hojeMes?hojeMes():''),sd=0,xs=[],ys=[];
    function addm(s,k){var p=String(s).split('-'),d=new Date(+p[0],+p[1]-1+k,1);return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2);}
    for(var m=0;m<=meses;m++){xs.push(m);ys.push(Math.round(sd));var inc=fx+(window.extraRendaEm&&m0?extraRendaEm(addm(m0,m)):(window.extraRenda?extraRenda():0));sd=sd*(1+taxa)+Math.max(inc-atual,0);}
    var s2=JSON.stringify([ys,tx]);
    if(s2!==sigL){
      sigL=s2;if(ln){ln.destroy();ln=null;}
      ln=new Chart($('dcLinha'),{type:'line',data:{labels:xs,datasets:[{data:ys,borderColor:'#2f6bff',backgroundColor:'rgba(47,107,255,.18)',fill:true,pointRadius:0,tension:.25}]},
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:tx,maxTicksLimit:8},grid:{display:false}},y:{ticks:{color:tx,callback:function(v){return brl0(v);}},grid:{color:'rgba(128,150,190,.15)'}}}}});
    }
  }
  function ciclo(){try{zerarCortes();organizar();filtrar();dash();}catch(e){}}
  setInterval(ciclo,800);
  setTimeout(ciclo,1500);
})();
(function(){
  function $(i){return document.getElementById(i);}
  var t0=Date.now();
  var ICONES=['💳','🍽️','🚗','⚡','💧','🛒','🛍️','🏠','📱','🎓','💊','🐶','🎁','🧴','✈️','⛽','📦','🍔','🎮','🏦'];
  var SUG=[{nome:'Cartão Alexandre',valor:454.2,icone:'💳',parcAtual:1,parcTotal:6,pagoEm:'2026-11-23'},{nome:'Cantina Antonella',valor:0,icone:'🍽️'},{nome:'Uber',valor:0,icone:'🚗'},{nome:'Água',valor:0,icone:'💧'},{nome:'Energia',valor:0,icone:'⚡'}];
  var css=document.createElement('style');
  css.textContent='#hmNovoW{margin-top:12px}#hmNovo,#hmSug{background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:12px 14px;margin-top:10px}'+
    '#hmSug{border-style:dashed;border-color:var(--ac);font-size:13px}#hmSug .bt{display:flex;gap:8px;margin-top:8px}'+
    '#hmNovo label{display:block;font-size:12px;color:var(--tx2);margin-top:8px}#hmNovo input,#hmNovo select{width:100%;box-sizing:border-box}'+
    '.icg{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.icg button{font-size:20px;line-height:1;padding:6px 8px;border-radius:10px;border:1px solid var(--bd);background:var(--bg);cursor:pointer}.icg button.on{border-color:var(--ac);box-shadow:0 0 0 2px var(--ac)}'+
    '#hmNovo .qk{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}#hmCats .em{font-size:15px;line-height:1}#cardPdf .item{display:flex;align-items:center;gap:8px;justify-content:space-between}';
  document.head.appendChild(css);
  function ex(){return window.extras||[];}
  function falta(){return SUG.filter(function(s){return !ex().some(function(e){return String(e.nome||'').toLowerCase()===s.nome.toLowerCase();});});}
  function flag(){try{return localStorage.getItem('g360_sug17')==='1';}catch(e){return false;}}
  function setFlag(){try{localStorage.setItem('g360_sug17','1');}catch(e){}}
  var icSel='🏷️';
  function iconGrid(el,onPick){
    el.innerHTML='';
    ICONES.forEach(function(ic){var b=document.createElement('button');b.type='button';b.textContent=ic;
      b.onclick=function(e){e.stopPropagation();onPick(ic);};el.appendChild(b);});
  }
  function montarNovo(){
    var H=$('hmCats');if(!H||$('hmNovoW'))return;
    var w=document.createElement('div');w.id='hmNovoW';
    w.innerHTML='<button type="button" class="btn" id="hmNovoBt" style="width:100%">+ Novo pagamento</button><div id="hmSug" style="display:none"></div><div id="hmNovo" style="display:none">'
     +'<b>Novo pagamento</b>'
     +'<div class="qk" id="nvQk"></div>'
     +'<label>Nome<input type="text" id="nvNome" maxlength="30" placeholder="Ex.: Cartão Alexandre"></label>'
     +'<label>Valor (R$)<input type="number" id="nvValor" min="0" step="0.01"></label>'
     +'<label>Tipo<select id="nvTipo"><option value="u">Mensal ou avulso</option><option value="p">Parcelado</option></select></label>'
     +'<div id="nvPar" style="display:none"><label>Total de parcelas<input type="number" id="nvTotal" min="2" step="1"></label>'
     +'<label>Parcelas já pagas<input type="number" id="nvPagas" min="0" step="1"></label>'
     +'<label>Data da última parcela paga<input type="date" id="nvData"></label></div>'
     +'<label>Figurinha</label><div class="icg" id="nvIcons"></div>'
     +'<div style="display:flex;gap:8px;margin-top:12px"><button type="button" class="btn" id="nvSalvar">Salvar</button><button type="button" class="btn sec" id="nvCancelar">Cancelar</button></div><span class="msg" id="nvMsg"></span></div>';
    H.parentNode.insertBefore(w,H.nextSibling);
    var g=$('nvIcons');
    function marcar(){Array.prototype.forEach.call(g.children,function(b){b.className=b.textContent===icSel?'on':'';});}
    iconGrid(g,function(ic){icSel=ic;marcar();});marcar();
    $('nvTipo').onchange=function(){$('nvPar').style.display=this.value==='p'?'':'none';};
    var qk=$('nvQk');
    SUG.forEach(function(s){var b=document.createElement('button');b.type='button';b.className='btn sec';b.style.cssText='padding:4px 10px;font-size:12px';b.textContent=s.icone+' '+s.nome;
      b.onclick=function(){$('nvNome').value=s.nome;$('nvValor').value=s.valor||'';icSel=s.icone;marcar();
        $('nvTipo').value=s.parcTotal?'p':'u';$('nvPar').style.display=s.parcTotal?'':'none';
        $('nvTotal').value=s.parcTotal||'';$('nvPagas').value=s.parcAtual||'';$('nvData').value=s.pagoEm||'';};qk.appendChild(b);});
    $('hmNovoBt').onclick=function(){var f=$('hmNovo');f.style.display=f.style.display==='none'?'':'none';};
    $('nvCancelar').onclick=function(){$('hmNovo').style.display='none';};
    $('nvSalvar').onclick=async function(){
      var m=$('nvMsg'),n=$('nvNome').value.trim(),v=+$('nvValor').value||0;
      if(!n){m.className='msg err';m.textContent='Informe o nome.';return;}
      var o={id:'x'+Date.now(),nome:n.slice(0,30),valor:r2(v),icone:icSel};
      if($('nvTipo').value==='p'){
        var T=Math.round(+$('nvTotal').value||0),P=Math.round(+$('nvPagas').value||0);
        if(T<2){m.className='msg err';m.textContent='Informe o total de parcelas.';return;}
        o.parcTotal=T;o.parcAtual=Math.min(Math.max(P,0),T);
        if($('nvData').value)o.pagoEm=$('nvData').value;
      }
      try{await saveDoc(o);m.className='msg';m.textContent='Pagamento salvo.';
        $('nvNome').value='';$('nvValor').value='';$('nvTotal').value='';$('nvPagas').value='';$('nvData').value='';
        setTimeout(function(){$('hmNovo').style.display='none';m.textContent='';},900);
      }catch(e){m.className='msg err';m.textContent='Não consegui salvar.';}
    };
    $('hmSug').addEventListener('click',async function(e){
      var id=e.target&&e.target.id;
      if(id==='sugNao'){setFlag();$('hmSug').style.display='none';}
      if(id==='sugSim'){
        var f=falta(),k=0;
        for(var i=0;i<f.length;i++){await saveDoc(Object.assign({id:'x'+(Date.now()+i)},f[i]));k++;}
        setFlag();$('hmSug').style.display='none';
      }
    });
  }
  function sugestao(){
    var s=$('hmSug');if(!s)return;
    var f=falta();
    var mostrar=!flag()&&f.length>0&&Date.now()-t0>5000;
    s.style.display=mostrar?'':'none';
    if(mostrar&&!s._ok){
      s._ok=1;
      s.innerHTML='<b>Adicionar sugestões?</b><div style="margin-top:4px">Cartão Alexandre (6 parcelas de R$ 454,20, 1 paga em 23/11), Cantina Antonella, Uber, Água e Energia.</div><div class="bt"><button type="button" class="btn" id="sugSim">Adicionar</button><button type="button" class="btn sec" id="sugNao">Agora não</button></div>';
    }
  }
  function realce(){
    var H=$('hmCats');if(!H)return;
    Array.prototype.forEach.call(H.children,function(ct){
      if(ct._idx===undefined||ct._head)return;
      var e=ex()[ct._idx];if(!e)return;
      var n=ct.querySelector('.n');if(!n)return;
      var em=n.querySelector('.em');
      if(!em){em=document.createElement('b');em.className='em';n.insertBefore(em,n.firstChild);var sv=n.querySelector('svg');if(sv)sv.style.display='none';}
      em.textContent=e.icone||'🏷️';
      if(!ct._ic){
        var ed=ct.querySelector('.ed'),okb=ed&&ed.querySelector(':scope>button');
        if(!ed||!okb)return;
        ct._ic=1;
        var box=document.createElement('div');box.innerHTML='<small style="display:block;margin-top:8px;color:var(--tx2)">Figurinha</small>';
        var g=document.createElement('div');g.className='icg';
        iconGrid(g,function(ic){var e2=ex()[ct._idx];if(e2)saveDoc(Object.assign({},e2,{icone:ic}));});
        box.appendChild(g);
        var del=document.createElement('button');del.type='button';del.className='btn sec';del.textContent='Excluir pagamento';del.style.cssText='margin-top:10px;width:100%';
        del.onclick=function(ev){ev.stopPropagation();var e2=ex()[ct._idx];if(e2&&confirm('Excluir "'+e2.nome+'"?'))delDoc(e2.id);};
        ed.insertBefore(box,okb);ed.insertBefore(del,okb);
      }
    });
  }
  // extratos em PDF
  var _s=window.splitAll;
  window.splitAll=function(all){_s(all);window.extratosPdf=all.filter(function(x){return String(x.id||'').charAt(0)==='f'&&x.pdf;});};
  function mlab(s){var p=String(s||'').split('-');return p.length===2?p[1]+'/'+p[0]:s;}
  function listaPdf(){
    var L=$('pdfLista');if(!L)return;L.innerHTML='';
    (window.extratosPdf||[]).slice().sort(function(a,b){return String(b.mes||'').localeCompare(String(a.mes||''))||String(b.id).localeCompare(String(a.id));}).forEach(function(r){
      var row=document.createElement('div');row.className='item';
      var a=document.createElement('span');a.textContent='📄 '+r.desc+(r.mes?' · '+mlab(r.mes):'');
      var b=document.createElement('button');b.type='button';b.className='btn sec';b.style.cssText='padding:4px 10px;font-size:12px';b.textContent='Abrir';
      b.onclick=function(){
        var d=r.pdf,i=d.indexOf(','),bin=atob(d.slice(i+1)),u=new Uint8Array(bin.length);
        for(var k=0;k<bin.length;k++)u[k]=bin.charCodeAt(k);
        window.open(URL.createObjectURL(new Blob([u],{type:'application/pdf'})),'_blank');
      };
      var x=document.createElement('button');x.className='x';x.type='button';x.textContent='✕';x.setAttribute('aria-label','Excluir '+r.desc);x.onclick=function(){delDoc(r.id);};
      row.appendChild(a);row.appendChild(b);row.appendChild(x);L.appendChild(row);
    });
  }
  function montarPdf(){
    if($('cardPdf'))return;var base=$('cardPG');if(!base||!base.parentNode)return;
    var c=document.createElement('div');c.className='card';c.id='cardPdf';
    c.innerHTML='<h2>Extratos em PDF</h2><div class="note" style="margin:0 0 10px">Anexe o extrato do banco ou do cartão em PDF (até cerca de 650 KB).</div>'
     +'<div class="form" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))"><label>Descrição<input type="text" id="pdfDesc" maxlength="40" placeholder="Ex.: Extrato Nubank"></label>'
     +'<label>Mês<input type="month" id="pdfMes"></label><label>Arquivo PDF<input type="file" id="pdfArq" accept="application/pdf,.pdf"></label></div>'
     +'<button class="btn" id="btPdf" type="button" style="margin-top:8px">Salvar extrato</button><span class="msg" id="pdfMsg"></span><div id="pdfLista" style="margin-top:12px"></div>';
    base.parentNode.insertBefore(c,base.nextSibling);
    var d=new Date();$('pdfMes').value=d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2);
    $('btPdf').onclick=function(){
      var m=$('pdfMsg'),f=$('pdfArq').files&&$('pdfArq').files[0],desc=$('pdfDesc').value.trim();
      if(!desc||!f){m.className='msg err';m.textContent='Informe a descrição e escolha o PDF.';return;}
      if(!/pdf/i.test(f.type)&&!/\.pdf$/i.test(f.name)){m.className='msg err';m.textContent='O arquivo precisa ser PDF.';return;}
      var fr=new FileReader();
      fr.onerror=function(){m.className='msg err';m.textContent='Não consegui ler o arquivo.';};
      fr.onload=async function(){
        var data=String(fr.result);
        if(data.length>900000){m.className='msg err';m.textContent='PDF grande demais (máximo cerca de 650 KB). Comprima o arquivo e tente de novo.';return;}
        try{await saveDoc({id:'f'+Date.now(),desc:desc.slice(0,40),mes:$('pdfMes').value,nome:f.name.slice(0,60),pdf:data});
          m.className='msg';m.textContent='Extrato salvo.';$('pdfDesc').value='';$('pdfArq').value='';
        }catch(e){m.className='msg err';m.textContent='Não consegui salvar. Tente de novo.';}
      };
      fr.readAsDataURL(f);
    };
    listaPdf();
  }
  var _rt=window.renderTudo;
  window.renderTudo=function(){_rt();try{listaPdf();}catch(e){}};
  try{window.renderTudo();}catch(e){}
  function ciclo2(){try{montarNovo();sugestao();realce();montarPdf();}catch(e){}}
  setInterval(ciclo2,900);setTimeout(ciclo2,1600);
})();
(function(){
  function $(i){return document.getElementById(i);}
  var M=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  var ano=new Date().getFullYear();
  function p2(n){return ('0'+n).slice(-2);}
  function atual(){var v=($('gMes')||{}).value;return /^\d{4}-\d{2}$/.test(v)?v:'';}
  function setMes(v){
    var s=$('gMes');if(!s)return;
    if(v&&!Array.prototype.some.call(s.options,function(o){return o.value===v;})){var o=document.createElement('option');o.value=v;o.textContent=v.slice(5)+'/'+v.slice(0,4);s.appendChild(o);}
    s.value=v;s.dispatchEvent(new Event('change',{bubbles:true}));
  }
  function montar(){
    var t=$('tab-agenda');if(!t)return;
    var box=$('agMeses');
    if(!box){box=document.createElement('div');box.id='agMeses';box.className='card';t.insertBefore(box,t.firstChild);}
    var cur=atual(),sig=cur+'|'+ano;
    if(box._sig===sig)return;box._sig=sig;
    box.innerHTML='';
    var top=document.createElement('div');top.style.cssText='display:flex;align-items:center;gap:8px;margin-bottom:8px';
    var a=document.createElement('button');a.type='button';a.className='btn sec';a.textContent='‹';a.setAttribute('aria-label','Ano anterior');a.onclick=function(){ano--;box._sig='';montar();};
    var y=document.createElement('b');y.textContent=ano;y.style.flex='1';y.style.textAlign='center';
    var n=document.createElement('button');n.type='button';n.className='btn sec';n.textContent='›';n.setAttribute('aria-label','Próximo ano');n.onclick=function(){ano++;box._sig='';montar();};
    var td=document.createElement('button');td.type='button';td.className='btn sec';td.textContent=cur?'Ver tudo':'Mostrando tudo';td.onclick=function(){setMes('');};
    top.appendChild(a);top.appendChild(y);top.appendChild(n);top.appendChild(td);box.appendChild(top);
    var row=document.createElement('div');row.style.cssText='display:flex;flex-wrap:wrap;gap:6px';
    M.forEach(function(nm,i){
      var v=ano+'-'+p2(i+1),b=document.createElement('button');b.type='button';b.textContent=nm;
      b.className=(cur===v)?'btn':'btn sec';b.style.cssText='padding:6px 12px;border-radius:999px';
      b.onclick=function(){setMes(v);};row.appendChild(b);
    });
    box.appendChild(row);
    var nt=document.createElement('div');nt.className='note';nt.style.marginTop='8px';
    nt.textContent=cur?'Mostrando os pagamentos de '+cur.slice(5)+'/'+cur.slice(0,4)+'.':'Mostrando os próximos pagamentos. Escolha um mês para filtrar.';
    box.appendChild(nt);
  }
  setInterval(function(){try{montar();}catch(e){}},700);
})();
(function(){
  function $(i){return document.getElementById(i);}
  var css=document.createElement('style');
  css.textContent='#hmRend{background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:12px 14px;margin-bottom:10px}#hmRend h3{margin:0 0 6px;font-size:14px}'+
    '#hmRend label{display:block;font-size:12px;color:var(--tx2);margin-top:8px}#hmRend input,#hmRend select{width:100%;box-sizing:border-box}'+
    '#hmRend .it{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:13px;margin:4px 0}#hmRend .it b{color:var(--pos)}';
  document.head.appendChild(css);
  function mes(){var g=$('gMes');return (g&&g.value)||(window.hojeMes?hojeMes():'');}
  function lab(m){return window.mesLabel?mesLabel(m):m;}
  function montar(){
    var M=$('hmMet');if(!M||$('hmRend'))return;
    var b=document.createElement('div');b.id='hmRend';
    b.innerHTML='<h3>Rendas</h3><div id="rdRes" class="note"></div><div id="rdLista"></div><button type="button" class="btn" id="rdBt" style="width:100%;margin-top:8px">+ Renda temporária</button>'
     +'<div id="rdForm" style="display:none"><label>Descrição<input type="text" id="rdDesc" maxlength="40" placeholder="Ex.: Freela, Férias"></label>'
     +'<label>Valor (R$)<input type="number" id="rdValor" min="0" step="10"></label>'
     +'<label>Tipo<select id="rdTipo"><option value="t">Temporária (de / até)</option><option value="u">Só uma vez</option><option value="m">Todo mês (sem fim)</option></select></label>'
     +'<label>Mês de início<input type="month" id="rdDe"></label><label id="rdAteL">Até o mês<input type="month" id="rdAte"></label>'
     +'<div style="display:flex;gap:8px;margin-top:12px"><button type="button" class="btn" id="rdSalvar">Salvar</button><button type="button" class="btn sec" id="rdCancelar">Cancelar</button></div><span class="msg" id="rdMsg"></span></div>';
    M.parentNode.insertBefore(b,M.nextSibling);
    $('rdDe').value=window.hojeMes?hojeMes():'';
    $('rdTipo').onchange=function(){$('rdAteL').style.display=this.value==='t'?'':'none';};
    $('rdBt').onclick=function(){var f=$('rdForm');f.style.display=f.style.display==='none'?'':'none';};
    $('rdCancelar').onclick=function(){$('rdForm').style.display='none';};
    $('rdSalvar').onclick=async function(){
      var m=$('rdMsg'),d=$('rdDesc').value.trim(),v=+$('rdValor').value,tp=$('rdTipo').value,de=$('rdDe').value,ate=tp==='t'?$('rdAte').value:'';
      if(!d||!(v>0)||!de){m.className='msg err';m.textContent='Informe descrição, valor e mês de início.';return;}
      if(tp==='t'&&(!ate||ate<de)){m.className='msg err';m.textContent='Informe o mês final (igual ou depois do início).';return;}
      try{await saveDoc({id:'r'+Date.now(),desc:d.slice(0,40),valor:r2(v),rec:tp,mes:de,ate:ate});
        m.className='msg';m.textContent='Renda salva.';$('rdDesc').value='';$('rdValor').value='';$('rdAte').value='';
        setTimeout(function(){$('rdForm').style.display='none';m.textContent='';},900);
      }catch(e){m.className='msg err';m.textContent='Não consegui salvar.';}
    };
  }
  function lista(){
    var L=$('rdLista');if(!L)return;
    var m=mes(),a=window.receitasAtivas?receitasAtivas(m):[],t=0;
    a.forEach(function(r){t+=+r.valor||0;});
    var fx=+($('renda')||{}).value||0;
    var res='Em '+lab(m)+': renda fixa '+brl2(fx)+' + extras '+brl2(t)+'.';
    if($('rdRes').textContent!==res)$('rdRes').textContent=res;
    var sig=JSON.stringify([m,a.map(function(r){return [r.id,r.valor,r.desc,r.ate];})]);
    if(L._sig===sig)return;L._sig=sig;L.innerHTML='';
    a.forEach(function(r){
      var row=document.createElement('div');row.className='it';
      var s=document.createElement('span');s.textContent=r.desc+(r.rec==='t'?' · até '+lab(r.ate):(r.rec==='m'?' · todo mês':' · só este mês'));
      var v=document.createElement('b');v.textContent='+ '+brl2(r.valor);
      var x=document.createElement('button');x.className='x';x.type='button';x.textContent='✕';x.setAttribute('aria-label','Excluir '+r.desc);x.onclick=function(){delDoc(r.id);};
      row.appendChild(s);row.appendChild(v);row.appendChild(x);L.appendChild(row);
    });
  }
  setInterval(function(){try{montar();lista();}catch(e){}},900);
})();
