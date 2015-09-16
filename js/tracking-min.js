/**
 * tracking.js - A modern approach for Computer Vision on the web.
 * @author Eduardo Lundgren <edu@rdo.io>
 * @version v1.0.0
 * @link http://trackingjs.com
 * @license BSD
 */
!function(t){t.tracking=t.tracking||{},tracking.inherits=function(t,r){function n(){}n.prototype=r.prototype,t.superClass_=r.prototype,t.prototype=new n,t.prototype.constructor=t,t.base=function(t,n){var e=Array.prototype.slice.call(arguments,2);return r.prototype[n].apply(t,e)}},tracking.initUserMedia_=function(r,n){t.navigator.getUserMedia({video:!0,audio:n.audio},function(n){try{r.src=t.URL.createObjectURL(n)}catch(e){r.src=n}},function(){throw Error("Cannot capture user camera.")})},tracking.isNode=function(t){return t.nodeType||this.isWindow(t)},tracking.isWindow=function(t){return!!(t&&t.alert&&t.document)},tracking.one=function(t,r){return this.isNode(t)?t:(r||document).querySelector(t)},tracking.track=function(t,r,n){if(t=tracking.one(t),!t)throw new Error("Element not found, try a different element or selector.");if(!r)throw new Error("Tracker not specified, try `tracking.track(element, new tracking.FaceTracker())`.");switch(t.nodeName.toLowerCase()){case"canvas":return this.trackCanvas_(t,r,n);case"img":return this.trackImg_(t,r,n);case"video":return n&&n.camera&&this.initUserMedia_(t,n),this.trackVideo_(t,r,n);default:throw new Error("Element not supported, try in a canvas, img, or video.")}},tracking.trackCanvas_=function(t,r){var n=this,e=new tracking.TrackerTask(r);return e.on("run",function(){n.trackCanvasInternal_(t,r)}),e.run()},tracking.trackCanvasInternal_=function(t,r){var n=t.width,e=t.height,i=t.getContext("2d"),a=i.getImageData(0,0,n,e);r.track(a.data,n,e)},tracking.trackImg_=function(t,r){var n=t.width,e=t.height,i=document.createElement("canvas");i.width=n,i.height=e;var a=new tracking.TrackerTask(r);return a.on("run",function(){tracking.Canvas.loadImage(i,t.src,0,0,n,e,function(){tracking.trackCanvasInternal_(i,r)})}),a.run()},tracking.trackVideo_=function(r,n){var e,i,a=document.createElement("canvas"),o=a.getContext("2d"),c=function(){e=r.offsetWidth,i=r.offsetHeight,a.width=e,a.height=i};c(),r.addEventListener("resize",c);var s,g=function(){s=t.requestAnimationFrame(function(){if(r.readyState===r.HAVE_ENOUGH_DATA){try{o.drawImage(r,0,0,e,i)}catch(t){}tracking.trackCanvasInternal_(a,n)}g()})},h=new tracking.TrackerTask(n);return h.on("stop",function(){t.cancelAnimationFrame(s)}),h.on("run",function(){g()}),h.run()},t.URL||(t.URL=t.URL||t.webkitURL||t.msURL||t.oURL),navigator.getUserMedia||(navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia)}(window),function(){tracking.EventEmitter=function(){},tracking.EventEmitter.prototype.events_=null,tracking.EventEmitter.prototype.addListener=function(t,r){if("function"!=typeof r)throw new TypeError("Listener must be a function");return this.events_||(this.events_={}),this.emit("newListener",t,r),this.events_[t]||(this.events_[t]=[]),this.events_[t].push(r),this},tracking.EventEmitter.prototype.listeners=function(t){return this.events_&&this.events_[t]},tracking.EventEmitter.prototype.emit=function(t){var r=this.listeners(t);if(r){for(var n=Array.prototype.slice.call(arguments,1),e=0;e<r.length;e++)r[e]&&r[e].apply(this,n);return!0}return!1},tracking.EventEmitter.prototype.on=tracking.EventEmitter.prototype.addListener,tracking.EventEmitter.prototype.once=function(t,r){var n=this;n.on(t,function e(){n.removeListener(t,e),r.apply(this,arguments)})},tracking.EventEmitter.prototype.removeAllListeners=function(t){return this.events_?(t?delete this.events_[t]:delete this.events_,this):this},tracking.EventEmitter.prototype.removeListener=function(t,r){if("function"!=typeof r)throw new TypeError("Listener must be a function");if(!this.events_)return this;var n=this.listeners(t);if(Array.isArray(n)){var e=n.indexOf(r);if(0>e)return this;n.splice(e,1)}return this},tracking.EventEmitter.prototype.setMaxListeners=function(){throw new Error("Not implemented")}}(),function(){tracking.Canvas={},tracking.Canvas.loadImage=function(t,r,n,e,i,a,o){var c=this,s=new window.Image;s.onload=function(){var r=t.getContext("2d");t.width=i,t.height=a,r.drawImage(s,n,e,i,a),o&&o.call(c),s=null},s.src=r}}(),function(){tracking.DisjointSet=function(t){if(void 0===t)throw new Error("DisjointSet length not specified.");this.length=t,this.parent=new Uint32Array(t);for(var r=0;t>r;r++)this.parent[r]=r},tracking.DisjointSet.prototype.length=null,tracking.DisjointSet.prototype.parent=null,tracking.DisjointSet.prototype.find=function(t){return this.parent[t]===t?t:this.parent[t]=this.find(this.parent[t])},tracking.DisjointSet.prototype.union=function(t,r){var n=this.find(t),e=this.find(r);this.parent[n]=e}}(),function(){tracking.Image={},tracking.Image.blur=function(t,r,n,e){if(e=Math.abs(e),1>=e)throw new Error("Diameter should be greater than 1.");for(var i=e/2,a=Math.ceil(e)+(1-Math.ceil(e)%2),o=new Float32Array(a),c=(i+.5)/3,s=c*c,g=1/Math.sqrt(2*Math.PI*s),h=-1/(2*c*c),k=0,u=Math.floor(a/2),f=0;a>f;f++){var l=f-u,p=g*Math.exp(l*l*h);o[f]=p,k+=p}for(var v=0;v<o.length;v++)o[v]/=k;return this.separableConvolve(t,r,n,o,o,!1)},tracking.Image.computeIntegralImage=function(t,r,n,e,i,a,o){if(arguments.length<4)throw new Error("You should specify at least one output array in the order: sum, square, tilted, sobel.");var c;o&&(c=tracking.Image.sobel(t,r,n));for(var s=0;n>s;s++)for(var g=0;r>g;g++){var h=s*r*4+4*g,k=~~(.299*t[h]+.587*t[h+1]+.114*t[h+2]);if(e&&this.computePixelValueSAT_(e,r,s,g,k),i&&this.computePixelValueSAT_(i,r,s,g,k*k),a){var u=h-4*r,f=~~(.299*t[u]+.587*t[u+1]+.114*t[u+2]);this.computePixelValueRSAT_(a,r,s,g,k,f||0)}o&&this.computePixelValueSAT_(o,r,s,g,c[h])}},tracking.Image.computePixelValueRSAT_=function(t,r,n,e,i,a){var o=n*r+e;t[o]=(t[o-r-1]||0)+(t[o-r+1]||0)-(t[o-r-r]||0)+i+a},tracking.Image.computePixelValueSAT_=function(t,r,n,e,i){var a=n*r+e;t[a]=(t[a-r]||0)+(t[a-1]||0)+i-(t[a-r-1]||0)},tracking.Image.grayscale=function(t,r,n,e){for(var i=new Uint8ClampedArray(e?t.length:t.length>>2),a=0,o=0,c=0;n>c;c++)for(var s=0;r>s;s++){var g=.299*t[o]+.587*t[o+1]+.114*t[o+2];i[a++]=g,e&&(i[a++]=g,i[a++]=g,i[a++]=t[o+3]),o+=4}return i},tracking.Image.horizontalConvolve=function(t,r,n,e,i){for(var a=e.length,o=Math.floor(a/2),c=new Float32Array(r*n*4),s=i?1:0,g=0;n>g;g++)for(var h=0;r>h;h++){for(var k=g,u=h,f=4*(g*r+h),l=0,p=0,v=0,m=0,y=0;a>y;y++){var d=k,w=Math.min(r-1,Math.max(0,u+y-o)),T=4*(d*r+w),C=e[y];l+=t[T]*C,p+=t[T+1]*C,v+=t[T+2]*C,m+=t[T+3]*C}c[f]=l,c[f+1]=p,c[f+2]=v,c[f+3]=m+s*(255-m)}return c},tracking.Image.verticalConvolve=function(t,r,n,e,i){for(var a=e.length,o=Math.floor(a/2),c=new Float32Array(r*n*4),s=i?1:0,g=0;n>g;g++)for(var h=0;r>h;h++){for(var k=g,u=h,f=4*(g*r+h),l=0,p=0,v=0,m=0,y=0;a>y;y++){var d=Math.min(n-1,Math.max(0,k+y-o)),w=u,T=4*(d*r+w),C=e[y];l+=t[T]*C,p+=t[T+1]*C,v+=t[T+2]*C,m+=t[T+3]*C}c[f]=l,c[f+1]=p,c[f+2]=v,c[f+3]=m+s*(255-m)}return c},tracking.Image.separableConvolve=function(t,r,n,e,i,a){var o=this.verticalConvolve(t,r,n,i,a);return this.horizontalConvolve(o,r,n,e,a)},tracking.Image.sobel=function(t,r,n){t=this.grayscale(t,r,n,!0);for(var e=new Float32Array(r*n*4),i=new Float32Array([-1,0,1]),a=new Float32Array([1,2,1]),o=this.separableConvolve(t,r,n,i,a),c=this.separableConvolve(t,r,n,a,i),s=0;s<e.length;s+=4){var g=o[s],h=c[s],k=Math.sqrt(h*h+g*g);e[s]=k,e[s+1]=k,e[s+2]=k,e[s+3]=255}return e}}(),function(){tracking.ViolaJones={},tracking.ViolaJones.REGIONS_OVERLAP=.5,tracking.ViolaJones.classifiers={},tracking.ViolaJones.detect=function(t,r,n,e,i,a,o,c){var s,g=0,h=[],k=new Int32Array(r*n),u=new Int32Array(r*n),f=new Int32Array(r*n);o>0&&(s=new Int32Array(r*n)),tracking.Image.computeIntegralImage(t,r,n,k,u,f,s);for(var l=c[0],p=c[1],v=e*i,m=v*l|0,y=v*p|0;r>m&&n>y;){for(var d=v*a+.5|0,w=0;n-y>w;w+=d)for(var T=0;r-m>T;T+=d)o>0&&this.isTriviallyExcluded(o,s,w,T,r,m,y)||this.evalStages_(c,k,u,f,w,T,r,m,y,v)&&(h[g++]={width:m,height:y,x:T,y:w});v*=i,m=v*l|0,y=v*p|0}return this.mergeRectangles_(h)},tracking.ViolaJones.isTriviallyExcluded=function(t,r,n,e,i,a,o){var c=n*i+e,s=c+a,g=c+o*i,h=g+a,k=(r[c]-r[s]-r[g]+r[h])/(a*o*255);return t>k?!0:!1},tracking.ViolaJones.evalStages_=function(t,r,n,e,i,a,o,c,s,g){var h=1/(c*s),k=i*o+a,u=k+c,f=k+s*o,l=f+c,p=(r[k]-r[u]-r[f]+r[l])*h,v=(n[k]-n[u]-n[f]+n[l])*h-p*p,m=1;v>0&&(m=Math.sqrt(v));for(var y=t.length,d=2;y>d;){for(var w=0,T=t[d++],C=t[d++];C--;){for(var _=0,E=t[d++],M=t[d++],x=0;M>x;x++){var I,b,O,A,S=a+t[d++]*g+.5|0,D=i+t[d++]*g+.5|0,R=t[d++]*g+.5|0,j=t[d++]*g+.5|0,F=t[d++];E?(I=S-j+R+(D+R+j-1)*o,b=S+(D-1)*o,O=S-j+(D+j-1)*o,A=S+R+(D+R-1)*o,_+=(e[I]+e[b]-e[O]-e[A])*F):(I=D*o+S,b=I+R,O=I+j*o,A=O+R,_+=(r[I]-r[b]-r[O]+r[A])*F)}var L=t[d++],V=t[d++],U=t[d++];w+=L*m>_*h?V:U}if(T>w)return!1}return!0},tracking.ViolaJones.mergeRectangles_=function(t){for(var r=new tracking.DisjointSet(t.length),n=0;n<t.length;n++)for(var e=t[n],i=0;i<t.length;i++){var a=t[i];if(tracking.Math.intersectRect(e.x,e.y,e.x+e.width,e.y+e.height,a.x,a.y,a.x+a.width,a.y+a.height)){var o=Math.max(e.x,a.x),c=Math.max(e.y,a.y),s=Math.min(e.x+e.width,a.x+a.width),g=Math.min(e.y+e.height,a.y+a.height),h=(o-s)*(c-g),k=e.width*e.height,u=a.width*a.height;h/(k*(k/u))>=this.REGIONS_OVERLAP&&h/(u*(k/u))>=this.REGIONS_OVERLAP&&r.union(n,i)}}for(var f={},l=0;l<r.length;l++){var p=r.find(l);f[p]?(f[p].total++,f[p].width+=t[l].width,f[p].height+=t[l].height,f[p].x+=t[l].x,f[p].y+=t[l].y):f[p]={total:1,width:t[l].width,height:t[l].height,x:t[l].x,y:t[l].y}}var v=[];return Object.keys(f).forEach(function(t){var r=f[t];v.push({total:r.total,width:r.width/r.total+.5|0,height:r.height/r.total+.5|0,x:r.x/r.total+.5|0,y:r.y/r.total+.5|0})}),v}}(),function(){tracking.Brief={},tracking.Brief.N=512,tracking.Brief.randomImageOffsets_={},tracking.Brief.randomWindowOffsets_=null,tracking.Brief.getDescriptors=function(t,r,n){for(var e=new Int32Array((n.length>>1)*(this.N>>5)),i=0,a=this.getRandomOffsets_(r),o=0,c=0;c<n.length;c+=2)for(var s=r*n[c+1]+n[c],g=0,h=0,k=this.N;k>h;h++)t[a[g++]+s]<t[a[g++]+s]&&(i|=1<<(31&h)),h+1&31||(e[o++]=i,i=0);return e},tracking.Brief.match=function(t,r,n,e){for(var i=t.length>>1,a=n.length>>1,o=new Array(i),c=0;i>c;c++){for(var s=1/0,g=0,h=0;a>h;h++){for(var k=0,u=0,f=this.N>>5;f>u;u++)k+=tracking.Math.hammingWeight(r[c*f+u]^e[h*f+u]);s>k&&(s=k,g=h)}o[c]={index1:c,index2:g,keypoint1:[t[2*c],t[2*c+1]],keypoint2:[n[2*g],n[2*g+1]],confidence:1-s/this.N}}return o},tracking.Brief.reciprocalMatch=function(t,r,n,e){var i=[];if(0===t.length||0===n.length)return i;for(var a=tracking.Brief.match(t,r,n,e),o=tracking.Brief.match(n,e,t,r),c=0;c<a.length;c++)o[a[c].index2].index2===c&&i.push(a[c]);return i},tracking.Brief.getRandomOffsets_=function(t){if(!this.randomWindowOffsets_){for(var r=0,n=new Int32Array(4*this.N),e=0;e<this.N;e++)n[r++]=Math.round(tracking.Math.uniformRandom(-15,16)),n[r++]=Math.round(tracking.Math.uniformRandom(-15,16)),n[r++]=Math.round(tracking.Math.uniformRandom(-15,16)),n[r++]=Math.round(tracking.Math.uniformRandom(-15,16));this.randomWindowOffsets_=n}if(!this.randomImageOffsets_[t]){for(var i=0,a=new Int32Array(2*this.N),o=0;o<this.N;o++)a[i++]=this.randomWindowOffsets_[4*o]*t+this.randomWindowOffsets_[4*o+1],a[i++]=this.randomWindowOffsets_[4*o+2]*t+this.randomWindowOffsets_[4*o+3];this.randomImageOffsets_[t]=a}return this.randomImageOffsets_[t]}}(),function(){tracking.Fast={},tracking.Fast.THRESHOLD=40,tracking.Fast.circles_={},tracking.Fast.findCorners=function(t,r,n,e){var i=this.getCircleOffsets_(r),a=new Int32Array(16),o=[];void 0===e&&(e=this.THRESHOLD);for(var c=3;n-3>c;c++)for(var s=3;r-3>s;s++){for(var g=c*r+s,h=t[g],k=0;16>k;k++)a[k]=t[g+i[k]];this.isCorner(h,a,e)&&(o.push(s,c),s+=3)}return o},tracking.Fast.isBrighter=function(t,r,n){return t-r>n},tracking.Fast.isCorner=function(t,r,n){if(this.isTriviallyExcluded(r,t,n))return!1;for(var e=0;16>e;e++){for(var i=!0,a=!0,o=0;9>o;o++){var c=r[e+o&15];if(!this.isBrighter(t,c,n)&&(a=!1,i===!1))break;if(!this.isDarker(t,c,n)&&(i=!1,a===!1))break}if(a||i)return!0}return!1},tracking.Fast.isDarker=function(t,r,n){return r-t>n},tracking.Fast.isTriviallyExcluded=function(t,r,n){var e=0,i=t[8],a=t[12],o=t[4],c=t[0];return this.isBrighter(c,r,n)&&e++,this.isBrighter(o,r,n)&&e++,this.isBrighter(i,r,n)&&e++,this.isBrighter(a,r,n)&&e++,3>e&&(e=0,this.isDarker(c,r,n)&&e++,this.isDarker(o,r,n)&&e++,this.isDarker(i,r,n)&&e++,this.isDarker(a,r,n)&&e++,3>e)?!0:!1},tracking.Fast.getCircleOffsets_=function(t){if(this.circles_[t])return this.circles_[t];var r=new Int32Array(16);return r[0]=-t-t-t,r[1]=r[0]+1,r[2]=r[1]+t+1,r[3]=r[2]+t+1,r[4]=r[3]+t,r[5]=r[4]+t,r[6]=r[5]+t-1,r[7]=r[6]+t-1,r[8]=r[7]-1,r[9]=r[8]-1,r[10]=r[9]-t-1,r[11]=r[10]-t-1,r[12]=r[11]-t,r[13]=r[12]-t,r[14]=r[13]-t+1,r[15]=r[14]-t+1,this.circles_[t]=r,r}}(),function(){tracking.Math={},tracking.Math.distance=function(t,r,n,e){var i=n-t,a=e-r;return Math.sqrt(i*i+a*a)},tracking.Math.hammingWeight=function(t){return t-=t>>1&1431655765,t=(858993459&t)+(t>>2&858993459),16843009*(t+(t>>4)&252645135)>>24},tracking.Math.uniformRandom=function(t,r){return t+Math.random()*(r-t)},tracking.Math.intersectRect=function(t,r,n,e,i,a,o,c){return!(i>n||t>o||a>e||r>c)}}(),function(){tracking.Matrix={},tracking.Matrix.forEach=function(t,r,n,e,i){i=i||1;for(var a=0;n>a;a+=i)for(var o=0;r>o;o+=i){var c=a*r*4+4*o;e.call(this,t[c],t[c+1],t[c+2],t[c+3],c,a,o)}}}(),function(){tracking.EPnP={},tracking.EPnP.solve=function(){}}(),function(){tracking.Tracker=function(){tracking.Tracker.base(this,"constructor")},tracking.inherits(tracking.Tracker,tracking.EventEmitter),tracking.Tracker.prototype.track=function(){}}(),function(){tracking.TrackerTask=function(t){if(tracking.TrackerTask.base(this,"constructor"),!t)throw new Error("Tracker instance not specified.");this.setTracker(t)},tracking.inherits(tracking.TrackerTask,tracking.EventEmitter),tracking.TrackerTask.prototype.tracker_=null,tracking.TrackerTask.prototype.running_=!1,tracking.TrackerTask.prototype.getTracker=function(){return this.tracker_},tracking.TrackerTask.prototype.inRunning=function(){return this.running_},tracking.TrackerTask.prototype.setRunning=function(t){this.running_=t},tracking.TrackerTask.prototype.setTracker=function(t){this.tracker_=t},tracking.TrackerTask.prototype.run=function(){var t=this;if(!this.inRunning())return this.setRunning(!0),this.reemitTrackEvent_=function(r){t.emit("track",r)},this.tracker_.on("track",this.reemitTrackEvent_),this.emit("run"),this},tracking.TrackerTask.prototype.stop=function(){return this.inRunning()?(this.setRunning(!1),this.emit("stop"),this.tracker_.removeListener("track",this.reemitTrackEvent_),this):void 0}}(),function(){tracking.ColorTracker=function(t){tracking.ColorTracker.base(this,"constructor"),"string"==typeof t&&(t=[t]),t&&(t.forEach(function(t){if(!tracking.ColorTracker.getColor(t))throw new Error('Color not valid, try `new tracking.ColorTracker("magenta")`.')}),this.setColors(t))},tracking.inherits(tracking.ColorTracker,tracking.Tracker),tracking.ColorTracker.knownColors_={},tracking.ColorTracker.neighbours_={},tracking.ColorTracker.registerColor=function(t,r){tracking.ColorTracker.knownColors_[t]=r},tracking.ColorTracker.getColor=function(t){return tracking.ColorTracker.knownColors_[t]},tracking.ColorTracker.prototype.colors=["magenta"],tracking.ColorTracker.prototype.minDimension=20,tracking.ColorTracker.prototype.maxDimension=1/0,tracking.ColorTracker.prototype.minGroupSize=30,tracking.ColorTracker.prototype.calculateDimensions_=function(t,r){for(var n=-1,e=-1,i=1/0,a=1/0,o=0;r>o;o+=2){var c=t[o],s=t[o+1];i>c&&(i=c),c>n&&(n=c),a>s&&(a=s),s>e&&(e=s)}return{width:n-i,height:e-a,x:i,y:a}},tracking.ColorTracker.prototype.getColors=function(){return this.colors},tracking.ColorTracker.prototype.getMinDimension=function(){return this.minDimension},tracking.ColorTracker.prototype.getMaxDimension=function(){return this.maxDimension},tracking.ColorTracker.prototype.getMinGroupSize=function(){return this.minGroupSize},tracking.ColorTracker.prototype.getNeighboursForWidth_=function(t){if(tracking.ColorTracker.neighbours_[t])return tracking.ColorTracker.neighbours_[t];var r=new Int32Array(8);return r[0]=4*-t,r[1]=4*-t+4,r[2]=4,r[3]=4*t+4,r[4]=4*t,r[5]=4*t-4,r[6]=-4,r[7]=4*-t-4,tracking.ColorTracker.neighbours_[t]=r,r},tracking.ColorTracker.prototype.mergeRectangles_=function(t){for(var r,n=[],e=this.getMinDimension(),i=this.getMaxDimension(),a=0;a<t.length;a++){var o=t[a];r=!0;for(var c=a+1;c<t.length;c++){var s=t[c];if(tracking.Math.intersectRect(o.x,o.y,o.x+o.width,o.y+o.height,s.x,s.y,s.x+s.width,s.y+s.height)){r=!1;var g=Math.min(o.x,s.x),h=Math.min(o.y,s.y),k=Math.max(o.x+o.width,s.x+s.width),u=Math.max(o.y+o.height,s.y+s.height);s.height=u-h,s.width=k-g,s.x=g,s.y=h;break}}r&&o.width>=e&&o.height>=e&&o.width<=i&&o.height<=i&&n.push(o)}return n},tracking.ColorTracker.prototype.setColors=function(t){this.colors=t},tracking.ColorTracker.prototype.setMinDimension=function(t){this.minDimension=t},tracking.ColorTracker.prototype.setMaxDimension=function(t){this.maxDimension=t},tracking.ColorTracker.prototype.setMinGroupSize=function(t){this.minGroupSize=t},tracking.ColorTracker.prototype.track=function(t,r,n){var e=this,i=this.getColors();if(!i)throw new Error('Colors not specified, try `new tracking.ColorTracker("magenta")`.');var a=[];i.forEach(function(i){a=a.concat(e.trackColor_(t,r,n,i))}),this.emit("track",{data:a})},tracking.ColorTracker.prototype.trackColor_=function(n,e,i,a){var o,c,s,g,h,k=tracking.ColorTracker.knownColors_[a],u=new Int32Array(n.length>>2),f=new Int8Array(n.length),l=this.getMinGroupSize(),p=this.getNeighboursForWidth_(e),v=new Int32Array(n.length),m=[],y=-4;if(!k)return m;for(var d=0;i>d;d++)for(var w=0;e>w;w++)if(y+=4,!f[y]){for(o=0,h=-1,v[++h]=y,v[++h]=d,v[++h]=w,f[y]=1;h>=0;)if(s=v[h--],c=v[h--],g=v[h--],k(n[g],n[g+1],n[g+2],n[g+3],g,c,s)){u[o++]=s,u[o++]=c;for(var T=0;T<p.length;T++){var C=g+p[T],_=c+t[T],E=s+r[T];!f[C]&&_>=0&&i>_&&E>=0&&e>E&&(v[++h]=C,v[++h]=_,v[++h]=E,f[C]=1)}}if(o>=l){var M=this.calculateDimensions_(u,o);M&&(M.color=a,m.push(M))}}return this.mergeRectangles_(m)},tracking.ColorTracker.registerColor("cyan",function(t,r,n){var e=50,i=70,a=t-0,o=r-255,c=n-255;return r-t>=e&&n-t>=i?!0:6400>a*a+o*o+c*c}),tracking.ColorTracker.registerColor("magenta",function(t,r,n){var e=50,i=t-255,a=r-0,o=n-255;return t-r>=e&&n-r>=e?!0:19600>i*i+a*a+o*o}),tracking.ColorTracker.registerColor("yellow",function(t,r,n){var e=50,i=t-255,a=r-255,o=n-0;return t-n>=e&&r-n>=e?!0:1e4>i*i+a*a+o*o});var t=new Int32Array([-1,-1,0,1,1,1,0,-1]),r=new Int32Array([0,1,1,1,0,-1,-1,-1])}(),function(){tracking.ObjectTracker=function(t){tracking.ObjectTracker.base(this,"constructor"),t&&(Array.isArray(t)||(t=[t]),Array.isArray(t)&&t.forEach(function(r,n){if("string"==typeof r&&(t[n]=tracking.ViolaJones.classifiers[r]),!t[n])throw new Error('Object classifier not valid, try `new tracking.ObjectTracker("face")`.')})),this.setClassifiers(t)},tracking.inherits(tracking.ObjectTracker,tracking.Tracker),tracking.ObjectTracker.prototype.edgesDensity=.2,tracking.ObjectTracker.prototype.initialScale=1,tracking.ObjectTracker.prototype.scaleFactor=1.25,tracking.ObjectTracker.prototype.stepSize=1.5,tracking.ObjectTracker.prototype.getClassifiers=function(){return this.classifiers},tracking.ObjectTracker.prototype.getEdgesDensity=function(){return this.edgesDensity},tracking.ObjectTracker.prototype.getInitialScale=function(){return this.initialScale},tracking.ObjectTracker.prototype.getScaleFactor=function(){return this.scaleFactor},tracking.ObjectTracker.prototype.getStepSize=function(){return this.stepSize},tracking.ObjectTracker.prototype.track=function(t,r,n){var e=this,i=this.getClassifiers();if(!i)throw new Error('Object classifier not specified, try `new tracking.ObjectTracker("face")`.');var a=[];i.forEach(function(i){a=a.concat(tracking.ViolaJones.detect(t,r,n,e.getInitialScale(),e.getScaleFactor(),e.getStepSize(),e.getEdgesDensity(),i))}),this.emit("track",{data:a})},tracking.ObjectTracker.prototype.setClassifiers=function(t){this.classifiers=t},tracking.ObjectTracker.prototype.setEdgesDensity=function(t){this.edgesDensity=t},tracking.ObjectTracker.prototype.setInitialScale=function(t){this.initialScale=t},tracking.ObjectTracker.prototype.setScaleFactor=function(t){this.scaleFactor=t},tracking.ObjectTracker.prototype.setStepSize=function(t){this.stepSize=t}}();
