/* Solario — interactive shader wallpaper engine (WebGL1)
   5 wallpapers. The pointer is the sun: everything gains light/energy near it.
   Clicks inject energy pulses. window.SOLARIO = { setShader, setParams, names } */
(function () {
  'use strict';

  var COMMON = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;
uniform vec3  u_clicks[8];
uniform float u_intensity;
uniform float u_speed;
uniform float u_grain;

float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f);
  float a=hash(i), b=hash(i+vec2(1.0,0.0)), c=hash(i+vec2(0.0,1.0)), d=hash(i+vec2(1.0,1.0));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}
float fbm(vec2 p){
  float v=0.0; float a=0.5;
  for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.03+vec2(7.31,3.17); a*=0.5; }
  return v;
}
float clickRings(vec2 uv){
  float s=0.0;
  for(int i=0;i<8;i++){
    vec3 c=u_clicks[i];
    if(c.z<0.0) continue;
    float age=u_time-c.z;
    if(age>2.5||age<0.0) continue;
    float d=length(uv-c.xy);
    float r=age*0.55;
    s+=smoothstep(0.05,0.0,abs(d-r))*exp(-age*2.0);
  }
  return s;
}
float clickGlow(vec2 uv){
  float s=0.0;
  for(int i=0;i<8;i++){
    vec3 c=u_clicks[i];
    if(c.z<0.0) continue;
    float age=u_time-c.z;
    if(age>2.5||age<0.0) continue;
    s+=exp(-length(uv-c.xy)*6.0)*exp(-age*3.0);
  }
  return s;
}
vec3 filmGrain(vec2 fc){
  float g=hash(fc*0.7+fract(u_time)*113.1)-0.5;
  return vec3(g)*0.045*u_grain;
}
`;

  /* ------------------------------------------------------------------ */
  var SHADERS = [
    {
      name: 'Acero ◇',
      desc: 'La selección · acero diagonal, celda fina',
      src: `
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*u_res)/u_res.y;
  float t=u_time*u_speed;
  vec2 m=u_mouse;

  vec2 pr=vec2(uv.x-uv.y, uv.x+uv.y)*0.7071;
  vec2 mr=vec2(m.x-m.y, m.x+m.y)*0.7071;
  float S=26.0;
  vec2 g=pr*S;
  float off=0.0;
  vec2 id=floor(g);
  vec2 gv=fract(g)-0.5;
  vec2 cc=vec2((id.x+0.5-off),(id.y+0.5))/S;
  float h=hash(id);

  float d=length(cc-mr);
  // wide, soft glow so the light fades gently (no hard ring)
  float charge=exp(-d*2.7)*u_intensity + 0.14*exp(-d*1.25)*u_intensity;

  for(int i=0;i<8;i++){
    vec3 c=u_clicks[i];
    if(c.z<0.0) continue;
    float age=u_time-c.z;
    if(age>3.0||age<0.0) continue;
    vec2 cr=vec2(c.x-c.y, c.x+c.y)*0.7071;
    float dd=length(cc-cr);
    float rr=age*0.7;
    charge += smoothstep(0.22,0.0,abs(dd-rr))*exp(-age*1.2);
  }
  charge *= 0.72+0.5*h;
  float cg=clamp(charge,0.0,1.4);

  float pulse=0.5+0.5*sin(t*2.2+h*6.2831);
  float b=max(abs(gv.x),abs(gv.y));
  float body=smoothstep(0.48,0.42,b);
  float edge=body-smoothstep(0.40,0.32,b);

  vec3 amb=mix(vec3(0.055,0.090,0.190), vec3(0.110,0.165,0.320), 0.35+0.45*h);
  vec3 lit=mix(vec3(0.170,0.350,0.620), vec3(0.560,0.760,1.000), cg);

  vec3 col=vec3(0.012,0.016,0.036)*(1.0-body);
  col += amb*body;
  col += lit*body*cg*(0.84+0.16*pulse);
  col += vec3(0.55,0.72,0.95)*edge*(0.25+cg*1.0);

  vec2 dir=normalize(mr-cc+vec2(1e-4));
  float sheen=clamp(dot(gv*2.0,dir),0.0,1.0);
  col += vec3(0.70,0.82,1.0)*sheen*sheen*cg*0.16*body;

  float vfade=smoothstep(-0.98,-0.55,uv.y);
  col=mix(vec3(0.012,0.016,0.036), col, 0.18+0.82*vfade);

  col += filmGrain(gl_FragCoord.xy);
  gl_FragColor=vec4(col,1.0);
}`
    },
    {
      name: 'Cobalto',
      desc: 'Cuadrícula fina · azul cobalto',
      src: `
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*u_res)/u_res.y;
  float t=u_time*u_speed;
  vec2 m=u_mouse;

  vec2 pr=uv; vec2 mr=m;
  float S=18.0;
  vec2 g=pr*S;
  float off=0.0;
  vec2 id=floor(g);
  vec2 gv=fract(g)-0.5;
  vec2 cc=vec2((id.x+0.5-off),(id.y+0.5))/S;
  float h=hash(id);

  float d=length(cc-mr);
  // wide, soft glow so the light fades gently (no hard ring)
  float charge=exp(-d*2.7)*u_intensity + 0.14*exp(-d*1.25)*u_intensity;

  for(int i=0;i<8;i++){
    vec3 c=u_clicks[i];
    if(c.z<0.0) continue;
    float age=u_time-c.z;
    if(age>3.0||age<0.0) continue;
    vec2 cr=c.xy;
    float dd=length(cc-cr);
    float rr=age*0.7;
    charge += smoothstep(0.22,0.0,abs(dd-rr))*exp(-age*1.2);
  }
  charge *= 0.72+0.5*h;
  float cg=clamp(charge,0.0,1.4);

  float pulse=0.5+0.5*sin(t*2.2+h*6.2831);
  float b=max(abs(gv.x),abs(gv.y));
  float body=smoothstep(0.48,0.42,b);
  float edge=body-smoothstep(0.40,0.32,b);

  vec3 amb=mix(vec3(0.045,0.090,0.280), vec3(0.080,0.150,0.430), 0.35+0.45*h);
  vec3 lit=mix(vec3(0.090,0.330,0.820), vec3(0.430,0.680,1.000), cg);

  vec3 col=vec3(0.010,0.014,0.040)*(1.0-body);
  col += amb*body;
  col += lit*body*cg*(0.84+0.16*pulse);
  col += vec3(0.45,0.70,1.0)*edge*(0.25+cg*1.0);

  vec2 dir=normalize(mr-cc+vec2(1e-4));
  float sheen=clamp(dot(gv*2.0,dir),0.0,1.0);
  col += vec3(0.60,0.78,1.0)*sheen*sheen*cg*0.16*body;

  float vfade=smoothstep(-0.98,-0.55,uv.y);
  col=mix(vec3(0.010,0.014,0.040), col, 0.18+0.82*vfade);

  col += filmGrain(gl_FragCoord.xy);
  gl_FragColor=vec4(col,1.0);
}`
    },
    {
      name: 'Cielo',
      desc: 'Diagonal · azul cielo',
      src: `
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*u_res)/u_res.y;
  float t=u_time*u_speed;
  vec2 m=u_mouse;

  vec2 pr=vec2(uv.x-uv.y, uv.x+uv.y)*0.7071;
  vec2 mr=vec2(m.x-m.y, m.x+m.y)*0.7071;
  float S=20.0;
  vec2 g=pr*S;
  float off=0.0;
  vec2 id=floor(g);
  vec2 gv=fract(g)-0.5;
  vec2 cc=vec2((id.x+0.5-off),(id.y+0.5))/S;
  float h=hash(id);

  float d=length(cc-mr);
  // wide, soft glow so the light fades gently (no hard ring)
  float charge=exp(-d*2.7)*u_intensity + 0.14*exp(-d*1.25)*u_intensity;

  for(int i=0;i<8;i++){
    vec3 c=u_clicks[i];
    if(c.z<0.0) continue;
    float age=u_time-c.z;
    if(age>3.0||age<0.0) continue;
    vec2 cr=vec2(c.x-c.y, c.x+c.y)*0.7071;
    float dd=length(cc-cr);
    float rr=age*0.7;
    charge += smoothstep(0.22,0.0,abs(dd-rr))*exp(-age*1.2);
  }
  charge *= 0.72+0.5*h;
  float cg=clamp(charge,0.0,1.4);

  float pulse=0.5+0.5*sin(t*2.2+h*6.2831);
  float b=max(abs(gv.x),abs(gv.y));
  float body=smoothstep(0.48,0.42,b);
  float edge=body-smoothstep(0.40,0.32,b);

  vec3 amb=mix(vec3(0.040,0.110,0.250), vec3(0.080,0.200,0.420), 0.35+0.45*h);
  vec3 lit=mix(vec3(0.120,0.470,0.820), vec3(0.520,0.880,1.000), cg);

  vec3 col=vec3(0.008,0.016,0.038)*(1.0-body);
  col += amb*body;
  col += lit*body*cg*(0.84+0.16*pulse);
  col += vec3(0.45,0.85,1.0)*edge*(0.25+cg*1.0);

  vec2 dir=normalize(mr-cc+vec2(1e-4));
  float sheen=clamp(dot(gv*2.0,dir),0.0,1.0);
  col += vec3(0.65,0.90,1.0)*sheen*sheen*cg*0.16*body;

  float vfade=smoothstep(-0.98,-0.55,uv.y);
  col=mix(vec3(0.008,0.016,0.038), col, 0.18+0.82*vfade);

  col += filmGrain(gl_FragCoord.xy);
  gl_FragColor=vec4(col,1.0);
}`
    },
    {
      name: 'Acero ▦',
      desc: 'Ladrillo · azul acero',
      src: `
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*u_res)/u_res.y;
  float t=u_time*u_speed;
  vec2 m=u_mouse;

  vec2 pr=uv; vec2 mr=m;
  float S=16.0;
  vec2 g=pr*S;
  float row=floor(g.y);
  float off=0.5*mod(row,2.0);
  g.x+=off;
  vec2 id=floor(g);
  vec2 gv=fract(g)-0.5;
  vec2 cc=vec2((id.x+0.5-off),(id.y+0.5))/S;
  float h=hash(id);

  float d=length(cc-mr);
  // wide, soft glow so the light fades gently (no hard ring)
  float charge=exp(-d*2.7)*u_intensity + 0.14*exp(-d*1.25)*u_intensity;

  for(int i=0;i<8;i++){
    vec3 c=u_clicks[i];
    if(c.z<0.0) continue;
    float age=u_time-c.z;
    if(age>3.0||age<0.0) continue;
    vec2 cr=c.xy;
    float dd=length(cc-cr);
    float rr=age*0.7;
    charge += smoothstep(0.22,0.0,abs(dd-rr))*exp(-age*1.2);
  }
  charge *= 0.72+0.5*h;
  float cg=clamp(charge,0.0,1.4);

  float pulse=0.5+0.5*sin(t*2.2+h*6.2831);
  float b=max(abs(gv.x),abs(gv.y));
  float body=smoothstep(0.48,0.42,b);
  float edge=body-smoothstep(0.40,0.32,b);

  vec3 amb=mix(vec3(0.055,0.090,0.190), vec3(0.110,0.165,0.320), 0.35+0.45*h);
  vec3 lit=mix(vec3(0.170,0.350,0.620), vec3(0.560,0.760,1.000), cg);

  vec3 col=vec3(0.012,0.016,0.036)*(1.0-body);
  col += amb*body;
  col += lit*body*cg*(0.84+0.16*pulse);
  col += vec3(0.55,0.72,0.95)*edge*(0.25+cg*1.0);

  vec2 dir=normalize(mr-cc+vec2(1e-4));
  float sheen=clamp(dot(gv*2.0,dir),0.0,1.0);
  col += vec3(0.70,0.82,1.0)*sheen*sheen*cg*0.16*body;

  float vfade=smoothstep(-0.98,-0.55,uv.y);
  col=mix(vec3(0.012,0.016,0.036), col, 0.18+0.82*vfade);

  col += filmGrain(gl_FragCoord.xy);
  gl_FragColor=vec4(col,1.0);
}`
    },
    {
      name: 'Eléctrico',
      desc: 'Diagonal con onda · azul eléctrico',
      src: `
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*u_res)/u_res.y;
  float t=u_time*u_speed;
  vec2 m=u_mouse;

  vec2 pr=vec2(uv.x-uv.y, uv.x+uv.y)*0.7071;
  vec2 mr=vec2(m.x-m.y, m.x+m.y)*0.7071;
  float S=22.0;
  vec2 g=pr*S;
  float off=0.0;
  vec2 id=floor(g);
  vec2 gv=fract(g)-0.5;
  vec2 cc=vec2((id.x+0.5-off),(id.y+0.5))/S;
  float h=hash(id);

  float d=length(cc-mr);
  // wide, soft glow so the light fades gently (no hard ring)
  float charge=exp(-d*2.7)*u_intensity + 0.14*exp(-d*1.25)*u_intensity;

  charge += max(0.0, 0.24*sin(d*15.0-t*2.3))*exp(-d*1.2)*u_intensity;
  for(int i=0;i<8;i++){
    vec3 c=u_clicks[i];
    if(c.z<0.0) continue;
    float age=u_time-c.z;
    if(age>3.0||age<0.0) continue;
    vec2 cr=vec2(c.x-c.y, c.x+c.y)*0.7071;
    float dd=length(cc-cr);
    float rr=age*0.7;
    charge += smoothstep(0.22,0.0,abs(dd-rr))*exp(-age*1.2);
  }
  charge *= 0.72+0.5*h;
  float cg=clamp(charge,0.0,1.4);

  float pulse=0.5+0.5*sin(t*2.2+h*6.2831);
  float b=max(abs(gv.x),abs(gv.y));
  float body=smoothstep(0.48,0.42,b);
  float edge=body-smoothstep(0.40,0.32,b);

  vec3 amb=mix(vec3(0.040,0.090,0.300), vec3(0.075,0.150,0.470), 0.35+0.45*h);
  vec3 lit=mix(vec3(0.110,0.440,0.940), vec3(0.470,0.820,1.000), cg);

  vec3 col=vec3(0.008,0.012,0.045)*(1.0-body);
  col += amb*body;
  col += lit*body*cg*(0.84+0.16*pulse);
  col += vec3(0.40,0.78,1.0)*edge*(0.25+cg*1.0);

  vec2 dir=normalize(mr-cc+vec2(1e-4));
  float sheen=clamp(dot(gv*2.0,dir),0.0,1.0);
  col += vec3(0.62,0.86,1.0)*sheen*sheen*cg*0.16*body;

  float vfade=smoothstep(-0.98,-0.55,uv.y);
  col=mix(vec3(0.008,0.012,0.045), col, 0.18+0.82*vfade);

  col += filmGrain(gl_FragCoord.xy);
  gl_FragColor=vec4(col,1.0);
}`
    },
    {
      name: 'Abismo',
      desc: 'Cuadrícula muy fina · azul profundo',
      src: `
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*u_res)/u_res.y;
  float t=u_time*u_speed;
  vec2 m=u_mouse;

  vec2 pr=uv; vec2 mr=m;
  float S=26.0;
  vec2 g=pr*S;
  float off=0.0;
  vec2 id=floor(g);
  vec2 gv=fract(g)-0.5;
  vec2 cc=vec2((id.x+0.5-off),(id.y+0.5))/S;
  float h=hash(id);

  float d=length(cc-mr);
  // wide, soft glow so the light fades gently (no hard ring)
  float charge=exp(-d*2.7)*u_intensity + 0.14*exp(-d*1.25)*u_intensity;

  for(int i=0;i<8;i++){
    vec3 c=u_clicks[i];
    if(c.z<0.0) continue;
    float age=u_time-c.z;
    if(age>3.0||age<0.0) continue;
    vec2 cr=c.xy;
    float dd=length(cc-cr);
    float rr=age*0.7;
    charge += smoothstep(0.22,0.0,abs(dd-rr))*exp(-age*1.2);
  }
  charge *= 0.72+0.5*h;
  float cg=clamp(charge,0.0,1.4);

  float pulse=0.5+0.5*sin(t*2.2+h*6.2831);
  float b=max(abs(gv.x),abs(gv.y));
  float body=smoothstep(0.48,0.42,b);
  float edge=body-smoothstep(0.40,0.32,b);

  vec3 amb=mix(vec3(0.035,0.080,0.210), vec3(0.065,0.140,0.350), 0.35+0.45*h);
  vec3 lit=mix(vec3(0.070,0.300,0.640), vec3(0.340,0.680,0.980), cg);

  vec3 col=vec3(0.006,0.012,0.030)*(1.0-body);
  col += amb*body;
  col += lit*body*cg*(0.84+0.16*pulse);
  col += vec3(0.36,0.66,0.96)*edge*(0.25+cg*1.0);

  vec2 dir=normalize(mr-cc+vec2(1e-4));
  float sheen=clamp(dot(gv*2.0,dir),0.0,1.0);
  col += vec3(0.55,0.78,1.0)*sheen*sheen*cg*0.16*body;

  float vfade=smoothstep(-0.98,-0.55,uv.y);
  col=mix(vec3(0.006,0.012,0.030), col, 0.18+0.82*vfade);

  col += filmGrain(gl_FragCoord.xy);
  gl_FragColor=vec4(col,1.0);
}`
    }
  ];

  /* ------------------------------------------------------------------ */
  var canvas = document.getElementById('wp-canvas');
  if (!canvas) return;
  var gl = canvas.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: true });
  if (!gl) { document.documentElement.classList.add('no-webgl'); return; }

  var VERT = 'attribute vec2 p; void main(){ gl_Position=vec4(p,0.0,1.0); }';
  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }
  var vert = compile(gl.VERTEX_SHADER, VERT);
  var programs = [];
  function getProgram(i) {
    if (programs[i]) return programs[i];
    var frag = compile(gl.FRAGMENT_SHADER, COMMON + SHADERS[i].src);
    if (!frag) return null;
    var pr = gl.createProgram();
    gl.attachShader(pr, vert); gl.attachShader(pr, frag); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
      console.error('Link error:', gl.getProgramInfoLog(pr));
      return null;
    }
    var u = {};
    ['u_res','u_time','u_mouse','u_intensity','u_speed','u_grain'].forEach(function (n) {
      u[n] = gl.getUniformLocation(pr, n);
    });
    u.u_clicks = gl.getUniformLocation(pr, 'u_clicks[0]');
    u.a_p = gl.getAttribLocation(pr, 'p');
    programs[i] = { pr: pr, u: u };
    return programs[i];
  }

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  /* ---- state ---- */
  var DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  var W = 0, H = 0;
  function resize() {
    var r = canvas.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width * DPR));
    H = Math.max(1, Math.round(r.height * DPR));
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W; canvas.height = H;
      gl.viewport(0, 0, W, H);
    }
  }
  window.addEventListener('resize', resize);
  resize(); // measure immediately so toUV never divides by zero

  var start = performance.now();
  var mouse = { x: 0.0, y: 0.0 };           // smoothed, uv space
  var target = { x: 0.0, y: 0.0 };
  var hasPointer = false;
  var lastMove = 0;
  var clicks = new Float32Array(24);
  for (var ci = 0; ci < 8; ci++) clicks[ci * 3 + 2] = -1.0;
  var clickIdx = 0;
  var params = { intensity: 1, speed: 1, grain: 1 };
  var current = 0;
  var visible = true;
  var energy = 0;
  var lastClient = null;

  function toUV(clientX, clientY) {
    if (W === 0 || H === 0) resize();
    if (H === 0) return { x: 0, y: 0 };
    var r = canvas.getBoundingClientRect();
    var px = (clientX - r.left) * DPR;
    var py = (clientY - r.top) * DPR;
    var u = { x: (px - 0.5 * W) / H, y: (0.5 * H - py) / H };
    if (!isFinite(u.x) || !isFinite(u.y)) return { x: 0, y: 0 };
    return u;
  }

  window.addEventListener('pointermove', function (e) {
    var p = toUV(e.clientX, e.clientY);
    target.x = p.x; target.y = p.y;
    hasPointer = true;
    lastMove = performance.now();
    if (lastClient) {
      var dx = e.clientX - lastClient.x, dy = e.clientY - lastClient.y;
      addEnergy(Math.sqrt(dx * dx + dy * dy) * 0.0004);
    }
    lastClient = { x: e.clientX, y: e.clientY };
  }, { passive: true });

  function registerClick(clientX, clientY) {
    var p = toUV(clientX, clientY);
    var t = (performance.now() - start) / 1000;
    clicks[clickIdx * 3] = p.x;
    clicks[clickIdx * 3 + 1] = p.y;
    clicks[clickIdx * 3 + 2] = t;
    clickIdx = (clickIdx + 1) % 8;
    addEnergy(0.25);
  }
  // only clicks on the wallpaper itself (not on buttons/links above it)
  var hero = canvas.closest('.hero') || canvas.parentElement;
  hero.addEventListener('pointerdown', function (e) {
    if (e.target.closest('a,button,input,textarea,select,[data-no-pulse]')) return;
    registerClick(e.clientX, e.clientY);
  });

  function addEnergy(v) {
    energy += v;
    window.dispatchEvent(new CustomEvent('solario-energy', { detail: { kwh: energy } }));
  }

  /* pause when hero is off-screen */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
    }, { threshold: 0.02 }).observe(canvas);
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    resize();
    var t = (now - start) / 1000;

    // when idle (no pointer, or 5s of stillness) the sun eases to a fixed resting
    // spot and stays there — the rest of the wallpaper holds its calm cobalt, no
    // autonomous colour-cycling where there is no sun.
    var idle = (!hasPointer || now - lastMove > 5000);
    if (idle) { target.x = 0.46; target.y = 0.16; }
    var ease = idle ? 0.025 : 0.07;
    mouse.x += (target.x - mouse.x) * ease;
    mouse.y += (target.y - mouse.y) * ease;
    // self-heal if anything ever poisoned the smoothing with NaN/Infinity
    if (!isFinite(mouse.x) || !isFinite(mouse.y)) { mouse.x = target.x; mouse.y = target.y; }
    if (!isFinite(mouse.x) || !isFinite(mouse.y)) { mouse.x = 0; mouse.y = 0; target.x = 0; target.y = 0; }

    var P = getProgram(current);
    if (!P) return;
    gl.useProgram(P.pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(P.u.a_p);
    gl.vertexAttribPointer(P.u.a_p, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(P.u.u_res, W, H);
    gl.uniform1f(P.u.u_time, t);
    gl.uniform2f(P.u.u_mouse, mouse.x, mouse.y);
    gl.uniform3fv(P.u.u_clicks, clicks);
    gl.uniform1f(P.u.u_intensity, params.intensity);
    gl.uniform1f(P.u.u_speed, params.speed);
    gl.uniform1f(P.u.u_grain, params.grain);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  requestAnimationFrame(frame);

  /* ---- public API ---- */
  window.SOLARIO = {
    names: SHADERS.map(function (s) { return { name: s.name, desc: s.desc }; }),
    setShader: function (i) {
      current = Math.max(0, Math.min(SHADERS.length - 1, i | 0));
      window.dispatchEvent(new CustomEvent('solario-shader', { detail: { index: current } }));
    },
    getShader: function () { return current; },
    setParams: function (p) {
      if (!p) return;
      if (typeof p.intensity === 'number') params.intensity = p.intensity;
      if (typeof p.speed === 'number') params.speed = p.speed;
      if (typeof p.grain === 'number') params.grain = p.grain;
    }
  };
})();
