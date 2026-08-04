(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,58659,e=>{"use strict";let t=(0,e.i(6927).default)("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]);e.s(["Mail",0,t],58659)},95388,e=>{"use strict";let t=(0,e.i(6927).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["ShieldCheck",0,t],95388)},8814,e=>{"use strict";let t=(0,e.i(6927).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Eye",0,t],8814)},33749,e=>{"use strict";let t=(0,e.i(6927).default)("lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);e.s(["Lock",0,t],33749)},7156,e=>{"use strict";var t=e.i(86927),r=e.i(68505),a=e.i(25929),i=e.i(35272),o=e.i(8814),s=e.i(6927);let n=(0,s.default)("eye-off",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);var l=e.i(33749),d=e.i(58659);let p=(0,s.default)("circle-alert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]),c=(0,s.default)("arrow-right",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);var g=e.i(95388);let m=(0,s.default)("circle-check",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);var x=e.i(6065);let f=`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100vh; width: 100vw; overflow: hidden; scrollbar-width: none; }
::-webkit-scrollbar { display: none; }

.split-root {
  font-family: 'Inter', sans-serif;
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #09090b;
  overflow: hidden;
}

@media (max-width: 960px) {
  .split-root { grid-template-columns: 1fr; overflow-y: auto; }
  html, body { overflow: auto; }
}

/* ═════════════════════════════════════════════
   LEFT PANEL — CLEAN WHITE BACKGROUND
═════════════════════════════════════════════ */
.split-left {
  position: relative;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 44px 56px;
  height: 100vh;
  overflow: hidden;
}

@media (max-width: 960px) {
  .split-left { display: none; }
}

.split-left-bg-pattern {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(230,0,18,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(230,0,18,0.03) 1px, transparent 1px);
  background-size: 36px 36px;
}

/* ═════════════════════════════════════════════
   ULTRA-CLEAN PURE MINIMALIST AMBIENT GLOW
═════════════════════════════════════════════ */
.perspective-container {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 1;
}

.pure-ambient-glow {
  position: absolute; top: 35%; left: 55%; width: 460px; height: 460px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(230,0,18,0.05) 0%, rgba(230,0,18,0.01) 50%, transparent 70%);
  border-radius: 50%; filter: blur(60px);
  animation: pureBreath 7s ease-in-out infinite alternate;
}

@keyframes pureBreath {
  0% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.7; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

.subtle-dot {
  position: absolute; border-radius: 50%;
  background: rgba(230,0,18,0.45);
  box-shadow: 0 0 12px rgba(230,0,18,0.3);
  animation: subtleFloat 9s ease-in-out infinite alternate;
}

.dot-1 { top: 30%; left: 75%; width: 8px; height: 8px; animation-delay: 0s; }
.dot-2 { bottom: 30%; left: 35%; width: 6px; height: 6px; animation-delay: 2s; }
.dot-3 { top: 70%; left: 80%; width: 5px; height: 5px; animation-delay: 4s; }

@keyframes subtleFloat {
  0% { transform: translateY(0); opacity: 0.3; }
  100% { transform: translateY(-20px); opacity: 0.75; }
}

.particle-node {
  position: absolute; border-radius: 50%;
  background: radial-gradient(circle, rgba(230,0,18,0.9) 0%, rgba(230,0,18,0.15) 70%, transparent 100%);
  box-shadow: 0 0 14px rgba(230,0,18,0.8);
}

.node-1 { top: 22%; left: 25%; width: 10px; height: 10px; animation: floatNode 6s ease-in-out infinite; }
.node-2 { top: 65%; left: 78%; width: 14px; height: 14px; animation: floatNode 8s ease-in-out infinite 1s; }
.node-3 { top: 78%; left: 30%; width: 8px; height: 8px; animation: floatNode 5s ease-in-out infinite 2s; }
.node-4 { top: 28%; left: 82%; width: 12px; height: 12px; animation: floatNode 7s ease-in-out infinite 3s; }
.node-5 { top: 48%; left: 55%; width: 16px; height: 16px; animation: floatNode 9s ease-in-out infinite 1.5s; }

@keyframes floatNode {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
  50% { transform: translateY(-35px) scale(1.4); opacity: 1; box-shadow: 0 0 24px rgba(230,0,18,1); }
}

@keyframes grid3dMove {
  0% { transform: perspective(600px) rotateX(68deg) translateY(0); }
  100% { transform: perspective(600px) rotateX(68deg) translateY(40px); }
}

/* 3D Rotating Mitsubishi Diamonds */
.threed-diamond {
  position: absolute; transform-style: preserve-3d;
}

.threed-diamond-1 {
  top: 15%; left: 68%; width: 70px; height: 70px;
  animation: float3d1 8s ease-in-out infinite alternate;
}

.threed-diamond-2 {
  bottom: 22%; left: 12%; width: 95px; height: 95px;
  animation: float3d2 11s ease-in-out infinite alternate;
}

.threed-diamond-3 {
  top: 55%; left: 75%; width: 55px; height: 55px;
  animation: float3d1 9s ease-in-out infinite alternate-reverse;
}

@keyframes float3d1 {
  0% { transform: translateY(0) rotateX(15deg) rotateY(0deg) rotateZ(0deg) scale(0.9); }
  50% { transform: translateY(-30px) rotateX(195deg) rotateY(180deg) rotateZ(90deg) scale(1.1); }
  100% { transform: translateY(0) rotateX(375deg) rotateY(360deg) rotateZ(180deg) scale(0.9); }
}

@keyframes float3d2 {
  0% { transform: translateY(0) rotateX(-20deg) rotateY(0deg) rotateZ(0deg) scale(1); }
  50% { transform: translateY(35px) rotateX(160deg) rotateY(-180deg) rotateZ(-90deg) scale(1.15); }
  100% { transform: translateY(0) rotateX(340deg) rotateY(-360deg) rotateZ(-180deg) scale(1); }
}

/* 3D Rhombus Cube Faces */
.rhombus-wrap {
  width: 100%; height: 100%; position: relative; transform-style: preserve-3d;
}
.rhombus-face {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(230,0,18,0.2) 0%, rgba(180,0,14,0.02) 100%);
  border: 1.5px solid rgba(230,0,18,0.35);
  box-shadow: 0 0 20px rgba(230,0,18,0.15), inset 0 0 10px rgba(230,0,18,0.1);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  backdrop-filter: blur(4px);
}
.rhombus-face-1 { transform: translateZ(20px); }
.rhombus-face-2 { transform: rotateY(90deg) translateZ(20px); }
.rhombus-face-3 { transform: rotateX(90deg) translateZ(20px); }

@keyframes orbPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.14; filter: blur(90px); }
  50% { transform: translate(-50%, -50%) scale(1.25); opacity: 0.24; filter: blur(110px); }
}

@keyframes laserSweep {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes dotPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 8px rgba(230,0,18,0.8); }
  50% { transform: scale(1.35); box-shadow: 0 0 16px rgba(230,0,18,1); }
}

.split-left-border-stripe {
  position: absolute; right: 0; top: 0; bottom: 0; width: 4px;
  background: linear-gradient(180deg, #E60012 0%, #a8000d 50%, #E60012 100%);
  background-size: 100% 200%;
  animation: laserSweep 6s ease-in-out infinite;
}

.left-logo-area {
  position: relative; z-index: 2;
}

.left-content-area {
  position: relative; z-index: 2; padding: 16px 0;
}
.left-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 12px; border-radius: 100px;
  background: rgba(230,0,18,0.06); border: 1px solid rgba(230,0,18,0.15);
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: #E60012; margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(230,0,18,0.08);
}
.left-h1 {
  font-size: clamp(32px, 3.2vw, 48px); font-weight: 900; line-height: 1.06;
  letter-spacing: -0.03em; color: #111115; margin-bottom: 14px;
}
.left-h1-highlight {
  color: #E60012; display: inline-block; position: relative;
}
.left-desc {
  font-size: 13px; font-weight: 450; line-height: 1.65; color: #555562;
  max-width: 420px; margin-bottom: 22px;
}

.left-features {
  display: flex; flex-direction: column; gap: 10px;
}
.left-feature-item {
  display: flex; align-items: center; gap: 8px;
  font-size: 12.5px; font-weight: 600; color: #22222a;
}
.left-feature-icon {
  color: #E60012; flex-shrink: 0;
}

.left-stats-bar {
  position: relative; z-index: 2;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
  padding-top: 24px; border-top: 1px solid #EAEAEF;
}
.left-stat-card {
  padding: 14px; border-radius: 14px;
  background: linear-gradient(135deg, #E60012 0%, #ba000e 100%);
  border: 1px solid rgba(230,0,18,0.3);
  box-shadow: 0 4px 16px rgba(230,0,18,0.25);
  transition: all 0.3s ease;
}
.left-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(230,0,18,0.4);
}
.left-stat-val {
  font-size: 22px; font-weight: 900; color: #FFFFFF; line-height: 1; letter-spacing: -0.02em;
}
.left-stat-lbl {
  font-size: 9px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  color: rgba(255,255,255,0.85); margin-top: 5px;
}
.left-stat-line {
  height: 2px; border-radius: 1px; background: linear-gradient(90deg, #FFFFFF, rgba(255,255,255,0.2));
  margin-top: 8px; width: 60%;
}

/* ═════════════════════════════════════════════
   RIGHT PANEL — DARK FORM WITH FROSTED GLASS CARD
═════════════════════════════════════════════ */
.split-right {
  position: relative;
  background: #08080a;
  display: flex; align-items: center; justify-content: center;
  padding: 24px 20px;
  height: 100vh;
  overflow: hidden;
}

.split-right-dots {
  position: absolute; inset: 0; pointer-events: none;
  background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size: 28px 28px;
}

.right-orb {
  position: absolute; width: 480px; height: 480px; border-radius: 50%;
  background: radial-gradient(circle, rgba(230,0,18,0.18) 0%, transparent 70%);
  top: 50%; left: 50%; transform: translate(-50%, -50%);
  pointer-events: none; filter: blur(90px);
  animation: orbPulse 8s ease-in-out infinite;
}

.right-form-container {
  width: 100%; max-width: 520px; position: relative; z-index: 2;
}

.right-glass-card {
  position: relative; overflow: hidden;
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  background: linear-gradient(145deg,
    rgba(255,255,255,0.08) 0%,
    rgba(255,255,255,0.035) 50%,
    rgba(255,255,255,0.06) 100%
  );
  border: 1px solid rgba(255,255,255,0.13);
  border-radius: 28px;
  padding: 42px 38px;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.04),
    0 30px 80px rgba(0,0,0,0.8),
    0 0 60px rgba(230,0,18,0.12),
    inset 0 1px 0 rgba(255,255,255,0.15);
}

.right-card-laser {
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent 5%, rgba(230,0,18,0.4) 25%, #E60012 50%, rgba(230,0,18,0.4) 75%, transparent 95%);
  box-shadow: 0 0 14px rgba(230,0,18,0.6);
}

.right-corner {
  position: absolute; width: 18px; height: 18px; pointer-events: none;
}
.right-corner-tl { top: 14px; left: 14px; border-top: 1.5px solid rgba(230,0,18,0.6); border-left: 1.5px solid rgba(230,0,18,0.6); border-radius: 4px 0 0 0; }
.right-corner-tr { top: 14px; right: 14px; border-top: 1.5px solid rgba(230,0,18,0.6); border-right: 1.5px solid rgba(230,0,18,0.6); border-radius: 0 4px 0 0; }
.right-corner-bl { bottom: 14px; left: 14px; border-bottom: 1.5px solid rgba(230,0,18,0.6); border-left: 1.5px solid rgba(230,0,18,0.6); border-radius: 0 0 0 4px; }
.right-corner-br { bottom: 14px; right: 14px; border-bottom: 1.5px solid rgba(230,0,18,0.6); border-right: 1.5px solid rgba(230,0,18,0.6); border-radius: 0 0 4px 0; }

.right-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 14px; border-radius: 100px;
  background: rgba(230,0,18,0.06); border: 1px solid rgba(230,0,18,0.2);
  margin-bottom: 20px;
}
.right-badge-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #E60012;
  animation: dotPulse 2s ease-in-out infinite;
}
.right-badge-txt {
  font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(230,0,18,0.85);
}

.right-h2 {
  font-size: 26px; font-weight: 900; color: #fff; letter-spacing: -0.02em; margin-bottom: 6px;
}
.right-sub {
  font-size: 12.5px; color: rgba(201,205,211,0.45); font-weight: 450; margin-bottom: 24px;
}

.form-field { margin-bottom: 15px; }
.form-label {
  display: block; font-size: 9.5px; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; color: rgba(201,205,211,0.45); margin-bottom: 7px;
}
.form-input-wrap { position: relative; }
.form-input-icon {
  position: absolute; left: 15px; top: 50%; transform: translateY(-50%);
  color: rgba(201,205,211,0.35); pointer-events: none; transition: color 0.25s; display: flex;
}
.form-input-wrap:focus-within .form-input-icon { color: #E60012; }
.form-input {
  width: 100%; padding: 13.5px 14px 13.5px 44px;
  background: rgba(255,255,255,0.045);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 13px; font-size: 13.5px; font-weight: 500; color: #fff;
  outline: none; transition: all 0.25s; font-family: 'Inter', sans-serif;
}
.form-input::placeholder { color: rgba(201,205,211,0.22); }
.form-input:focus {
  border-color: rgba(230,0,18,0.55);
  background: rgba(230,0,18,0.06);
  box-shadow: 0 0 0 3px rgba(230,0,18,0.12), 0 2px 16px rgba(230,0,18,0.08);
}
.form-input:-webkit-autofill,
.form-input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px #100f13 inset, 0 0 0 3px rgba(230,0,18,0.12);
  -webkit-text-fill-color: #fff; transition: background-color 9999s;
}
.form-pw-btn {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; padding: 4px;
  color: rgba(201,205,211,0.35); display: flex; transition: color 0.25s; border-radius: 6px;
}
.form-pw-btn:hover { color: rgba(201,205,211,0.75); }

.form-error {
  display: flex; align-items: center; gap: 8px;
  background: rgba(230,0,18,0.08); border: 1px solid rgba(230,0,18,0.3);
  border-radius: 10px; padding: 10px 12px; margin-bottom: 12px;
  font-size: 12px; color: #ff4444; font-weight: 500;
}

.form-submit {
  width: 100%; margin-top: 4px; padding: 14px;
  border-radius: 13px; border: none;
  background: linear-gradient(135deg, #E60012 0%, #c0000f 100%);
  color: #fff; font-size: 12.5px; font-weight: 900;
  letter-spacing: 0.08em; text-transform: uppercase;
  cursor: pointer; position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 4px 20px rgba(230,0,18,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
  font-family: 'Inter', sans-serif;
}
.form-submit::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
}
.form-submit:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 10px 32px rgba(230,0,18,0.55);
}
.form-submit:active:not(:disabled) { transform: scale(0.99); }
.form-submit:disabled { opacity: 0.65; cursor: not-allowed; }
.form-spin {
  display: inline-block; width: 13px; height: 13px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  border-radius: 50%; animation: spin 0.65s linear infinite;
  margin-right: 6px; vertical-align: middle;
}
@keyframes spin { to { transform: rotate(360deg); } }

.form-divider {
  display: flex; align-items: center; gap: 10px; margin: 16px 0 12px;
}
.form-div-line {
  flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
}
.form-div-txt {
  font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(201,205,211,0.25);
}

.form-demo {
  background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px; padding: 12px 14px;
}
.form-demo-title {
  font-size: 8.5px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(201,205,211,0.3); margin-bottom: 6px;
}
.form-demo-row {
  display: grid; grid-template-columns: 70px 1fr; font-size: 11px; margin-bottom: 3px; gap: 6px;
}
.form-demo-key { color: rgba(201,205,211,0.35); font-weight: 500; }
.form-demo-val { color: rgba(201,205,211,0.7); font-weight: 600; }

.form-security {
  margin-top: 14px; display: flex; align-items: center; justify-content: center; gap: 6px;
  font-size: 9.5px; color: rgba(201,205,211,0.22); font-weight: 500; letter-spacing: 0.05em;
}
`;e.s(["default",0,function(){let e=(0,a.useRouter)(),[s,b]=(0,r.useState)(""),[h,u]=(0,r.useState)(""),[y,v]=(0,r.useState)(!1),[w,k]=(0,r.useState)(""),[j,N]=(0,r.useState)(!1),z=(0,r.useRef)(null);async function E(t){t.preventDefault(),k(""),N(!0),await new Promise(e=>setTimeout(e,800));let r=(0,x.login)(s,h);N(!1),r.success?e.push("/admin"):k(r.error??"Authentication failed")}return(0,r.useEffect)(()=>{z.current?.focus()},[]),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("style",{dangerouslySetInnerHTML:{__html:f}}),(0,t.jsxs)("div",{className:"split-root",children:[(0,t.jsxs)("div",{className:"split-left",children:[(0,t.jsx)("div",{className:"split-left-bg-pattern"}),(0,t.jsx)("div",{className:"split-left-border-stripe"}),(0,t.jsxs)("div",{className:"perspective-container",children:[(0,t.jsx)("div",{className:"pure-ambient-glow"}),(0,t.jsx)("div",{className:"subtle-dot dot-1"}),(0,t.jsx)("div",{className:"subtle-dot dot-2"}),(0,t.jsx)("div",{className:"subtle-dot dot-3"})]}),(0,t.jsx)("div",{className:"left-logo-area",children:(0,t.jsx)(i.default,{src:"/mitsubishi-logo.png",alt:"Mitsubishi Electric",width:240,height:68,priority:!0,style:{objectFit:"contain",objectPosition:"left center",display:"block"}})}),(0,t.jsxs)("div",{className:"left-content-area",children:[(0,t.jsx)("div",{className:"left-badge",children:"CMS Platform"}),(0,t.jsxs)("h1",{className:"left-h1",children:["Manage your ",(0,t.jsx)("span",{className:"left-h1-highlight",children:"content"}),",",(0,t.jsx)("br",{}),"your way."]}),(0,t.jsx)("p",{className:"left-desc",children:"Unified enterprise control over events, resources, campaigns, brand assets, and team communications — all in one intelligent workspace."}),(0,t.jsx)("div",{className:"left-features",children:["Real-time content module management","Enterprise role-based access control","Centralized asset repository & media library"].map(e=>(0,t.jsxs)("div",{className:"left-feature-item",children:[(0,t.jsx)(m,{className:"left-feature-icon",size:15}),(0,t.jsx)("span",{children:e})]},e))})]}),(0,t.jsx)("div",{className:"left-stats-bar",children:[{val:"96+",lbl:"Content Assets"},{val:"11",lbl:"Active Modules"},{val:"2,480+",lbl:"Digital Files"}].map(e=>(0,t.jsxs)("div",{className:"left-stat-card",children:[(0,t.jsx)("div",{className:"left-stat-val",children:e.val}),(0,t.jsx)("div",{className:"left-stat-lbl",children:e.lbl}),(0,t.jsx)("div",{className:"left-stat-line"})]},e.lbl))})]}),(0,t.jsxs)("div",{className:"split-right",children:[(0,t.jsx)("div",{className:"split-right-dots"}),(0,t.jsx)("div",{className:"right-orb"}),(0,t.jsx)("div",{className:"right-form-container",children:(0,t.jsxs)("div",{className:"right-glass-card",children:[(0,t.jsx)("div",{className:"right-card-laser"}),(0,t.jsx)("div",{className:"right-corner right-corner-tl"}),(0,t.jsx)("div",{className:"right-corner right-corner-tr"}),(0,t.jsx)("div",{className:"right-corner right-corner-bl"}),(0,t.jsx)("div",{className:"right-corner right-corner-br"}),(0,t.jsx)("div",{style:{textAlign:"center",marginBottom:22},children:(0,t.jsx)(i.default,{src:"/mitsubishi-logo.png",alt:"Mitsubishi Electric",width:210,height:60,priority:!0,style:{objectFit:"contain",display:"block",margin:"0 auto"}})}),(0,t.jsx)("div",{style:{textAlign:"center",marginBottom:18},children:(0,t.jsxs)("div",{className:"right-badge",style:{margin:0},children:[(0,t.jsx)("div",{className:"right-badge-dot"}),(0,t.jsx)("span",{className:"right-badge-txt",children:"Secure Admin Access"})]})}),(0,t.jsx)("h2",{className:"right-h2",children:"Welcome back"}),(0,t.jsx)("p",{className:"right-sub",children:"Sign in to access your dashboard"}),(0,t.jsxs)("form",{onSubmit:E,children:[(0,t.jsxs)("div",{className:"form-field",children:[(0,t.jsx)("label",{className:"form-label",children:"Email Address"}),(0,t.jsxs)("div",{className:"form-input-wrap",children:[(0,t.jsx)(d.Mail,{className:"form-input-icon",size:15}),(0,t.jsx)("input",{ref:z,type:"email",value:s,onChange:e=>b(e.target.value),placeholder:"admin@mitsubishi-electric.com",required:!0,className:"form-input"})]})]}),(0,t.jsxs)("div",{className:"form-field",children:[(0,t.jsx)("label",{className:"form-label",children:"Password"}),(0,t.jsxs)("div",{className:"form-input-wrap",children:[(0,t.jsx)(l.Lock,{className:"form-input-icon",size:15}),(0,t.jsx)("input",{type:y?"text":"password",value:h,onChange:e=>u(e.target.value),placeholder:"••••••••••",required:!0,className:"form-input",style:{paddingRight:44}}),(0,t.jsx)("button",{type:"button",onClick:()=>v(e=>!e),className:"form-pw-btn",children:y?(0,t.jsx)(n,{size:14}):(0,t.jsx)(o.Eye,{size:14})})]})]}),w&&(0,t.jsxs)("div",{className:"form-error",children:[(0,t.jsx)(p,{size:14,style:{flexShrink:0}}),w]}),(0,t.jsx)("button",{type:"submit",disabled:j,className:"form-submit",children:j?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("span",{className:"form-spin"})," Authenticating..."]}):(0,t.jsxs)(t.Fragment,{children:["Sign In to CMS",(0,t.jsx)(c,{size:15})]})})]}),(0,t.jsxs)("div",{className:"form-divider",children:[(0,t.jsx)("div",{className:"form-div-line"}),(0,t.jsx)("span",{className:"form-div-txt",children:"Demo"}),(0,t.jsx)("div",{className:"form-div-line"})]}),(0,t.jsxs)("div",{className:"form-demo",children:[(0,t.jsx)("div",{className:"form-demo-title",children:"Test Credentials"}),(0,t.jsxs)("div",{className:"form-demo-row",children:[(0,t.jsx)("span",{className:"form-demo-key",children:"Email:"}),(0,t.jsx)("span",{className:"form-demo-val",children:"admin@mitsubishi-electric.com"})]}),(0,t.jsxs)("div",{className:"form-demo-row",children:[(0,t.jsx)("span",{className:"form-demo-key",children:"Password:"}),(0,t.jsx)("span",{className:"form-demo-val",children:"mitsubishi@2026"})]})]}),(0,t.jsxs)("div",{className:"form-security",children:[(0,t.jsx)(g.ShieldCheck,{size:11}),"256-bit SSL Encrypted · Enterprise Security"]})]})})]})]})]})}],7156)}]);