!function(){"use strict";function t(t){return Array.isArray?Array.isArray(t):"[object Array]"===l(t)}const e=1/0;function n(t){return null==t?"":function(t){if("string"==typeof t)return t;let n=`${t}`;return"0"===n&&1/t==-e?"-0":n}(t)}function s(t){return"string"==typeof t}function r(t){return"number"==typeof t}function i(t){return!0===t||!1===t||function(t){return o(t)&&null!==t}(t)&&"[object Boolean]"===l(t)}function o(t){return"object"==typeof t}function c(t){return null!=t}function a(t){return!t.trim().length}function l(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":Object.prototype.toString.call(t)}const h=t=>`Missing ${t} property in key`,d=t=>`Property 'weight' in key '${t}' must be a positive integer`,u=Object.prototype.hasOwnProperty;class f{constructor(t){this._keys=[],this._keyMap={};let e=0;for(const n of t){let t=g(n);this._keys.push(t),this._keyMap[t.id]=t,e+=t.weight}for(const t of this._keys)t.weight/=e}get(t){return this._keyMap[t]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}}function g(e){let n=null,r=null,i=null,o=1,c=null;if(s(e)||t(e))i=e,n=p(e),r=m(e);else{if(!u.call(e,"name"))throw new Error(h("name"));const t=e.name;if(i=t,u.call(e,"weight")&&(o=e.weight,o<=0))throw new Error(d(t));n=p(t),r=m(t),c=e.getFn}return{path:n,id:r,weight:o,src:i,getFn:c}}function p(e){return t(e)?e:e.split(".")}function m(e){return t(e)?e.join("."):e}let x={isCaseSensitive:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(t,e)=>t.score===e.score?t.idx<e.idx?-1:1:t.score<e.score?-1:1,includeMatches:!1,findAllMatches:!1,minMatchCharLength:1,location:0,threshold:.6,distance:100,...{useExtendedSearch:!1,getFn:function(e,o){let a=[],l=!1;const h=(e,o,d)=>{if(c(e))if(o[d]){const u=e[o[d]];if(!c(u))return;if(d===o.length-1&&(s(u)||r(u)||i(u)))a.push(n(u));else if(t(u)){l=!0;for(let t=0,e=u.length;t<e;t+=1)h(u[t],o,d+1)}else o.length&&h(u,o,d+1)}else a.push(e)};return h(e,s(o)?o.split("."):o,0),l?a:a[0]},ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1}};const b=/[^ ]+/g;class y{constructor({getFn:t=x.getFn,fieldNormWeight:e=x.fieldNormWeight}={}){this.norm=function(t=1,e=3){const n=new Map,s=10**e;return{get(e){const r=e.match(b).length;if(n.has(r))return n.get(r);const i=1/r**(.5*t),o=Number.parseFloat(Math.round(i*s)/s);return n.set(r,o),o},clear(){n.clear()}}}(e,3),this.getFn=t,this.isCreated=!1,this.setIndexRecords()}setSources(t=[]){this.docs=t}setIndexRecords(t=[]){this.records=t}setKeys(t=[]){this.keys=t,this._keysMap={},t.forEach(((t,e)=>{this._keysMap[t.id]=e}))}create(){!this.isCreated&&this.docs.length&&(this.isCreated=!0,s(this.docs[0])?this.docs.forEach(((t,e)=>{this._addString(t,e)})):this.docs.forEach(((t,e)=>{this._addObject(t,e)})),this.norm.clear())}add(t){const e=this.size();s(t)?this._addString(t,e):this._addObject(t,e)}removeAt(t){this.records.splice(t,1);for(let e=t,n=this.size();e<n;e+=1)this.records[e].i-=1}getValueForItemAtKeyId(t,e){return t[this._keysMap[e]]}size(){return this.records.length}_addString(t,e){if(!c(t)||a(t))return;let n={v:t,i:e,n:this.norm.get(t)};this.records.push(n)}_addObject(e,n){let r={i:n,$:{}};this.keys.forEach(((n,i)=>{let o=n.getFn?n.getFn(e):this.getFn(e,n.path);if(c(o))if(t(o)){let e=[];const n=[{nestedArrIndex:-1,value:o}];for(;n.length;){const{nestedArrIndex:r,value:i}=n.pop();if(c(i))if(s(i)&&!a(i)){let t={v:i,i:r,n:this.norm.get(i)};e.push(t)}else t(i)&&i.forEach(((t,e)=>{n.push({nestedArrIndex:e,value:t})}))}r.$[i]=e}else if(s(o)&&!a(o)){let t={v:o,n:this.norm.get(o)};r.$[i]=t}})),this.records.push(r)}toJSON(){return{keys:this.keys,records:this.records}}}function k(t,e,{getFn:n=x.getFn,fieldNormWeight:s=x.fieldNormWeight}={}){const r=new y({getFn:n,fieldNormWeight:s});return r.setKeys(t.map(g)),r.setSources(e),r.create(),r}function M(t,{errors:e=0,currentLocation:n=0,expectedLocation:s=0,distance:r=x.distance,ignoreLocation:i=x.ignoreLocation}={}){const o=e/t.length;if(i)return o;const c=Math.abs(s-n);return r?o+c/r:c?1:o}const w=32;function v(t,e,n,{location:s=x.location,distance:r=x.distance,threshold:i=x.threshold,findAllMatches:o=x.findAllMatches,minMatchCharLength:c=x.minMatchCharLength,includeMatches:a=x.includeMatches,ignoreLocation:l=x.ignoreLocation}={}){if(e.length>w)throw new Error(`Pattern length exceeds max of ${w}.`);const h=e.length,d=t.length,u=Math.max(0,Math.min(s,d));let f=i,g=u;const p=c>1||a,m=p?Array(d):[];let b;for(;(b=t.indexOf(e,g))>-1;){let t=M(e,{currentLocation:b,expectedLocation:u,distance:r,ignoreLocation:l});if(f=Math.min(t,f),g=b+h,p){let t=0;for(;t<h;)m[b+t]=1,t+=1}}g=-1;let y=[],k=1,v=h+d;const C=1<<h-1;for(let s=0;s<h;s+=1){let i=0,c=v;for(;i<c;){M(e,{errors:s,currentLocation:u+c,expectedLocation:u,distance:r,ignoreLocation:l})<=f?i=c:v=c,c=Math.floor((v-i)/2+i)}v=c;let a=Math.max(1,u-c+1),x=o?d:Math.min(u+c,d)+h,b=Array(x+2);b[x+1]=(1<<s)-1;for(let i=x;i>=a;i-=1){let o=i-1,c=n[t.charAt(o)];if(p&&(m[o]=+!!c),b[i]=(b[i+1]<<1|1)&c,s&&(b[i]|=(y[i+1]|y[i])<<1|1|y[i+1]),b[i]&C&&(k=M(e,{errors:s,currentLocation:o,expectedLocation:u,distance:r,ignoreLocation:l}),k<=f)){if(f=k,g=o,g<=u)break;a=Math.max(1,2*u-g)}}if(M(e,{errors:s+1,currentLocation:u,expectedLocation:u,distance:r,ignoreLocation:l})>f)break;y=b}const L={isMatch:g>=0,score:Math.max(.001,k)};if(p){const t=function(t=[],e=x.minMatchCharLength){let n=[],s=-1,r=-1,i=0;for(let o=t.length;i<o;i+=1){let o=t[i];o&&-1===s?s=i:o||-1===s||(r=i-1,r-s+1>=e&&n.push([s,r]),s=-1)}return t[i-1]&&i-s>=e&&n.push([s,i-1]),n}(m,c);t.length?a&&(L.indices=t):L.isMatch=!1}return L}function C(t){let e={};for(let n=0,s=t.length;n<s;n+=1){const r=t.charAt(n);e[r]=(e[r]||0)|1<<s-n-1}return e}class L{constructor(t,{location:e=x.location,threshold:n=x.threshold,distance:s=x.distance,includeMatches:r=x.includeMatches,findAllMatches:i=x.findAllMatches,minMatchCharLength:o=x.minMatchCharLength,isCaseSensitive:c=x.isCaseSensitive,ignoreLocation:a=x.ignoreLocation}={}){if(this.options={location:e,threshold:n,distance:s,includeMatches:r,findAllMatches:i,minMatchCharLength:o,isCaseSensitive:c,ignoreLocation:a},this.pattern=c?t:t.toLowerCase(),this.chunks=[],!this.pattern.length)return;const l=(t,e)=>{this.chunks.push({pattern:t,alphabet:C(t),startIndex:e})},h=this.pattern.length;if(h>w){let t=0;const e=h%w,n=h-e;for(;t<n;)l(this.pattern.substr(t,w),t),t+=w;if(e){const t=h-w;l(this.pattern.substr(t),t)}}else l(this.pattern,0)}searchIn(t){const{isCaseSensitive:e,includeMatches:n}=this.options;if(e||(t=t.toLowerCase()),this.pattern===t){let e={isMatch:!0,score:0};return n&&(e.indices=[[0,t.length-1]]),e}const{location:s,distance:r,threshold:i,findAllMatches:o,minMatchCharLength:c,ignoreLocation:a}=this.options;let l=[],h=0,d=!1;this.chunks.forEach((({pattern:e,alphabet:u,startIndex:f})=>{const{isMatch:g,score:p,indices:m}=v(t,e,u,{location:s+f,distance:r,threshold:i,findAllMatches:o,minMatchCharLength:c,includeMatches:n,ignoreLocation:a});g&&(d=!0),h+=p,g&&m&&(l=[...l,...m])}));let u={isMatch:d,score:d?h/this.chunks.length:1};return d&&n&&(u.indices=l),u}}class ${constructor(t){this.pattern=t}static isMultiMatch(t){return S(t,this.multiRegex)}static isSingleMatch(t){return S(t,this.singleRegex)}search(){}}function S(t,e){const n=t.match(e);return n?n[1]:null}class _ extends ${constructor(t,{location:e=x.location,threshold:n=x.threshold,distance:s=x.distance,includeMatches:r=x.includeMatches,findAllMatches:i=x.findAllMatches,minMatchCharLength:o=x.minMatchCharLength,isCaseSensitive:c=x.isCaseSensitive,ignoreLocation:a=x.ignoreLocation}={}){super(t),this._bitapSearch=new L(t,{location:e,threshold:n,distance:s,includeMatches:r,findAllMatches:i,minMatchCharLength:o,isCaseSensitive:c,ignoreLocation:a})}static get type(){return"fuzzy"}static get multiRegex(){return/^"(.*)"$/}static get singleRegex(){return/^(.*)$/}search(t){return this._bitapSearch.searchIn(t)}}class E extends ${constructor(t){super(t)}static get type(){return"include"}static get multiRegex(){return/^'"(.*)"$/}static get singleRegex(){return/^'(.*)$/}search(t){let e,n=0;const s=[],r=this.pattern.length;for(;(e=t.indexOf(this.pattern,n))>-1;)n=e+r,s.push([e,n-1]);const i=!!s.length;return{isMatch:i,score:i?0:1,indices:s}}}const I=[class extends ${constructor(t){super(t)}static get type(){return"exact"}static get multiRegex(){return/^="(.*)"$/}static get singleRegex(){return/^=(.*)$/}search(t){const e=t===this.pattern;return{isMatch:e,score:e?0:1,indices:[0,this.pattern.length-1]}}},E,class extends ${constructor(t){super(t)}static get type(){return"prefix-exact"}static get multiRegex(){return/^\^"(.*)"$/}static get singleRegex(){return/^\^(.*)$/}search(t){const e=t.startsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[0,this.pattern.length-1]}}},class extends ${constructor(t){super(t)}static get type(){return"inverse-prefix-exact"}static get multiRegex(){return/^!\^"(.*)"$/}static get singleRegex(){return/^!\^(.*)$/}search(t){const e=!t.startsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[0,t.length-1]}}},class extends ${constructor(t){super(t)}static get type(){return"inverse-suffix-exact"}static get multiRegex(){return/^!"(.*)"\$$/}static get singleRegex(){return/^!(.*)\$$/}search(t){const e=!t.endsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[0,t.length-1]}}},class extends ${constructor(t){super(t)}static get type(){return"suffix-exact"}static get multiRegex(){return/^"(.*)"\$$/}static get singleRegex(){return/^(.*)\$$/}search(t){const e=t.endsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[t.length-this.pattern.length,t.length-1]}}},class extends ${constructor(t){super(t)}static get type(){return"inverse-exact"}static get multiRegex(){return/^!"(.*)"$/}static get singleRegex(){return/^!(.*)$/}search(t){const e=-1===t.indexOf(this.pattern);return{isMatch:e,score:e?0:1,indices:[0,t.length-1]}}},_],N=I.length,A=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;const F=new Set([_.type,E.type]);class j{constructor(t,{isCaseSensitive:e=x.isCaseSensitive,includeMatches:n=x.includeMatches,minMatchCharLength:s=x.minMatchCharLength,ignoreLocation:r=x.ignoreLocation,findAllMatches:i=x.findAllMatches,location:o=x.location,threshold:c=x.threshold,distance:a=x.distance}={}){this.query=null,this.options={isCaseSensitive:e,includeMatches:n,minMatchCharLength:s,findAllMatches:i,ignoreLocation:r,location:o,threshold:c,distance:a},this.pattern=e?t:t.toLowerCase(),this.query=function(t,e={}){return t.split("|").map((t=>{let n=t.trim().split(A).filter((t=>t&&!!t.trim())),s=[];for(let t=0,r=n.length;t<r;t+=1){const r=n[t];let i=!1,o=-1;for(;!i&&++o<N;){const t=I[o];let n=t.isMultiMatch(r);n&&(s.push(new t(n,e)),i=!0)}if(!i)for(o=-1;++o<N;){const t=I[o];let n=t.isSingleMatch(r);if(n){s.push(new t(n,e));break}}}return s}))}(this.pattern,this.options)}static condition(t,e){return e.useExtendedSearch}searchIn(t){const e=this.query;if(!e)return{isMatch:!1,score:1};const{includeMatches:n,isCaseSensitive:s}=this.options;t=s?t:t.toLowerCase();let r=0,i=[],o=0;for(let s=0,c=e.length;s<c;s+=1){const c=e[s];i.length=0,r=0;for(let e=0,s=c.length;e<s;e+=1){const s=c[e],{isMatch:a,indices:l,score:h}=s.search(t);if(!a){o=0,r=0,i.length=0;break}if(r+=1,o+=h,n){const t=s.constructor.type;F.has(t)?i=[...i,...l]:i.push(l)}}if(r){let t={isMatch:!0,score:o/r};return n&&(t.indices=i),t}}return{isMatch:!1,score:1}}}const R=[];function O(t,e){for(let n=0,s=R.length;n<s;n+=1){let s=R[n];if(s.condition(t,e))return new s(t,e)}return new L(t,e)}const W="$and",z="$or",B="$path",P="$val",T=t=>!(!t[W]&&!t[z]),D=t=>({[W]:Object.keys(t).map((e=>({[e]:t[e]})))});function K(e,n,{auto:r=!0}={}){const i=e=>{let c=Object.keys(e);const a=(t=>!!t[B])(e);if(!a&&c.length>1&&!T(e))return i(D(e));if((e=>!t(e)&&o(e)&&!T(e))(e)){const t=a?e[B]:c[0],i=a?e[P]:e[t];if(!s(i))throw new Error((t=>`Invalid value for key ${t}`)(t));const o={keyId:m(t),pattern:i};return r&&(o.searcher=O(i,n)),o}let l={children:[],operator:c[0]};return c.forEach((n=>{const s=e[n];t(s)&&s.forEach((t=>{l.children.push(i(t))}))})),l};return T(e)||(e=D(e)),i(e)}function U(t,e){const n=t.matches;e.matches=[],c(n)&&n.forEach((t=>{if(!c(t.indices)||!t.indices.length)return;const{indices:n,value:s}=t;let r={indices:n,value:s};t.key&&(r.key=t.key.src),t.idx>-1&&(r.refIndex=t.idx),e.matches.push(r)}))}function H(t,e){e.score=t.score}class J{constructor(t,e={},n){this.options={...x,...e},this.options.useExtendedSearch,this._keyStore=new f(this.options.keys),this.setCollection(t,n)}setCollection(t,e){if(this._docs=t,e&&!(e instanceof y))throw new Error("Incorrect 'index' type");this._myIndex=e||k(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}add(t){c(t)&&(this._docs.push(t),this._myIndex.add(t))}remove(t=(()=>!1)){const e=[];for(let n=0,s=this._docs.length;n<s;n+=1){const r=this._docs[n];t(r,n)&&(this.removeAt(n),n-=1,s-=1,e.push(r))}return e}removeAt(t){this._docs.splice(t,1),this._myIndex.removeAt(t)}getIndex(){return this._myIndex}search(t,{limit:e=-1}={}){const{includeMatches:n,includeScore:i,shouldSort:o,sortFn:c,ignoreFieldNorm:a}=this.options;let l=s(t)?s(this._docs[0])?this._searchStringList(t):this._searchObjectList(t):this._searchLogical(t);return function(t,{ignoreFieldNorm:e=x.ignoreFieldNorm}){t.forEach((t=>{let n=1;t.matches.forEach((({key:t,norm:s,score:r})=>{const i=t?t.weight:null;n*=Math.pow(0===r&&i?Number.EPSILON:r,(i||1)*(e?1:s))})),t.score=n}))}(l,{ignoreFieldNorm:a}),o&&l.sort(c),r(e)&&e>-1&&(l=l.slice(0,e)),function(t,e,{includeMatches:n=x.includeMatches,includeScore:s=x.includeScore}={}){const r=[];return n&&r.push(U),s&&r.push(H),t.map((t=>{const{idx:n}=t,s={item:e[n],refIndex:n};return r.length&&r.forEach((e=>{e(t,s)})),s}))}(l,this._docs,{includeMatches:n,includeScore:i})}_searchStringList(t){const e=O(t,this.options),{records:n}=this._myIndex,s=[];return n.forEach((({v:t,i:n,n:r})=>{if(!c(t))return;const{isMatch:i,score:o,indices:a}=e.searchIn(t);i&&s.push({item:t,idx:n,matches:[{score:o,value:t,norm:r,indices:a}]})})),s}_searchLogical(t){const e=K(t,this.options),n=(t,e,s)=>{if(!t.children){const{keyId:n,searcher:r}=t,i=this._findMatches({key:this._keyStore.get(n),value:this._myIndex.getValueForItemAtKeyId(e,n),searcher:r});return i&&i.length?[{idx:s,item:e,matches:i}]:[]}const r=[];for(let i=0,o=t.children.length;i<o;i+=1){const o=t.children[i],c=n(o,e,s);if(c.length)r.push(...c);else if(t.operator===W)return[]}return r},s=this._myIndex.records,r={},i=[];return s.forEach((({$:t,i:s})=>{if(c(t)){let o=n(e,t,s);o.length&&(r[s]||(r[s]={idx:s,item:t,matches:[]},i.push(r[s])),o.forEach((({matches:t})=>{r[s].matches.push(...t)})))}})),i}_searchObjectList(t){const e=O(t,this.options),{keys:n,records:s}=this._myIndex,r=[];return s.forEach((({$:t,i:s})=>{if(!c(t))return;let i=[];n.forEach(((n,s)=>{i.push(...this._findMatches({key:n,value:t[s],searcher:e}))})),i.length&&r.push({idx:s,item:t,matches:i})})),r}_findMatches({key:e,value:n,searcher:s}){if(!c(n))return[];let r=[];if(t(n))n.forEach((({v:t,i:n,n:i})=>{if(!c(t))return;const{isMatch:o,score:a,indices:l}=s.searchIn(t);o&&r.push({score:a,key:e,value:t,idx:n,norm:i,indices:l})}));else{const{v:t,n:i}=n,{isMatch:o,score:c,indices:a}=s.searchIn(t);o&&r.push({score:c,key:e,value:t,norm:i,indices:a})}return r}}function q(t,e){const n=e.id,s=t.sortedCol===n;return t.sortedCol=s?"":n,"int"===e.type?t.table.sort(((t,e)=>s?e[n]-t[n]:t[n]-e[n])):t.table.sort(((t,e)=>{const r=t[n]??"",i=e[n]??"";return s?i.localeCompare(r):r.localeCompare(i)}))}J.version="7.0.0",J.createIndex=k,J.parseIndex=function(t,{getFn:e=x.getFn,fieldNormWeight:n=x.fieldNormWeight}={}){const{keys:s,records:r}=t,i=new y({getFn:e,fieldNormWeight:n});return i.setKeys(s),i.setIndexRecords(r),i},J.config=x,J.parseQuery=K,function(...t){R.push(...t)}(j);const V=(t,e)=>{const[n,s]=(r=t.currentPage,i=t.size,[(r+1)*i-i,(r+1)*i]);var r,i;const o=t.table.slice(n,s);e.innerHTML="";for(const n of o){const s=document.createElement("tr");s.className=t.classes.tr;for(const e of t.head){const r=document.createElement("td");r.className=`${e.class} ${e.id} ${t.classes.tableColumn}`,r.setAttribute("data-type",e.type);const i=n[e.id]??"",o=G(i,e.type,t.locale),c=new DocumentFragment;if(e.icon&&c.appendChild(Q(e.icon,n[e.icon.id]??"")),c.appendChild(document.createTextNode(o)),e.link){const s=document.createElement("a");s.className=t.classes.tableCellLink,s.href=`${e.link.base?e.link.base:""}${n[e.link.id]}`,s.appendChild(c),r.appendChild(s)}else r.appendChild(c);e.suffix&&""!==i&&r.appendChild(t.safeHtml(e.suffix)),s.appendChild(r)}e.appendChild(s)}},Q=(t,e)=>{const n=document.createElementNS("http://www.w3.org/2000/svg","svg"),s=document.createElementNS("http://www.w3.org/2000/svg","use");return s.setAttribute("href",`${t.base}${e}`),s.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",`#${e}`),n.setAttribute("class",t.class),n.appendChild(s),n},G=(t,e,n)=>"int"===e?new Intl.NumberFormat(n).format(t):t,X={pagination:"",sortArrow:"",arrowUp:"absolute right-2 top-0.5 text-sm",arrowDown:"absolute right-2 bottom-0.5 text-sm",paginationButton:"w-10 h-10 inline-flex justify-center items-center border dark:border-stone-900",paginationButtonCurrent:"text-lg font-bold text-white",paginationNav:"relative z-0 flex mt-4 justify-center rounded-md -space-x-px dark:text-stone-300",downloadButton:"relative inline-flex items-center bg-white dark:bg-stone-700 px-2 h-10 dark:text-stone-300 ring-1 ring-inset ring-stone-400 dark:ring-stone-800 focus:z-10",downloadDropdown:"absolute left-0 z-50 -mr-1 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-stone-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",downloadDropdownButton:"text-stone-700 dark:text-stone-300 hover:dark:bg-stone-900 hover:bg-stone-200 w-full block px-4 py-2 text-sm text-left",downloadDropdownInfo:"text-center text-xs text-stone-700 dark:text-stone-300 py-2",fieldsetWrap:"block mt-8 w-full bg-gray-200 dark:bg-stone-700 text-sm font-semibold p-3 text-stone-900 dark:text-stone-300 border-b border-stone-200 dark:border-stone-500 rounded-t-lg",fieldsetFilterWrap:"mb-4 dark:bg-stone-900 border border-stone-200 dark:border-stone-950 p-2",fieldset:"mb-4 dark:bg-stone-900 border border-stone-200 dark:border-stone-950 p-2",filterContainer:"hidden sm:flex flex-col lg:w-1/5 ltr:mr-4 rtl:ml-4",filterButton:"text-sm relative px-2 py-1 my-2 w-full flex items-center justify-center cursor-pointer rounded-lg border dark:text-stone-300 dark:bg-stone-800 border-stone-200 dark:border-stone-500 shadow-sm",filterButtonActive:"bg-stone-400 dark:bg-stone-950 text-white border-stone-800",tableContainer:"flex flex-col w-full relative z-10 max-w-7xl mx-auto",tableColumn:"whitespace-nowrap px-3 py-2 text-sm text-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-800 relative truncate max-w-[240px]",searchInput:"block w-full px-4 text-sm shadow-lg border border-stone-400 dark:border-stone-800 dark:bg-stone-700 text-stone-800 dark:text-stone-300 placeholder-stone-800 dark:placeholder-stone-100 rounded-tl-xl",searchBox:"block w-full px-4 text-sm shadow-lg border border-stone-400 dark:border-stone-800 dark:bg-stone-800 text-stone-800 dark:text-stone-300 placeholder-stone-800 dark:placeholder-stone-100",sizeSelect:"appearance-none w-full h-full px-6 bg-white dark:bg-stone-700 dark:text-stone-300 text-center ring-1 ring-inset ring-stone-400 dark:ring-stone-800 rtl:rounded-tl-lg ltr:rounded-tr-lg",tableHeader:"flex flex-row mt-8 h-10",tableCellLink:"text-white",table:"w-full",thead:"bg-stone-100 dark:bg-stone-700",tbody:"divide-y divide-stone-200 dark:divide-stone-800 bg-white dark:bg-stone-800 border border-stone-500 dark:border-none",th:"relative px-1 py-2 px-2 rtl:pr-7 ltr:text-left rtl:text-right text-sm font-semibold text-stone-900 dark:text-stone-300 cursor-pointer",tr:"dark:even:bg-stone-900",td:"whitespace-nowrap px-3 py-2 text-sm text-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-800 relative truncate max-w-[240px]"};function Y(t){t.filters.length>0&&t.container.appendChild(function(t,e){const n=document.createElement("div");return n.className=t.classes.filterContainer,n.id="fuzzy_filters",t.filters.forEach(((s,r)=>{const i=document.createElement("div");i.className=t.classes.fieldsetWrap,i.textContent=s.name,n.appendChild(i);const o=function(t,e,n,s){const r=document.createElement("fieldset");return r.className=s.classes.fieldset,t.options.forEach(((t,i)=>{const o=function(t,e,n){const s=document.createElement("button");return s.className=`${t.filterButton} ${e.active?t.filterButtonActive:""}`,s.textContent=e.title,s.onclick=n,s}(s.classes,t,(()=>n(s,e,i)));r.appendChild(o)})),r}(s,r,e,t);n.appendChild(o)})),n}(t,Z))}function Z(t,e,n){let s=t.data;t.filters[e].options[n].active=""!==t.filters[e].options[n].values,"radio"===t.filters[e].filterType&&t.filters[e].options.forEach(((s,r)=>{r!==n&&(t.filters[e].options[r].active=!1)})),t.filters[e].options[n].active=!0;for(const e of t.filters)for(const t of e.options.filter((t=>t.active)))s=s.filter((n=>{const s=t.value.test(n[e.filterColumn]);return t.active=!0,t.inverse?!s:s}));t.currentPage=0,t.table=s,t.updateTable(),t.fuse=new J(t.table,{shouldSort:!0,includeMatches:!0,threshold:.3,location:0,distance:50,maxPatternLength:12,minMatchCharLength:1,keys:t.head.filter((t=>!1!==t.searchable)).map((t=>t.id))}),t.paginationUpdate(t);const r=document.getElementById("fuzzy_filters");t.filters.forEach(((e,n)=>{const s=r.children[2*n+1];e.options.forEach(((e,n)=>{const r=s.children[n],i=t.classes.filterButtonActive.split(" ");for(const t of i)e.active?r.classList.add(t):r.classList.remove(t)}))}))}function tt(t,e){const n="TSV"===e,s=n?"text/tsv":"application/json",r=n?"data.tsv":"data.json",i=n?(t=>`${Object.keys(t[0]).join("\t")}\n${t.map((t=>Object.values(t).join("\t"))).join("\n")}`)(t):JSON.stringify(t),o=new Blob([i],{type:s}),c=document.createElement("a");c.download=r,c.href=window.URL.createObjectURL(o),document.body.appendChild(c),c.click(),document.body.removeChild(c)}function et(t){const e=t.paginationNav;e.innerHTML="";const n=function(t,e,n){let s=Math.max(t-n,0),r=Math.min(t+n,e-1),i=[];s>0&&(i.push(0),s>1&&i.push("..."));for(let t=s;t<=r;t++)i.push(t);r<e-1&&(r<e-2&&i.push("..."),i.push(e-1));return i}(t.currentPage,Math.ceil(t.table.length/t.size),4),s=document.createDocumentFragment();for(const e of n){const n=nt(t,e);s.appendChild(n)}e.appendChild(s)}function nt(t,e){if("..."===e){const e=document.createElement("span");return e.className=t.classes.paginationButton,e.textContent="...",e}const n=new Intl.NumberFormat(t.locale),s=document.createElement("button");return s.textContent=n.format(e+1),s.className=`${t.classes.paginationButton} ${t.currentPage===e?t.classes.paginationButtonCurrent:""}`,s.onclick=()=>{t.currentPage=e,t.updateTable(),et(t)},s}}();