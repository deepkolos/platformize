"use strict";var e=require("../../chunks/three-platformize.js"),t=require("../../chunks/screenshot.js");class r extends e.Loader{constructor(e){super(e)}load(t,r,a,o){const s=this,n=new e.FileLoader(s.manager);n.setPath(s.path),n.setResponseType("arraybuffer"),n.setRequestHeader(s.requestHeader),n.setWithCredentials(s.withCredentials),n.load(t,(function(e){try{r(s.parse(e))}catch(e){o?o(e):console.error(e),s.manager.itemError(t)}}),a,o)}parse(r){function a(e,t){const r=e.length,a=new Float32Array(r+t.length);return a.set(e),a.set(t,r),a}var o=e.LoaderUtils.decodeText(new Uint8Array(r,0,250)).split("\n");return-1!==o[0].indexOf("xml")?function(r){function o(e){var t,r,a,o,s,n,i="undefined"!=typeof Uint8Array?Uint8Array:Array,l=[],d=[],h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",c=h.length;for(t=0;t<c;t++)l[t]=h[t];for(t=0;t<c;++t)d[h.charCodeAt(t)]=t;if(d["-".charCodeAt(0)]=62,d["_".charCodeAt(0)]=63,(c=e.length)%4>0)throw new Error("Invalid string. Length must be a multiple of 4");n=new i(3*c/4-(s="="===e[c-2]?2:"="===e[c-1]?1:0)),a=s>0?c-4:c;var u=0;for(t=0,r=0;t<a;t+=4,r+=3)o=d[e.charCodeAt(t)]<<18|d[e.charCodeAt(t+1)]<<12|d[e.charCodeAt(t+2)]<<6|d[e.charCodeAt(t+3)],n[u++]=(16711680&o)>>16,n[u++]=(65280&o)>>8,n[u++]=255&o;return 2===s?(o=d[e.charCodeAt(t)]<<2|d[e.charCodeAt(t+1)]>>4,n[u++]=255&o):1===s&&(o=d[e.charCodeAt(t)]<<10|d[e.charCodeAt(t+1)]<<4|d[e.charCodeAt(t+2)]>>2,n[u++]=o>>8&255,n[u++]=255&o),n}function s(e,r){var s,n,l,d,h=0;if("UInt64"===i.attributes.header_type?h=8:"UInt32"===i.attributes.header_type&&(h=4),"binary"===e.attributes.format&&r){var c,u,p,f,w,m;if("Float32"===e.attributes.type)var A=new Float32Array;else"Int64"===e.attributes.type&&(A=new Int32Array);u=(c=o(e["#text"]))[0];for(var g=1;g<h-1;g++)u|=c[g]<<g*h;for(f=(u+3)*h,m=f+=f%3>0?3-f%3:0,(w=[]).push(m),p=3*h,g=0;g<u;g++){for(var y=c[g*h+p],v=1;v<h-1;v++)y|=c[g*h+p+v]<<8*v;m+=y,w.push(m)}for(g=0;g<w.length-1;g++)L=t.unzlibSync(c.slice(w[g],w[g+1])).buffer,"Float32"===e.attributes.type?A=a(A,L=new Float32Array(L)):"Int64"===e.attributes.type&&(n=L=new Int32Array(L),l=void 0,d=void 0,l=(s=A).length,(d=new Int32Array(l+n.length)).set(s),d.set(n,l),A=d);delete e["#text"],"Int64"===e.attributes.type&&"binary"===e.attributes.format&&(A=A.filter((function(e,t){if(t%2!=1)return!0})))}else{if("binary"!==e.attributes.format||r)if(e["#text"])var L=e["#text"].split(/\s+/).filter((function(e){if(""!==e)return e}));else L=new Int32Array(0).buffer;else L=(L=o(e["#text"])).slice(h).buffer;delete e["#text"],"Float32"===e.attributes.type?A=new Float32Array(L):"Int32"===e.attributes.type?A=new Int32Array(L):"Int64"===e.attributes.type&&(A=new Int32Array(L),"binary"===e.attributes.format&&(A=A.filter((function(e,t){if(t%2!=1)return!0}))))}return A}var n=null;if(e.$window.DOMParser)try{n=(new e.$DOMParser).parseFromString(r,"text/xml")}catch(e){n=null}else{if(!e.$window.ActiveXObject)throw new Error("Cannot parse xml string!");try{if((n=new ActiveXObject("Microsoft.XMLDOM")).async=!1,!n.loadXML())throw new Error(n.parseError.reason+n.parseError.srcText)}catch(e){n=null}}var i=function e(t){var r={};if(1===t.nodeType){if(t.attributes&&t.attributes.length>0){r.attributes={};for(var a=0;a<t.attributes.length;a++){var o=t.attributes.item(a);r.attributes[o.nodeName]=o.nodeValue.trim()}}}else 3===t.nodeType&&(r=t.nodeValue.trim());if(t.hasChildNodes())for(var s=0;s<t.childNodes.length;s++){var n=t.childNodes.item(s),i=n.nodeName;if(void 0===r[i])""!==(d=e(n))&&(r[i]=d);else{if(void 0===r[i].push){var l=r[i];r[i]=[l]}var d;""!==(d=e(n))&&r[i].push(d)}}return r}(n.documentElement),l=[],d=[],h=[];if(i.PolyData){for(var c=i.PolyData.Piece,u=i.attributes.hasOwnProperty("compressor"),p=["PointData","Points","Strips","Polys"],f=0,w=p.length;f<w;){var m=c[p[f]];if(m&&m.DataArray){if("[object Array]"===Object.prototype.toString.call(m.DataArray))var A=m.DataArray;else A=[m.DataArray];for(var g=0,y=A.length;g<y;)"#text"in A[g]&&A[g]["#text"].length>0&&(A[g].text=s(A[g],u)),g++;switch(p[f]){case"PointData":var v=parseInt(c.attributes.NumberOfPoints),L=m.attributes.Normals;if(v>0)for(var b=0,x=A.length;b<x;b++)if(L===A[b].attributes.Name){var D=A[b].attributes.NumberOfComponents;(d=new Float32Array(v*D)).set(A[b].text,0)}break;case"Points":(v=parseInt(c.attributes.NumberOfPoints))>0&&(D=m.DataArray.attributes.NumberOfComponents,(l=new Float32Array(v*D)).set(m.DataArray.text,0));break;case"Strips":var T=parseInt(c.attributes.NumberOfStrips);if(T>0){var I=new Int32Array(m.DataArray[0].text.length),C=new Int32Array(m.DataArray[1].text.length);I.set(m.DataArray[0].text,0),C.set(m.DataArray[1].text,0);var S=T+I.length;h=new Uint32Array(3*S-9*T);var P=0;for(b=0,x=T;b<x;b++){for(var F=[],M=0,O=C[b],E=0;M<O-E;M++)F.push(I[M]),b>0&&(E=C[b-1]);var R=0;for(O=C[b],E=0;R<O-E-2;R++)R%2?(h[P++]=F[R],h[P++]=F[R+2],h[P++]=F[R+1]):(h[P++]=F[R],h[P++]=F[R+1],h[P++]=F[R+2]),b>0&&(E=C[b-1])}}break;case"Polys":var B=parseInt(c.attributes.NumberOfPolys);if(B>0){I=new Int32Array(m.DataArray[0].text.length),C=new Int32Array(m.DataArray[1].text.length),I.set(m.DataArray[0].text,0),C.set(m.DataArray[1].text,0),S=B+I.length,h=new Uint32Array(3*S-9*B),P=0;var G=0;for(b=0,x=B,E=0;b<x;){var N=[];for(M=0,O=C[b];M<O-E;)N.push(I[G++]),M++;for(R=1;R<O-E-1;)h[P++]=N[0],h[P++]=N[R],h[P++]=N[R+1],R++;E=C[++b-1]}}}}f++}var k=new e.BufferGeometry;return k.setIndex(new e.BufferAttribute(h,1)),k.setAttribute("position",new e.BufferAttribute(l,3)),d.length===l.length&&k.setAttribute("normal",new e.BufferAttribute(d,3)),k}throw new Error("Unsupported DATASET type")}(e.LoaderUtils.decodeText(r)):o[2].includes("ASCII")?function(t){var r,a=[],o=[],s=[],n=[],i=/^[^\d.\s-]+/,l=/(\-?\d+\.?[\d\-\+e]*)\s+(\-?\d+\.?[\d\-\+e]*)\s+(\-?\d+\.?[\d\-\+e]*)/g,d=/^(\d+)\s+([\s\d]*)/,h=/^POINTS /,c=/^POLYGONS /,u=/^TRIANGLE_STRIPS /,p=/^POINT_DATA[ ]+(\d+)/,f=/^CELL_DATA[ ]+(\d+)/,w=/^COLOR_SCALARS[ ]+(\w+)[ ]+3/,m=/^NORMALS[ ]+(\w+)[ ]+(\w+)/,A=!1,g=!1,y=!1,v=!1,L=!1,b=!1,x=!1,D=t.split("\n");for(var T in D){var I=D[T].trim();if(0===I.indexOf("DATASET")){var C=I.split(" ")[1];if("POLYDATA"!==C)throw new Error("Unsupported DATASET type: "+C)}else if(A)for(;null!==(r=l.exec(I))&&null===i.exec(I);){var S=parseFloat(r[1]),P=parseFloat(r[2]),F=parseFloat(r[3]);o.push(S,P,F)}else if(g){if(null!==(r=d.exec(I))){var M=parseInt(r[1]),O=r[2].split(/\s+/);if(M>=3)for(var E=parseInt(O[0]),R=1,B=0;B<M-2;++B)G=parseInt(O[R]),N=parseInt(O[R+1]),a.push(E,G,N),R++}}else if(y){if(null!==(r=d.exec(I))){var G,N;if(M=parseInt(r[1]),O=r[2].split(/\s+/),M>=3)for(B=0;B<M-2;B++)B%2==1?(E=parseInt(O[B]),G=parseInt(O[B+2]),N=parseInt(O[B+1]),a.push(E,G,N)):(E=parseInt(O[B]),G=parseInt(O[B+1]),N=parseInt(O[B+2]),a.push(E,G,N))}}else if(v||L)if(b)for(;null!==(r=l.exec(I))&&null===i.exec(I);){var k=parseFloat(r[1]),U=parseFloat(r[2]),V=parseFloat(r[3]);s.push(k,U,V)}else if(x)for(;null!==(r=l.exec(I))&&null===i.exec(I);){var z=parseFloat(r[1]),X=parseFloat(r[2]),H=parseFloat(r[3]);n.push(z,X,H)}null!==c.exec(I)?(g=!0,A=!1,y=!1):null!==h.exec(I)?(g=!1,A=!0,y=!1):null!==u.exec(I)?(g=!1,A=!1,y=!0):null!==p.exec(I)?(v=!0,A=!1,g=!1,y=!1):null!==f.exec(I)?(L=!0,A=!1,g=!1,y=!1):null!==w.exec(I)?(b=!0,x=!1,A=!1,g=!1,y=!1):null!==m.exec(I)&&(x=!0,b=!1,A=!1,g=!1,y=!1)}var K=new e.BufferGeometry;if(K.setIndex(a),K.setAttribute("position",new e.Float32BufferAttribute(o,3)),n.length===o.length&&K.setAttribute("normal",new e.Float32BufferAttribute(n,3)),s.length!==a.length)s.length===o.length&&K.setAttribute("color",new e.Float32BufferAttribute(s,3));else{var W=(K=K.toNonIndexed()).attributes.position.count/3;if(s.length===3*W){var _=[];for(T=0;T<W;T++)k=s[3*T+0],U=s[3*T+1],V=s[3*T+2],_.push(k,U,V),_.push(k,U,V),_.push(k,U,V);K.setAttribute("color",new e.Float32BufferAttribute(_,3))}}return K}(e.LoaderUtils.decodeText(r)):function(t){var r,a,o,s,n,i,l,d=new Uint8Array(t),h=new DataView(t),c=[],u=[],p=[],f=0;function w(e,t){for(var r=t,a=e[r],o=[];10!==a;)o.push(String.fromCharCode(a)),a=e[++r];return{start:t,end:r,next:r+1,parsedString:o.join("")}}for(;;){if(0===(l=(i=w(d,f)).parsedString).indexOf("DATASET")){var m=l.split(" ")[1];if("POLYDATA"!==m)throw new Error("Unsupported DATASET type: "+m)}else if(0===l.indexOf("POINTS")){for(r=4*(s=parseInt(l.split(" ")[1],10))*3,c=new Float32Array(3*s),a=i.next,o=0;o<s;o++)c[3*o]=h.getFloat32(a,!1),c[3*o+1]=h.getFloat32(a+4,!1),c[3*o+2]=h.getFloat32(a+8,!1),a+=12;i.next=i.next+r+1}else if(0===l.indexOf("TRIANGLE_STRIPS")){var A=parseInt(l.split(" ")[1],10);r=4*(b=parseInt(l.split(" ")[2],10)),p=new Uint32Array(3*b-9*A);var g=0;for(a=i.next,o=0;o<A;o++){var y=h.getInt32(a,!1),v=[];for(a+=4,n=0;n<y;n++)v.push(h.getInt32(a,!1)),a+=4;for(var L=0;L<y-2;L++)L%2?(p[g++]=v[L],p[g++]=v[L+2],p[g++]=v[L+1]):(p[g++]=v[L],p[g++]=v[L+1],p[g++]=v[L+2])}i.next=i.next+r+1}else if(0===l.indexOf("POLYGONS")){var b;for(A=parseInt(l.split(" ")[1],10),r=4*(b=parseInt(l.split(" ")[2],10)),p=new Uint32Array(3*b-9*A),g=0,a=i.next,o=0;o<A;o++){for(y=h.getInt32(a,!1),v=[],a+=4,n=0;n<y;n++)v.push(h.getInt32(a,!1)),a+=4;for(L=1;L<y-1;L++)p[g++]=v[0],p[g++]=v[L],p[g++]=v[L+1]}i.next=i.next+r+1}else if(0===l.indexOf("POINT_DATA")){for(s=parseInt(l.split(" ")[1],10),i=w(d,i.next),r=4*s*3,u=new Float32Array(3*s),a=i.next,o=0;o<s;o++)u[3*o]=h.getFloat32(a,!1),u[3*o+1]=h.getFloat32(a+4,!1),u[3*o+2]=h.getFloat32(a+8,!1),a+=12;i.next=i.next+r}if((f=i.next)>=d.byteLength)break}var x=new e.BufferGeometry;return x.setIndex(new e.BufferAttribute(p,1)),x.setAttribute("position",new e.BufferAttribute(c,3)),u.length===c.length&&x.setAttribute("normal",new e.BufferAttribute(u,3)),x}(r)}}class a extends t.Demo{async init(){const a=new e.MeshLambertMaterial({color:1193046,side:e.DoubleSide}),o=new r,s=await o.loadAsync(t.baseUrl+"models/vtk/bunny.vtk");s.center(),s.computeVertexNormals();const n=new e.Mesh(s,a);console.log(s),this.add(new e.DirectionalLight(16777215,1)),this.add(new e.AmbientLight(16777215,1)),this.add(n),this.deps.camera.position.z=.5,this.deps.scene.position.z=0,this.addControl()}update(){!function(e){let t,r=e[0],a=1;for(;a<e.length;){const o=e[a],s=e[a+1];if(a+=2,("optionalAccess"===o||"optionalCall"===o)&&null==r)return;"access"===o||"optionalAccess"===o?(t=r,r=s(r)):"call"!==o&&"optionalCall"!==o||(r=s(((...e)=>r.call(t,...e))),t=void 0)}}([this,"access",e=>e.orbitControl,"optionalAccess",e=>e.update,"call",e=>e()])}dispose(){this.reset()}}class o extends t.Demo{async init(){const{camera:t,renderer:r,scene:a}=this.deps;t.position.set(0,10,30),a.fog=new e.Fog(13421772,50,100);const o=new e.SpotLight(8947848);o.name="Spot Light",o.angle=Math.PI/5,o.penumbra=.3,o.position.set(8,10,5),o.castShadow=!0,o.shadow.camera.near=8,o.shadow.camera.far=200,o.shadow.mapSize.width=256,o.shadow.mapSize.height=256,o.shadow.bias=-.002,o.shadow.radius=4;const s=new e.DirectionalLight(16777215,1);s.name="Dir. Light",s.position.set(3,12,17),s.castShadow=!0,s.shadow.camera.near=.1,s.shadow.camera.far=500,s.shadow.camera.right=17,s.shadow.camera.left=-17,s.shadow.camera.top=17,s.shadow.camera.bottom=-17,s.shadow.mapSize.width=512,s.shadow.mapSize.height=512,s.shadow.radius=4,s.shadow.bias=-5e-4;const n=new e.Group;n.add(s),this.addControl(),this.add(new e.AmbientLight(4473924)),this.add(n),this.add(o),this.add(s),this.dirLight=s,this.dirGroup=n;let i=new e.MeshPhongMaterial({color:10066329,shininess:0,specular:2236962});{const t=new e.TorusKnotGeometry(25,8,75,20),r=new e.Mesh(t,i);r.scale.multiplyScalar(1/18),r.position.y=3,r.castShadow=!0,r.receiveShadow=!0,this.add(r),this.torusKnot=r}{const t=new e.CylinderGeometry(.75,.75,7,32),r=new e.Mesh(t,i);r.position.set(10,3.5,10),r.castShadow=!0,r.receiveShadow=!0;const a=r.clone();a.position.set(10,3.5,-10);const o=r.clone();o.position.set(-10,3.5,10);const s=r.clone();s.position.set(-10,3.5,-10),this.add(r),this.add(a),this.add(o),this.add(s)}{const t=new e.PlaneGeometry(200,200);i=new e.MeshPhongMaterial({color:10066329,shininess:0,specular:1118481});const r=new e.Mesh(t,i);r.rotation.x=-Math.PI/2,r.scale.multiplyScalar(3),r.castShadow=!0,r.receiveShadow=!0,this.add(r)}r.shadowMap.enabled=!0,r.shadowMap.type=e.VSMShadowMap,r.setClearColor(13421772,1),this.orbitControl.target.set(0,2,0)}update(){!function(e){let t,r=e[0],a=1;for(;a<e.length;){const o=e[a],s=e[a+1];if(a+=2,("optionalAccess"===o||"optionalCall"===o)&&null==r)return;"access"===o||"optionalAccess"===o?(t=r,r=s(r)):"call"!==o&&"optionalCall"!==o||(r=s(((...e)=>r.call(t,...e))),t=void 0)}}([this,"access",e=>e.orbitControl,"optionalAccess",e=>e.update,"call",e=>e()]);const e=this.deps.clock.getDelta(),t=this.deps.clock.getElapsedTime();this.torusKnot.rotation.x+=.25*e,this.torusKnot.rotation.y+=2*e,this.torusKnot.rotation.z+=1*e,this.dirGroup.rotation.y+=.7*e,this.dirLight.position.z=17+5*Math.sin(.001*t)}dispose(){this.reset(),this.dirLight=null,this.dirGroup=null,this.torusKnot=null}}function s(e){let t,r=e[0],a=1;for(;a<e.length;){const o=e[a],s=e[a+1];if(a+=2,("optionalAccess"===o||"optionalCall"===o)&&null==r)return;"access"===o||"optionalAccess"===o?(t=r,r=s(r)):"call"!==o&&"optionalCall"!==o||(r=s(((...e)=>r.call(t,...e))),t=void 0)}return r}console.log("THREE Version",e.REVISION);const n={MemoryTest:t.DemoMemoryTest,VSMShadow:o,VTKLoader:a,MeshOpt:t.DemoMeshOpt,TGALoader:t.DemoTGALoader,PDBLoader:t.DemoPDBLoader,STLLoader:t.DemoSTLLoader,TTFLoader:t.DemoTTFLoader,BVHLoader:t.DemoBVHLoader,FBXLoader:t.DemoFBXLoader,LWOLoader:t.DemoLWOLoader,MTLLoader:t.DemoMTLLoader,EXRLoader:t.DemoEXRLoader,OBJLoader:t.DemoOBJLoader,SVGLoader:t.DemoSVGLoader,RGBELoader:t.DemoRGBELoader,GLTFLoader:t.DemoGLTFLoader,ColladaLoader:t.DemoColladaLoader,MeshQuantization:t.DemoMeshQuantization,ThreeSpritePlayer:t.DemoThreeSpritePlayer,HDRPrefilterTexture:t.DemoHDRPrefilterTexture,DeviceOrientationControls:t.DemoDeviceOrientationControls},i=e=>new Promise((t=>wx.createSelectorQuery().select(e).fields({node:!0,size:!0}).exec(t)));Page({disposing:!1,switchingItem:!1,deps:{},currDemo:null,platform:null,helperCanvas:null,data:{showMenu:!0,showCanvas:!1,currItem:-1,menuList:["GLTFLoader","ThreeSpritePlayer","DeviceOrientationControls","RGBELoader","SVGLoader","OBJLoader","MeshOpt","EXRLoader","HDRPrefilterTexture","MTLLoader","LWOLoader","FBXLoader","BVHLoader","ColladaLoader","MeshQuantization","TTFLoader","STLLoader","PDBLoader","TGALoader","VTKLoader","VSMShadow","MemoryTest"]},onReady(){this.onCanvasReady()},onCanvasReady(){console.log("onCanvasReady"),Promise.all([i("#gl"),i("#canvas")]).then((([e,t])=>{this.initCanvas(e[0].node,t[0].node)}))},initCanvas(r,a){const o=new t.WechatPlatform(r);this.platform=o,o.enableDeviceOrientation("game"),e.PLATFORM.set(o),console.log(e.$window.innerWidth,e.$window.innerHeight),console.log(r.width,r.height);const n=new e.WebGL1Renderer({canvas:r,antialias:!0,alpha:!1}),i=new e.PerspectiveCamera(75,r.width/r.height,.1,1e3),l=new e.Scene,d=new e.Clock,h=new t.GLTFLoader,c=new e.TextureLoader;this.deps={renderer:n,camera:i,scene:l,clock:d,gltfLoader:h,textureLoader:c},this.helperCanvas=a,l.position.z=-3,l.background=new e.Color(16777215),n.outputEncoding=e.sRGBEncoding,n.setPixelRatio(2),n.setSize(r.width,r.height);const u=()=>{this.disposing||(e.$requestAnimationFrame(u),s([this.currDemo,"optionalAccess",e=>e.update,"call",e=>e()]),n.render(l,i))};u(),console.log("canvas inited")},onMenuClick(){const e=!this.data.showMenu;e?this.setData({showMenu:e,showCanvas:!1}):(this.setData({showMenu:e}),setTimeout((()=>{this.setData({showCanvas:!0})}),330))},async onMenuItemClick(e){const{i:t,item:r}=e.currentTarget.dataset;if(wx.showLoading({mask:!1,title:"加载中"}),this.switchingItem||!n[r])return;s([this.currDemo,"optionalAccess",e=>e.dispose,"call",e=>e()]),this.switchingItem=!0,this.currDemo=null;const a=new n[r](this.deps);await a.init(),this.currDemo=a,this.setData({currItem:t}),this.onMenuClick(),this.switchingItem=!1,wx.hideLoading()},onTX(e){this.platform.dispatchTouchEvent(e)},screenshot(){const{renderer:r,scene:a,camera:o}=this.deps,[s,n,i]=t.screenshot(r,a,o,e.WebGLRenderTarget),l=this.helperCanvas.getContext("2d"),d=this.helperCanvas.createImageData(s,n,i);this.helperCanvas.height=d.height,this.helperCanvas.width=d.width,l.putImageData(d,0,0);const h=l.getImageData(0,0,n,i).data.some((e=>0!==e));console.log("hasPixel",h),wx.canvasToTempFilePath({canvas:this.helperCanvas,success(e){wx.previewImage({urls:[e.tempFilePath]})}})},async screenrecord(){console.log("screenrecord clicked");const e=this.deps.renderer.domElement,t=wx.createMediaRecorder(e,{fps:20,videoBitsPerSecond:600,duration:5});await new Promise((e=>{t.on("start",e),t.start()})),console.log("start");let r=100;for(;r--;)await new Promise((e=>t.requestFrame(e))),await new Promise((e=>setTimeout(e,50))),console.log(r);const{tempFilePath:a}=await new Promise((e=>{t.on("stop",e),t.stop()}));console.log(a),t.destroy(),wx.previewMedia({sources:[{url:a,type:"video"}]})},onUnload(){this.disposing=!0,s([this.currDemo,"optionalAccess",e=>e.dispose,"call",e=>e()]),e.PLATFORM.dispose()},onShareAppMessage(){}});
