(function(){
  function $(i){return document.getElementById(i);}
  window.agenda=[];
  var _split=window.splitAll;
  window.splitAll=function(all){_split(all);window.agenda=all.filter(function(x){return String(x.id||'').charAt(0)==='a'&&x.venc;});};
  var main=document.querySelector('main');if(!main)return;
  var sec=document.createElement('section');sec.id='tab-agenda';sec.style.display='none';
  sec.innerHTML='<div class="card"><h2>Agenda de pagamentos</h2>'
   +'<div class="note" style="margin:0 0 10px">Cadastre contas e vencimentos. O app avisa quando estiver perto e você pode levar o lembrete para o calendário do celular.</div>'
   +'<div class="form" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">'
   +'<label>Conta<input type="text" id="agDesc" maxlength="40" placeholder="Ex.: Aluguel, Cartão"></label>'
   +'<label>Valor (R$)<input type="number" id="agValor" min="0" step="0.01"></label>'
   +'<label>Vencimento<input type="date" id="agVenc"></label>'
   +'<label>Tipo<select id="agRec"><option value="m">Fixo (todo mês)</option><option value="p">Parcelado</option><option value="u">Avulso (uma vez)</option></select></label>'
   +'<label id="agPL" style="display:none">Nº de parcelas<input type="number" id="agParc" min="2" max="60" step="1" placeholder="Ex.: 10"></label></div>'
   +'<button class="btn" id="btAg" type="button">Adicionar à agenda</button><span class="msg" id="agMsg"></span></div>'
   +'<div class="card"><h2>Próximos vencimentos</h2><div id="agLista"></div>'
   +'<div style="margin-top:10px"><button class="btn sec" id="btNotif" type="button">Ativar avisos neste aparelho</button><span class="msg" id="ntMsg"></span></div></div>';
  var ref=$('tab-sim');if(ref&&ref.parentNode)ref.parentNode.insertBefore(sec,ref.nextSibling);else main.appendChild(sec);
  function p2(n){return ('0'+n).slice(-2);}
  function iso(d){return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());}
  function dbr(s){var p=s.split('-');return p[2]+'/'+p[1]+'/'+p[0];}
  $('agVenc').value=iso(new Date());
  $('agRec').addEventListener('change',function(){$('agPL').style.display=this.value==='p'?'':'none';});
  function mesSel(){var v=($('gMes')||{}).value;return /^\d{4}-\d{2}$/.test(v)?v:'';}
  document.addEventListener('change',function(e){if(e.target&&e.target.id==='gMes')desenhar();});
  function ocorr(a,ign){
    var out=[],h=new Date(),ms0=ign?'':mesSel();h.setHours(0,0,0,0);
    var p=a.venc.split('-'),y0=+p[0],m0=+p[1]-1,d0=+p[2],pagos=a.pagos||{};
    if(a.rec==='u'){out.push({a:a,key:a.venc,data:new Date(y0,m0,d0),pago:!!pagos[a.venc]});return out;}
    if(a.rec==='p'){
      var N=+a.parcelas||1;
      for(var i=0;i<N;i++){
        var ms=new Date(y0,m0+i,1),ul=new Date(ms.getFullYear(),ms.getMonth()+1,0).getDate();
        var dd=new Date(ms.getFullYear(),ms.getMonth(),Math.min(d0,ul));
        var kk=ms.getFullYear()+'-'+p2(ms.getMonth()+1);
        var dias=Math.round((dd-h)/86400000);
        if(ms0?kk!==ms0:(dias<-62||dias>35))continue;
        out.push({a:a,key:kk,data:dd,pago:!!pagos[kk],n:i+1,N:N});
      }
      return out;
    }
    if(ms0){var pm=ms0.split('-'),yy=+pm[0],mm=+pm[1]-1,ul0=new Date(yy,mm+1,0).getDate(),dm=new Date(yy,mm,Math.min(d0,ul0));if(dm>=new Date(y0,m0,d0))out.push({a:a,key:ms0,data:dm,pago:!!pagos[ms0]});return out;}
    var ini=new Date(Math.max(new Date(y0,m0,1).getTime(),new Date(h.getFullYear(),h.getMonth()-2,1).getTime()));
    for(var k=0;k<4;k++){
      var y=ini.getFullYear(),m=ini.getMonth()+k+0;
      var dt=new Date(y,m,1);
      if(dt>new Date(h.getFullYear(),h.getMonth()+1,1))break;
      var ult=new Date(dt.getFullYear(),dt.getMonth()+1,0).getDate();
      var d=new Date(dt.getFullYear(),dt.getMonth(),Math.min(d0,ult));
      if(d<new Date(y0,m0,d0))continue;
      var key=dt.getFullYear()+'-'+p2(dt.getMonth()+1);
      out.push({a:a,key:key,data:d,pago:!!pagos[key]});
    }
    return out;
  }
  function todas(ign){
    var h=new Date();h.setHours(0,0,0,0);
    var r=[];
    window.agenda.forEach(function(a){ocorr(a,ign).forEach(function(o){
      o.dias=Math.round((o.data-h)/86400000);r.push(o);
    });});
    var ms=ign?'':mesSel();if(ms)r=r.filter(function(o){return iso(o.data).slice(0,7)===ms;});
    return r.sort(function(x,y){return x.data-y.data;});
  }
  function status(o){
    if(o.pago)return ['Pago','var(--pos)'];
    if(o.dias<0)return ['Atrasado '+(-o.dias)+(o.dias===-1?' dia':' dias'),'var(--neg,#e5484d)'];
    if(o.dias===0)return ['Vence hoje','var(--neg,#e5484d)'];
    if(o.dias===1)return ['Vence amanhã','#d9822b'];
    return ['Em '+o.dias+' dias','var(--tx2)'];
  }
  function ics(a){
    var p=a.venc.split('-'),ds=p[0]+p[1]+p[2];
    var L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Gestao 360//PT','BEGIN:VEVENT','UID:'+a.id+'@gestao360','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z',
      'DTSTART:'+ds+'T090000','DTEND:'+ds+'T093000','SUMMARY:Pagar '+a.desc+' (R$ '+(+a.valor||0).toFixed(2).replace('.',',')+')'];
    if(a.rec==='m')L.push('RRULE:FREQ=MONTHLY');if(a.rec==='p')L.push('RRULE:FREQ=MONTHLY;COUNT='+(+a.parcelas||1));
    ['-P3D','-P1D','PT0S'].forEach(function(t){L.push('BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:Pagar '+a.desc,'TRIGGER:'+t,'END:VALARM');});
    L.push('END:VEVENT','END:VCALENDAR');
    var blob=new Blob([L.join('\r\n')],{type:'text/calendar'}),u=URL.createObjectURL(blob),x=document.createElement('a');
    x.href=u;x.download='pagar-'+a.desc.replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'.ics';document.body.appendChild(x);x.click();x.remove();
    setTimeout(function(){URL.revokeObjectURL(u);},4000);
  }
  function desenhar(){
    var L=$('agLista');if(!L)return;L.innerHTML='';
    var h=new Date();h.setHours(0,0,0,0);
    var ms=mesSel();var lista=todas().filter(function(o){return ms||!o.pago||o.dias>=-3;});
    if(!lista.length){L.innerHTML='<div class="note">'+(ms?'Nenhuma conta neste mês.':'Nenhuma conta cadastrada ainda.')+'</div>';}
    var grupos=[['m','Pagamentos fixos'],['p','Parcelados'],['u','Avulsos']];
    var ordem=[];
    grupos.forEach(function(g){
      var sub=lista.filter(function(o){return o.a.rec===g[0];});
      if(!sub.length)return;
      ordem.push({tit:g[1]});sub.forEach(function(o){ordem.push(o);});
    });
    ordem.forEach(function(o){
      if(o.tit){var hd=document.createElement('div');hd.textContent=o.tit;hd.style.cssText='font-weight:700;font-size:14px;margin:14px 0 6px;color:var(--ac)';L.appendChild(hd);return;}
      var st=status(o),a=o.a;
      var row=document.createElement('div');row.className='item';row.style.flexWrap='wrap';
      var t=document.createElement('span');t.style.flex='1 1 160px';t.textContent=a.desc+(o.N?' · parcela '+o.n+'/'+o.N:'')+' · '+dbr(iso(o.data));
      var v=document.createElement('span');v.textContent=brl2(a.valor);
      var s=document.createElement('span');s.textContent=st[0];s.style.cssText='font-weight:700;color:'+st[1];
      row.appendChild(t);row.appendChild(v);row.appendChild(s);
      var bar=document.createElement('div');bar.style.cssText='display:flex;gap:6px;width:100%;margin-top:6px;flex-wrap:wrap';
      if(!o.pago){
        var bp=document.createElement('button');bp.className='btn';bp.type='button';bp.textContent='Marcar como pago';
        bp.onclick=async function(){var n=Object.assign({},a);n.pagos=Object.assign({},a.pagos||{});n.pagos[o.key]=true;try{await saveDoc(n);}catch(e){}};
        bar.appendChild(bp);
      }
      var bc=document.createElement('button');bc.className='btn sec';bc.type='button';bc.textContent='Adicionar ao calendário';bc.onclick=function(){ics(a);};bar.appendChild(bc);
      var bx=document.createElement('button');bx.className='btn sec';bx.type='button';bx.textContent='Excluir';bx.onclick=function(){if(confirm('Excluir "'+a.desc+'" da agenda?'))delDoc(a.id);};bar.appendChild(bx);
      row.appendChild(bar);L.appendChild(row);
    });
    faixa();
  }
  function faixa(){
    var ref=$('tab-sim');if(!ref)return;
    var f=$('g360AgFaixa');
    var urg=todas(true).filter(function(o){return !o.pago&&o.dias<=3;});
    if(!urg.length){if(f)f.remove();return;}
    if(!f){f=document.createElement('div');f.id='g360AgFaixa';f.className='card';f.style.cssText='cursor:pointer;border-color:#d9822b';f.onclick=function(){window.tab('agenda');};ref.insertBefore(f,ref.firstChild);}
    var atr=urg.filter(function(o){return o.dias<0;}).length,hoje=urg.filter(function(o){return o.dias===0;}).length;
    f.innerHTML='<b>Agenda:</b> '+urg.length+(urg.length===1?' pagamento perto do vencimento':' pagamentos perto do vencimento')+(atr?' ('+atr+' atrasado'+(atr>1?'s':'')+')':'')+(hoje?' · '+hoje+' vence hoje':'')+'. Toque para ver.';
  }
  $('btAg').onclick=async function(){
    var m=$('agMsg'),d=$('agDesc').value.trim(),v=+$('agValor').value,dt=$('agVenc').value,rc=$('agRec').value,np=+$('agParc').value;
    if(!d||!(v>0)||!dt){m.className='msg err';m.textContent='Informe conta, valor e vencimento.';return;}
    if(rc==='p'&&!(np>=2)){m.className='msg err';m.textContent='Informe o número de parcelas (2 ou mais).';return;}
    try{var ob={id:'a'+Date.now(),desc:d.slice(0,40),valor:r2(v),venc:dt,rec:rc,pagos:{}};if(rc==='p')ob.parcelas=Math.round(np);await saveDoc(ob);
      m.className='msg';m.textContent='Adicionado à agenda.';$('agDesc').value='';$('agValor').value='';$('agParc').value='';
    }catch(e){m.className='msg err';m.textContent='Não consegui salvar. Tente de novo.';}
  };
  var reg=null;
  if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').then(function(r){reg=r;}).catch(function(){});}
  function permTxt(){
    var m=$('ntMsg'),b=$('btNotif');if(!m||!b)return;
    if(!('Notification' in window)){m.className='msg err';m.textContent='Este navegador não suporta avisos. Use o calendário.';b.style.display='none';return;}
    if(Notification.permission==='granted'){m.className='msg';m.textContent='Avisos ativados neste aparelho.';b.style.display='none';}
    else if(Notification.permission==='denied'){m.className='msg err';m.textContent='Avisos bloqueados nas configurações do navegador.';}
  }
  $('btNotif').onclick=function(){
    if(!('Notification' in window))return permTxt();
    Notification.requestPermission().then(function(){permTxt();avisar();});
  };
  permTxt();
  function mostrar(titulo,corpo,tag){
    try{
      if(reg&&reg.showNotification){reg.showNotification(titulo,{body:corpo,tag:tag,icon:'icon-192.png',badge:'icon-192.png'});return;}
    }catch(e){}
    try{new Notification(titulo,{body:corpo,tag:tag,icon:'icon-192.png'});}catch(e){}
  }
  function avisar(){
    if(!('Notification' in window)||Notification.permission!=='granted')return;
    var hoje=iso(new Date()),vis={};
    try{vis=JSON.parse(localStorage.getItem('g360_avisos')||'{}');}catch(e){}
    todas(true).forEach(function(o){
      if(o.pago)return;
      if(!(o.dias<=3&&o.dias>=-3))return;
      var k=o.a.id+'|'+o.key+'|'+hoje;if(vis[k])return;vis[k]=1;
      var t=o.dias<0?'Pagamento atrasado':(o.dias===0?'Vence hoje':(o.dias===1?'Vence amanhã':'Vence em '+o.dias+' dias'));
      mostrar(t,o.a.desc+' · '+brl2(o.a.valor),k);
    });
    var ks=Object.keys(vis);if(ks.length>200)ks.slice(0,ks.length-200).forEach(function(x){delete vis[x];});
    try{localStorage.setItem('g360_avisos',JSON.stringify(vis));}catch(e){}
  }
  document.addEventListener('visibilitychange',function(){if(!document.hidden)avisar();});
  setInterval(avisar,60000);
  var _rt=window.renderTudo;
  window.renderTudo=function(){_rt();try{desenhar();}catch(e){}setTimeout(avisar,500);};
  window.renderTudo();
})();
