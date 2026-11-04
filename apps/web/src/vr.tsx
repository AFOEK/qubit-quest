import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {VRButton} from 'three/addons/webxr/VRButton.js';
import {apply,initial,describe,type GateName} from './quantum';
export default function Immersive({onClose}:{onClose:()=>void}){
 const mount=useRef<HTMLDivElement>(null), vector=useRef(new THREE.Vector3(0,1,0));
 const [gates,setGates]=useState<GateName[]>([]),[error,setError]=useState('');
 const state=gates.reduce((s,g)=>apply(s,g),initial()),d=describe(state);
 vector.current.set(d.x,d.z,-d.y);
 useEffect(()=>{
  if(!mount.current)return;
  const target=mount.current;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true})}catch{setError('WebGL is unavailable. Use the gate explorer or enable graphics acceleration.');return}
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.xr.enabled=true;target.appendChild(renderer.domElement);
  const scene=new THREE.Scene();scene.background=new THREE.Color('#162d28');
  const camera=new THREE.PerspectiveCamera(55,1,.1,100);camera.position.set(0,1.6,3.8);
  const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,1.5,-.5);controls.enableDamping=true;
  scene.add(new THREE.HemisphereLight(0xffffff,0x304030,3));
  const group=new THREE.Group();group.position.set(0,1.5,-.5);scene.add(group);
  const sphere=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),new THREE.MeshBasicMaterial({color:0x8bbfa4,wireframe:true,transparent:true,opacity:.13}));group.add(sphere);
  for(const axis of [new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,1)])group.add(new THREE.ArrowHelper(axis,new THREE.Vector3(),1.2,0x7d9a88,.06,.04));
  const arrow=new THREE.ArrowHelper(new THREE.Vector3(0,1,0),new THREE.Vector3(),1,0xd9f4ad,.17,.09);group.add(arrow);
  const floor=new THREE.GridHelper(12,24,0x4b6658,0x29483b);scene.add(floor);
  // In-headset controllers cycle the same gates as the desktop controls.
  const cycle:GateName[]=['H','X','S'];let cursor=0;
  const select=()=>setGates(previous=>[...previous.slice(-31),cycle[cursor++%cycle.length]]);
  for(let i=0;i<2;i++){const controller=renderer.xr.getController(i);controller.addEventListener('select',select);scene.add(controller)}
  const vrButton=VRButton.createButton(renderer);vrButton.style.bottom='150px';target.appendChild(vrButton);
  function resize(){const w=target.clientWidth,h=target.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()}
  resize();window.addEventListener('resize',resize);
  renderer.setAnimationLoop(()=>{controls.update();const length=vector.current.length();arrow.visible=length>1e-8;if(arrow.visible){arrow.setDirection(vector.current.clone().normalize());arrow.setLength(length,.17,.09)}renderer.render(scene,camera)});
  return()=>{window.removeEventListener('resize',resize);renderer.setAnimationLoop(null);void renderer.xr.getSession()?.end();controls.dispose();scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Line){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose()}});renderer.dispose();target.replaceChildren()};
 },[]);
 return <div className="vr-overlay" role="dialog" aria-modal="true" aria-label="Immersive qubit lab"><div ref={mount} className="vr-canvas"/><div className="vr-controls"><p>{error||'Drag to orbit. Green axis is |0⟩ above and |1⟩ below. Headset trigger cycles H, X, S.'}</p>{(['H','X','S'] as GateName[]).map(g=><button key={g} onClick={()=>setGates([...gates.slice(-31),g])}>Apply {g}</button>)}<button onClick={()=>setGates([])}>Reset</button><button onClick={onClose}>Close lab</button><p>Z-basis: 0 → {(d.p0*100).toFixed(0)}% · 1 → {(d.p1*100).toFixed(0)}% · {gates.length} gates</p></div></div>
}
