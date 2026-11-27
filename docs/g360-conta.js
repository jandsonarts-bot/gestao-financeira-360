(function(){
  var ADMIN='jandsonarts@gmail.com';
  var B='https://www.gstatic.com/firebasejs/11.10.0/';
  function $(i){return document.getElementById(i);}
  function mk(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;}
  var S='font:inherit;padding:8px 10px;border-radius:8px;border:1px solid var(--bd,#999);background:var(--neu,#eee);color:var(--tx,#222);';
  var M=null,unsubs=[];
  function erro(e){
    var c=e&&e.code||'';
    if(c==='auth/invalid-credential'||c==='auth/wrong-password'||c==='auth/user-not-found')return 'E-mail ou senha incorretos.';
    if(c==='auth/email-already-in-use')return 'Este e-mail já tem conta. Toque em Entrar.';
    if(c==='auth/weak-password')return 'Senha muito curta. Use pelo menos 6 caracteres.';
    if(c==='auth/invalid-email')return 'E-mail inválido.';
    if(c==='auth/missing-password')return 'Digite a senha.';
    if(c==='auth/too-many-requests')return 'Muitas tentativas. Aguarde um pouco e tente de novo.';
    if(c==='auth/operation-not-allowed')return 'Login por e-mail não está ativado.';
    return 'Não foi possível concluir. Tente de novo.';
  }
  function dmy(d){var p=String(d||'').split('-');return p.length===3?p[2]+'/'+p[1]+'/'+p[0]:'';}
  function painelLogin(){
    if($('g360Login'))return;
    var box=mk('div');box.id='g360Login';
    box.style.cssText='max-width:760px;margin:6px auto 12px;padding:14px 16px;border-radius:14px;border:1px solid var(--bd,#999);background:var(--card,#fff);color:var(--tx,#222);font:14px system-ui,sans-serif';
    box.appendChild(mk('div',null,'Entre com seu e-mail para guardar seus dados na nuvem e usar em qualquer aparelho.')).style.marginBottom='10px';
    var row=mk('div');row.style.cssText='display:flex;gap:8px;flex-wrap:wrap';
    var em=mk('input');em.type='email';em.placeholder='Seu e-mail';em.autocomplete='email';em.style.cssText=S+'flex:1;min-width:180px';
    var pw=mk('input');pw.type='password';pw.placeholder='Senha (mín. 6 caracteres)';pw.autocomplete='current-password';pw.style.cssText=S+'flex:1;min-width:160px';
    row.appendChild(em);row.appendChild(pw);box.appendChild(row);
    var r2=mk('div');r2.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:center';
    var bi=mk('button','btn','Entrar'),bc=mk('button','btn sec','Criar conta'),bs=mk('button','btn sec','Esqueci a senha'),m=mk('span','msg');
    [bi,bc,bs].forEach(function(b){b.type='button';});
    r2.appendChild(bi);r2.appendChild(bc);r2.appendChild(bs);r2.appendChild(m);box.appendChild(r2);
    function ok(t){m.className='msg';m.textContent=t;} function bad(t){m.className='msg err';m.textContent=t;}
    bi.onclick=function(){M.A.signInWithEmailAndPassword(M.auth,em.value.trim(),pw.value).then(function(){location.reload();}).catch(function(e){bad(erro(e));});};
    bc.onclick=function(){M.A.createUserWithEmailAndPassword(M.auth,em.value.trim(),pw.value).then(function(){location.reload();}).catch(function(e){bad(erro(e));});};
    bs.onclick=function(){if(!em.value.trim()){bad('Digite seu e-mail acima.');return;}M.A.sendPasswordResetEmail(M.auth,em.value.trim()).then(function(){ok('Enviamos um link para redefinir a senha. Confira seu e-mail.');}).catch(function(e){bad(erro(e));});};
    pw.addEventListener('keydown',function(ev){if(ev.key==='Enter')bi.click();});
    var bar=document.body.firstChild;document.body.insertBefore(box,bar&&bar.nextSibling);
  }
  function limpar(){var a=$('g360Aviso'),b=$('g360Bloq');if(a)a.remove();if(b)b.remove();}
  function aplicar(d,u){
    limpar();if(!d)return;
    if(d.status==='pendente'){
      var a=mk('div');a.id='g360Aviso';
      a.style.cssText='background:#ffb020;color:#2a1c00;padding:10px 14px;text-align:center;font:600 14px system-ui,sans-serif';
      a.textContent='Pagamento pendente. '+(d.aviso||'Regularize para continuar usando o app.')+(d.venc?' Vencimento: '+dmy(d.venc)+'.':'');
      document.body.insertBefore(a,document.body.firstChild);
    }else if(d.status==='bloqueado'){
      var o=mk('div');o.id='g360Bloq';
      o.style.cssText='position:fixed;inset:0;z-index:99999;background:#050b1a;color:#e8f1ff;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font:16px system-ui,sans-serif';
      var c=mk('div');c.style.maxWidth='420px';
      c.appendChild(mk('div',null,'360')).style.cssText='font:800 28px system-ui;width:72px;height:72px;border-radius:20px;background:linear-gradient(135deg,#00d4ff,#2f7bff);display:grid;place-items:center;margin:0 auto 16px;color:#fff';
      c.appendChild(mk('h2',null,'Acesso bloqueado')).style.margin='0 0 8px';
      c.appendChild(mk('p',null,d.aviso||'Há um pagamento pendente. Fale com o responsável pelo app para liberar seu acesso.'));
      var b=mk('button','btn','Sair');b.type='button';b.onclick=function(){M.A.signOut(M.auth).then(function(){location.reload();});};
      c.appendChild(b);o.appendChild(c);document.body.appendChild(o);
    }
  }
  function painelAdmin(){
    if($('g360Admin'))return;
    var cfg=$('tab-config');if(!cfg)return;
    var card=mk('div','card');card.id='g360Admin';
    card.appendChild(mk('h2',null,'Administração: usuários e pagamentos'));
    card.appendChild(mk('div','note','Só você vê este painel. Avise pendência, bloqueie ou libere cada pessoa. O bloqueio vale também no banco de dados.')).style.marginBottom='10px';
    var resumo=mk('div','note');resumo.style.fontWeight='600';card.appendChild(resumo);
    var lista=mk('div');lista.style.marginTop='10px';card.appendChild(lista);
    cfg.insertBefore(card,cfg.firstChild);
    var un=M.F.onSnapshot(M.F.collection(M.db,'assinaturas'),function(sn){
      lista.innerHTML='';var rows=[];sn.forEach(function(d){var x=d.data();x._id=d.id;rows.push(x);});
      rows.sort(function(a,b){return String(a.email).localeCompare(String(b.email));});
      var n={ativo:0,pendente:0,bloqueado:0};rows.forEach(function(r){n[r.status]=(n[r.status]||0)+1;});
      resumo.textContent=rows.length+' usuários · em dia '+n.ativo+' · pendentes '+n.pendente+' · bloqueados '+n.bloqueado;
      rows.forEach(function(r){
        var it=mk('div');it.style.cssText='border:1px solid var(--bd,#999);border-radius:10px;padding:10px;margin-bottom:8px';
        var t=mk('div');t.style.cssText='display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;font-weight:600';
        t.appendChild(mk('span',null,(r.email||r._id)+(r.nome?' ('+r.nome+')':'')));
        var st=mk('span',null,r.status==='bloqueado'?'Bloqueado':r.status==='pendente'?'Pendente':'Em dia');
        st.style.color=r.status==='bloqueado'?'var(--neg,#d33)':r.status==='pendente'?'#e0a000':'var(--pos,#2a9)';t.appendChild(st);it.appendChild(t);
        var f=mk('div');f.style.cssText='display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;align-items:center';
        var av=mk('input');av.type='text';av.placeholder='Mensagem para o usuário';av.value=r.aviso||'';av.style.cssText=S+'flex:1;min-width:160px';
        var vc=mk('input');vc.type='date';vc.value=r.venc||'';vc.style.cssText=S;vc.title='Vencimento';
        f.appendChild(av);f.appendChild(vc);it.appendChild(f);
        var g=mk('div');g.style.cssText='display:flex;gap:6px;flex-wrap:wrap;margin-top:8px';
        function set(status,aviso){return M.F.setDoc(M.F.doc(M.db,'assinaturas',r._id),{status:status,aviso:aviso,venc:vc.value||'',atualizado:new Date().toISOString()},{merge:true});}
        var proprio=r.email&&r.email.toLowerCase()===ADMIN;
        var b1=mk('button','btn sec','Avisar pendência'),b2=mk('button','btn sec','Marcar em dia'),b3=mk('button','btn sec',r.status==='bloqueado'?'Desbloquear':'Bloquear');
        [b1,b2,b3].forEach(function(b){b.type='button';g.appendChild(b);});
        b1.onclick=function(){set('pendente',av.value.trim());};
        b2.onclick=function(){set('ativo','');};
        b3.onclick=function(){if(r.status==='bloqueado')set('ativo','');else set('bloqueado',av.value.trim());};
        if(proprio){g.style.display='none';f.style.display='none';}
        it.appendChild(g);lista.appendChild(it);
      });
      if(!rows.length)lista.appendChild(mk('div','note','Nenhum usuário ainda.'));
    },function(){resumo.textContent='Sem permissão para listar usuários.';});
    unsubs.push(un);
  }
  async function aoUsuario(u){
    limpar();
    if(!u){painelLogin();return;}
    var ref=M.F.doc(M.db,'assinaturas',u.uid);
    try{
      var s=await M.F.getDoc(ref);
      if(!s.exists())await M.F.setDoc(ref,{email:u.email||'',nome:u.displayName||'',status:'ativo',aviso:'',venc:'',criado:new Date().toISOString()});
    }catch(e){}
    unsubs.push(M.F.onSnapshot(ref,function(sn){aplicar(sn.exists()?sn.data():null,u);},function(){}));
    if(u.email&&u.email.toLowerCase()===ADMIN&&u.emailVerified)painelAdmin();
  }
  async function iniciar(){
    if(!window.claude)return;
    var us=await window.claude.use('user');if(!us)return;
    var a=await import(B+'firebase-app.js'),au=await import(B+'firebase-auth.js'),fs=await import(B+'firebase-firestore.js');
    var app=a.getApp();
    M={A:au,F:fs,auth:au.getAuth(app),db:fs.getFirestore(app)};
    au.onAuthStateChanged(M.auth,aoUsuario);
  }
  iniciar().catch(function(){});
})();
