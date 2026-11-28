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
      ct._pb.textContent=N>1?('Parcela '+Math.min(a||1,N)+'/'+N):'Toque para informar as parcelas';
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
      var z=!(+ct._num.value>0);if(z)vazias++;
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
      M.parentNode.insertBefore(box,M.nextSibling);
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
    var ap=Math.max(renda-atual,0),sd=0,xs=[],ys=[];
    for(var m=0;m<=meses;m++){xs.push(m);ys.push(Math.round(sd));sd=sd*(1+taxa)+ap;}
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
