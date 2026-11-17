/*
 * Pentagone 3D du héros : les cinq lames du logo RIFU, rendues en temps réel (WebGL 2, rendu par
 * lancer de rayons sur des champs de distance). Chaque lame est d'abord un hologramme ; quand le
 * joueur correspondant verrouille son champion, elle se matérialise en or brossé et se met en place.
 * La lame du haut (« vous », cyan) se pose quand le visiteur choisit son option dans la démo.
 *
 * Aucune dépendance. Sans WebGL 2, `mountPenta3D` renvoie null et la page garde le pentagone SVG.
 * Le rendu s'arrête hors écran, onglet masqué, et baisse sa résolution si la machine peine.
 */

/* Lames dans le repère du logo (viewBox 64 × 64), même ordre que les attributs data-seg du SVG. */
const BLADES = {
  0: [[4.4, 24], [20.9, 12.1], [31.1, 19.5], [8.3, 36]],
  1: [[14, 57.2], [7.7, 37.8], [17.9, 30.4], [26.6, 57.2]],
  2: [[48.5, 58.3], [28.1, 58.3], [24.2, 46.3], [52.4, 46.3]],
  3: [[60.2, 25.8], [53.9, 45.2], [41.3, 45.2], [50, 18.4]],
  you: [[32.9, 4.7], [49.4, 16.6], [45.5, 28.6], [22.7, 12.1]],
};
const ORDER = ['0', '1', '2', '3', 'you'];

const VERT = `#version 300 es
in vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uV[20];
uniform float uS[5];   // matérialisée (0 hologramme, 1 métal)
uniform float uE[5];   // écart à la position assemblée (0 en place)
uniform float uF[5];   // éclat à la matérialisation
uniform vec2 uTilt;
uniform float uDone;   // compo complète
uniform float uPx;     // taille d'un pixel à la distance de l'objet

const float H = 0.085;  // demi-épaisseur
const float R = 0.028;  // arrondi des arêtes

mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}

void edge(vec2 p, vec2 vi, vec2 vj, inout float d, inout float s){
  vec2 e = vj - vi; vec2 w = p - vi;
  vec2 b = w - e*clamp(dot(w,e)/dot(e,e),0.,1.);
  d = min(d, dot(b,b));
  bool c1 = p.y>=vi.y, c2 = p.y<vj.y, c3 = e.x*w.y>e.y*w.x;
  if((c1&&c2&&c3)||(!c1&&!c2&&!c3)) s*=-1.;
}
float sdQuad(vec2 p, vec2 a, vec2 b, vec2 c, vec2 d4){
  float d = dot(p-a,p-a); float s = 1.;
  edge(p,a,d4,d,s); edge(p,b,a,d,s); edge(p,c,b,d,s); edge(p,d4,c,d,s);
  return s*sqrt(d);
}

vec3 bladeSpace(vec3 p, int i){
  vec2 a=uV[i*4], b=uV[i*4+1], c=uV[i*4+2], d=uV[i*4+3];
  vec2 cen = (a+b+c+d)*.25;
  vec2 dir = normalize(cen + vec2(1e-4));
  float e = uE[i];
  vec3 q = p - vec3(dir*0.5*e, 0.34*e);
  q.xy -= cen;
  // la lame pivote sur son axe radial quand elle est écartée
  vec2 t = vec2(-dir.y, dir.x);
  float ang = -e*1.15 + sin(uTime*.9 + float(i)*1.7)*0.05*e;
  float along = dot(q.xy, t), rad = dot(q.xy, dir);
  vec2 az = rot(ang)*vec2(along, q.z);
  q = vec3(t*az.x + dir*rad, az.y);
  q.xy += cen;
  return q;
}
float sdBlade(vec3 p, int i){
  vec3 q = bladeSpace(p, i);
  float d2 = sdQuad(q.xy, uV[i*4], uV[i*4+1], uV[i*4+2], uV[i*4+3]) + R;
  vec2 w = vec2(d2, abs(q.z) - (H - R));
  return min(max(w.x,w.y),0.) + length(max(w,0.)) - R;
}

vec3 world(vec3 p){
  float idle = 1. - uDone*.6;
  p.yz = rot(uTilt.y*.42 + sin(uTime*.37)*.06*idle)*p.yz;
  p.xz = rot(uTilt.x*.55 + sin(uTime*.23)*.12*idle)*p.xz;
  return p;
}

// x : distance au métal, y : indice de la lame, z : distance à l'hologramme le plus proche, w : son indice
vec4 map(vec3 p){
  p = world(p);
  float dm = 1e3, im = -1., dg = 1e3, ig = -1.;
  for(int i=0;i<5;i++){
    float d = sdBlade(p, i);
    if(uS[i] > .5){ if(d<dm){dm=d; im=float(i);} }
    else { float a = abs(d); if(a<dg){dg=a; ig=float(i);} }
  }
  return vec4(dm, im, dg, ig);
}

vec3 normal(vec3 p){
  vec2 e = vec2(.0015,0.);
  return normalize(vec3(map(p+e.xyy).x-map(p-e.xyy).x, map(p+e.yxy).x-map(p-e.yxy).x, map(p+e.yyx).x-map(p-e.yyx).x));
}

vec3 env(vec3 r){
  vec3 c = mix(vec3(.012,.018,.035), vec3(.07,.085,.12), smoothstep(-.6,.8,r.y));
  c += vec3(1.,.86,.62)*1.05*smoothstep(.55,.95,r.y)*smoothstep(.9,.2,abs(r.x+.15)); // boîte à lumière du haut
  c += vec3(1.,.9,.75)*1.6*smoothstep(.985,.999,dot(r, normalize(vec3(.75,.35,.55)))); // projecteur
  c += vec3(.95,.8,.55)*.7*smoothstep(.15,.0,abs(r.x-.72))*smoothstep(-.3,.4,r.y); // bande verticale
  c += vec3(.17,.71,.78)*1.1*pow(max(dot(r, normalize(vec3(-1.,.05,.25))),0.),6.); // contre-jour cyan
  // grande boîte à lumière derrière le spectateur : c'est elle que reflètent les faces avant
  float front = smoothstep(.2,1.,r.z);
  c += vec3(1.,.86,.66)*front*(.18 + .85*smoothstep(-.2,.45,r.y + r.x*.55));
  c += vec3(1.,.93,.8)*1.3*smoothstep(.93,.99,dot(r, normalize(vec3(-.3,.55,.78)))); // reflet net en haut à gauche
  return c;
}

float hash(vec2 p){return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5);}

void main(){
  vec2 uv = (gl_FragCoord.xy - .5*uRes)/uRes.y;
  vec3 ro = vec3(0.,0.,4.1);
  vec3 rd = normalize(vec3(uv*1.5, -1.6));
  // sphère englobante : on ne lance des rayons que là où l'objet peut se trouver
  float bb = dot(ro,rd); float cc = dot(ro,ro) - 2.25*2.25; float disc = bb*bb - cc;
  vec3 col = vec3(0.); float alpha = 0.;
  if(disc > 0.){
    float t = max(-bb - sqrt(disc), 0.); float tEnd = -bb + sqrt(disc);
    float glow = 0.; float gi = 0.; float minD = 1e3; float hit = -1.;
    for(int k=0;k<96;k++){
      vec3 p = ro + rd*t;
      vec4 m = map(p);
      if(m.x < .0006){ hit = m.y; break; }
      minD = min(minD, m.x/(t*uPx));
      float g = exp(-m.z*70.)*.085;
      glow += g; if(g>.004) gi = m.w;
      t += max(min(m.x, m.z + .012)*.9, .004);
      if(t > tEnd) break;
    }
    // hologramme des lames pas encore verrouillées : or pour les alliés, cyan pour vous
    vec3 holo = gi > 3.5 ? vec3(.24,.86,.95) : vec3(1.,.78,.42);
    float scan = .88 + .12*sin(gl_FragCoord.y*.55 - uTime*3.);
    col += holo * glow * scan * 1.25;
    alpha = clamp(glow*1.4, 0., 1.);
    if(hit > -.5){
      vec3 p = ro + rd*t;
      vec3 n = normal(p);
      vec3 pw = world(p);
      int ib = int(hit+.5);
      // reflets brossés : fines rayures le long de la lame
      float brush = hash(floor(pw.xy*vec2(900.,9.)))*.06;
      n = normalize(n + vec3(brush-.03, 0., 0.));
      vec3 v = -rd; vec3 r = reflect(rd, n);
      bool you = ib == 4;
      vec3 f0 = you ? vec3(.2,.74,.86) : vec3(.96,.76,.46);
      float fr = pow(1.-max(dot(n,v),0.), 5.);
      vec3 spec = env(r) * (f0 + (1.-f0)*fr);
      vec3 base = f0 * (.045 + .05*max(dot(n, normalize(vec3(.4,.8,.6))),0.));
      col = base + spec*1.15;
      // éclat de matérialisation et pulsation de la compo complète
      float fl = 0.;
      for(int i=0;i<5;i++){ if(i==ib) fl = uF[i]; }
      col += f0 * (fl*1.8 + uDone*.18*(.5+.5*sin(uTime*2.2)));
      if(you) col += vec3(.1,.5,.6)*(.25 + .2*smoothstep(.2,1.,n.z));
      alpha = 1.;
    } else {
      // contour lissé : couverture partielle quand le rayon frôle le métal
      float cov = 1. - smoothstep(0., 1.5, minD);
      if(cov > 0.){ col = mix(col, vec3(.42,.32,.17), cov); alpha = max(alpha, cov); }
    }
  }
  col = col/(1.+col*.55);           // compression douce des hautes lumières
  col = pow(col, vec3(.95));
  fragColor = vec4(col*alpha, alpha);
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
  return s;
}

/**
 * Monte le pentagone 3D dans `canvas`. Renvoie un objet de pilotage, ou null sans WebGL.
 * - lock(id) : la lame `id` ('0'…'3' ou 'you') se matérialise et se met en place
 * - hover(on) : la lame « vous » s'approche (survol d'une option)
 * - release(id) : la lame redevient hologramme
 * - reset() : toutes les lames en hologramme
 */
export function mountPenta3D(canvas, { reduced = false } = {}) {
  let gl;
  try {
    gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'high-performance' });
  } catch { gl = null; }
  if (!gl) return null;
  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
  } catch (err) {
    console.warn('Pentagone 3D indisponible :', err);
    return null;
  }
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = (n) => gl.getUniformLocation(prog, n);
  const U = { res: u('uRes'), time: u('uTime'), v: u('uV'), s: u('uS'), e: u('uE'), f: u('uF'), tilt: u('uTilt'), done: u('uDone'), px: u('uPx') };

  // Sommets centrés, mis à l'échelle (rayon d'environ 1,1)
  const verts = [];
  for (const id of ORDER) for (const [x, y] of BLADES[id]) verts.push((x - 32.4) / 25.5, (33.2 - y) / 25.5);
  gl.uniform2fv(U.v, new Float32Array(verts));

  // État animé de chaque lame : position (ressort) et matière
  const st = ORDER.map(() => ({ s: 0, e: 0.55, ev: 0, eT: 0.55, f: 0 }));
  const idx = (id) => ORDER.indexOf(String(id));
  let done = 0, doneT = 0;
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };

  let scale = Math.min(window.devicePixelRatio || 1, 1.75);
  let w = 0, h = 0;
  function resize() {
    const r = canvas.getBoundingClientRect();
    const nw = Math.max(1, Math.round(r.width * scale)), nh = Math.max(1, Math.round(r.height * scale));
    if (nw !== w || nh !== h) { w = nw; h = nh; canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
  }
  const ro = 'ResizeObserver' in window ? new ResizeObserver(resize) : null;
  ro?.observe(canvas);
  resize();

  let visible = true, running = false, last = performance.now(), t0 = last, slow = 0;
  function frame(now) {
    if (!visible || document.hidden) { running = false; return; }
    const dt = Math.min(0.05, (now - last) / 1000);
    // résolution adaptative : si les images prennent trop de temps, on rend moins de pixels
    if (dt > 0.03 && scale > 0.7) { if (++slow > 20) { scale = Math.max(0.7, scale - 0.25); slow = 0; resize(); } } else slow = Math.max(0, slow - 1);
    last = now;
    for (const b of st) {
      if (reduced) { b.e = b.eT; b.ev = 0; } else {
        const k = 90, c = 13; // ressort un peu nerveux : léger dépassement à l'arrivée
        b.ev += (k * (b.eT - b.e) - c * b.ev) * dt;
        b.e += b.ev * dt;
      }
      b.f = Math.max(0, b.f - dt * 1.6);
    }
    done += (doneT - done) * Math.min(1, dt * 4);
    tilt.x += (tilt.tx - tilt.x) * Math.min(1, dt * 3);
    tilt.y += (tilt.ty - tilt.y) * Math.min(1, dt * 3);
    gl.uniform2f(U.res, w, h);
    gl.uniform1f(U.time, reduced ? 0 : (now - t0) / 1000);
    gl.uniform1fv(U.s, st.map((b) => b.s));
    gl.uniform1fv(U.e, st.map((b) => b.e));
    gl.uniform1fv(U.f, st.map((b) => b.f));
    gl.uniform2f(U.tilt, tilt.x, tilt.y);
    gl.uniform1f(U.done, done);
    gl.uniform1f(U.px, 0.94 / h);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(frame);
  }
  const start = () => { if (!running && visible && !document.hidden) { running = true; last = performance.now(); requestAnimationFrame(frame); } };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; start(); }).observe(canvas);
  }
  document.addEventListener('visibilitychange', start);
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); running = false; visible = false; canvas.dispatchEvent(new CustomEvent('penta-lost', { bubbles: true })); });

  const host = canvas.closest('[data-penta-host]') || canvas;
  if (!reduced && window.matchMedia('(pointer: fine)').matches) {
    host.addEventListener('pointermove', (e) => {
      const r = host.getBoundingClientRect();
      tilt.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      tilt.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    }, { passive: true });
    host.addEventListener('pointerleave', () => { tilt.tx = 0; tilt.ty = 0; });
  }
  start();

  return {
    lock(id) { const b = st[idx(id)]; if (!b) return; b.s = 1; b.eT = 0; b.f = 1; },
    release(id) { const b = st[idx(id)]; if (!b) return; b.s = 0; b.eT = 0.55; },
    hover(on) { const b = st[4]; if (b.s < 0.5) b.eT = on ? 0.2 : 0.55; },
    complete(on) { doneT = on ? 1 : 0; },
    reset() { for (const b of st) { b.s = 0; b.eT = 0.55; b.f = 0; } doneT = 0; },
  };
}
