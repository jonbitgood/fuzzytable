!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).FuzzyTable=t()}(this,(function(){"use strict";function e(e){return Array.isArray?Array.isArray(e):"[object Array]"===l(e)}const t=1/0;function n(e){return null==e?"":function(e){if("string"==typeof e)return e;let n=`${e}`;return"0"===n&&1/e==-t?"-0":n}(e)}function s(e){return"string"==typeof e}function r(e){return"number"==typeof e}function i(e){return!0===e||!1===e||function(e){return o(e)&&null!==e}(e)&&"[object Boolean]"===l(e)}function o(e){return"object"==typeof e}function a(e){return null!=e}function c(e){return!e.trim().length}function l(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":Object.prototype.toString.call(e)}const h=e=>`Missing ${e} property in key`,d=e=>`Property 'weight' in key '${e}' must be a positive integer`,u=Object.prototype.hasOwnProperty;class p{constructor(e){this._keys=[],this._keyMap={};let t=0;for(const n of e){let e=f(n);this._keys.push(e),this._keyMap[e.id]=e,t+=e.weight}for(const e of this._keys)e.weight/=t}get(e){return this._keyMap[e]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}}function f(t){let n=null,r=null,i=null,o=1,a=null;if(s(t)||e(t))i=t,n=g(t),r=m(t);else{if(!u.call(t,"name"))throw new Error(h("name"));const e=t.name;if(i=e,u.call(t,"weight")&&(o=t.weight,o<=0))throw new Error(d(e));n=g(e),r=m(e),a=t.getFn}return{path:n,id:r,weight:o,src:i,getFn:a}}function g(t){return e(t)?t:t.split(".")}function m(t){return e(t)?t.join("."):t}let x={isCaseSensitive:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(e,t)=>e.score===t.score?e.idx<t.idx?-1:1:e.score<t.score?-1:1,includeMatches:!1,findAllMatches:!1,minMatchCharLength:1,location:0,threshold:.6,distance:100,...{useExtendedSearch:!1,getFn:function(t,o){let c=[],l=!1;const h=(t,o,d)=>{if(a(t))if(o[d]){const u=t[o[d]];if(!a(u))return;if(d===o.length-1&&(s(u)||r(u)||i(u)))c.push(n(u));else if(e(u)){l=!0;for(let e=0,t=u.length;e<t;e+=1)h(u[e],o,d+1)}else o.length&&h(u,o,d+1)}else c.push(t)};return h(t,s(o)?o.split("."):o,0),l?c:c[0]},ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1}};const b=/[^ ]+/g;class y{constructor({getFn:e=x.getFn,fieldNormWeight:t=x.fieldNormWeight}={}){this.norm=function(e=1,t=3){const n=new Map,s=10**t;return{get(t){const r=t.match(b).length;if(n.has(r))return n.get(r);const i=1/r**(.5*e),o=Number.parseFloat(Math.round(i*s)/s);return n.set(r,o),o},clear(){n.clear()}}}(t,3),this.getFn=e,this.isCreated=!1,this.setIndexRecords()}setSources(e=[]){this.docs=e}setIndexRecords(e=[]){this.records=e}setKeys(e=[]){this.keys=e,this._keysMap={},e.forEach(((e,t)=>{this._keysMap[e.id]=t}))}create(){!this.isCreated&&this.docs.length&&(this.isCreated=!0,s(this.docs[0])?this.docs.forEach(((e,t)=>{this._addString(e,t)})):this.docs.forEach(((e,t)=>{this._addObject(e,t)})),this.norm.clear())}add(e){const t=this.size();s(e)?this._addString(e,t):this._addObject(e,t)}removeAt(e){this.records.splice(e,1);for(let t=e,n=this.size();t<n;t+=1)this.records[t].i-=1}getValueForItemAtKeyId(e,t){return e[this._keysMap[t]]}size(){return this.records.length}_addString(e,t){if(!a(e)||c(e))return;let n={v:e,i:t,n:this.norm.get(e)};this.records.push(n)}_addObject(t,n){let r={i:n,$:{}};this.keys.forEach(((n,i)=>{let o=n.getFn?n.getFn(t):this.getFn(t,n.path);if(a(o))if(e(o)){let t=[];const n=[{nestedArrIndex:-1,value:o}];for(;n.length;){const{nestedArrIndex:r,value:i}=n.pop();if(a(i))if(s(i)&&!c(i)){let e={v:i,i:r,n:this.norm.get(i)};t.push(e)}else e(i)&&i.forEach(((e,t)=>{n.push({nestedArrIndex:t,value:e})}))}r.$[i]=t}else if(s(o)&&!c(o)){let e={v:o,n:this.norm.get(o)};r.$[i]=e}})),this.records.push(r)}toJSON(){return{keys:this.keys,records:this.records}}}function k(e,t,{getFn:n=x.getFn,fieldNormWeight:s=x.fieldNormWeight}={}){const r=new y({getFn:n,fieldNormWeight:s});return r.setKeys(e.map(f)),r.setSources(t),r.create(),r}function w(e,{errors:t=0,currentLocation:n=0,expectedLocation:s=0,distance:r=x.distance,ignoreLocation:i=x.ignoreLocation}={}){const o=t/e.length;if(i)return o;const a=Math.abs(s-n);return r?o+a/r:a?1:o}const v=32;function M(e,t,n,{location:s=x.location,distance:r=x.distance,threshold:i=x.threshold,findAllMatches:o=x.findAllMatches,minMatchCharLength:a=x.minMatchCharLength,includeMatches:c=x.includeMatches,ignoreLocation:l=x.ignoreLocation}={}){if(t.length>v)throw new Error(`Pattern length exceeds max of ${v}.`);const h=t.length,d=e.length,u=Math.max(0,Math.min(s,d));let p=i,f=u;const g=a>1||c,m=g?Array(d):[];let b;for(;(b=e.indexOf(t,f))>-1;){let e=w(t,{currentLocation:b,expectedLocation:u,distance:r,ignoreLocation:l});if(p=Math.min(e,p),f=b+h,g){let e=0;for(;e<h;)m[b+e]=1,e+=1}}f=-1;let y=[],k=1,M=h+d;const C=1<<h-1;for(let s=0;s<h;s+=1){let i=0,a=M;for(;i<a;){w(t,{errors:s,currentLocation:u+a,expectedLocation:u,distance:r,ignoreLocation:l})<=p?i=a:M=a,a=Math.floor((M-i)/2+i)}M=a;let c=Math.max(1,u-a+1),x=o?d:Math.min(u+a,d)+h,b=Array(x+2);b[x+1]=(1<<s)-1;for(let i=x;i>=c;i-=1){let o=i-1,a=n[e.charAt(o)];if(g&&(m[o]=+!!a),b[i]=(b[i+1]<<1|1)&a,s&&(b[i]|=(y[i+1]|y[i])<<1|1|y[i+1]),b[i]&C&&(k=w(t,{errors:s,currentLocation:o,expectedLocation:u,distance:r,ignoreLocation:l}),k<=p)){if(p=k,f=o,f<=u)break;c=Math.max(1,2*u-f)}}if(w(t,{errors:s+1,currentLocation:u,expectedLocation:u,distance:r,ignoreLocation:l})>p)break;y=b}const L={isMatch:f>=0,score:Math.max(.001,k)};if(g){const e=function(e=[],t=x.minMatchCharLength){let n=[],s=-1,r=-1,i=0;for(let o=e.length;i<o;i+=1){let o=e[i];o&&-1===s?s=i:o||-1===s||(r=i-1,r-s+1>=t&&n.push([s,r]),s=-1)}return e[i-1]&&i-s>=t&&n.push([s,i-1]),n}(m,a);e.length?c&&(L.indices=e):L.isMatch=!1}return L}function C(e){let t={};for(let n=0,s=e.length;n<s;n+=1){const r=e.charAt(n);t[r]=(t[r]||0)|1<<s-n-1}return t}class L{constructor(e,{location:t=x.location,threshold:n=x.threshold,distance:s=x.distance,includeMatches:r=x.includeMatches,findAllMatches:i=x.findAllMatches,minMatchCharLength:o=x.minMatchCharLength,isCaseSensitive:a=x.isCaseSensitive,ignoreLocation:c=x.ignoreLocation}={}){if(this.options={location:t,threshold:n,distance:s,includeMatches:r,findAllMatches:i,minMatchCharLength:o,isCaseSensitive:a,ignoreLocation:c},this.pattern=a?e:e.toLowerCase(),this.chunks=[],!this.pattern.length)return;const l=(e,t)=>{this.chunks.push({pattern:e,alphabet:C(e),startIndex:t})},h=this.pattern.length;if(h>v){let e=0;const t=h%v,n=h-t;for(;e<n;)l(this.pattern.substr(e,v),e),e+=v;if(t){const e=h-v;l(this.pattern.substr(e),e)}}else l(this.pattern,0)}searchIn(e){const{isCaseSensitive:t,includeMatches:n}=this.options;if(t||(e=e.toLowerCase()),this.pattern===e){let t={isMatch:!0,score:0};return n&&(t.indices=[[0,e.length-1]]),t}const{location:s,distance:r,threshold:i,findAllMatches:o,minMatchCharLength:a,ignoreLocation:c}=this.options;let l=[],h=0,d=!1;this.chunks.forEach((({pattern:t,alphabet:u,startIndex:p})=>{const{isMatch:f,score:g,indices:m}=M(e,t,u,{location:s+p,distance:r,threshold:i,findAllMatches:o,minMatchCharLength:a,includeMatches:n,ignoreLocation:c});f&&(d=!0),h+=g,f&&m&&(l=[...l,...m])}));let u={isMatch:d,score:d?h/this.chunks.length:1};return d&&n&&(u.indices=l),u}}class N{constructor(e){this.pattern=e}static isMultiMatch(e){return E(e,this.multiRegex)}static isSingleMatch(e){return E(e,this.singleRegex)}search(){}}function E(e,t){const n=e.match(t);return n?n[1]:null}class S extends N{constructor(e,{location:t=x.location,threshold:n=x.threshold,distance:s=x.distance,includeMatches:r=x.includeMatches,findAllMatches:i=x.findAllMatches,minMatchCharLength:o=x.minMatchCharLength,isCaseSensitive:a=x.isCaseSensitive,ignoreLocation:c=x.ignoreLocation}={}){super(e),this._bitapSearch=new L(e,{location:t,threshold:n,distance:s,includeMatches:r,findAllMatches:i,minMatchCharLength:o,isCaseSensitive:a,ignoreLocation:c})}static get type(){return"fuzzy"}static get multiRegex(){return/^"(.*)"$/}static get singleRegex(){return/^(.*)$/}search(e){return this._bitapSearch.searchIn(e)}}class _ extends N{constructor(e){super(e)}static get type(){return"include"}static get multiRegex(){return/^'"(.*)"$/}static get singleRegex(){return/^'(.*)$/}search(e){let t,n=0;const s=[],r=this.pattern.length;for(;(t=e.indexOf(this.pattern,n))>-1;)n=t+r,s.push([t,n-1]);const i=!!s.length;return{isMatch:i,score:i?0:1,indices:s}}}const $=[class extends N{constructor(e){super(e)}static get type(){return"exact"}static get multiRegex(){return/^="(.*)"$/}static get singleRegex(){return/^=(.*)$/}search(e){const t=e===this.pattern;return{isMatch:t,score:t?0:1,indices:[0,this.pattern.length-1]}}},_,class extends N{constructor(e){super(e)}static get type(){return"prefix-exact"}static get multiRegex(){return/^\^"(.*)"$/}static get singleRegex(){return/^\^(.*)$/}search(e){const t=e.startsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,this.pattern.length-1]}}},class extends N{constructor(e){super(e)}static get type(){return"inverse-prefix-exact"}static get multiRegex(){return/^!\^"(.*)"$/}static get singleRegex(){return/^!\^(.*)$/}search(e){const t=!e.startsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}},class extends N{constructor(e){super(e)}static get type(){return"inverse-suffix-exact"}static get multiRegex(){return/^!"(.*)"\$$/}static get singleRegex(){return/^!(.*)\$$/}search(e){const t=!e.endsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}},class extends N{constructor(e){super(e)}static get type(){return"suffix-exact"}static get multiRegex(){return/^"(.*)"\$$/}static get singleRegex(){return/^(.*)\$$/}search(e){const t=e.endsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[e.length-this.pattern.length,e.length-1]}}},class extends N{constructor(e){super(e)}static get type(){return"inverse-exact"}static get multiRegex(){return/^!"(.*)"$/}static get singleRegex(){return/^!(.*)$/}search(e){const t=-1===e.indexOf(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}},S],A=$.length,I=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;const z=new Set([S.type,_.type]);class F{constructor(e,{isCaseSensitive:t=x.isCaseSensitive,includeMatches:n=x.includeMatches,minMatchCharLength:s=x.minMatchCharLength,ignoreLocation:r=x.ignoreLocation,findAllMatches:i=x.findAllMatches,location:o=x.location,threshold:a=x.threshold,distance:c=x.distance}={}){this.query=null,this.options={isCaseSensitive:t,includeMatches:n,minMatchCharLength:s,findAllMatches:i,ignoreLocation:r,location:o,threshold:a,distance:c},this.pattern=t?e:e.toLowerCase(),this.query=function(e,t={}){return e.split("|").map((e=>{let n=e.trim().split(I).filter((e=>e&&!!e.trim())),s=[];for(let e=0,r=n.length;e<r;e+=1){const r=n[e];let i=!1,o=-1;for(;!i&&++o<A;){const e=$[o];let n=e.isMultiMatch(r);n&&(s.push(new e(n,t)),i=!0)}if(!i)for(o=-1;++o<A;){const e=$[o];let n=e.isSingleMatch(r);if(n){s.push(new e(n,t));break}}}return s}))}(this.pattern,this.options)}static condition(e,t){return t.useExtendedSearch}searchIn(e){const t=this.query;if(!t)return{isMatch:!1,score:1};const{includeMatches:n,isCaseSensitive:s}=this.options;e=s?e:e.toLowerCase();let r=0,i=[],o=0;for(let s=0,a=t.length;s<a;s+=1){const a=t[s];i.length=0,r=0;for(let t=0,s=a.length;t<s;t+=1){const s=a[t],{isMatch:c,indices:l,score:h}=s.search(e);if(!c){o=0,r=0,i.length=0;break}if(r+=1,o+=h,n){const e=s.constructor.type;z.has(e)?i=[...i,...l]:i.push(l)}}if(r){let e={isMatch:!0,score:o/r};return n&&(e.indices=i),e}}return{isMatch:!1,score:1}}}const j=[];function B(e,t){for(let n=0,s=j.length;n<s;n+=1){let s=j[n];if(s.condition(e,t))return new s(e,t)}return new L(e,t)}const O="$and",R="$or",T="$path",W="$val",P=e=>!(!e[O]&&!e[R]),D=e=>({[O]:Object.keys(e).map((t=>({[t]:e[t]})))});function H(t,n,{auto:r=!0}={}){const i=t=>{let a=Object.keys(t);const c=(e=>!!e[T])(t);if(!c&&a.length>1&&!P(t))return i(D(t));if((t=>!e(t)&&o(t)&&!P(t))(t)){const e=c?t[T]:a[0],i=c?t[W]:t[e];if(!s(i))throw new Error((e=>`Invalid value for key ${e}`)(e));const o={keyId:m(e),pattern:i};return r&&(o.searcher=B(i,n)),o}let l={children:[],operator:a[0]};return a.forEach((n=>{const s=t[n];e(s)&&s.forEach((e=>{l.children.push(i(e))}))})),l};return P(t)||(t=D(t)),i(t)}function J(e,t){const n=e.matches;t.matches=[],a(n)&&n.forEach((e=>{if(!a(e.indices)||!e.indices.length)return;const{indices:n,value:s}=e;let r={indices:n,value:s};e.key&&(r.key=e.key.src),e.idx>-1&&(r.refIndex=e.idx),t.matches.push(r)}))}function U(e,t){t.score=e.score}class V{constructor(e,t={},n){this.options={...x,...t},this.options.useExtendedSearch,this._keyStore=new p(this.options.keys),this.setCollection(e,n)}setCollection(e,t){if(this._docs=e,t&&!(t instanceof y))throw new Error("Incorrect 'index' type");this._myIndex=t||k(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}add(e){a(e)&&(this._docs.push(e),this._myIndex.add(e))}remove(e=(()=>!1)){const t=[];for(let n=0,s=this._docs.length;n<s;n+=1){const r=this._docs[n];e(r,n)&&(this.removeAt(n),n-=1,s-=1,t.push(r))}return t}removeAt(e){this._docs.splice(e,1),this._myIndex.removeAt(e)}getIndex(){return this._myIndex}search(e,{limit:t=-1}={}){const{includeMatches:n,includeScore:i,shouldSort:o,sortFn:a,ignoreFieldNorm:c}=this.options;let l=s(e)?s(this._docs[0])?this._searchStringList(e):this._searchObjectList(e):this._searchLogical(e);return function(e,{ignoreFieldNorm:t=x.ignoreFieldNorm}){e.forEach((e=>{let n=1;e.matches.forEach((({key:e,norm:s,score:r})=>{const i=e?e.weight:null;n*=Math.pow(0===r&&i?Number.EPSILON:r,(i||1)*(t?1:s))})),e.score=n}))}(l,{ignoreFieldNorm:c}),o&&l.sort(a),r(t)&&t>-1&&(l=l.slice(0,t)),function(e,t,{includeMatches:n=x.includeMatches,includeScore:s=x.includeScore}={}){const r=[];return n&&r.push(J),s&&r.push(U),e.map((e=>{const{idx:n}=e,s={item:t[n],refIndex:n};return r.length&&r.forEach((t=>{t(e,s)})),s}))}(l,this._docs,{includeMatches:n,includeScore:i})}_searchStringList(e){const t=B(e,this.options),{records:n}=this._myIndex,s=[];return n.forEach((({v:e,i:n,n:r})=>{if(!a(e))return;const{isMatch:i,score:o,indices:c}=t.searchIn(e);i&&s.push({item:e,idx:n,matches:[{score:o,value:e,norm:r,indices:c}]})})),s}_searchLogical(e){const t=H(e,this.options),n=(e,t,s)=>{if(!e.children){const{keyId:n,searcher:r}=e,i=this._findMatches({key:this._keyStore.get(n),value:this._myIndex.getValueForItemAtKeyId(t,n),searcher:r});return i&&i.length?[{idx:s,item:t,matches:i}]:[]}const r=[];for(let i=0,o=e.children.length;i<o;i+=1){const o=e.children[i],a=n(o,t,s);if(a.length)r.push(...a);else if(e.operator===O)return[]}return r},s=this._myIndex.records,r={},i=[];return s.forEach((({$:e,i:s})=>{if(a(e)){let o=n(t,e,s);o.length&&(r[s]||(r[s]={idx:s,item:e,matches:[]},i.push(r[s])),o.forEach((({matches:e})=>{r[s].matches.push(...e)})))}})),i}_searchObjectList(e){const t=B(e,this.options),{keys:n,records:s}=this._myIndex,r=[];return s.forEach((({$:e,i:s})=>{if(!a(e))return;let i=[];n.forEach(((n,s)=>{i.push(...this._findMatches({key:n,value:e[s],searcher:t}))})),i.length&&r.push({idx:s,item:e,matches:i})})),r}_findMatches({key:t,value:n,searcher:s}){if(!a(n))return[];let r=[];if(e(n))n.forEach((({v:e,i:n,n:i})=>{if(!a(e))return;const{isMatch:o,score:c,indices:l}=s.searchIn(e);o&&r.push({score:c,key:t,value:e,idx:n,norm:i,indices:l})}));else{const{v:e,n:i}=n,{isMatch:o,score:a,indices:c}=s.searchIn(e);o&&r.push({score:a,key:t,value:e,norm:i,indices:c})}return r}}function q(e,t){const n=t.id,s=e.sortedCol===n;return e.sortedCol=s?"":n,"int"===t.type?e.table.sort(((e,t)=>s?t[n]-e[n]:e[n]-t[n])):e.table.sort(((e,t)=>{const r=e[n]??"",i=t[n]??"";return s?i.localeCompare(r):r.localeCompare(i)}))}V.version="7.0.0",V.createIndex=k,V.parseIndex=function(e,{getFn:t=x.getFn,fieldNormWeight:n=x.fieldNormWeight}={}){const{keys:s,records:r}=e,i=new y({getFn:t,fieldNormWeight:n});return i.setKeys(s),i.setIndexRecords(r),i},V.config=x,V.parseQuery=H,function(...e){j.push(...e)}(F);const K=(e,t)=>{const[n,s]=(r=e.currentPage,i=e.size,[(r+1)*i-i,(r+1)*i]);var r,i;const o=e.table.slice(n,s);t.innerHTML="";for(const n of o){const s=document.createElement("tr");s.className=e.classes.tr;for(const t of e.head){const r=document.createElement("td");r.className=`${t.class} ${t.id} ${e.classes.tableColumn}`,r.setAttribute("data-type",t.type);const i=n[t.id]??"",o=G(i,t.type,e.locale),a=new DocumentFragment;if(t.icon&&a.appendChild(Q(t.icon,n[t.icon.id]??"")),a.appendChild(document.createTextNode(o)),t.subtitle){const s=document.createElement("em");s.className=e.classes.tableCellSubtitle,s.innerText=n[t.subtitle]??"",a.appendChild(s)}if(t.link){const s=document.createElement("a");s.className=e.classes.tableCellLink,s.href=`${t.link.base?t.link.base:""}${n[t.link.id]}`,s.appendChild(a),r.appendChild(s)}else r.appendChild(a);t.suffix&&""!==i&&r.appendChild(e.safeHtml(t.suffix)),s.appendChild(r)}t.appendChild(s)}},Q=(e,t)=>{const n=document.createElementNS("http://www.w3.org/2000/svg","svg"),s=document.createElementNS("http://www.w3.org/2000/svg","use");return s.setAttribute("href",`${e.base}${t}`),s.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",`#${t}`),n.setAttribute("class",e.class),n.appendChild(s),n},G=(e,t,n)=>"int"===t?new Intl.NumberFormat(n).format(e):e,X={pagination:"",sortArrow:"",arrowUp:"absolute right-2 top-0.5 text-sm",arrowDown:"absolute right-2 bottom-0.5 text-sm",paginationButton:"w-10 h-10 inline-flex justify-center items-center border dark:border-stone-900",paginationButtonCurrent:"text-lg font-bold dark:text-white",paginationNav:"relative z-0 flex mt-4 justify-center rounded-md -space-x-px dark:text-stone-300",downloadButton:"relative inline-flex items-center bg-white dark:bg-stone-700 px-2 h-10 dark:text-stone-300 ring-1 ring-inset ring-stone-400 dark:ring-stone-800 focus:z-10",downloadDropdown:"absolute left-0 z-50 -mr-1 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-stone-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",downloadDropdownButton:"text-stone-700 dark:text-stone-300 hover:dark:bg-stone-900 hover:bg-stone-200 w-full block px-4 py-2 text-sm text-left",downloadDropdownInfo:"text-center text-xs text-stone-700 dark:text-stone-300 py-2",fieldsetWrap:"block mt-8 w-full bg-gray-200 dark:bg-stone-700 text-sm font-semibold p-3 text-stone-900 dark:text-stone-300 border-b border-stone-200 dark:border-stone-500 rounded-t-lg",fieldsetFilterWrap:"mb-4 dark:bg-stone-900 border border-stone-200 dark:border-stone-950 p-2",fieldset:"mb-4 dark:bg-stone-900 border border-stone-200 dark:border-stone-950 p-2",filterContainer:"hidden sm:flex flex-col lg:w-1/5 ltr:mr-4 rtl:ml-4",filterButton:"text-sm relative px-2 py-1 my-2 w-full flex items-center justify-center cursor-pointer rounded-lg border dark:text-stone-300 dark:bg-stone-800 border-stone-200 dark:border-stone-500 shadow-sm",filterButtonActive:"bg-stone-400 dark:bg-stone-950 dark:text-white border-stone-800",tableContainer:"flex flex-col w-full relative z-10 max-w-7xl mx-auto",tableColumn:"whitespace-nowrap px-3 py-2 text-sm text-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-800 relative truncate max-w-[240px]",searchInput:"block w-full px-4 text-sm shadow-lg border border-stone-400 dark:border-stone-800 dark:bg-stone-700 text-stone-800 dark:text-stone-300 placeholder-stone-800 dark:placeholder-stone-100 rounded-tl-xl",searchBox:"block w-full px-4 text-sm shadow-lg border border-stone-400 dark:border-stone-800 dark:bg-stone-800 text-stone-800 dark:text-stone-300 placeholder-stone-800 dark:placeholder-stone-100",sizeSelect:"appearance-none w-full h-full px-6 bg-white dark:bg-stone-700 dark:text-stone-300 text-center border-0 ring-1 ring-inset ring-stone-400 dark:ring-stone-800 rtl:rounded-tl-lg ltr:rounded-tr-lg",tableHeader:"flex flex-row mt-8 h-10",tableCellLink:"dark:text-white",tableCellSubtitle:"block not-italic text-stone-400 dark:text-stone-700",table:"w-full",thead:"bg-stone-100 dark:bg-stone-700",tbody:"divide-y divide-stone-200 dark:divide-stone-800 bg-white dark:bg-stone-800 border border-stone-500 dark:border-none",th:"relative px-1 py-2 px-2 rtl:pr-7 ltr:text-left rtl:text-right text-sm font-semibold text-stone-900 dark:text-stone-300 cursor-pointer",tr:"dark:even:bg-stone-900",td:"whitespace-nowrap px-3 py-2 text-sm text-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-800 relative truncate max-w-[240px]"};function Y(e){e.filters.length>0&&e.container.appendChild(function(e,t){const n=document.createElement("div");return n.className=e.classes.filterContainer,n.id="fuzzy_filters",e.filters.forEach(((s,r)=>{const i=document.createElement("div");i.className=e.classes.fieldsetWrap,i.textContent=s.name,n.appendChild(i);const o=function(e,t,n,s){const r=document.createElement("fieldset");return r.className=s.classes.fieldset,e.options.forEach(((e,i)=>{const o=function(e,t,n){const s=document.createElement("button");return s.className=`${e.filterButton} ${t.active?e.filterButtonActive:""}`,s.textContent=t.title,s.onclick=n,s}(s.classes,e,(()=>n(s,t,i)));r.appendChild(o)})),r}(s,r,t,e);n.appendChild(o)})),n}(e,Z))}function Z(e,t,n){let s=e.data;e.filters[t].options[n].active=""!==e.filters[t].options[n].values,"radio"===e.filters[t].filterType&&e.filters[t].options.forEach(((s,r)=>{r!==n&&(e.filters[t].options[r].active=!1)})),e.filters[t].options[n].active=!0;for(const t of e.filters)for(const e of t.options.filter((e=>e.active)))s=s.filter((n=>{const s=e.value.test(n[t.filterColumn]);return e.active=!0,e.inverse?!s:s}));e.currentPage=0,e.table=s,e.updateTable(),e.fuse=new V(e.table,{shouldSort:!0,includeMatches:!0,threshold:.3,location:0,distance:50,maxPatternLength:12,minMatchCharLength:1,keys:e.head.filter((e=>!1!==e.searchable)).map((e=>e.id))}),e.paginationUpdate(e);const r=document.getElementById("fuzzy_filters");e.filters.forEach(((t,n)=>{const s=r.children[2*n+1];t.options.forEach(((t,n)=>{const r=s.children[n],i=e.classes.filterButtonActive.split(" ");for(const e of i)t.active?r.classList.add(e):r.classList.remove(e)}))}))}function ee(e,t){const n="TSV"===t,s=n?"text/tsv":"application/json",r=n?"data.tsv":"data.json",i=n?(e=>`${Object.keys(e[0]).join("\t")}\n${e.map((e=>Object.values(e).join("\t"))).join("\n")}`)(e):JSON.stringify(e),o=new Blob([i],{type:s}),a=document.createElement("a");a.download=r,a.href=window.URL.createObjectURL(o),document.body.appendChild(a),a.click(),document.body.removeChild(a)}function te(e){const t=e.paginationNav;t.innerHTML="";const n=function(e,t,n){let s=Math.max(e-n,0),r=Math.min(e+n,t-1),i=[];s>0&&(i.push(0),s>1&&i.push("..."));for(let e=s;e<=r;e++)i.push(e);r<t-1&&(r<t-2&&i.push("..."),i.push(t-1));return i}(e.currentPage,Math.ceil(e.table.length/e.size),4),s=document.createDocumentFragment();for(const t of n){const n=ne(e,t);s.appendChild(n)}t.appendChild(s)}function ne(e,t){if("..."===t){const t=document.createElement("span");return t.className=e.classes.paginationButton,t.textContent="...",t}const n=new Intl.NumberFormat(e.locale),s=document.createElement("button");return s.textContent=n.format(t+1),s.className=`${e.classes.paginationButton} ${e.currentPage===t?e.classes.paginationButtonCurrent:""}`,s.onclick=()=>{e.currentPage=t,e.updateTable(),te(e)},s}return class{constructor(e,t,n,s){this.container=document.getElementById(e),t?(this.data=[...t],this.table=[...t]):(this.data=[...JSON.parse(this.container.dataset.rows)],this.table=[...JSON.parse(this.container.dataset.rows)]),this.searchBox,this.query="",this.sortedCol="",this.filters=s.filters??[],this.head=n,this.head=n||[...JSON.parse(this.container.dataset.head)],this.filteredTable=[],this.size=10,this.currentPage=1,this.pageSizes=[10,150,500,1e3,5e3],this.classes=((e={})=>{const t={...X};for(const n of Object.keys(e))n.startsWith("_")?t[n.substring(1)]=e[n]:t[n]=e[n];return t})(s.classes),this.locale=s.locale??"en",this.t=s.t??{search_placeholder:"Search"},this.vernacularNumerals=s.vernacularNumerals??!0,this.fuse=new V(this.table,{shouldSort:!0,includeMatches:!0,threshold:.3,location:0,distance:50,maxPatternLength:12,minMatchCharLength:1,keys:this.head.filter((e=>!1!==e.searchable)).map((e=>e.id))}),this.render()}setData(e){this.update((()=>{this.data=e,this.table=e,this.filteredTable=e.filter((()=>!0))}))}render=()=>{this.container.innerHTML="",Y(this);const e=document.createElement("div");e.className=this.classes.tableContainer;const t=document.createElement("div");t.className=this.classes.tableHeader,t.appendChild(function(e){const t=document.createElement("input");return t.type="search",t.id="fuzzy_search",t.placeholder=e.t?.search_placeholder??"Search",t.className=e.classes.searchInput,t.oninput=()=>{if(""!==e.searchBox.value)e.table=e.fuse.search(e.searchBox.value).slice(0,100).map((e=>e.item));else{let t=e.data;for(const n of e.filters)for(const e of n.options.filter((e=>e.active)))t=t.filter((t=>{const s=e.value.test(t[n.filterColumn]);return e.active=!0,e.inverse?!s:s}));e.table=t}e.currentPage=0,e.updateTable()},e.searchBox=t,t}(this)),t.appendChild(function(e){const t=["JSON","TSV"],n=document.createElement("details");n.className="relative",n.id="fuzzy_download_details";const s=document.createElement("summary");s.className=e.classes.downloadButton;const r=document.createElementNS("http://www.w3.org/2000/svg","svg");r.setAttribute("fill","none"),r.setAttribute("viewBox","0 0 24 24"),r.setAttribute("stroke-width","1.5"),r.setAttribute("stroke","currentColor"),r.setAttribute("class","w-6 h-6"),r.innerHTML='<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />',s.appendChild(r);const i=document.createElement("div");i.className=e.classes.downloadDropdown,i.innerHTML=`<p class="${e.classes.downloadDropdownInfo}">(Download current filtered dataset)</p>`;for(const n of t){const t=document.createElement("button");t.className=e.classes.downloadDropdownButton,t.textContent=n,t.onclick=()=>ee(e.table,n),i.appendChild(t)}return n.appendChild(s),n.appendChild(i),n}(this)),t.appendChild(function(e){const t=document.createElement("div");t.className="relative inline-block";const n=document.createElement("label");n.setAttribute("for","fuzzy_size_select"),n.className="sr-only",n.textContent="Select Page Size",t.appendChild(n);const s=document.createElement("select");s.id="fuzzy_size_select",s.className=e.classes.sizeSelect,t.appendChild(s);const r=new Intl.NumberFormat(e.locale);for(const t of e.pageSizes.filter((t=>t<=e.data.length))){const e=document.createElement("option");e.value=t,e.textContent=r.format(t),s.appendChild(e)}return s.value=e.size,s.addEventListener("change",(t=>{e.size=t.target.value,e.paginationUpdate(),e.updateTable()})),t}(this));const n=document.createElement("table");n.className=this.classes.table;const s=document.createElement("thead");s.className=this.classes.thead;for(const e of this.head){const t=document.createElement("th");t.className=`${this.classes.th} ${e.class}`,t.textContent=e.name;const n=document.createElement("span"),r=document.createElement("span");n.className=this.classes.arrowUp,r.className=this.classes.arrowDown,n.textContent="▲",r.textContent="▼",n.style.opacity=.35,r.style.opacity=.35,t.appendChild(n),t.appendChild(r),t.addEventListener("click",(()=>{for(const e of document.querySelectorAll("th span"))e.style.opacity=.35;t.classList.toggle("ascending")?(n.style.opacity=1,r.style.opacity=.35):(r.style.opacity=1,n.style.opacity=.35),this.table=q(this,e),this.updateTable()})),s.appendChild(t)}n.appendChild(s);const r=document.createElement("tbody");r.id="fuzzy-rows",r.className=this.classes.tbody,K(this,r),n.appendChild(r),e.appendChild(t),e.appendChild(n),function(e,t){if(!e.paginationNav){e.paginationNav=document.createElement("nav"),e.paginationNav.id="paginationNav",e.paginationNav.className=e.classes.paginationNav;const n=document.createElement("div");n.className=e.classes.tablePagination,n.id="paginationContainer",n.appendChild(e.paginationNav),t.appendChild(n)}te(e)}(this,e),this.container.append(e)};safeHtml=e=>{let t=document.createElement("div");t.innerHTML=e;for(const e of["script","iframe","link","style","object","embed"]){let n=t.getElementsByTagName(e);for(let e=n.length-1;e>=0;e--)n[e].parentNode.removeChild(n[e])}return t.firstChild};paginationUpdate=()=>te(this);updateTable=()=>K(this,document.getElementById("fuzzy-rows"))}}));