(function(){function e(t){"@babel/helpers - typeof";return e=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},e(t)}function t(e){return i(e)||r(e)||s(e)||n()}function n(){throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function r(e){if(typeof Symbol<`u`&&e[Symbol.iterator]!=null||e[`@@iterator`]!=null)return Array.from(e)}function i(e){if(Array.isArray(e))return c(e)}function a(e,t){return u(e)||l(e,t)||s(e,t)||o()}function o(){throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function s(e,t){if(e){if(typeof e==`string`)return c(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?c(e,t):void 0}}function c(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function l(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r,i,a,o,s=[],c=!0,l=!1;try{if(a=(n=n.call(e)).next,t===0){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);c=!0);}catch(e){l=!0,i=e}finally{try{if(!c&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw i}}return s}}function u(e){if(Array.isArray(e))return e}function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function f(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?d(Object(n),!0).forEach(function(t){p(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function p(e,t,n){return(t=m(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function m(t){var n=h(t,`string`);return e(n)==`symbol`?n:n+``}function h(t,n){if(e(t)!=`object`||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var i=r.call(t,n||`default`);if(e(i)!=`object`)return i;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(n===`string`?String:Number)(t)}function g(){var e,t,n=typeof Symbol==`function`?Symbol:{},r=n.iterator||`@@iterator`,i=n.toStringTag||`@@toStringTag`;function a(n,r,i,a){var c=r&&r.prototype instanceof s?r:s,l=Object.create(c.prototype);return _(l,`_invoke`,function(n,r,i){var a,s,c,l=0,u=i||[],d=!1,f={p:0,n:0,v:e,a:p,f:p.bind(e,4),d:function(t,n){return a=t,s=0,c=e,f.n=n,o}};function p(n,r){for(s=n,c=r,t=0;!d&&l&&!i&&t<u.length;t++){var i,a=u[t],p=f.p,m=a[2];n>3?(i=m===r)&&(c=a[(s=a[4])?5:(s=3,3)],a[4]=a[5]=e):a[0]<=p&&((i=n<2&&p<a[1])?(s=0,f.v=r,f.n=a[1]):p<m&&(i=n<3||a[0]>r||r>m)&&(a[4]=n,a[5]=r,f.n=m,s=0))}if(i||n>1)return o;throw d=!0,r}return function(i,u,m){if(l>1)throw TypeError(`Generator is already running`);for(d&&u===1&&p(u,m),s=u,c=m;(t=s<2?e:c)||!d;){a||(s?s<3?(s>1&&(f.n=-1),p(s,c)):f.n=c:f.v=c);try{if(l=2,a){if(s||(i=`next`),t=a[i]){if(!(t=t.call(a,c)))throw TypeError(`iterator result is not an object`);if(!t.done)return t;c=t.value,s<2&&(s=0)}else s===1&&(t=a.return)&&t.call(a),s<2&&(c=TypeError(`The iterator does not provide a '`+i+`' method`),s=1);a=e}else if((t=(d=f.n<0)?c:n.call(r,f))!==o)break}catch(t){a=e,s=1,c=t}finally{l=1}}return{value:t,done:d}}}(n,i,a),!0),l}var o={};function s(){}function c(){}function l(){}t=Object.getPrototypeOf;var u=[][r]?t(t([][r]())):(_(t={},r,function(){return this}),t),d=l.prototype=s.prototype=Object.create(u);function f(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,l):(e.__proto__=l,_(e,i,`GeneratorFunction`)),e.prototype=Object.create(d),e}return c.prototype=l,_(d,`constructor`,l),_(l,`constructor`,c),c.displayName=`GeneratorFunction`,_(l,i,`GeneratorFunction`),_(d),_(d,i,`Generator`),_(d,r,function(){return this}),_(d,`toString`,function(){return`[object Generator]`}),(g=function(){return{w:a,m:f}})()}function _(e,t,n,r){var i=Object.defineProperty;try{i({},``,{})}catch{i=0}_=function(e,t,n,r){function a(t,n){_(e,t,function(e){return this._invoke(t,n,e)})}t?i?i(e,t,{value:n,enumerable:!r,configurable:!r,writable:!r}):e[t]=n:(a(`next`,0),a(`throw`,1),a(`return`,2))},_(e,t,n,r)}function v(e,t){var n=typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(!n){if(Array.isArray(e)||(n=y(e))||t&&e&&typeof e.length==`number`){n&&(e=n);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var a,o=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return o=e.done,e},e:function(e){s=!0,a=e},f:function(){try{o||n.return==null||n.return()}finally{if(s)throw a}}}}function y(e,t){if(e){if(typeof e==`string`)return b(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?b(e,t):void 0}}function b(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function x(e,t,n,r,i,a,o){try{var s=e[a](o),c=s.value}catch(e){n(e);return}s.done?t(c):Promise.resolve(c).then(r,i)}function S(e){return function(){var t=this,n=arguments;return new Promise(function(r,i){var a=e.apply(t,n);function o(e){x(a,r,i,o,s,`next`,e)}function s(e){x(a,r,i,o,s,`throw`,e)}o(void 0)})}}System.register([],function(e,n){var r,i,o,s,c,l,u,d,p,m,h,_,y,b,x,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R;function z(e){return B.apply(this,arguments)}function B(){return B=S(g().m(function e(t){var n,r,i;return g().w(function(e){for(;;)switch(e.n){case 0:return n=t.toLowerCase(),r=`Based on clinical guidelines, I'd recommend discussing this with your doctor at your next visit.`,n.includes(`iron`)||n.includes(`diet`)||n.includes(`food`)?r=`A balanced diet is crucial during pregnancy! Excellent sources of iron include lean red meat, poultry, beans, lentils, spinach, and iron-fortified cereals. Remember to pair iron-rich foods with vitamin C for better absorption.`:n.includes(`sleep`)?r=`Sleeping on your left side (SOS) is highly recommended during the second and third trimesters as it improves blood flow to the placenta and your baby. Try using a pregnancy pillow for extra support!`:n.includes(`kick`)||n.includes(`movement`)?r=`Tracking baby kicks is a great way to monitor your baby's well-being. You should generally feel about 10 movements within 2 hours. If you notice a significant decrease, contact your healthcare provider immediately.`:n.includes(`blood pressure`)||n.includes(`bp`)?r=`Monitoring blood pressure is important to watch for signs of preeclampsia. A normal reading is typically around 120/80. If it consistently reads higher than 140/90, please consult your doctor.`:n.includes(`contraction`)||n.includes(`labor`)?r=`Braxton Hicks (practice contractions) are normal and usually irregular. True labor contractions will become closer together, stronger, and more regular. If you're unsure or before 37 weeks, always call your provider.`:(n.includes(`nausea`)||n.includes(`morning sickness`))&&(r=`Nausea is very common, especially in the first trimester. Try eating small, frequent meals, keeping crackers by your bed, and staying hydrated. Ginger and vitamin B6 can also help.`),i=Math.floor(Math.random()*1e3)+1e3,e.a(2,new Promise(function(e){return setTimeout(function(){return e(r)},i)}))}},e)})),B.apply(this,arguments)}return{setters:[],execute:function(){r=document.createElement(`style`),r.textContent=`@import "https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700;800;900&display=swap";:root{--clr-primary:#6da171;--clr-dark-green:#436746;--clr-mid-green:#6b8e6d;--clr-accent-green:#8db48e;--clr-green-10:rgba(141,180,142,.1);--clr-green-tint:rgba(194,237,203,.3);--clr-text-heading:#0f110f;--clr-text-primary:#121412;--clr-text-dark:#1a1c1a;--clr-text-body:#2d332d;--clr-text-body-alt:#2d312d;--clr-text-body-alt2:#2d2f2f;--clr-text-muted:#5c615c;--clr-text-muted-alt:#5a5c5c;--clr-text-placeholder:#8e938e;--clr-text-warm:#80543b;--clr-bg-white:#fff;--clr-bg-warm:#faf9f6;--clr-bg-input:#f9faf9;--clr-bg-card:#f4f3f1;--clr-bg-pill:#efeeeb;--clr-bg-glass:rgba(255,255,255,.85);--clr-bg-glass-footer:rgba(250,249,246,.8);--clr-border-input:#dce1dc;--clr-border-glass:rgba(255,255,255,.3);--clr-border-subtle:rgba(0,0,0,.05);--clr-border-device:rgba(172,173,173,.3);--clr-divider:rgba(0,0,0,.1);--clr-purple:#625190;--clr-purple-bg:rgba(193,174,245,.3);--clr-oximeter-bg:rgba(232,240,232,.4);--clr-danger:#ba1a1a;--clr-danger-bg:rgba(186,26,26,.1);--clr-info-brown:#665d4e;--clr-info-brown-bg:rgba(102,93,78,.1);--grad-btn-primary:linear-gradient(102.26deg, #436746 0%, #6b8e6d 100%);--grad-btn-cta:none;--grad-kick:linear-gradient(135deg, #436746 0%, #8db48e 100%);--grad-stress:linear-gradient(90deg, #4caf82 0%, #f59e0b 50%, #e8547a 100%);--grad-overlay:linear-gradient(180deg, rgba(255,255,255,.6) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,.9) 100%);--shadow-btn-green:0px 15px 30px -5px rgba(109,161,113,.4);--shadow-btn-action:0px 10px 15px -3px rgba(67,103,70,.3), 0px 4px 6px -4px rgba(67,103,70,.3);--shadow-btn-accent:0px 10px 15px -3px rgba(141,180,142,.2), 0px 4px 6px -4px rgba(141,180,142,.2);--shadow-card-glass:0px 32px 64px -16px rgba(0,0,0,.2);--shadow-card-white:0px 25px 50px -12px rgba(0,0,0,.25);--shadow-card-device:0px 12px 32px -8px rgba(141,180,142,.08);--shadow-header:0px 8px 32px rgba(26,28,26,.06);--shadow-footer:0px -8px 32px rgba(26,28,26,.06);--shadow-xs:0px 1px 2px rgba(0,0,0,.05);--shadow-text:0px 1px 1px rgba(0,0,0,.05);--r-pill:9999px;--r-card-xl:48px;--r-card-lg:40px;--r-card:32px;--r-sm:16px;--font-family:"Lexend", system-ui, -apple-system, sans-serif}*,:before,:after{box-sizing:border-box}*{margin:0;padding:0}body{line-height:1.62;font-family:var(--font-family);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background-color:var(--clr-bg-white);color:var(--clr-text-body);user-select:none;-webkit-tap-highlight-color:transparent;overflow-x:hidden}input,textarea{user-select:auto}img,picture,video,canvas,svg{max-width:100%;display:block}input,button,textarea,select{font:inherit;background:0 0;border:none;outline:none}p,h1,h2,h3,h4,h5,h6{overflow-wrap:break-word}a{color:inherit;text-decoration:none}button{cursor:pointer}h1{letter-spacing:-.9px;color:var(--clr-text-heading);font-size:36px;font-weight:900;line-height:1.25}h2{letter-spacing:-.75px;color:var(--clr-text-body-alt2);font-size:30px;font-weight:700;line-height:1.25}h3{letter-spacing:-.5px;color:var(--clr-dark-green);font-size:20px;font-weight:700;line-height:1.4}.subtitle{color:var(--clr-text-heading);font-size:18px;font-weight:500;line-height:1.62}.label{letter-spacing:1.2px;text-transform:uppercase;color:var(--clr-text-body);font-size:12px;font-weight:800;line-height:1.33}.micro-label{letter-spacing:1.1px;text-transform:uppercase;color:var(--clr-accent-green);font-size:11px;font-weight:700;line-height:1.5}.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}.btn{border-radius:var(--r-pill);justify-content:center;align-items:center;gap:12px;transition:transform .2s,box-shadow .2s,opacity .2s;display:inline-flex}.btn:active{transform:scale(.98)}.btn-primary{background:var(--clr-primary);color:var(--clr-bg-white);box-shadow:var(--shadow-btn-green);width:100%;height:68px;padding:20px 32px;font-size:20px;font-weight:700}.btn-secondary{border:2px solid var(--clr-primary);color:var(--clr-primary);backdrop-filter:blur(2px);background:rgba(255,255,255,.8);width:100%;height:72px;padding:20px 32px;font-size:18px;font-weight:700}.btn-action{background:var(--grad-btn-primary);color:var(--clr-bg-white);box-shadow:var(--shadow-btn-action);width:100%;height:60px;padding:16px 0;font-size:18px;font-weight:700}.btn-accent{background:var(--clr-accent-green);color:var(--clr-bg-white);box-shadow:var(--shadow-btn-accent);width:100%;height:56px;padding:14px 0;font-size:18px;font-weight:600}.btn-google{background:var(--clr-bg-white);border:2px solid var(--clr-border-subtle);color:var(--clr-text-primary);width:100%;height:60px;font-size:16px;font-weight:700}.btn-apple{background:var(--clr-text-primary);color:var(--clr-bg-white);width:100%;height:60px;font-size:16px;font-weight:700}.btn-text{color:var(--clr-accent-green);background:0 0;height:40px;font-size:16px;font-weight:500}.btn-text-link{color:var(--clr-dark-green);font-size:12px;font-weight:800}.card-glass{background:var(--clr-bg-glass);border:1px solid var(--clr-border-glass);backdrop-filter:blur(6px);border-radius:var(--r-card-lg);box-shadow:var(--shadow-card-glass);padding:40px 32px 32px}.card-white{background:var(--clr-bg-white);border-radius:var(--r-card-lg);box-shadow:var(--shadow-card-white);padding:32px}.card-device{background:var(--clr-bg-white);border-radius:var(--r-card);box-shadow:var(--shadow-card-device);align-items:center;gap:20px;padding:24px;display:flex}.card-device-icon-bg{border-radius:var(--r-pill);justify-content:center;align-items:center;width:64px;height:64px;display:flex}.card-device-icon-bg.green{background:var(--clr-green-tint);color:#3d6449}.card-device-icon-bg.purple{background:var(--clr-purple-bg);color:var(--clr-purple)}.card-device-icon-bg.teal{background:var(--clr-oximeter-bg);color:var(--clr-accent-green)}.card-device-content{flex-grow:1}.card-device-content h3{color:var(--clr-text-body-alt2);margin-bottom:4px;font-size:18px;font-weight:400}.card-device-content p{color:var(--clr-text-muted-alt);font-size:14px}.btn-connect{border:1px solid var(--clr-border-device);color:var(--clr-accent-green);border-radius:var(--r-pill);padding:8px 24px;font-size:16px;font-weight:500}.card-info{background:var(--clr-green-10);border-radius:var(--r-card-xl);padding:32px;position:relative;overflow:hidden}.card-info-bg-icon{opacity:.1;color:var(--clr-accent-green);width:120px;height:120px;position:absolute;bottom:-32px;right:-32px}.card-quote{border-left:4px solid var(--clr-primary);box-shadow:var(--shadow-xs);backdrop-filter:blur(6px);border-radius:var(--r-sm);background:rgba(255,255,255,.9);gap:16px;padding:24px;display:flex}.input-group{flex-direction:column;gap:8px;width:100%;display:flex;position:relative}.input-group .label-row{justify-content:space-between;align-items:center;padding:0 16px;display:flex}.input-auth{border-radius:var(--r-pill);width:100%;height:60px;color:var(--clr-text-muted);background:rgba(255,255,255,.6);padding:18px 16px 18px 48px}.input-icon-left{color:var(--clr-text-body-alt);pointer-events:none;position:absolute;top:50%;left:16px;transform:translateY(-50%)}.input-icon-right{color:var(--clr-text-body-alt);cursor:pointer;background:0 0;padding:4px;position:absolute;top:50%;right:16px;transform:translateY(-50%)}.input-form{background:var(--clr-bg-input);border:1px solid var(--clr-border-input);border-radius:var(--r-card-lg);width:100%;height:58px;color:var(--clr-text-body);padding:18px 24px}.otp-group{justify-content:space-between;gap:12px;display:flex}.input-otp{text-align:center;background:var(--clr-bg-input);border:1px solid var(--clr-border-input);width:60px;height:68px;color:var(--clr-text-heading);border-radius:20px;font-size:24px;font-weight:700}.input-otp:focus{border-color:var(--clr-primary);background:var(--clr-bg-white);box-shadow:0 0 0 4px rgba(109,161,113,.1)}.tab-switcher{background:var(--clr-border-subtle);border-radius:var(--r-pill);width:100%;height:56px;padding:6px;display:flex}.tab-btn{border-radius:var(--r-pill);color:var(--clr-text-body-alt);flex:1;justify-content:center;align-items:center;font-size:14px;font-weight:700;display:flex}.tab-btn.active{background:var(--clr-bg-white);box-shadow:var(--shadow-xs);color:var(--clr-dark-green)}.divider-with-text{text-align:center;width:100%;margin:16px 0;position:relative}.divider-with-text:before{content:"";border-top:1px solid var(--clr-divider);position:absolute;top:50%;left:0;right:0}.divider-with-text span{backdrop-filter:blur(6px);letter-spacing:2.4px;color:var(--clr-text-body-alt);text-transform:uppercase;background:rgba(255,255,255,.1);border-radius:4px;padding:0 16px;font-size:12px;font-weight:900;position:relative}.glass-header{background:var(--clr-bg-glass-footer);backdrop-filter:blur(12px);height:72px;box-shadow:var(--shadow-header);z-index:100;justify-content:space-between;align-items:center;padding:16px 24px;display:flex;position:fixed;top:0;left:0;right:0}.glass-footer{background:var(--clr-bg-glass-footer);backdrop-filter:blur(12px);box-shadow:var(--shadow-footer);z-index:100;flex-direction:column;gap:16px;padding:24px 32px 40px;display:flex;position:fixed;bottom:0;left:0;right:0}.mt-4{margin-top:16px}.mt-6{margin-top:24px}.mt-8{margin-top:32px}.mt-12{margin-top:48px}.hidden{display:none!important}.text-center{text-align:center}.w-full{width:100%}.page{opacity:0;pointer-events:none;background-color:var(--clr-bg-white);width:100%;height:100%;padding-bottom:env(safe-area-inset-bottom);flex-direction:column;transition:opacity .3s;display:flex;position:absolute;top:0;left:0;overflow-x:hidden;overflow-y:auto}.page.active{opacity:1;pointer-events:auto;z-index:10}#page-onboarding{background:var(--clr-bg-white);justify-content:flex-end}.onboarding-bg{z-index:0;background-position:top;background-size:cover;position:absolute;top:0;bottom:0;left:0;right:0}.onboarding-overlay{background:var(--grad-overlay);z-index:1;position:absolute;top:0;bottom:0;left:0;right:0}.onboarding-content{z-index:2;flex-direction:column;justify-content:space-between;align-items:center;height:100%;padding:80px 32px 32px;display:flex;position:relative}.onboarding-header{text-align:center;flex-direction:column;align-items:center;gap:16px;margin-top:40px;display:flex}.onboarding-actions{flex-direction:column;gap:16px;width:100%;margin-top:auto;display:flex}#page-signin{background:var(--clr-bg-white)}.signin-bg{z-index:0;background-color:rgba(0,0,0,.1);background-position:50%;background-size:cover;position:absolute;top:0;bottom:0;left:0;right:0}.signin-content{z-index:1;flex-direction:column;justify-content:center;align-items:center;min-height:100%;padding:52px 24px;display:flex;position:relative}.brand-header{text-align:center;flex-direction:column;align-items:center;margin-bottom:32px;display:flex}.brand-header img{width:96px;height:96px;margin-bottom:24px}#page-signup{background:var(--clr-bg-white);padding:50px 16px}.signup-content{flex-direction:column;align-items:center;width:100%;max-width:576px;margin:0 auto;display:flex}.signup-logo{width:80px;height:80px;margin-bottom:12px}.signup-header{text-align:center;margin-bottom:40px}.signup-form{flex-direction:column;gap:24px;width:100%;display:flex}#page-bluetooth{background:var(--clr-bg-warm)}.bt-main{flex-direction:column;align-items:center;max-width:672px;margin:0 auto;padding:96px 24px 205px;display:flex}.bt-hero{text-align:center;flex-direction:column;align-items:center;margin-bottom:48px;display:flex}.bt-device-list{flex-direction:column;gap:24px;width:100%;margin-bottom:48px;display:flex}.bottom-nav{-webkit-backdrop-filter:blur(16px);height:80px;padding-bottom:env(safe-area-inset-bottom);z-index:100;background:rgba(255,255,255,.85);border-top:1px solid rgba(0,0,0,.05);justify-content:space-around;align-items:center;transition:transform .3s;display:flex;position:fixed;bottom:0;left:0;right:0}.bottom-nav.hidden{transform:translateY(100%)}.nav-item{color:var(--clr-text-muted);flex-direction:column;align-items:center;gap:4px;width:60px;font-size:11px;font-weight:600;display:flex}.nav-item i{width:24px;height:24px}.nav-item.active{color:var(--clr-primary)}.nav-item-fab{position:relative;top:-20px}.fab-inner{background:var(--clr-primary);color:#fff;border-radius:var(--r-pill);justify-content:center;align-items:center;width:56px;height:56px;display:flex;box-shadow:0 4px 12px rgba(109,161,113,.4)}.fab-inner i{width:28px;height:28px}.sheet-overlay{z-index:200;opacity:1;background:rgba(0,0,0,.4);align-items:flex-end;transition:opacity .3s;display:flex;position:fixed;top:0;bottom:0;left:0;right:0}.sheet-overlay.hidden{opacity:0;pointer-events:none}.bottom-sheet{background:var(--clr-bg-white);border-radius:24px 24px 0 0;width:100%;padding:16px 24px 40px;transition:transform .3s cubic-bezier(.175,.885,.32,1.275);transform:translateY(0)}.sheet-overlay.hidden .bottom-sheet{transform:translateY(100%)}.sheet-handle{background:var(--clr-border-input);border-radius:2px;width:40px;height:4px;margin:0 auto 24px}.sheet-title{color:var(--clr-text-heading);margin-bottom:24px;font-size:20px;font-weight:700}.sheet-actions{grid-template-columns:1fr 1fr;gap:16px;display:grid}.sheet-btn{background:var(--clr-bg-input);text-align:center;color:var(--clr-text-body);border-radius:16px;flex-direction:column;align-items:center;gap:12px;padding:20px 16px;font-size:14px;font-weight:600;display:flex}.sheet-btn .icon-wrapper{width:48px;height:48px;color:var(--clr-dark-green);border-radius:50%;justify-content:center;align-items:center;display:flex}.bg-green-tint{background:var(--clr-green-tint)}.toast-container{z-index:1000;pointer-events:none;flex-direction:column;gap:8px;display:flex;position:fixed;top:16px;left:16px;right:16px}.toast{color:#fff;opacity:0;pointer-events:auto;background:rgba(45,51,45,.95);border-radius:12px;align-items:center;gap:12px;padding:16px;font-size:14px;font-weight:500;transition:all .3s;display:flex;transform:translateY(-20px);box-shadow:0 4px 12px rgba(0,0,0,.15)}.toast.show{opacity:1;transform:translateY(0)}.toast.error{border-left:4px solid var(--clr-danger)}.toast.success{border-left:4px solid var(--clr-primary)}.slide-in-right{animation:.3s cubic-bezier(.2,.8,.2,1) forwards slideInRight}.slide-out-left{animation:.3s cubic-bezier(.2,.8,.2,1) forwards slideOutLeft}@keyframes slideInRight{0%{opacity:0;transform:translate(20px)}to{opacity:1;transform:translate(0)}}@keyframes slideOutLeft{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(-20px)}}.scanning-animation{justify-content:center;align-items:center;width:192px;height:192px;display:flex;position:relative}.scan-ring{border:2px solid var(--clr-accent-green);opacity:0;border-radius:50%;animation:3s cubic-bezier(.2,0,.2,1) infinite scanPulse;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.scan-ring:first-child{width:64px;height:64px;animation-delay:0s}.scan-ring:nth-child(2){width:128px;height:128px;animation-delay:1s}.scan-ring:nth-child(3){width:192px;height:192px;animation-delay:2s}@keyframes scanPulse{0%{opacity:.8;transform:translate(-50%,-50%)scale(.5)}to{opacity:0;transform:translate(-50%,-50%)scale(1.2)}}.scan-center{backdrop-filter:blur(6px);z-index:10;background:rgba(141,180,142,.1);border-radius:50%;justify-content:center;align-items:center;width:128px;height:128px;display:flex}.scan-center-icon{width:36px;height:40px;color:var(--clr-accent-green)}.ripple{position:relative;overflow:hidden}.ripple:after{content:"";pointer-events:none;opacity:0;background-image:radial-gradient(circle,#fff 10%,transparent 10.01%);background-position:50%;background-repeat:no-repeat;width:100%;height:100%;transition:transform .5s,opacity 1s;display:block;position:absolute;top:0;left:0;transform:scale(10)}.ripple:active:after{opacity:.3;transition:all;transform:scale(0)}.skeleton{background:#f6f7f8 linear-gradient(90deg,#f6f7f8 0%,#edeef1 20%,#f6f7f8 40%,#f6f7f8 100%) 0 0/800px 100% no-repeat;animation-name:placeholderShimmer;animation-duration:1s;animation-timing-function:linear;animation-iteration-count:infinite;animation-fill-mode:forwards;display:inline-block;position:relative}@keyframes placeholderShimmer{0%{background-position:-468px 0}to{background-position:468px 0}}
/*$vite$:1*/`,document.head.appendChild(r),(function(){var e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;var t=v(document.querySelectorAll(`link[rel="modulepreload"]`)),n;try{for(t.s();!(n=t.n()).done;){var r=n.value;a(r)}}catch(e){t.e(e)}finally{t.f()}new MutationObserver(function(e){var t=v(e),n;try{for(t.s();!(n=t.n()).done;){var r=n.value;if(r.type===`childList`){var i=v(r.addedNodes),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;s.tagName===`LINK`&&s.rel===`modulepreload`&&a(s)}}catch(e){i.e(e)}finally{i.f()}}}}catch(e){t.e(e)}finally{t.f()}}).observe(document,{childList:!0,subtree:!0});function i(e){var t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function a(e){if(!e.ep){e.ep=!0;var t=i(e);fetch(e.href,t)}}})(),i=`<!-- pages/bluetooth.html -->
<div id="page-bluetooth" class="page">
    
    <!-- Top Glass Header -->
    <header class="glass-header">
        <div style="display: flex; align-items: center; gap: 12px;">
            <a href="#" onclick="App.goBack(); return false;" style="width: 20px; height: 20px; color: var(--clr-dark-green);">
                <i data-lucide="arrow-left"></i>
            </a>
            <h1 style="font-size: 20px; color: var(--clr-dark-green);">Connect Devices</h1>
        </div>
        
        <!-- User Profile Photo Placeholder -->
        <div style="width: 40px; height: 40px; background: var(--clr-border-input); border-radius: 50%; display: flex; justify-content: center; align-items: center;">
            <i data-lucide="user" style="color: var(--clr-text-muted);"></i>
        </div>
    </header>

    <div class="bt-main">
        
        <!-- Hero Section with Scanning Animation -->
        <div class="bt-hero">
            <div class="scanning-animation">
                <div class="scan-ring"></div>
                <div class="scan-ring"></div>
                <div class="scan-ring"></div>
                <div class="scan-center">
                    <i data-lucide="bluetooth" class="scan-center-icon"></i>
                </div>
            </div>
            
            <h2 class="mt-4">Connect Your<br>Devices</h2>
            <p style="font-size: 18px; color: var(--clr-text-muted-alt); text-align: center; margin-top: 8px;">
                Real-time insights for a safer journey.
            </p>
        </div>

        <!-- Device List -->
        <div class="bt-device-list">
            
            <!-- BP Monitor -->
            <div class="card-device">
                <div class="card-device-icon-bg green">
                    <i data-lucide="heart-pulse"></i>
                </div>
                <div class="card-device-content">
                    <h3>BP Monitor</h3>
                    <p>Omron / iHealth</p>
                </div>
                <button class="btn btn-connect" onclick="Bluetooth.connect('bp')">Connect</button>
            </div>

            <!-- Smartwatch -->
            <div class="card-device">
                <div class="card-device-icon-bg purple">
                    <i data-lucide="watch"></i>
                </div>
                <div class="card-device-content">
                    <h3>Smartwatch</h3>
                    <p>Apple Watch / Fitbit</p>
                </div>
                <button class="btn btn-connect" onclick="Bluetooth.connect('watch')">Connect</button>
            </div>

            <!-- Pulse Oximeter -->
            <div class="card-device">
                <div class="card-device-icon-bg teal">
                    <i data-lucide="activity"></i>
                </div>
                <div class="card-device-content">
                    <h3>Pulse Oximeter</h3>
                    <p>Digital Vitals Trackers</p>
                </div>
                <button class="btn btn-connect" onclick="Bluetooth.connect('spo2')">Connect</button>
            </div>
            
        </div>

        <!-- Info Anchor Card -->
        <div class="card-info w-full">
            <i data-lucide="activity" class="card-info-bg-icon"></i>
            <div style="position: relative; z-index: 1;">
                <p class="micro-label" style="margin-bottom: 8px;">WHY CONNECT?</p>
                <p style="font-size: 16px; color: var(--clr-text-muted-alt); line-height: 1.62;">
                    Syncing your devices allows us to detect subtle patterns in your health, providing you and your doctor with precise, real-time insights for a safer journey.
                </p>
            </div>
        </div>

    </div>

    <!-- Bottom Glass Footer -->
    <footer class="glass-footer">
        <a href="#/dashboard" class="btn btn-accent">
            Continue
            <i data-lucide="arrow-right"></i>
        </a>
        <a href="#/dashboard" class="btn btn-text w-full text-center">
            Skip for now
        </a>
    </footer>

</div>
`,o=`<!-- pages/care-guide.html -->
<div id="page-care-guide" class="page" style="padding-bottom: 100px;">
    <!-- Top App Bar -->
    <header class="glass-header">
      <div style="display: flex; align-items: center; gap: 12px;">
        <button onclick="App.goBack(); return false;" style="width: 24px; height: 24px; color: var(--clr-dark-green); background: none; border: none; padding: 0;">
          <i data-lucide="arrow-left"></i>
        </button>
        <h1 style="font-size: 20px; color: var(--clr-dark-green);">The Sanctuary</h1>
      </div>
      <div style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden;">
        <img src="https://i.pravatar.cc/100?img=1" alt="User Profile" style="width: 100%; height: 100%;">
      </div>
    </header>

    <!-- Scrollable Main Content -->
    <div style="padding: 96px 24px 24px; max-width: 512px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px;">
      
      <!-- Hero Section -->
      <div class="card-info" style="display: flex; flex-direction: column; gap: 16px; background: var(--clr-primary); color: white;">
        <span style="font-size: 10px; font-weight: 800; letter-spacing: 2px; color: rgba(255,255,255,0.8);">EDUCATION MODULE</span>
        <h2 style="font-size: 28px; font-weight: 800; line-height: 1.2;">Maternal &<br>Newborn Care<br>Guide</h2>
        <p style="font-size: 15px; color: rgba(255,255,255,0.9); line-height: 1.5;">A comprehensive roadmap for your journey from pregnancy to the first steps of motherhood.</p>
        <i data-lucide="book-open" class="card-info-bg-icon" style="color: rgba(255,255,255,0.1);"></i>
      </div>

      <!-- The 10 Points List -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        
        <!-- Point 01 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--clr-primary);"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: var(--clr-green-10); color: var(--clr-primary); font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">01</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Antenatal Care</h3>
          </div>
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px; margin-bottom: 12px;">Consistent monitoring is vital. Aim for 4+ scheduled visits to ensure safety. Involve partners in the process and learn to recognize danger signs like <span style="color: var(--clr-danger); font-weight: 600;">sudden bleeding or high fever</span>.</p>
          <div style="display: inline-flex; align-items: center; gap: 6px; background: var(--clr-bg-subtle); padding: 6px 12px; border-radius: var(--r-pill); color: var(--clr-text-muted); font-size: 12px; font-weight: 700;">
            <i data-lucide="users" style="width: 14px; height: 14px;"></i> PARTNER SUPPORT
          </div>
        </div>

        <!-- Point 02 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--clr-purple);"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: var(--clr-purple-bg); color: var(--clr-purple); font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">02</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Delivery Planning</h3>
          </div>
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px;">Prepare for a facility birth with skilled attendants. Having a dedicated plan reduces stress and ensures immediate professional intervention if required for you or the baby.</p>
        </div>

        <!-- Point 03 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: #EAB308;"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: rgba(234,179,8,0.1); color: #EAB308; font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">03</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Mental Well-being</h3>
          </div>
          <p style="font-style: italic; color: var(--clr-text-muted); margin-bottom: 8px; border-left: 2px solid var(--clr-border-subtle); padding-left: 12px;">"Support networks are the foundation of a healthy recovery."</p>
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px;">Embrace shared parenting. Maternal health is not just physical; your emotional resilience thrives when responsibilities are distributed.</p>
        </div>

        <!-- Point 04 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--clr-primary);"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: var(--clr-green-10); color: var(--clr-primary); font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">04</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Newborn Care</h3>
          </div>
          <img src="https://images.unsplash.com/photo-1544126592-807ade215a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" alt="Baby hand" style="width: 100%; height: 120px; object-fit: cover; border-radius: 12px; margin-bottom: 12px;">
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px;">Prioritize skin-to-skin contact immediately after birth. This regulates the baby's temperature, heartbeat, and fosters deep emotional bonding.</p>
        </div>

        <!-- Point 05 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--clr-primary);"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: var(--clr-green-10); color: var(--clr-primary); font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">05</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Exclusive Breastfeeding</h3>
          </div>
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px; margin-bottom: 12px;">Commit to exclusive breastfeeding for the first 6 months. Colostrum, the first milk, acts as the baby's <span style="color: var(--clr-dark-green); font-weight: 600;">first natural vaccine</span>.</p>
          <div style="display: inline-flex; align-items: center; gap: 6px; background: var(--clr-green-10); padding: 6px 12px; border-radius: var(--r-pill); color: var(--clr-primary); font-size: 12px; font-weight: 700;">
            <i data-lucide="shield" style="width: 14px; height: 14px;"></i> ESSENTIAL IMMUNITY
          </div>
        </div>

        <!-- Point 06 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--clr-primary);"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: var(--clr-green-10); color: var(--clr-primary); font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">06</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Feeding Transition</h3>
          </div>
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px;">Starting at 6 months, introduce soft, mashed, and nutrient-dense foods while continuing to breastfeed to support rapid growth.</p>
        </div>

        <!-- Point 07 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--clr-primary);"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: var(--clr-green-10); color: var(--clr-primary); font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">07</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Micronutrients</h3>
          </div>
          <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
            <span style="background: var(--clr-bg-subtle); border: 1px solid var(--clr-border-subtle); padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 700;">IRON</span>
            <span style="background: var(--clr-bg-subtle); border: 1px solid var(--clr-border-subtle); padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 700;">FOLATE</span>
            <span style="background: var(--clr-bg-subtle); border: 1px solid var(--clr-border-subtle); padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 700;">VIT A</span>
          </div>
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px;">Essential for both mother and child to prevent anemia and support the development of the baby's immune system and vision.</p>
        </div>

        <!-- Point 08 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px; border: 2px solid var(--clr-danger);">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--clr-danger);"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: rgba(239,68,68,0.1); color: var(--clr-danger); font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">08</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Danger Signs</h3>
          </div>
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px; margin-bottom: 12px;">Seek immediate help if you notice: difficulty feeding, blue skin tint, or extreme lethargy. Trust your maternal instincts.</p>
          <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(239,68,68,0.1); padding: 6px 12px; border-radius: var(--r-pill); color: var(--clr-danger); font-size: 12px; font-weight: 700;">
            <i data-lucide="alert-triangle" style="width: 14px; height: 14px;"></i> EMERGENCY PROTOCOL
          </div>
        </div>

        <!-- Point 09 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: #3B82F6;"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: rgba(59,130,246,0.1); color: #3B82F6; font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">09</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Registration</h3>
          </div>
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px; margin-bottom: 12px;">Legal proof of identity is a human right. Complete digital birth registration early to ensure access to healthcare and education services.</p>
          <div style="display: inline-flex; align-items: center; gap: 6px; background: #3B82F6; padding: 6px 12px; border-radius: var(--r-pill); color: white; font-size: 12px; font-weight: 700;">
            <i data-lucide="file-check" style="width: 14px; height: 14px;"></i> DIGITAL PORTAL
          </div>
        </div>

        <!-- Point 10 -->
        <div class="card-white" style="position: relative; overflow: hidden; padding-left: 24px;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: var(--clr-primary);"></div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: var(--clr-green-10); color: var(--clr-primary); font-weight: 800; font-size: 14px; padding: 4px 8px; border-radius: 8px;">10</div>
            <h3 style="font-size: 18px; color: var(--clr-text-heading); font-weight: 700;">Family Planning</h3>
          </div>
          <p style="color: var(--clr-text-body); line-height: 1.5; font-size: 15px;">Healthy spacing of 3 years between births allows the mother's body to fully recover and ensures each child receives optimal care and nutrition.</p>
        </div>

      </div>

      <!-- Completion Area -->
      <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; margin-top: 16px;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--clr-green-10); display: flex; justify-content: center; align-items: center;">
          <i data-lucide="check" style="width: 40px; height: 40px; color: var(--clr-primary);"></i>
        </div>
        <h4 style="font-size: 20px; font-weight: 700; color: var(--clr-text-heading);">Guide Completed</h4>
        <p style="color: var(--clr-text-muted); font-size: 15px;">Knowledge is your superpower.</p>
        <button class="btn btn-primary" style="margin-top: 8px;" onclick="App.goBack();">FINISH</button>
      </div>

    </div>
</div>
`,s=`<!-- pages/contractions.html -->
<div id="page-contractions" class="page">
    
    <header class="glass-header">
        <div style="display: flex; align-items: center; gap: 12px;">
            <a href="#" onclick="App.goBack(); return false;" style="width: 20px; height: 20px; color: var(--clr-dark-green);">
                <i data-lucide="arrow-left"></i>
            </a>
            <h1 style="font-size: 20px; color: var(--clr-dark-green);">Contraction Timer</h1>
        </div>
    </header>

    <div style="padding: 96px 24px 100px; display: flex; flex-direction: column; align-items: center; height: 100%;">
        
        <div style="text-align: center; margin-bottom: 40px;">
            <p style="font-size: 16px; color: var(--clr-text-muted);">Track duration and frequency</p>
        </div>
        
        <!-- Large Interactive Circle (Purple theme for contractions) -->
        <div id="contraction-button" class="ripple" onclick="Kicks.toggleContraction()" style="
            width: 280px; height: 280px; 
            border-radius: 50%; 
            background: var(--clr-bg-white); 
            border: 8px solid var(--clr-purple-bg);
            box-shadow: 0 16px 40px rgba(139, 92, 246, 0.2);
            display: flex; flex-direction: column; 
            justify-content: center; align-items: center;
            margin-bottom: 40px; cursor: pointer;
            transition: all 0.3s ease;
        ">
            <h1 id="contraction-state-display" style="font-size: 32px; color: var(--clr-purple); line-height: 1.2;">Tap to<br>Start</h1>
            <p id="contraction-timer-display" style="font-size: 24px; color: var(--clr-text-heading); font-weight: 700; margin-top: 12px; display: none; font-variant-numeric: tabular-nums;">00:00</p>
        </div>
        
        <!-- Metrics -->
        <div style="display: flex; gap: 16px; width: 100%; margin-bottom: 48px;">
            <div class="card-white" style="flex: 1; text-align: center; padding: 16px;">
                <p class="micro-label" style="color: var(--clr-text-muted);">AVG DURATION</p>
                <p id="avg-duration" style="font-size: 20px; font-weight: 700; margin-top: 4px;">--</p>
            </div>
            <div class="card-white" style="flex: 1; text-align: center; padding: 16px;">
                <p class="micro-label" style="color: var(--clr-text-muted);">AVG FREQUENCY</p>
                <p id="avg-frequency" style="font-size: 20px; font-weight: 700; margin-top: 4px;">--</p>
            </div>
        </div>
        
        <!-- Rule of 5-1-1 Banner -->
        <div class="card-info w-full" style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2);">
            <div style="display: flex; gap: 12px; align-items: flex-start;">
                <i data-lucide="alert-circle" style="color: #F59E0B; width: 24px; height: 24px; flex-shrink: 0;"></i>
                <div>
                    <h4 style="font-weight: 700; color: #B45309; margin-bottom: 4px;">The 5-1-1 Rule</h4>
                    <p style="font-size: 14px; color: #92400E;">Go to the hospital if contractions are <b>5</b> minutes apart, last <b>1</b> minute, for <b>1</b> hour.</p>
                </div>
            </div>
        </div>

    </div>
</div>
`,c=`<!-- pages/dashboard.html -->
<div id="page-dashboard" class="page" style="padding-bottom: 100px;">
    
    <!-- Top Nav -->
    <header style="display: flex; justify-content: space-between; align-items: center; padding: 24px;">
        <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 48px; height: 48px; background: var(--clr-border-input); border-radius: 50%; display: flex; justify-content: center; align-items: center; overflow: hidden;">
                <!-- Profile Image -->
                <i data-lucide="user" style="color: var(--clr-text-muted);"></i>
            </div>
            <div>
                <p style="font-size: 12px; color: var(--clr-text-muted); line-height: 1.2;">Good Morning,</p>
                <h2 id="dash-name" style="font-size: 20px; line-height: 1.2; color: var(--clr-text-heading);">Sarah</h2>
            </div>
        </div>
        <div style="display: flex; gap: 16px;">
            <a href="#/reminders" style="position: relative; color: var(--clr-text-body-alt2);">
                <i data-lucide="bell"></i>
                <span style="position: absolute; top: 0; right: 0; width: 8px; height: 8px; background: var(--clr-danger); border-radius: 50%;"></span>
            </a>
            <a href="#" style="color: var(--clr-text-body-alt2);">
                <i data-lucide="menu"></i>
            </a>
        </div>
    </header>

    <div style="padding: 0 24px;">
        
        <!-- Trimester-Aware Week Card -->
        <div class="card-white" style="margin-bottom: 16px; padding: 24px; display: flex; flex-direction: column; gap: 16px; background: var(--clr-bg-card); box-shadow: none;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p id="dash-trimester-label" class="micro-label" style="color: var(--clr-text-warm); margin-bottom: 4px;">SECOND TRIMESTER</p>
                    <h3 id="dash-week" style="font-size: 24px;">Week 24</h3>
                </div>
                <div style="font-size: 40px;">
                    <!-- Emoji representing baby size -->
                    <span id="dash-baby-size">🌽</span>
                </div>
            </div>
            
            <div>
                <div style="height: 8px; background: rgba(0,0,0,0.05); border-radius: 4px; overflow: hidden; margin-bottom: 8px;">
                    <div id="dash-progress-bar" style="height: 100%; width: 60%; background: var(--clr-primary); border-radius: 4px;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--clr-text-muted);">
                    <span id="dash-progress-text">60%</span>
                    <span id="dash-days-left">112 days to go</span>
                </div>
            </div>
        </div>

        <!-- GESTOSIS Risk Banner -->
        <a href="#/risk-assessment" style="display: block; margin-bottom: 32px;">
            <div id="dash-risk-banner" style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: var(--clr-green-10); border-radius: 20px; border-left: 6px solid var(--clr-primary);">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i data-lucide="activity" id="dash-risk-icon" style="color: var(--clr-primary);"></i>
                    <div>
                        <p style="font-size: 12px; font-weight: 700; color: var(--clr-text-body-alt);">GESTOSIS RISK SCORE</p>
                        <p id="dash-risk-text" style="font-size: 18px; font-weight: 700; color: var(--clr-primary);">Low (4)</p>
                    </div>
                </div>
                <i data-lucide="chevron-right" style="color: var(--clr-text-muted);"></i>
            </div>
        </a>

        <!-- Today's Vitals Strip -->
        <div style="margin-bottom: 32px;">
            <h3 style="font-size: 18px; margin-bottom: 16px;">Today's Vitals</h3>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                
                <!-- BP -->
                <div style="background: var(--clr-bg-card); border-radius: 24px; padding: 16px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                    <div style="width: 32px; height: 32px; background: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: var(--clr-primary); margin-bottom: 8px; box-shadow: var(--shadow-xs);">
                        <i data-lucide="heart-pulse" style="width: 16px; height: 16px;"></i>
                    </div>
                    <p id="dash-vital-bp" style="font-weight: 700; font-size: 16px; color: var(--clr-text-heading); line-height: 1.2;">118<br><span style="font-size: 14px; font-weight: 500; color: var(--clr-text-muted);">/76</span></p>
                </div>
                
                <!-- Weight -->
                <div style="background: var(--clr-bg-card); border-radius: 24px; padding: 16px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                    <div style="width: 32px; height: 32px; background: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #E8547A; margin-bottom: 8px; box-shadow: var(--shadow-xs);">
                        <i data-lucide="scale" style="width: 16px; height: 16px;"></i>
                    </div>
                    <p id="dash-vital-weight" style="font-weight: 700; font-size: 16px; color: var(--clr-text-heading); line-height: 1.2;">65<br><span style="font-size: 14px; font-weight: 500; color: var(--clr-text-muted);">kg</span></p>
                </div>
                
                <!-- Sleep/Glucose (Dynamic) -->
                <div style="background: var(--clr-bg-card); border-radius: 24px; padding: 16px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                    <div style="width: 32px; height: 32px; background: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: var(--clr-purple); margin-bottom: 8px; box-shadow: var(--shadow-xs);">
                        <i data-lucide="moon" style="width: 16px; height: 16px;"></i>
                    </div>
                    <p id="dash-vital-sleep" style="font-weight: 700; font-size: 16px; color: var(--clr-text-heading); line-height: 1.2;">7.5<br><span style="font-size: 14px; font-weight: 500; color: var(--clr-text-muted);">hrs</span></p>
                </div>
                
            </div>
            
            <button class="btn btn-text w-full mt-4" style="border: 1px dashed var(--clr-border-device); border-radius: var(--r-pill);" onclick="document.getElementById('nav-log-btn').click();">
                <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
                Log a New Vital
            </button>
        </div>

        <!-- Bento Grid Apps -->
        <div style="margin-bottom: 32px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                
                <a href="#/log-bp" style="background: var(--clr-bg-card); border-radius: 32px; padding: 24px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="width: 48px; height: 48px; background: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: var(--clr-primary); box-shadow: var(--shadow-xs);">
                        <i data-lucide="activity"></i>
                    </div>
                    <h4 style="font-weight: 700; font-size: 16px; color: var(--clr-text-heading);">Blood<br>Pressure</h4>
                </a>
                
                <a href="#/kick-counter" style="background: var(--clr-bg-card); border-radius: 32px; padding: 24px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="width: 48px; height: 48px; background: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: var(--clr-purple); box-shadow: var(--shadow-xs);">
                        <i data-lucide="baby"></i>
                    </div>
                    <h4 style="font-weight: 700; font-size: 16px; color: var(--clr-text-heading);">Kick<br>Counter</h4>
                </a>
                
                <a href="#" onclick="AIBot.openChat(); return false;" style="background: var(--clr-bg-card); border-radius: 32px; padding: 24px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="width: 48px; height: 48px; background: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #E8547A; box-shadow: var(--shadow-xs);">
                        <i data-lucide="bot"></i>
                    </div>
                    <h4 style="font-weight: 700; font-size: 16px; color: var(--clr-text-heading);">AI<br>Assistant</h4>
                </a>
                
                <a href="#/medical-history" style="background: var(--clr-bg-card); border-radius: 32px; padding: 24px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="width: 48px; height: 48px; background: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: var(--clr-info-brown); box-shadow: var(--shadow-xs);">
                        <i data-lucide="clipboard-list"></i>
                    </div>
                    <h4 style="font-weight: 700; font-size: 16px; color: var(--clr-text-heading);">Medical<br>History</h4>
                </a>
                
            </div>
        </div>

        <!-- Quick Symptoms -->
        <div style="margin-bottom: 32px;">
            <h3 style="font-size: 18px; margin-bottom: 16px;">How are you feeling?</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 12px;">
                <button class="btn btn-secondary" style="height: 44px; padding: 0 20px; font-size: 14px; width: auto; font-weight: 500;" onclick="Vitals.logSymptom('headache', this)">Headache</button>
                <button class="btn btn-secondary" style="height: 44px; padding: 0 20px; font-size: 14px; width: auto; font-weight: 500;" onclick="Vitals.logSymptom('swelling', this)">Swelling</button>
                <button class="btn btn-secondary" style="height: 44px; padding: 0 20px; font-size: 14px; width: auto; font-weight: 500;" onclick="Vitals.logSymptom('nausea', this)">Nausea</button>
                <button class="btn btn-secondary" style="height: 44px; padding: 0 20px; font-size: 14px; width: auto; font-weight: 500;" onclick="Vitals.logSymptom('fatigue', this)">Fatigue</button>
            </div>
        </div>

        <!-- Medical Disclaimer -->
        <div style="margin-bottom: 32px; padding: 16px; background: rgba(0,0,0,0.03); border-radius: 16px; text-align: center;">
            <p style="font-size: 11px; color: var(--clr-text-muted); line-height: 1.4;">
                <i data-lucide="info" style="width: 12px; height: 12px; display: inline-block; margin-bottom: -2px;"></i>
                <strong>Medical Disclaimer:</strong> Gestation Guardian provides risk alerts for clinician review based on logged data. It does not provide medical diagnosis or replace professional medical advice. Always consult your healthcare provider.
            </p>
        </div>

    </div>
</div>


`,l=`<!-- pages/health-hub.html -->
<div id="page-health-hub" class="page">
    
    <header class="glass-header">
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <a href="#" onclick="App.goBack(); return false;" style="width: 20px; height: 20px; color: var(--clr-dark-green);">
                    <i data-lucide="arrow-left"></i>
                </a>
                <h1 style="font-size: 20px; color: var(--clr-dark-green);">Health Records</h1>
            </div>
            
            <button onclick="document.getElementById('nav-log-btn').click();" style="background: none; border: none; color: var(--clr-primary); font-weight: 600; display: flex; align-items: center; gap: 4px;">
                <i data-lucide="plus" style="width: 16px; height: 16px;"></i> Log
            </button>
        </div>
    </header>

    <div style="padding: 80px 24px 100px; display: flex; flex-direction: column; gap: 16px;">
        <!-- Timeline will be injected here -->
        <div id="health-records-timeline" style="display: flex; flex-direction: column; gap: 16px;">
            <!-- Empty state -->
            <div id="health-records-empty" style="display: none; text-align: center; padding: 48px 24px; color: var(--clr-text-muted);">
                <i data-lucide="clipboard-list" style="width: 48px; height: 48px; margin: 0 auto 16px; opacity: 0.5;"></i>
                <p>No health records logged yet.</p>
                <button class="btn btn-primary mt-4" style="border-radius: var(--r-pill); display: inline-flex; width: auto; padding: 0 24px;" onclick="document.getElementById('nav-log-btn').click();">Log your first entry</button>
            </div>
        </div>
    </div>
</div>


`,u=`<!-- pages/kick-counter.html -->
<div id="page-kick-counter" class="page">
    
    <header class="glass-header">
        <div style="display: flex; align-items: center; gap: 12px;">
            <a href="#" onclick="App.goBack(); return false;" style="width: 20px; height: 20px; color: var(--clr-dark-green);">
                <i data-lucide="arrow-left"></i>
            </a>
            <h1 style="font-size: 20px; color: var(--clr-dark-green);">Kick Counter</h1>
        </div>
    </header>

    <div style="padding: 96px 24px 100px; display: flex; flex-direction: column; align-items: center; height: 100%;">
        
        <div style="text-align: center; margin-bottom: 40px;">
            <p style="font-size: 16px; color: var(--clr-text-muted);">Aim for 10 kicks in 2 hours</p>
        </div>
        
        <!-- Large Interactive Circle -->
        <div id="kick-button" class="ripple" onclick="Kicks.logKick()" style="
            width: 280px; height: 280px; 
            border-radius: 50%; 
            background: var(--clr-bg-white); 
            border: 8px solid var(--clr-green-tint);
            box-shadow: 0 16px 40px rgba(109, 161, 113, 0.2);
            display: flex; flex-direction: column; 
            justify-content: center; align-items: center;
            margin-bottom: 40px; cursor: pointer;
            transition: transform 0.1s;
        ">
            <h1 id="kick-count-display" style="font-size: 96px; color: var(--clr-primary); line-height: 1;">0</h1>
            <p style="font-size: 18px; color: var(--clr-text-muted); font-weight: 600; margin-top: -8px;">KICKS</p>
        </div>
        
        <!-- Session Controls -->
        <div style="display: flex; justify-content: space-between; width: 100%; max-width: 320px; align-items: center;">
            <div style="text-align: left;">
                <p class="micro-label" style="color: var(--clr-text-muted);">SESSION TIME</p>
                <p id="kick-timer-display" style="font-size: 24px; font-weight: 700; color: var(--clr-text-heading); font-variant-numeric: tabular-nums;">00:00</p>
            </div>
            
            <button id="kick-control-btn" class="btn btn-secondary" style="width: auto; padding: 0 24px;" onclick="Kicks.toggleSession()">
                Start Session
            </button>
        </div>
        
        <!-- Recent Sessions List -->
        <div class="card-white w-full mt-6" style="margin-top: 48px;">
            <h3 style="font-size: 16px; margin-bottom: 16px;">Recent Sessions</h3>
            <div id="kick-history-list" style="display: flex; flex-direction: column; gap: 12px;">
                <!-- Populated by JS -->
                <p style="color: var(--clr-text-muted); text-align: center; font-size: 14px; padding: 16px 0;">No sessions yet today.</p>
            </div>
        </div>

    </div>
</div>


`,d=`<!-- pages/log-bp.html -->
<div id="page-log-bp" class="page">
    
    <!-- Top Glass Header -->
    <header class="glass-header">
        <div style="display: flex; align-items: center; gap: 12px;">
            <a href="#" onclick="App.goBack(); return false;" style="width: 20px; height: 20px; color: var(--clr-dark-green);">
                <i data-lucide="arrow-left"></i>
            </a>
            <h1 style="font-size: 20px; color: var(--clr-dark-green);">Log Blood Pressure</h1>
        </div>
    </header>

    <div style="padding: 96px 24px 100px; max-width: 512px; margin: 0 auto;">
        
        <form onsubmit="event.preventDefault(); Vitals.saveBP();" style="display: flex; flex-direction: column; gap: 24px;">
            
            <div class="card-white">
                <div style="display: flex; gap: 16px; align-items: center; justify-content: center; margin-bottom: 24px;">
                    <!-- Systolic -->
                    <div style="text-align: center;">
                        <input type="number" id="bp-sys" class="input-form" style="width: 100px; height: 80px; font-size: 32px; font-weight: 700; text-align: center;" placeholder="120" required>
                        <p class="micro-label" style="margin-top: 8px; color: var(--clr-text-muted);">SYS (mmHg)</p>
                    </div>
                    
                    <div style="font-size: 32px; font-weight: 300; color: var(--clr-text-muted);">/</div>
                    
                    <!-- Diastolic -->
                    <div style="text-align: center;">
                        <input type="number" id="bp-dia" class="input-form" style="width: 100px; height: 80px; font-size: 32px; font-weight: 700; text-align: center;" placeholder="80" required>
                        <p class="micro-label" style="margin-top: 8px; color: var(--clr-text-muted);">DIA (mmHg)</p>
                    </div>
                </div>

                <!-- Pulse -->
                <div class="input-group" style="align-items: center;">
                    <label class="label text-center w-full">Pulse (BPM)</label>
                    <input type="number" id="bp-pulse" class="input-form" style="width: 120px; text-align: center;" placeholder="72">
                </div>
            </div>

            <!-- Position Selector -->
            <div>
                <label class="label" style="margin-bottom: 12px; display: block;">Position</label>
                <div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 12px; scrollbar-width: none; -webkit-overflow-scrolling: touch;">
                    <label style="flex: 0 0 120px;">
                        <input type="radio" name="bp-position" value="sitting" checked style="display: none;">
                        <div class="btn btn-secondary" style="height: 48px; border-radius: var(--r-card);">Sitting</div>
                    </label>
                    <label style="flex: 0 0 120px;">
                        <input type="radio" name="bp-position" value="lying" style="display: none;">
                        <div class="btn btn-secondary" style="height: 48px; border-radius: var(--r-card);">Lying</div>
                    </label>
                    <label style="flex: 0 0 120px;">
                        <input type="radio" name="bp-position" value="standing" style="display: none;">
                        <div class="btn btn-secondary" style="height: 48px; border-radius: var(--r-card);">Standing</div>
                    </label>
                </div>
            </div>

            <!-- Arm Selector -->
            <div>
                <label class="label" style="margin-bottom: 12px; display: block;">Arm Used</label>
                <div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 12px; scrollbar-width: none; -webkit-overflow-scrolling: touch;">
                    <label style="flex: 0 0 120px;">
                        <input type="radio" name="bp-arm" value="left" checked style="display: none;">
                        <div class="btn btn-secondary" style="height: 48px; border-radius: var(--r-card);">Left</div>
                    </label>
                    <label style="flex: 0 0 120px;">
                        <input type="radio" name="bp-arm" value="right" style="display: none;">
                        <div class="btn btn-secondary" style="height: 48px; border-radius: var(--r-card);">Right</div>
                    </label>
                </div>
            </div>

            <!-- Notes -->
            <div class="input-group">
                <label class="label">Notes (Optional)</label>
                <textarea id="bp-notes" class="input-form" style="height: 100px; resize: none; padding: 16px;" placeholder="How are you feeling?"></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="margin-top: 16px;">
                Save Reading
            </button>
        </form>
    </div>
    
    <!-- CSS for radio button selection states -->
    <style>
        input[type="radio"]:checked + .btn-secondary {
            background: var(--clr-primary);
            color: white;
            border-color: var(--clr-primary);
        }
    </style>
</div>
`,p=`<!-- pages/log-vitals.html -->
<div id="page-log-vitals" class="page">
    
    <header class="glass-header">
        <div style="display: flex; align-items: center; gap: 12px;">
            <a href="#" onclick="App.goBack(); return false;" style="width: 20px; height: 20px; color: var(--clr-dark-green);">
                <i data-lucide="arrow-left"></i>
            </a>
            <h1 style="font-size: 20px; color: var(--clr-dark-green);">Log Other Vitals</h1>
        </div>
    </header>

    <div style="padding: 96px 24px 100px; max-width: 512px; margin: 0 auto;">
        
        <form onsubmit="event.preventDefault(); Vitals.saveVitals();" style="display: flex; flex-direction: column; gap: 24px;">
            
            <p style="color: var(--clr-text-muted); text-align: center;">Only log what you measured today. Empty fields will be ignored.</p>
            
            <!-- Weight -->
            <div class="card-white" style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: rgba(232, 84, 122, 0.1); color: #E8547A; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                    <i data-lucide="scale"></i>
                </div>
                <div style="flex: 1;">
                    <label class="label" style="margin-bottom: 4px; display: block;">Weight</label>
                    <div style="position: relative;">
                        <input type="number" step="0.1" id="vital-weight" class="input-form" placeholder="65.0" style="padding-right: 48px;">
                        <span style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--clr-text-muted); font-weight: 500;">kg</span>
                    </div>
                </div>
            </div>

            <!-- Sleep -->
            <div class="card-white" style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: var(--clr-purple-bg); color: var(--clr-purple); border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                    <i data-lucide="moon"></i>
                </div>
                <div style="flex: 1;">
                    <label class="label" style="margin-bottom: 4px; display: block;">Sleep Duration</label>
                    <div style="position: relative;">
                        <input type="number" step="0.5" id="vital-sleep" class="input-form" placeholder="7.5" style="padding-right: 48px;">
                        <span style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--clr-text-muted); font-weight: 500;">hrs</span>
                    </div>
                </div>
            </div>

            <!-- Temperature -->
            <div class="card-white" style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: rgba(245, 158, 11, 0.1); color: #F59E0B; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                    <i data-lucide="thermometer"></i>
                </div>
                <div style="flex: 1;">
                    <label class="label" style="margin-bottom: 4px; display: block;">Body Temperature</label>
                    <div style="position: relative;">
                        <input type="number" step="0.1" id="vital-temp" class="input-form" placeholder="98.6" style="padding-right: 48px;">
                        <span style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--clr-text-muted); font-weight: 500;">°F</span>
                    </div>
                </div>
            </div>

            <!-- Blood Glucose (GDM Tracking) -->
            <div class="card-white" style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: rgba(239, 68, 68, 0.1); color: #EF4444; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                    <i data-lucide="droplet"></i>
                </div>
                <div style="flex: 1;">
                    <label class="label" style="margin-bottom: 4px; display: block;">Blood Glucose (Fasting/Post-meal)</label>
                    <div style="position: relative;">
                        <input type="number" id="vital-glucose" class="input-form" placeholder="e.g. 95" style="padding-right: 56px;">
                        <span style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--clr-text-muted); font-weight: 500;">mg/dL</span>
                    </div>
                </div>
            </div>

            <!-- Urine Protein (Preeclampsia Tracking) -->
            <div class="card-white" style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: rgba(59, 130, 246, 0.1); color: #3B82F6; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                    <i data-lucide="test-tube"></i>
                </div>
                <div style="flex: 1;">
                    <label class="label" style="margin-bottom: 4px; display: block;">Urine Protein (Dipstick)</label>
                    <select id="vital-protein" class="input-form">
                        <option value="" selected>Not tested</option>
                        <option value="negative">Negative / Trace</option>
                        <option value="+1">+1 (Mild)</option>
                        <option value="+2">+2 (Moderate)</option>
                        <option value="+3">+3 (High/Severe)</option>
                    </select>
                </div>
            </div>

            <!-- Stress Slider -->
            <div class="card-white">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                    <div style="width: 48px; height: 48px; background: var(--clr-green-10); color: var(--clr-primary); border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                        <i data-lucide="brain"></i>
                    </div>
                    <div>
                        <label class="label">Stress Level</label>
                        <p style="font-size: 14px; color: var(--clr-text-muted);">How overwhelmed do you feel today?</p>
                    </div>
                </div>
                
                <input type="range" id="vital-stress" min="1" max="10" value="3" style="width: 100%; margin: 16px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--clr-text-muted); font-weight: 500;">
                    <span>Calm (1)</span>
                    <span>High (10)</span>
                </div>
            </div>

            <button type="submit" class="btn btn-primary" style="margin-top: 16px;">
                Save Vitals
            </button>
        </form>
    </div>
</div>
`,m=`<!-- pages/medical-history.html -->
<div id="page-medical-history" class="page">
    
    <header class="glass-header">
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <a href="#" onclick="App.goBack(); return false;" style="width: 20px; height: 20px; color: var(--clr-dark-green);">
                    <i data-lucide="arrow-left"></i>
                </a>
                <h1 style="font-size: 20px; color: var(--clr-dark-green);">Medical History</h1>
            </div>
            
            <a href="#" style="color: var(--clr-primary);">
                <i data-lucide="share"></i>
            </a>
        </div>
    </header>

    <div style="padding: 80px 24px 100px;">
        
        <div style="margin-bottom: 24px;">
            <p style="color: var(--clr-text-muted); font-size: 14px; margin-bottom: 16px;">This data is securely stored and used to inform your GESTOSIS risk score. Share this with your doctor.</p>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 18px;">Pregnancy Profile</h3>
                <button class="btn btn-text" style="color: var(--clr-primary); font-size: 14px; font-weight: 600;" onclick="UI.showToast('Edit mode enabled')">Edit</button>
            </div>
        </div>

        <div class="card-white" style="margin-bottom: 24px; padding: 0; overflow: hidden;">
            
            <!-- Row 1 -->
            <div style="padding: 16px; border-bottom: 1px solid var(--clr-divider); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="font-size: 14px; font-weight: 600; color: var(--clr-text-heading);">First Pregnancy</p>
                    <p style="font-size: 12px; color: var(--clr-text-muted);">Nulliparity</p>
                </div>
                <!-- Toggle Switch styling via CSS -->
                <label class="toggle-switch">
                    <input type="checkbox" id="hist-first-preg">
                    <span class="slider"></span>
                </label>
            </div>
            
            <!-- Row 2 -->
            <div style="padding: 16px; border-bottom: 1px solid var(--clr-divider); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="font-size: 14px; font-weight: 600; color: var(--clr-text-heading);">Multiple Gestation</p>
                    <p style="font-size: 12px; color: var(--clr-text-muted);">Twins, triplets, etc.</p>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="hist-multiple">
                    <span class="slider"></span>
                </label>
            </div>

            <!-- Row 3 -->
            <div style="padding: 16px; border-bottom: 1px solid var(--clr-divider); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="font-size: 14px; font-weight: 600; color: var(--clr-text-heading);">Prior Preeclampsia</p>
                    <p style="font-size: 12px; color: var(--clr-text-muted);">In a previous pregnancy</p>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="hist-prior-pe">
                    <span class="slider"></span>
                </label>
            </div>

            <!-- Row 4 -->
            <div style="padding: 16px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="font-size: 14px; font-weight: 600; color: var(--clr-text-heading);">Chronic Hypertension</p>
                    <p style="font-size: 12px; color: var(--clr-text-muted);">Pre-existing high BP</p>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="hist-chronic-htn">
                    <span class="slider"></span>
                </label>
            </div>

        </div>

        <h3 style="font-size: 18px; margin-bottom: 16px;">Vitals History</h3>
        
        <div class="card-white" style="padding: 0; overflow: hidden; margin-bottom: 24px;">
            <div class="tab-switcher" style="margin: 16px;">
                <a href="#" class="tab-btn active">Blood Pressure</a>
                <a href="#" class="tab-btn">Weight</a>
            </div>
            
            <!-- Sparkline Chart -->
            <div style="padding: 16px 16px 24px;">
                <canvas id="bp-history-chart" width="300" height="120" style="width: 100%; height: 120px;"></canvas>
            </div>
            
            <div style="padding: 16px; border-top: 1px solid var(--clr-divider); background: var(--clr-bg-card);">
                <p style="font-size: 12px; color: var(--clr-text-muted); text-align: center;">Recent Logs</p>
                <div id="hist-bp-logs" style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;">
                    <!-- Populated by JS -->
                </div>
            </div>
        </div>

    </div>

    <style>
        /* Simple toggle switch CSS */
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 48px;
            height: 24px;
        }
        .toggle-switch input { 
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: var(--clr-border-input);
            transition: .4s;
            border-radius: 24px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        input:checked + .slider {
            background-color: var(--clr-primary);
        }
        input:checked + .slider:before {
            transform: translateX(24px);
        }
    </style>
</div>


`,h=`<!-- pages/onboarding.html -->
<div id="page-onboarding" class="page active">
    <!-- Background image container (simulated with CSS for now) -->
    <div class="onboarding-bg" style="background-image: url('assets/images/maternity-bg.jpg'); background-color: var(--clr-green-tint);"></div>
    
    <!-- Gradient overlay for text legibility -->
    <div class="onboarding-overlay"></div>
    
    <!-- Main content container -->
    <div class="onboarding-content">
        <!-- Top branding area -->
        <div class="onboarding-header">
            <!-- Space for logo if we add it back, but spec says "Typography Branding (Logo Image Removed)" -->
            <h1>Gestation<br>Guardian</h1>
            <p class="subtitle">Your trusted companion for a safer, healthier pregnancy journey.</p>
        </div>
        
        <!-- Bottom actions area -->
        <div class="onboarding-actions">
            <!-- Micro label divider -->
            <div class="divider-with-text">
                <span>Empowering Every Step</span>
            </div>
            
            <a href="#/signup" class="btn btn-primary">
                Get Started
                <i data-lucide="arrow-right"></i>
            </a>
            
            <a href="#/signin" class="btn btn-secondary">
                Sign In
            </a>
            
            <!-- Footer Quote -->
            <div class="card-quote mt-6">
                <i data-lucide="quote" style="color: var(--clr-primary); align-self: flex-start; margin-top: 4px;"></i>
                <p>A mother's journey is the greatest adventure. Let us watch over you.</p>
            </div>
        </div>
    </div>
</div>
`,_=`<!-- pages/profile.html -->
<div id="page-profile" class="page" style="padding-bottom: 100px;">
    <!-- Top App Bar -->
    <header class="glass-header">
      <div style="display: flex; align-items: center; gap: 12px;">
        <button onclick="App.goBack(); return false;" style="width: 24px; height: 24px; color: var(--clr-dark-green); background: none; border: none; padding: 0;">
          <i data-lucide="arrow-left"></i>
        </button>
        <h1 style="font-size: 20px; color: var(--clr-dark-green);">Profile</h1>
      </div>
    </header>

    <!-- Scrollable Main Content -->
    <div style="padding: 96px 24px 24px; max-width: 512px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px;">
      
      <!-- Profile Header Area -->
      <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; margin-bottom: 8px;">
        <div style="position: relative; width: 96px; height: 96px;">
          <img src="https://i.pravatar.cc/150?img=47" alt="User Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 4px solid white; box-shadow: var(--shadow-sm);">
          <div style="position: absolute; bottom: 0; right: 0; background: var(--clr-primary); width: 28px; height: 28px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 2px solid white;">
            <i data-lucide="shield-check" style="color: white; width: 14px; height: 14px;"></i>
          </div>
        </div>
        <h2 style="font-size: 24px; color: var(--clr-text-heading); font-weight: 700;">Sarah</h2>
        <div style="display: inline-flex; align-items: center; gap: 6px; background: var(--clr-green-10); padding: 6px 12px; border-radius: var(--r-pill); color: var(--clr-primary); font-size: 14px; font-weight: 600;">
          <i data-lucide="calendar" style="width: 14px; height: 14px;"></i>
          <span>Week 24</span>
        </div>
      </div>

      <!-- Personal Details Card -->
      <div class="card-white" style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <i data-lucide="user" style="color: var(--clr-primary); width: 20px; height: 20px;"></i>
          <h3 style="font-size: 18px; color: var(--clr-text-heading);">Personal Details</h3>
        </div>
        
        <div class="input-group">
          <label class="label">Full Name</label>
          <input type="text" value="Sarah" class="input-form">
        </div>

        <div style="display: flex; gap: 16px;">
          <div class="input-group" style="flex: 1;">
            <label class="label">Age</label>
            <input type="number" value="28" class="input-form">
          </div>
          <div class="input-group" style="flex: 1;">
            <label class="label">Date of Birth</label>
            <input type="text" value="12/05/1995" class="input-form">
          </div>
        </div>

        <div class="input-group">
          <label class="label">Primary Phone Number</label>
          <div style="position: relative;">
            <span style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--clr-text-muted); font-weight: 500;">+91</span>
            <input type="tel" value="9876543210" class="input-form" style="padding-left: 56px;">
          </div>
        </div>

        <div class="input-group">
          <label class="label">Email Address</label>
          <input type="email" value="sarah@example.com" class="input-form">
        </div>
      </div>

      <!-- Health & Preferences Card -->
      <div class="card-white" style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <i data-lucide="activity" style="color: var(--clr-primary); width: 20px; height: 20px;"></i>
          <h3 style="font-size: 18px; color: var(--clr-text-heading);">Health & Preferences</h3>
        </div>

        <div class="input-group">
          <label class="label">Blood Group</label>
          <select class="input-form">
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>O+</option>
          </select>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
        <button class="btn btn-primary" onclick="UI.showToast('Profile Saved'); App.goBack();">Save Changes</button>
        <button class="btn btn-secondary" onclick="UI.showToast('Exporting data...')">
          <i data-lucide="download" style="width: 18px; height: 18px;"></i> Export Health Data (JSON)
        </button>
        <button class="btn btn-text" onclick="window.location.hash='#/onboarding'" style="color: var(--clr-danger); margin-top: 8px;">
          <i data-lucide="log-out" style="width: 18px; height: 18px;"></i> Sign Out
        </button>
      </div>

    </div>
</div>
`,y=`<!-- pages/reminders.html -->
<div id="page-reminders" class="page" style="padding-bottom: 100px;">
    <!-- Top App Bar -->
    <header class="glass-header">
      <div style="display: flex; align-items: center; gap: 12px;">
        <button onclick="App.goBack(); return false;" style="width: 24px; height: 24px; color: var(--clr-dark-green); background: none; border: none; padding: 0;">
          <i data-lucide="arrow-left"></i>
        </button>
        <h1 style="font-size: 20px; color: var(--clr-dark-green);">Health Reminders</h1>
      </div>
    </header>

    <!-- Scrollable Main Content -->
    <div style="padding: 96px 24px 24px; max-width: 512px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px;">
      
      <!-- Hero / Add Reminder CTA -->
      <div class="card-info" style="display: flex; flex-direction: column; gap: 16px;">
        <h2 style="font-size: 24px; color: var(--clr-text-heading); font-weight: 700; z-index: 1;">Organize your wellness routine</h2>
        <button class="btn btn-primary" style="z-index: 1;" onclick="document.getElementById('add-reminder-modal').style.display='flex'">
          <i data-lucide="plus"></i> Add Reminder
        </button>
        <i data-lucide="bell" class="card-info-bg-icon"></i>
      </div>

      <!-- Active Schedules Section -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="font-size: 14px; font-weight: 700; color: var(--clr-text-body-alt); letter-spacing: 1px;">ACTIVE SCHEDULES</h3>
          <button class="btn-text" id="btn-clear-reminders">Edit all</button>
        </div>

        <div id="reminders-list" style="display: flex; flex-direction: column; gap: 12px;">
          <!-- Card 1 -->
          <div class="card-white" style="display: flex; justify-content: space-between; align-items: center; padding: 20px;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="width: 40px; height: 40px; background: var(--clr-green-10); border-radius: 50%; display: flex; justify-content: center; align-items: center; color: var(--clr-primary);">
                <i data-lucide="pill"></i>
              </div>
              <div>
                <h4 style="font-size: 16px; font-weight: 600; color: var(--clr-text-heading);">Prenatal Vitamins</h4>
                <p style="font-size: 14px; color: var(--clr-text-muted); margin-top: 2px;">09:00 AM - Daily</p>
              </div>
            </div>
            <!-- Toggle Switch Mock -->
            <div style="width: 48px; height: 28px; background: var(--clr-primary); border-radius: 14px; position: relative; cursor: pointer;">
              <div style="width: 24px; height: 24px; background: white; border-radius: 50%; position: absolute; top: 2px; right: 2px; box-shadow: var(--shadow-sm);"></div>
            </div>
          </div>
          
          <!-- Card 2 -->
          <div class="card-white" style="display: flex; justify-content: space-between; align-items: center; padding: 20px;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="width: 40px; height: 40px; background: rgba(59, 130, 246, 0.1); border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #3B82F6;">
                <i data-lucide="droplet"></i>
              </div>
              <div>
                <h4 style="font-size: 16px; font-weight: 600; color: var(--clr-text-heading);">Hydration</h4>
                <p style="font-size: 14px; color: var(--clr-text-muted); margin-top: 2px;">02:00 PM - Daily</p>
              </div>
            </div>
            <div style="width: 48px; height: 28px; background: var(--clr-border-subtle); border-radius: 14px; position: relative; cursor: pointer;">
              <div style="width: 24px; height: 24px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; box-shadow: var(--shadow-sm);"></div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Add Reminder Modal -->
    <div id="add-reminder-modal" style="display:none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: flex-end;">
      <div style="background: var(--clr-bg-white); width: 100%; border-radius: 32px 32px 0 0; padding: 32px 24px 64px; box-shadow: 0 -10px 40px rgba(0,0,0,0.1);">
        <h3 style="font-size: 20px; font-weight: 700; color: var(--clr-text-heading); margin-bottom: 24px; text-align: center;">New Reminder</h3>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div class="input-group">
            <label class="label">Reminder Name</label>
            <input type="text" id="new-reminder-title" class="input-form" placeholder="e.g. Prenatal Vitamins">
          </div>
          <div class="input-group">
            <label class="label">Time</label>
            <input type="time" id="new-reminder-time" class="input-form">
          </div>
        </div>
        
        <div style="display: flex; gap: 12px; margin-top: 32px;">
          <button class="btn btn-secondary" style="flex: 1; height: 56px;" onclick="document.getElementById('add-reminder-modal').style.display='none'">Cancel</button>
          <button class="btn btn-primary" style="flex: 1; height: 56px;" onclick="document.getElementById('add-reminder-modal').style.display='none'; UI.showToast('Reminder saved', 'success')">Save</button>
        </div>
      </div>
    </div>
</div>
`,b=`<!-- pages/risk-assessment.html -->
<div id="page-risk-assessment" class="page" style="background: var(--clr-bg-warm);">
    
    <header class="glass-header">
        <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
            <h1 style="font-size: 18px; color: var(--clr-dark-green);">Health Profile</h1>
        </div>
    </header>

    <div style="padding: 96px 24px 100px; max-width: 600px; margin: 0 auto;">
        
        <div style="text-align: center; margin-bottom: 32px;">
            <i data-lucide="clipboard-plus" style="width: 48px; height: 48px; color: var(--clr-primary); margin-bottom: 12px;"></i>
            <h2 style="font-size: 24px;">Let's establish your baseline</h2>
            <p style="color: var(--clr-text-muted); font-size: 14px; margin-top: 8px;">Please answer these 12 questions to calculate your initial GESTOSIS risk score. Your data is secure.</p>
        </div>
        
        <form id="assessment-form" onsubmit="event.preventDefault(); Assessment.submit();" style="display: flex; flex-direction: column; gap: 24px;">
            
            <!-- Q1: Age -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">1. What is your age?</label>
                <input type="number" id="q-age" class="input-form" placeholder="e.g., 28" required>
            </div>

            <!-- Q2: First Pregnancy -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">2. Is this your first pregnancy?</label>
                <div style="display: flex; gap: 12px;">
                    <label style="flex: 1;">
                        <input type="radio" name="q-first-preg" value="yes" style="display: none;" required>
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">Yes</div>
                    </label>
                    <label style="flex: 1;">
                        <input type="radio" name="q-first-preg" value="no" style="display: none;">
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">No</div>
                    </label>
                </div>
            </div>

            <!-- Q3: Prior PE -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">3. Have you had preeclampsia in a previous pregnancy?</label>
                <div style="display: flex; gap: 12px;">
                    <label style="flex: 1;">
                        <input type="radio" name="q-prior-pe" value="yes" style="display: none;" required>
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">Yes</div>
                    </label>
                    <label style="flex: 1;">
                        <input type="radio" name="q-prior-pe" value="no" style="display: none;">
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">No</div>
                    </label>
                </div>
            </div>

            <!-- Q4: Chronic HTN -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">4. Do you have pre-existing (chronic) high blood pressure?</label>
                <div style="display: flex; gap: 12px;">
                    <label style="flex: 1;">
                        <input type="radio" name="q-chronic-htn" value="yes" style="display: none;" required>
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">Yes</div>
                    </label>
                    <label style="flex: 1;">
                        <input type="radio" name="q-chronic-htn" value="no" style="display: none;">
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">No</div>
                    </label>
                </div>
            </div>

            <!-- Q5: Diabetes -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">5. Do you have diabetes?</label>
                <select id="q-diabetes" class="input-form" required>
                    <option value="" disabled selected>Select an option</option>
                    <option value="none">No</option>
                    <option value="gestational">Gestational Diabetes (Pregnancy-induced)</option>
                    <option value="type1_2">Type 1 or Type 2 Diabetes</option>
                </select>
            </div>

            <!-- Q6: Family History -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">6. Is there a family history of preeclampsia or hypertension?</label>
                <div style="display: flex; gap: 12px;">
                    <label style="flex: 1;">
                        <input type="radio" name="q-family" value="yes" style="display: none;" required>
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">Yes</div>
                    </label>
                    <label style="flex: 1;">
                        <input type="radio" name="q-family" value="no" style="display: none;">
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">No</div>
                    </label>
                </div>
            </div>

            <!-- Q7: BMI -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">7. What is your height and pre-pregnancy weight?</label>
                <div style="display: flex; gap: 16px;">
                    <div style="flex: 1; position: relative;">
                        <input type="number" id="q-height" class="input-form" placeholder="160" required style="padding-right: 40px;">
                        <span style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--clr-text-muted);">cm</span>
                    </div>
                    <div style="flex: 1; position: relative;">
                        <input type="number" id="q-weight" class="input-form" placeholder="65" required style="padding-right: 40px;">
                        <span style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--clr-text-muted);">kg</span>
                    </div>
                </div>
            </div>

            <!-- Q8: Booking BP -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">8. What was your booking (initial) blood pressure?</label>
                <div style="display: flex; gap: 16px; align-items: center;">
                    <input type="number" id="q-booking-sys" class="input-form" placeholder="SYS" style="flex: 1; text-align: center;">
                    <span style="color: var(--clr-text-muted);">/</span>
                    <input type="number" id="q-booking-dia" class="input-form" placeholder="DIA" style="flex: 1; text-align: center;">
                </div>
                <p style="font-size: 12px; color: var(--clr-text-muted); margin-top: 8px;">Leave blank if unknown.</p>
            </div>

            <!-- Q9: Current BP -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">9. What is your most recent blood pressure?</label>
                <div style="display: flex; gap: 16px; align-items: center;">
                    <input type="number" id="q-current-sys" class="input-form" placeholder="SYS" style="flex: 1; text-align: center;" required>
                    <span style="color: var(--clr-text-muted);">/</span>
                    <input type="number" id="q-current-dia" class="input-form" placeholder="DIA" style="flex: 1; text-align: center;" required>
                </div>
            </div>

            <!-- Q10: Symptoms -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">10. Are you currently experiencing any of these symptoms?</label>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <label class="checkbox-item" style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                        <input type="checkbox" name="q-symptoms" value="severe_headache" style="width: 20px; height: 20px; accent-color: var(--clr-primary);">
                        <span>Severe headache</span>
                    </label>
                    <label class="checkbox-item" style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                        <input type="checkbox" name="q-symptoms" value="vision_changes" style="width: 20px; height: 20px; accent-color: var(--clr-primary);">
                        <span>Visual disturbances (blurriness, spots)</span>
                    </label>
                    <label class="checkbox-item" style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                        <input type="checkbox" name="q-symptoms" value="ruq_pain" style="width: 20px; height: 20px; accent-color: var(--clr-primary);">
                        <span>Upper abdominal pain</span>
                    </label>
                    <label class="checkbox-item" style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                        <input type="checkbox" name="q-symptoms" value="swelling" style="width: 20px; height: 20px; accent-color: var(--clr-primary);">
                        <span>Sudden swelling of face or hands</span>
                    </label>
                </div>
            </div>

            <!-- Q11: Weight Gain -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">11. Have you experienced rapid weight gain recently (≥2kg/week)?</label>
                <div style="display: flex; gap: 12px;">
                    <label style="flex: 1;">
                        <input type="radio" name="q-weight-gain" value="yes" style="display: none;" required>
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">Yes</div>
                    </label>
                    <label style="flex: 1;">
                        <input type="radio" name="q-weight-gain" value="no" style="display: none;">
                        <div class="btn btn-secondary q-radio-btn" style="height: 48px;">No</div>
                    </label>
                </div>
            </div>

            <!-- Q12: Proteinuria -->
            <div class="card-white" style="padding: 24px;">
                <label class="label" style="font-size: 16px; margin-bottom: 16px; display: block;">12. Do you have protein in your urine (Proteinuria)?</label>
                <select id="q-protein" class="input-form" required>
                    <option value="" disabled selected>Select from latest test</option>
                    <option value="negative">Negative</option>
                    <option value="trace">Trace</option>
                    <option value="1plus">1+</option>
                    <option value="2plus">2+</option>
                    <option value="3plus">3+ or higher</option>
                    <option value="unknown">Not Tested / Unknown</option>
                </select>
            </div>

            <button type="submit" class="btn btn-primary" style="height: 56px; font-size: 16px; margin-top: 16px;">
                Complete Setup
            </button>
        </form>
    </div>

    <!-- Styles for custom radio buttons -->
    <style>
        input[type="radio"]:checked + .q-radio-btn {
            background: var(--clr-primary);
            color: white;
            border-color: var(--clr-primary);
        }
    </style>
</div>
`,x=`<!-- pages/signin.html -->
<div id="page-signin" class="page">
    <div class="signin-bg"></div>
    
    <div class="signin-content">
        <!-- Branding Header -->
        <div class="brand-header">
            <!-- Use a placeholder div for logo if image not available -->
            <div style="width: 96px; height: 96px; background: var(--clr-primary); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-bottom: 24px;">
                <i data-lucide="shield" style="color: white; width: 48px; height: 48px;"></i>
            </div>
            <h1>Gestation Guardian</h1>
            <p style="font-weight: 600; font-size: 16px; color: var(--clr-text-body-alt);">Monitor. Protect. Nurture.</p>
        </div>

        <!-- Glass Card for Auth -->
        <div class="card-glass w-full">
            
            <!-- Tab Switcher (Simulated links for SPA) -->
            <div class="tab-switcher mb-6" style="margin-bottom: 32px;">
                <a href="#/signin" class="tab-btn active">Sign In</a>
                <a href="#/signup" class="tab-btn">Sign Up</a>
            </div>

            <form id="form-signin" onsubmit="event.preventDefault(); Auth.handleSignIn();">
                <!-- Form Fields Container -->
                <div style="display: flex; flex-direction: column; gap: 24px; margin-bottom: 32px;">
                    
                    <!-- Email Field -->
                    <div class="input-group">
                        <label class="label">Email Address</label>
                        <div style="position: relative;">
                            <i data-lucide="mail" class="input-icon-left"></i>
                            <input type="email" id="signin-email" class="input-auth" placeholder="name@example.com" required>
                        </div>
                    </div>

                    <!-- Password Field -->
                    <div class="input-group">
                        <div class="label-row" style="padding: 0;">
                            <label class="label">Password</label>
                            <a href="#" class="btn-text-link">Forgot?</a>
                        </div>
                        <div style="position: relative;">
                            <i data-lucide="lock" class="input-icon-left"></i>
                            <input type="password" id="signin-password" class="input-auth" placeholder="••••••••" required>
                            <button type="button" class="input-icon-right" onclick="Auth.togglePassword('signin-password')">
                                <i data-lucide="eye"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Action Button -->
                <button type="submit" class="btn btn-action">
                    Sign In
                </button>
            </form>

            <div class="divider-with-text mt-6 mb-6" style="margin: 32px 0;">
                <span>OR</span>
            </div>

            <!-- Social Sign-in -->
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <button type="button" class="btn btn-google">
                    <i data-lucide="chrome" style="color: #4285F4;"></i> <!-- Fallback for Google logo -->
                    Continue with Google
                </button>
                <button type="button" class="btn btn-apple">
                    <i data-lucide="apple"></i>
                    Continue with Apple
                </button>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 32px;">
            <p style="font-weight: 700; font-size: 16px; color: var(--clr-text-primary);">
                Don't have an account? <br>
                <a href="#/signup" style="color: var(--clr-primary);">Create one</a>
            </p>
        </div>
    </div>
</div>
`,C=`<!-- pages/signup.html -->
<div id="page-signup" class="page">
    
    <div class="signup-content">
        <!-- Solid White Card -->
        <div class="card-white w-full" style="padding-top: 40px;">
            
            <div class="signup-header">
                <!-- Placeholder for logo -->
                <div style="width: 80px; height: 80px; background: var(--clr-primary); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 12px;">
                    <i data-lucide="shield" style="color: white; width: 40px; height: 40px;"></i>
                </div>
                <h2>Create Your<br>Safe Space</h2>
                <p style="font-weight: 500; font-size: 16px; color: var(--clr-text-body); margin-top: 12px;">Let's get started on your journey</p>
            </div>

            <form id="form-signup" class="signup-form" onsubmit="event.preventDefault(); Auth.handleSignUp();">
                
                <!-- Full Name -->
                <div class="input-group">
                    <label class="label">Full Name</label>
                    <div style="position: relative;">
                        <input type="text" id="su-name" class="input-form" placeholder="Eleanor Vance" required>
                        <i data-lucide="user" class="input-icon-right" style="pointer-events: none;"></i>
                    </div>
                </div>

                <!-- Phone & OTP Section -->
                <div class="input-group">
                    <label class="label">Phone Number</label>
                    <div style="display: flex; gap: 8px;">
                        <input type="tel" id="su-phone" class="input-form" style="flex: 1;" placeholder="+91 98765 43210" required>
                        <button type="button" class="btn btn-primary" style="width: auto; padding: 0 24px; height: 58px; font-size: 14px;" onclick="Auth.sendOTP()">Send</button>
                    </div>
                </div>

                <div id="otp-section" class="input-group hidden">
                    <label class="label">Enter OTP</label>
                    <div class="otp-group">
                        <input type="text" maxlength="1" class="input-otp" data-index="1">
                        <input type="text" maxlength="1" class="input-otp" data-index="2">
                        <input type="text" maxlength="1" class="input-otp" data-index="3">
                        <input type="text" maxlength="1" class="input-otp" data-index="4">
                    </div>
                </div>

                <!-- Email -->
                <div class="input-group">
                    <label class="label">Email</label>
                    <input type="email" id="su-email" class="input-form" placeholder="name@example.com" required>
                </div>

                <!-- Password -->
                <div class="input-group">
                    <label class="label">Password</label>
                    <div style="position: relative;">
                        <input type="password" id="su-password" class="input-form" placeholder="Create a password" required>
                        <button type="button" class="input-icon-right" onclick="Auth.togglePassword('su-password')">
                            <i data-lucide="eye"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Date of Birth -->
                <div class="input-group">
                    <label class="label">Date of Birth</label>
                    <input type="date" id="su-dob" class="input-form" required>
                </div>

                <!-- LMP / EDD -->
                <div class="input-group">
                    <label class="label">Last Menstrual Period (LMP)</label>
                    <input type="date" id="su-lmp" class="input-form" onchange="Auth.calculateEDD()" required>
                    <p id="su-edd-display" style="font-size: 12px; color: var(--clr-text-muted); margin-top: 4px;"></p>
                </div>

                <!-- Blood Group -->
                <div class="input-group">
                    <label class="label">Blood Group</label>
                    <select id="su-blood" class="input-form" required>
                        <option value="" disabled selected>Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>

                <button type="submit" class="btn btn-action" style="margin-top: 16px;">
                    Continue to Health Profile
                </button>
            </form>
            
            <div style="text-align: center; margin-top: 24px;">
                <p style="font-size: 14px; color: var(--clr-text-muted);">
                    Already have an account? <a href="#/signin" style="color: var(--clr-primary); font-weight: 700;">Sign In</a>
                </p>
            </div>
            
        </div>
    </div>
</div>
`,w=window.location.protocol===`file:`?`http://10.0.2.2:3000/api`:`/api`,T={KEYS:{PROFILE:`gg_profile`,BP_LOGS:`gg_bp_logs`,VITALS_LOGS:`gg_vitals_logs`,GLUCOSE_LOGS:`gg_glucose_logs`,URINE_LOGS:`gg_urine_logs`,HB_LOGS:`gg_hb_logs`,KICKS:`gg_kick_sessions`,CONTRACTIONS:`gg_contractions`,SYMPTOMS:`gg_symptoms`,HISTORY:`gg_medical_history`,REMINDERS:`gg_reminders`,SETTINGS:`gg_settings`},userId:`default_user_123`,getSyncQueue:function(){var e=localStorage.getItem(`gg_sync_queue`);return e?JSON.parse(e):[]},saveSyncQueue:function(e){localStorage.setItem(`gg_sync_queue`,JSON.stringify(e))},processSyncQueue:function(){var e=this;return S(g().m(function t(){var n,r;return g().w(function(t){for(;;)switch(t.p=t.n){case 0:if(navigator.onLine){t.n=1;break}return t.a(2);case 1:if(n=e.getSyncQueue(),n.length!==0){t.n=2;break}return t.a(2);case 2:return console.log(`Processing ${n.length} queued operations...`),t.p=3,t.n=4,fetch(`${w}/sync`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({operations:n})});case 4:if(!t.v.ok){t.n=5;break}console.log(`Sync successful, clearing queue.`),e.saveSyncQueue([]);case 5:t.n=7;break;case 6:t.p=6,r=t.v,console.error(`Sync failed, will retry later.`,r);case 7:return t.a(2)}},t,null,[[3,6]])}))()},initSyncEngine:function(){var e=this;window.addEventListener(`online`,function(){console.log(`Back online. Triggering sync...`),e.processSyncQueue()}),setTimeout(function(){return e.processSyncQueue()},2e3)},_get:function(e){var t=arguments,n=this;return S(g().m(function r(){var i,a,o,s,c,l;return g().w(function(r){for(;;)switch(r.p=r.n){case 0:if(i=t.length>1&&t[1]!==void 0?t[1]:null,!navigator.onLine){r.n=6;break}return r.p=1,r.n=2,fetch(`${w}/users/${n.userId}/collections/${e}`);case 2:if(a=r.v,!a.ok){r.n=4;break}return r.n=3,a.json();case 3:return o=r.v,localStorage.setItem(e,JSON.stringify(o)),r.a(2,o);case 4:r.n=6;break;case 5:r.p=5,c=r.v,console.warn(`Network fetch failed for ${e}, falling back to local:`,c);case 6:if(r.p=6,s=localStorage.getItem(e),s){r.n=7;break}return r.a(2,i);case 7:return r.p=7,r.a(2,JSON.parse(s));case 8:return r.p=8,r.v,r.a(2,JSON.parse(atob(s)));case 9:return r.p=9,l=r.v,console.error(`Error reading ${e} from storage:`,l),r.a(2,i);case 10:return r.a(2)}},r,null,[[7,8],[6,9],[1,5]])}))()},_set:function(e,t){var n=this;return S(g().m(function r(){var i,a;return g().w(function(r){for(;;)switch(r.p=r.n){case 0:try{localStorage.setItem(e,JSON.stringify(t))}catch(t){console.error(`Error saving ${e} to local storage:`,t)}if(!navigator.onLine){r.n=5;break}return r.p=1,r.n=2,fetch(`${w}/users/${n.userId}/collections/${e}`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)});case 2:if(!r.v.ok){r.n=3;break}return r.a(2);case 3:r.n=5;break;case 4:r.p=4,a=r.v,console.warn(`Network write failed for ${e}, queuing for offline sync:`,a);case 5:i=n.getSyncQueue().filter(function(t){return t.key!==e}),i.push({userId:n.userId,key:e,data:t,timestamp:Date.now()}),n.saveSyncQueue(i);case 6:return r.a(2)}},r,null,[[1,4]])}))()},_generateId:function(){return Date.now().toString(36)+Math.random().toString(36).substr(2)},getProfile:function(){var e=this;return S(g().m(function t(){return g().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,e._get(e.KEYS.PROFILE);case 1:return t.a(2,t.v)}},t)}))()},saveProfile:function(e){var t=this;return S(g().m(function n(){return g().w(function(n){for(;;)switch(n.n){case 0:return n.n=1,t._set(t.KEYS.PROFILE,e);case 1:return n.a(2)}},n)}))()},getLogs:function(e){var t=this;return S(g().m(function n(){var r;return g().w(function(n){for(;;)switch(n.n){case 0:return n.n=1,t._get(e,[]);case 1:if(r=n.v,!(!r||Object.keys(r).length===0)){n.n=2;break}return n.a(2,[]);case 2:return n.a(2,r)}},n)}))()},addLog:function(e,t){var n=this;return S(g().m(function r(){var i,a;return g().w(function(r){for(;;)switch(r.n){case 0:return r.n=1,n.getLogs(e);case 1:return i=r.v,a=f({id:n._generateId(),timestamp:new Date().toISOString()},t),i.unshift(a),r.n=2,n._set(e,i);case 2:return r.a(2,a)}},r)}))()},getLatestBP:function(){var e=this;return S(g().m(function t(){var n;return g().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,e.getLogs(e.KEYS.BP_LOGS);case 1:return n=t.v,t.a(2,n.length>0?n[0]:null)}},t)}))()},getLatestUrine:function(){var e=this;return S(g().m(function t(){var n;return g().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,e.getLogs(e.KEYS.URINE_LOGS);case 1:return n=t.v,t.a(2,n.length>0?n[0]:null)}},t)}))()},getTodaySymptoms:function(){var e=this;return S(g().m(function t(){var n,r;return g().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,e.getLogs(e.KEYS.SYMPTOMS);case 1:return n=t.v,r=new Date().toDateString(),t.a(2,n.filter(function(e){return new Date(e.timestamp).toDateString()===r}))}},t)}))()},getCurrentGestationalWeek:function(){var e=this;return S(g().m(function t(){var n,r,i,a,o;return g().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,e.getProfile();case 1:if(n=t.v,!(!n||!n.lmp)){t.n=2;break}return t.a(2,0);case 2:return r=new Date(n.lmp),i=Math.abs(new Date-r),a=Math.floor(i/(1e3*60*60*24)),o=Math.floor(a/7),t.a(2,Math.min(Math.max(o,0),42))}},t)}))()},getCurrentTrimester:function(){var e=this;return S(g().m(function t(){var n;return g().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,e.getCurrentGestationalWeek();case 1:if(n=t.v,!(n<13)){t.n=2;break}return t.a(2,1);case 2:if(!(n<27)){t.n=3;break}return t.a(2,2);case 3:return t.a(2,3)}},t)}))()},clearAll:function(){var e=this;return S(g().m(function t(){return g().w(function(t){for(;;)switch(t.n){case 0:Object.values(e.KEYS).forEach(function(e){return localStorage.removeItem(e)});case 1:return t.a(2)}},t)}))()}},window.Store=T,E={updateBottomNav:function(e){var t=document.getElementById(`bottom-nav`);if(t){if([`onboarding`,`signin`,`signup`,`bluetooth`].includes(e)){t.classList.add(`hidden`);return}t.classList.remove(`hidden`),document.querySelectorAll(`.nav-item`).forEach(function(t){t.getAttribute(`data-target`)===e?t.classList.add(`active`):t.classList.remove(`active`)})}},showToast:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:`success`,n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:3e3,r=document.getElementById(`toast-container`);if(r){var i=document.createElement(`div`);i.className=`toast ${t}`,i.innerHTML=`
            <i data-lucide="${t===`success`?`check-circle`:`alert-triangle`}"></i>
            <span>${e}</span>
        `,r.appendChild(i),window.lucide&&window.lucide.createIcons({root:i}),requestAnimationFrame(function(){i.classList.add(`show`)}),setTimeout(function(){i.classList.remove(`show`),setTimeout(function(){return i.remove()},300)},n)}},initBottomSheet:function(){var e=document.getElementById(`log-sheet-overlay`),t=document.getElementById(`nav-log-btn`),n=document.querySelector(`.bottom-sheet`);if(!(!e||!t||!n)){t.addEventListener(`click`,function(t){t.preventDefault(),e.classList.remove(`hidden`)}),e.addEventListener(`click`,function(t){t.target===e&&e.classList.add(`hidden`)});var r=0;n.addEventListener(`touchstart`,function(e){r=e.touches[0].clientY},{passive:!0}),n.addEventListener(`touchmove`,function(t){t.touches[0].clientY-r>50&&e.classList.add(`hidden`)},{passive:!0}),n.querySelectorAll(`a`).forEach(function(t){t.addEventListener(`click`,function(){e.classList.add(`hidden`)})})}},haptic:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:10;navigator.vibrate&&navigator.vibrate(e)}},document.addEventListener(`DOMContentLoaded`,function(){E.initBottomSheet()}),window.UI=E,D={init:function(e){e===`signup`&&this.setupOTPInputs()},togglePassword:function(e){var t=document.getElementById(e);t&&(t.type===`password`?t.type=`text`:t.type=`password`)},sendOTP:function(){var e=document.getElementById(`su-phone`).value;if(!e||e.length<10){E.showToast(`Please enter a valid phone number`,`error`);return}E.showToast(`OTP sent via SMS`,`success`),document.getElementById(`otp-section`).classList.remove(`hidden`),setTimeout(function(){document.querySelector(`.input-otp[data-index="1"]`).focus()},100)},setupOTPInputs:function(){document.querySelectorAll(`.input-otp`).forEach(function(e){e.addEventListener(`keyup`,function(t){var n=e,r=parseInt(n.dataset.index);if(n.value.length===1&&r<4){var i=document.querySelector(`.input-otp[data-index="${r+1}"]`);i&&i.focus()}if(t.key===`Backspace`&&n.value.length===0&&r>1){var a=document.querySelector(`.input-otp[data-index="${r-1}"]`);a&&(a.focus(),a.value=``)}})})},calculateEDD:function(){var e=document.getElementById(`su-lmp`),t=document.getElementById(`su-edd-display`);if(!(!e||!e.value)){var n=new Date(e.value),r=new Date(n.getTime());r.setDate(r.getDate()+280),t.textContent=`Estimated Due Date: ${r.toLocaleDateString(void 0,{year:`numeric`,month:`long`,day:`numeric`})}`}},handleSignUp:function(){return S(g().m(function e(){var t,n,r,i,a,o,s,c,l,u,d,f,p,m,h;return g().w(function(e){for(;;)switch(e.n){case 0:if(t=document.getElementById(`su-name`).value,n=document.getElementById(`su-phone`).value,r=document.getElementById(`su-email`).value,i=document.getElementById(`su-dob`).value,a=document.getElementById(`su-lmp`).value,o=document.getElementById(`su-blood`).value,s=document.querySelectorAll(`.input-otp`),c=``,s.forEach(function(e){return c+=e.value}),!(c.length<4)){e.n=1;break}return E.showToast(`Please verify your phone number with the OTP`,`error`),e.a(2);case 1:return l=new Date(i),u=new Date,d=u.getFullYear()-l.getFullYear(),f=u.getMonth()-l.getMonth(),(f<0||f===0&&u.getDate()<l.getDate())&&d--,p=new Date(a),m=new Date(p.getTime()),m.setDate(m.getDate()+280),h={name:t,phone:n,email:r,dob:i,age:d,lmp:a,edd:m.toISOString().split(`T`)[0],bloodGroup:o,isFirstPregnancy:!1,priorPE:!1,priorPTB:!1,chronicHTN:!1,diabetes:`none`,multipleGestation:!1,familyHistory:!1},e.n=2,T.saveProfile(h);case 2:E.showToast(`Account created securely`,`success`),setTimeout(function(){window.location.hash=`#/risk-assessment`},1e3);case 3:return e.a(2)}},e)}))()},handleSignIn:function(){return S(g().m(function e(){var t,n,r;return g().w(function(e){for(;;)switch(e.n){case 0:if(t=document.getElementById(`signin-email`).value,n=document.getElementById(`signin-password`).value,!(!t||!n)){e.n=1;break}return E.showToast(`Please enter your credentials`,`error`),e.a(2);case 1:return e.n=2,T.getProfile();case 2:if(e.v){e.n=3;break}return r=new Date,r.setDate(r.getDate()-140),e.n=3,T.saveProfile({name:`Demo User`,email:t,lmp:r.toISOString().split(`T`)[0],age:28,bloodGroup:`O+`});case 3:E.showToast(`Signed in successfully`,`success`),setTimeout(function(){window.location.hash=`#/dashboard`},1e3);case 4:return e.a(2)}},e)}))()}},window.Auth=D,window.Auth=D,O={connectedDevices:[],init:function(){console.log(`Bluetooth Manager Initialized`),this.connectedDevices=[],this.updateUI()},connect:function(e){var t=this;E.showToast(`Scanning for ${e.toUpperCase()} devices...`,`success`,2e3);var n=document.querySelectorAll(`.card-device`),r=null;n.forEach(function(t){var n=t.querySelector(`button`);n&&n.getAttribute(`onclick`).includes(e)&&(r=n)}),r&&(r.innerText,r.innerText=`Connecting...`,r.style.opacity=`0.7`,setTimeout(function(){t.connectedDevices.push(e),r.innerText=`Connected`,r.style.background=`var(--clr-accent-green)`,r.style.color=`white`,r.style.opacity=`1`,r.disabled=!0,E.showToast(`${e.toUpperCase()} Connected Successfully!`,`success`),t.updateUI()},2e3))},updateUI:function(){},receiveData:function(e,t){return S(g().m(function n(){return g().w(function(n){for(;;)switch(n.n){case 0:if(console.log(`Received data from ${e}:`,t),e!==`bp`){n.n=2;break}return n.n=1,T.addLog(T.KEYS.BP_LOGS,{date:new Date().toISOString().split(`T`)[0],time:new Date().toTimeString().split(` `)[0],sys:t.sys,dia:t.dia,pulse:t.pulse,position:`sitting`,arm:`left`,notes:`Auto-synced from BP Monitor`});case 1:E.showToast(`New Blood Pressure reading synced`,`success`),n.n=3;break;case 2:case 3:return n.a(2)}},n)}))()}},window.Bluetooth=O,window.Bluetooth=O,k={kickSessionActive:!1,kickCount:0,kickStartTime:null,kickInterval:null,isContractionActive:!1,contractionStartTime:null,contractionInterval:null,lastContractionEndTime:null,currentContractionDuration:0,init:function(){var e=document.getElementById(`kick-control-btn`);e&&(e.addEventListener(`mousedown`,function(){return e.style.transform=`scale(0.95)`}),e.addEventListener(`mouseup`,function(){return e.style.transform=`scale(1)`}),e.addEventListener(`mouseleave`,function(){return e.style.transform=`scale(1)`}),e.addEventListener(`touchstart`,function(){return e.style.transform=`scale(0.95)`}),e.addEventListener(`touchend`,function(){return e.style.transform=`scale(1)`}))},toggleSession:function(){var e=document.getElementById(`kick-control-btn`);e&&(this.kickSessionActive?(this.endKickSession(),e.textContent=`Start Session`,e.classList.replace(`btn-danger`,`btn-secondary`)):(this.startKickSession(),e.textContent=`End Session`,e.classList.replace(`btn-secondary`,`btn-danger`),e.style.background=`var(--clr-danger)`,e.style.color=`white`))},startKickSession:function(){var e=this;this.kickSessionActive=!0,this.kickCount=0,this.kickStartTime=Date.now(),this.updateKickDisplay(),this.kickInterval=setInterval(function(){e.updateKickTimer()},1e3),E.showToast(`Session started. Tap the circle when you feel a kick.`)},endKickSession:function(){var e=this;return S(g().m(function t(){var n;return g().w(function(t){for(;;)switch(t.n){case 0:if(e.kickSessionActive=!1,clearInterval(e.kickInterval),n=Math.floor((Date.now()-e.kickStartTime)/1e3),!(n>60||e.kickCount>0)){t.n=2;break}return t.n=1,T.addLog(T.KEYS.KICKS,{date:new Date().toISOString().split(`T`)[0],time:new Date().toTimeString().split(` `)[0],count:e.kickCount,durationSeconds:n});case 1:E.showToast(`Session saved: ${e.kickCount} kicks in ${e.formatTime(n)}`,`success`);case 2:e.kickCount=0,e.updateKickDisplay(),document.getElementById(`kick-timer-display`).textContent=`00:00`;case 3:return t.a(2)}},t)}))()},logKick:function(){if(this.kickSessionActive||this.toggleSession(),this.kickCount++,this.updateKickDisplay(),E.haptic(),this.kickCount>=10){var e=Math.floor((Date.now()-this.kickStartTime)/1e3);E.showToast(`Great! 10 kicks reached in ${this.formatTime(e)}.`,`success`)}},updateKickDisplay:function(){var e=document.getElementById(`kick-count-display`);e&&(e.textContent=this.kickCount)},updateKickTimer:function(){var e=document.getElementById(`kick-timer-display`);if(e){var t=Math.floor((Date.now()-this.kickStartTime)/1e3);e.textContent=this.formatTime(t)}},initContractions:function(){var e=this;return S(g().m(function t(){return g().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,e.updateContractionAverages();case 1:return t.a(2)}},t)}))()},toggleContraction:function(){var e=this;return S(g().m(function t(){var n,r,i,a,o;return g().w(function(t){for(;;)switch(t.n){case 0:if(n=document.getElementById(`contraction-button`),r=document.getElementById(`contraction-state-display`),i=document.getElementById(`contraction-timer-display`),!(!n||!r)){t.n=1;break}return t.a(2);case 1:if(!e.isContractionActive){t.n=4;break}if(e.isContractionActive=!1,clearInterval(e.contractionInterval),a=Math.floor((Date.now()-e.contractionStartTime)/1e3),o=null,e.lastContractionEndTime&&(o=Math.floor((e.contractionStartTime-e.lastContractionEndTime)/1e3)),e.lastContractionEndTime=Date.now(),!(a>10)){t.n=3;break}return t.n=2,T.addLog(T.KEYS.CONTRACTIONS,{timestamp:new Date().toISOString(),durationSec:a,frequencySec:o});case 2:return t.n=3,e.updateContractionAverages();case 3:n.style.background=`var(--clr-bg-white)`,n.style.borderColor=`var(--clr-purple-bg)`,r.innerHTML=`Tap to<br>Start`,r.style.color=`var(--clr-purple)`,i.style.display=`none`,t.n=5;break;case 4:e.isContractionActive=!0,e.contractionStartTime=Date.now(),navigator.vibrate&&navigator.vibrate([50,50,50]),n.style.background=`var(--clr-purple-bg)`,n.style.borderColor=`var(--clr-purple)`,r.textContent=`Contracting...`,r.style.color=`white`,i.style.display=`block`,i.style.color=`white`,i.textContent=`00:00`,e.contractionInterval=setInterval(function(){var t=Math.floor((Date.now()-e.contractionStartTime)/1e3);i.textContent=e.formatTime(t)},1e3);case 5:return t.a(2)}},t)}))()},updateContractionAverages:function(){var e=this;return S(g().m(function t(){var n,r,i,a,o,s,c,l,u;return g().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,T.getLogs(T.KEYS.CONTRACTIONS);case 1:if(n=t.v,n.length!==0){t.n=2;break}return t.a(2);case 2:r=n.slice(0,5),i=0,a=0,o=0,r.forEach(function(e){i+=e.durationSec,e.frequencySec&&(a+=e.frequencySec,o++)}),s=i/r.length,document.getElementById(`avg-duration`).textContent=e.formatTime(Math.round(s)),o>0&&(c=a/o,l=Math.floor(c/60),u=Math.round(c%60),document.getElementById(`avg-frequency`).textContent=`${l}m ${u}s apart`);case 3:return t.a(2)}},t)}))()},formatTime:function(e){return`${Math.floor(e/60).toString().padStart(2,`0`)}:${(e%60).toString().padStart(2,`0`)}`}},window.Kicks=k,window.Kicks=k,A={logSymptom:function(e,t){return S(g().m(function n(){var r,i,a,o;return g().w(function(n){for(;;)switch(n.n){case 0:return n.n=1,T.getTodaySymptoms();case 1:if(r=n.v,i=r.length>0?r[0]:null,i){n.n=3;break}return n.n=2,T.addLog(T.KEYS.SYMPTOMS,{symptoms:[e],severity:1,notes:`Quick log from dashboard`});case 2:i=n.v,E.showToast(`Logged symptom: ${e}`),n.n=6;break;case 3:if(i.symptoms||(i.symptoms=[]),i.symptoms.includes(e)){n.n=6;break}return i.symptoms.push(e),n.n=4,T.getLogs(T.KEYS.SYMPTOMS);case 4:if(a=n.v,o=a.findIndex(function(e){return e.id===i.id}),o===-1){n.n=5;break}return a[o]=i,n.n=5,T._set(T.KEYS.SYMPTOMS,a);case 5:E.showToast(`Added symptom: ${e}`);case 6:t&&(t.classList.replace(`btn-secondary`,`btn-primary`),t.style.background=`var(--clr-primary)`,t.style.color=`white`),window.DashboardUI&&DashboardUI.init();case 7:return n.a(2)}},n)}))()},saveBP:function(){return S(g().m(function e(){var t,n,r,i,a,o,s,c,l,u,d,f,p,m;return g().w(function(e){for(;;)switch(e.n){case 0:t=parseInt(document.getElementById(`bp-sys`).value),n=parseInt(document.getElementById(`bp-dia`).value),r=parseInt(document.getElementById(`bp-pulse`).value)||0,i=`sitting`,a=document.getElementsByName(`bp-position`),o=v(a);try{for(o.s();!(s=o.n()).done;)c=s.value,c.checked&&(i=c.value)}catch(e){o.e(e)}finally{o.f()}l=`left`,u=document.getElementsByName(`bp-arm`),d=v(u);try{for(d.s();!(f=d.n()).done;)p=f.value,p.checked&&(l=p.value)}catch(e){d.e(e)}finally{d.f()}if(m=document.getElementById(`bp-notes`).value,!(!t||!n)){e.n=1;break}return E.showToast(`Please enter both Systolic and Diastolic values`,`error`),e.a(2);case 1:if(!(t<50||t>250||n<30||n>150)){e.n=2;break}return E.showToast(`Values seem out of normal human range. Please check.`,`error`),e.a(2);case 2:return e.n=3,T.addLog(T.KEYS.BP_LOGS,{sys:t,dia:n,pulse:r,position:i,arm:l,notes:m,date:new Date().toISOString().split(`T`)[0],time:new Date().toTimeString().split(` `)[0]});case 3:E.showToast(`Blood Pressure reading saved successfully`,`success`),setTimeout(function(){return R.goBack()},1e3);case 4:return e.a(2)}},e)}))()},saveVitals:function(){return S(g().m(function e(){var t,n,r,i,a,o,s;return g().w(function(e){for(;;)switch(e.n){case 0:if(t=parseFloat(document.getElementById(`vital-weight`).value),n=parseFloat(document.getElementById(`vital-sleep`).value),r=parseInt(document.getElementById(`vital-stress`).value),i=parseFloat(document.getElementById(`vital-temp`).value),a=parseFloat(document.getElementById(`vital-glucose`).value),o=document.getElementById(`vital-protein`).value,s={},t&&(s.weight=t),n&&(s.sleep=n),r&&(s.stress=r),i&&(s.temperature=i),a&&(s.glucose=a),o&&(s.protein=o),Object.keys(s).length!==0){e.n=1;break}return E.showToast(`Please enter at least one vital sign`,`error`),e.a(2);case 1:return e.n=2,T.addLog(T.KEYS.VITALS_LOGS,s);case 2:E.showToast(`Vitals saved successfully`,`success`),setTimeout(function(){return R.goBack()},1e3);case 3:return e.a(2)}},e)}))()},initBPPage:function(){},initVitalsPage:function(){var e=document.getElementById(`vital-stress`);e&&e.addEventListener(`input`,function(e){})}},window.Vitals=A,window.Vitals=A,j={init:function(){console.log(`Assessment initialized`)},submit:function(){return S(g().m(function e(){var t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,_,v,y,b,x,S,C,w,D,O;return g().w(function(e){for(;;)switch(e.n){case 0:return t=parseInt(document.getElementById(`q-age`).value)||25,n=document.querySelector(`input[name="q-first-preg"]:checked`)?.value===`yes`,r=document.querySelector(`input[name="q-prior-pe"]:checked`)?.value===`yes`,i=document.querySelector(`input[name="q-chronic-htn"]:checked`)?.value===`yes`,a=document.getElementById(`q-diabetes`).value||`none`,o=document.querySelector(`input[name="q-family"]:checked`)?.value===`yes`,s=parseInt(document.getElementById(`q-height`).value)||160,c=parseInt(document.getElementById(`q-weight`).value)||65,l=parseInt(document.getElementById(`q-booking-sys`).value)||null,u=parseInt(document.getElementById(`q-booking-dia`).value)||null,d=parseInt(document.getElementById(`q-current-sys`).value)||null,f=parseInt(document.getElementById(`q-current-dia`).value)||null,p=document.querySelectorAll(`input[name="q-symptoms"]:checked`),m=Array.from(p).map(function(e){return e.value}),h=document.querySelector(`input[name="q-weight-gain"]:checked`)?.value===`yes`,_=document.getElementById(`q-protein`).value||`unknown`,e.n=1,T.getProfile();case 1:if(D=e.v,D){e.n=2;break}D={};case 2:return v=D,v.age=t,v.isFirstPregnancy=n,v.priorPE=r,v.chronicHTN=i,v.diabetes=a,v.familyHistory=o,v.height=s,v.prePregnancyWeight=c,v.bookingBPSys=l,v.bookingBPDia=u,e.n=3,T.saveProfile(v);case 3:if(!(d&&f)){e.n=5;break}return e.n=4,T.getLogs(T.KEYS.BP_LOGS);case 4:return y=e.v,y.push({sys:d,dia:f,position:`sitting`,timestamp:new Date().toISOString(),date:new Date().toLocaleDateString(`en-US`,{month:`short`,day:`numeric`,year:`numeric`}),time:new Date().toLocaleTimeString(`en-US`,{hour:`2-digit`,minute:`2-digit`})}),e.n=5,T._set(T.KEYS.BP_LOGS,y);case 5:if(!(m.length>0)){e.n=7;break}return e.n=6,T.getLogs(T.KEYS.VITALS_LOGS);case 6:return b=e.v,b.push({symptoms:m,timestamp:new Date().toISOString()}),e.n=7,T._set(T.KEYS.VITALS_LOGS,b);case 7:if(_===`unknown`){e.n=10;break}return e.n=8,T.getLogs(`gg_urine_logs`);case 8:if(O=e.v,O){e.n=9;break}O=[];case 9:return x=O,x.push({protein:_,timestamp:new Date().toISOString()}),e.n=10,T._set(`gg_urine_logs`,x);case 10:if(!h){e.n=12;break}return e.n=11,T.getLogs(T.KEYS.VITALS_LOGS);case 11:return S=e.v,C=new Date,w=new Date(C.getTime()-10080*60*1e3),S.push({weight:c,timestamp:w.toISOString()}),S.push({weight:c+2.5,timestamp:C.toISOString()}),e.n=12,T._set(T.KEYS.VITALS_LOGS,S);case 12:E.showToast(`Health profile saved. Analyzing risk...`,`success`),setTimeout(function(){window.location.hash=`#/bluetooth`},1e3);case 13:return e.a(2)}},e)}))()}},window.Assessment=j,M={calcBMI:function(e,t){if(!e||!t)return 0;var n=t/100;return e/(n*n)},evaluateCurrentState:function(){var e=this;return S(g().m(function t(){var n,r,i,a,o,s,c,l,u,d,f,p,m,h,_,v,y,b,x;return g().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,T.getProfile();case 1:if(n=t.v,n){t.n=2;break}return t.a(2,{score:0,band:`Low`,color:`#436746`,action:`Complete profile`});case 2:return t.n=3,T.getLatestBP();case 3:return r=t.v,t.n=4,T.getLatestUrine();case 4:return i=t.v,t.n=5,T.getLogs(T.KEYS.VITALS_LOGS);case 5:return a=t.v,t.n=6,T.getTodaySymptoms();case 6:return o=t.v,s=0,c=[],(n.age<20||n.age>35)&&(s+=2,c.push(`Age risk`)),n.isFirstPregnancy&&(s+=2,c.push(`Nulliparity`)),n.priorPE&&(s+=4,c.push(`Prior PE history`)),n.chronicHTN&&(s+=3,c.push(`Chronic hypertension`)),n.diabetes!==`none`&&(s+=2,c.push(`Diabetes`)),n.familyHistory&&(s+=2,c.push(`Family history`)),n.multipleGestation&&(s+=2,c.push(`Multiple gestation`)),l=n.height||160,u=n.prePregnancyWeight||65,e.calcBMI(u,l)>=30&&(s+=2,c.push(`BMI ≥30`)),r&&(r.sys>=160||r.dia>=110?(s+=7,c.push(`Severe-range BP`)):r.sys>=140||r.dia>=90?(s+=5,c.push(`BP ≥140/90`)):(r.sys>=130||r.dia>=80)&&(s+=2,c.push(`Elevated BP`))),a.length>0?(d=a[0],f=d.protein,f===`+3`?(s+=6,c.push(`Proteinuria 3+`)):f===`+2`?(s+=4,c.push(`Proteinuria 2+`)):f===`+1`?(s+=2,c.push(`Proteinuria 1+`)):i&&(i.protein===`3plus`?(s+=6,c.push(`Proteinuria 3+`)):i.protein===`2plus`?(s+=4,c.push(`Proteinuria 2+`)):i.protein===`1plus`&&(s+=2,c.push(`Proteinuria 1+`))),p=d.glucose,p&&(p>=200?(s+=5,c.push(`Severe Hyperglycemia`)):p>=140?(s+=3,c.push(`Elevated Blood Glucose`)):p<60&&(s+=4,c.push(`Hypoglycemia`)))):i&&(i.protein===`3plus`?(s+=6,c.push(`Proteinuria 3+`)):i.protein===`2plus`?(s+=4,c.push(`Proteinuria 2+`)):i.protein===`1plus`&&(s+=2,c.push(`Proteinuria 1+`))),m=new Set,o.forEach(function(e){e.symptoms&&e.symptoms.forEach(function(e){return m.add(e)})}),m.has(`severe_headache`)&&(s+=2,c.push(`Severe headache`)),m.has(`vision_changes`)&&(s+=2,c.push(`Visual disturbances`)),m.has(`ruq_pain`)&&(s+=3,c.push(`RUQ/Epigastric pain`)),m.has(`swelling`)&&(s+=1,c.push(`Sudden swelling`)),a.length>=2&&(h=a[0].weight,_=a[1].weight,v=(new Date(a[0].timestamp)-new Date(a[1].timestamp))/(1e3*60*60*24),h&&_&&v>0&&(h-_)/v*7>=2&&(s+=1,c.push(`Weight gain ≥2kg/wk`))),s<=5?(y=`Low`,b=`#436746`,x=`Continue routine monitoring`):s<=12?(y=`Moderate`,b=`#80543B`,x=`Increase BP logging frequency. Mention at next doctor visit.`):s<=20?(y=`High`,b=`#BA1A1A`,x=`Contact your healthcare provider today for an assessment.`):(y=`Critical`,b=`#BA1A1A`,x=`EMERGENCY: Proceed to the nearest hospital immediately.`),e._checkAndTriggerAlerts(s,y,x),t.a(2,{score:s,band:y,color:b,factors:c,action:x})}},t)}))()},_checkAndTriggerAlerts:function(e,t,n){var r=localStorage.getItem(`gg_last_alert`),i=r?JSON.parse(r):{time:0,band:``},a=Date.now();(t!==`Low`&&t!==i.band||t!==`Low`&&a-i.time>864e5)&&((t===`Critical`||t===`High`)&&E.showToast(`ALERT: ${n}`,`error`,1e4),localStorage.setItem(`gg_last_alert`,JSON.stringify({time:a,band:t})))}},window.Scoring=M,window.Scoring=M,N={init:function(){this.setupDraggableFab(),this.setupChatUI()},setupDraggableFab:function(){var e=this,t=document.getElementById(`ai-bot-fab`),n=document.getElementById(`ai-chat-overlay`);if(!(!t||!n)){var r=!1,i=0,a=0,o=0,s=0,c=!1;t.addEventListener(`touchstart`,function(e){var n=e.touches[0];i=n.clientY,a=n.clientX;var r=window.getComputedStyle(t).transform,l=0,u=0;if(r!==`none`){var d=new DOMMatrix(r);l=d.m41,u=d.m42}s=l,o=u,c=!1,t.style.transition=`none`},{passive:!0}),t.addEventListener(`touchmove`,function(e){r=!0;var n=e.touches[0],l=n.clientY-i,u=n.clientX-a;(Math.abs(l)>15||Math.abs(u)>15)&&(c=!0);var d=o+l,f=s+u;t.style.transform=`translate(${f}px, ${d}px) scale(1.05)`},{passive:!0}),t.addEventListener(`touchend`,function(n){if(r=!1,t.style.transition=`transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)`,c){var i=window.getComputedStyle(t).transform;if(i!==`none`){var a=new DOMMatrix(i);t.style.transform=`translate(${a.m41}px, ${a.m42}px) scale(1)`}}else t.style.transform=`translate(${s}px, ${o}px) scale(1)`,e.openChat()}),t.addEventListener(`mousedown`,function(e){r=!0,c=!1,i=e.clientY,a=e.clientX;var n=window.getComputedStyle(t).transform,l=0,u=0;if(n!==`none`){var d=new DOMMatrix(n);l=d.m41,u=d.m42}s=l,o=u,t.style.transition=`none`}),window.addEventListener(`mousemove`,function(e){if(r){var n=e.clientY-i,l=e.clientX-a;(Math.abs(n)>5||Math.abs(l)>5)&&(c=!0),t.style.transform=`translate(${s+l}px, ${o+n}px) scale(1.05)`}}),window.addEventListener(`mouseup`,function(){if(r)if(r=!1,t.style.transition=`transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)`,!c)t.style.transform=`translate(${s}px, ${o}px) scale(1)`,e.openChat();else{var n=window.getComputedStyle(t).transform;if(n!==`none`){var i=new DOMMatrix(n);t.style.transform=`translate(${i.m41}px, ${i.m42}px) scale(1)`}}}),t.addEventListener(`click`,function(t){c||e.openChat()})}},setupChatUI:function(){var e=this,t=document.getElementById(`close-ai-chat`),n=document.getElementById(`ai-chat-overlay`),r=document.getElementById(`global-chat-form`);t&&t.addEventListener(`click`,function(){e.closeChat()}),n&&n.addEventListener(`click`,function(t){t.target===n&&e.closeChat()}),r&&r.addEventListener(`submit`,function(t){t.preventDefault(),e.sendMessage()});var i=document.getElementById(`global-chat-input`);i&&i.addEventListener(`keydown`,function(t){t.key===`Enter`&&!t.shiftKey&&(t.preventDefault(),e.sendMessage())})},openChat:function(){var e=document.getElementById(`ai-chat-overlay`);e&&e.classList.remove(`hidden`)},closeChat:function(){var e=document.getElementById(`ai-chat-overlay`);e&&e.classList.add(`hidden`)},sendMessage:function(){return S(g().m(function e(){var t,n,r,i,a,o,s,c,l,u;return g().w(function(e){for(;;)switch(e.p=e.n){case 0:if(t=document.getElementById(`global-chat-input`),n=t.value.trim(),n){e.n=1;break}return e.a(2);case 1:if(r=document.getElementById(`global-chat-history`),r){e.n=2;break}return e.a(2);case 2:return i=document.createElement(`div`),i.style.display=`flex`,i.style.gap=`12px`,i.style.alignItems=`flex-start`,i.style.maxWidth=`85%`,i.style.alignSelf=`flex-end`,i.style.flexDirection=`row-reverse`,i.innerHTML=`
            <div style="width: 32px; height: 32px; background: var(--clr-bg-card); color: var(--clr-primary); border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0; border: 1px solid var(--clr-divider);">
                <i data-lucide="user" style="width: 16px; height: 16px;"></i>
            </div>
            <div style="background: var(--clr-primary); padding: 16px; border-radius: 20px 4px 20px 20px; box-shadow: var(--shadow-sm);">
                <p style="font-size: 14px; color: white; line-height: 1.5;">
                    ${n.replace(/</g,`&lt;`)}
                </p>
            </div>
        `,r.appendChild(i),t.value=``,t.style.height=`48px`,window.lucide&&window.lucide.createIcons({root:i}),r.scrollTop=r.scrollHeight,a=document.createElement(`div`),a.style.display=`flex`,a.style.gap=`12px`,a.style.alignItems=`flex-start`,a.style.maxWidth=`85%`,a.id=`ai-typing-indicator`,a.innerHTML=`
            <div style="width: 32px; height: 32px; background: #E8547A; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                <i data-lucide="bot" style="width: 16px; height: 16px;"></i>
            </div>
            <div style="background: white; padding: 16px; border-radius: 4px 20px 20px 20px; box-shadow: var(--shadow-sm); border: 1px solid var(--clr-divider);">
                <p style="font-size: 14px; color: var(--clr-text-body); line-height: 1.5; font-style: italic;">
                    Typing...
                </p>
            </div>
        `,r.appendChild(a),window.lucide&&window.lucide.createIcons({root:a}),r.scrollTop=r.scrollHeight,e.p=3,e.n=4,z(n);case 4:o=e.v,s=document.getElementById(`ai-typing-indicator`),s&&s.remove(),c=document.createElement(`div`),c.style.display=`flex`,c.style.gap=`12px`,c.style.alignItems=`flex-start`,c.style.maxWidth=`85%`,c.innerHTML=`
                <div style="width: 32px; height: 32px; background: #E8547A; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                    <i data-lucide="bot" style="width: 16px; height: 16px;"></i>
                </div>
                <div style="background: white; padding: 16px; border-radius: 4px 20px 20px 20px; box-shadow: var(--shadow-sm); border: 1px solid var(--clr-divider);">
                    <p style="font-size: 14px; color: var(--clr-text-body); line-height: 1.5;">
                        ${o}
                    </p>
                </div>
            `,r.appendChild(c),window.lucide&&window.lucide.createIcons({root:c}),r.scrollTop=r.scrollHeight,e.n=6;break;case 5:e.p=5,u=e.v,console.error(`AI query failed:`,u),l=document.getElementById(`ai-typing-indicator`),l&&l.remove();case 6:return e.a(2)}},e,null,[[3,5]])}))()}},window.AIBot=N,P={init:function(){var e=this;return S(g().m(function t(){return g().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,e.renderTimeline();case 1:return t.a(2)}},t)}))()},formatTime:function(e){return new Date(e).toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`})},formatDate:function(e){return new Date(e).toLocaleDateString([],{weekday:`short`,month:`short`,day:`numeric`})},renderTimeline:function(){var e=this;return S(g().m(function t(){var n,r,i,o,s,c,l,u,d,p,m;return g().w(function(t){for(;;)switch(t.n){case 0:if(n=document.getElementById(`health-records-timeline`),r=document.getElementById(`health-records-empty`),!(!n||!r)){t.n=1;break}return t.a(2);case 1:return i=[],o=function(){var e=S(g().m(function e(t,n){var r;return g().w(function(e){for(;;)switch(e.n){case 0:return e.n=1,T.getLogs(t);case 1:if(r=e.v,r){e.n=2;break}r=[];case 2:r.forEach(function(e){i.push(f(f({},e),{},{_type:n}))});case 3:return e.a(2)}},e)}));return function(t,n){return e.apply(this,arguments)}}(),t.n=2,o(T.KEYS.BP_LOGS,`bp`);case 2:return t.n=3,o(T.KEYS.VITALS_LOGS,`vitals`);case 3:return t.n=4,o(T.KEYS.KICKS,`kicks`);case 4:return t.n=5,o(T.KEYS.CONTRACTIONS,`contractions`);case 5:return t.n=6,o(T.KEYS.SYMPTOMS,`symptoms`);case 6:if(i.length!==0){t.n=7;break}return r.style.display=`block`,t.a(2);case 7:r.style.display=`none`;case 8:for(i.sort(function(e,t){return new Date(t.timestamp).getTime()-new Date(e.timestamp).getTime()}),s={},i.forEach(function(t){var n=e.formatDate(t.timestamp);s[n]||(s[n]=[]),s[n].push(t)}),c=``,l=0,u=Object.entries(s);l<u.length;l++)d=a(u[l],2),p=d[0],m=d[1],c+=`<div style="margin-top: 8px;"><h3 style="font-size: 14px; color: var(--clr-text-muted); font-weight: 600; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">${p}</h3>`,m.forEach(function(t){var n=e.formatTime(t.timestamp),r=`activity`,i=`var(--clr-primary)`,a=`Health Log`,o=``;t._type===`bp`?(r=`heart-pulse`,a=`Blood Pressure`,o=`<span style="font-size: 18px; font-weight: 700;">${t.sys}/${t.dia}</span> <span style="font-size: 12px; color: var(--clr-text-muted);">mmHg</span>`,t.pulse&&(o+=` &middot; ${t.pulse} bpm`)):t._type===`vitals`?t.weight?(r=`scale`,i=`#E8547A`,a=`Weight`,o=`<span style="font-size: 18px; font-weight: 700;">${t.weight}</span> <span style="font-size: 12px; color: var(--clr-text-muted);">kg</span>`):t.sleep&&(r=`moon`,i=`var(--clr-purple)`,a=`Sleep`,o=`<span style="font-size: 18px; font-weight: 700;">${t.sleep}</span> <span style="font-size: 12px; color: var(--clr-text-muted);">hours</span>`):t._type===`kicks`?(r=`baby`,i=`var(--clr-purple)`,a=`Kick Session`,o=`<span style="font-size: 18px; font-weight: 700;">${t.count}</span> <span style="font-size: 12px; color: var(--clr-text-muted);">kicks in ${Math.round(t.duration/60)} min</span>`):t._type===`symptoms`?(r=`alert-circle`,i=`var(--clr-danger)`,a=`Symptom Logged`,o=`<span style="font-size: 16px; font-weight: 600; text-transform: capitalize;">${t.symptom}</span>`):t._type===`contractions`&&(r=`timer`,i=`var(--clr-info-brown)`,a=`Contraction`,o=`Duration: ${Math.round(t.duration)}s &middot; Intensity: ${t.intensity||`N/A`}`),c+=`
                    <div class="card-white" style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px; padding: 16px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: ${i}1A; color: ${i}; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                            <i data-lucide="${r}" style="width: 20px; height: 20px;"></i>
                        </div>
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <h4 style="font-weight: 600; font-size: 14px; color: var(--clr-text-heading);">${a}</h4>
                                <span style="font-size: 12px; color: var(--clr-text-muted);">${n}</span>
                            </div>
                            <div style="color: var(--clr-text-body);">${o}</div>
                            ${t.notes?`<div style="font-size: 12px; color: var(--clr-text-muted); margin-top: 4px; background: rgba(0,0,0,0.03); padding: 8px; border-radius: 8px; font-style: italic;">"${t.notes}"</div>`:``}
                        </div>
                    </div>
                `}),c+=`</div>`;n.innerHTML=``,n.appendChild(r),n.insertAdjacentHTML(`beforeend`,c),window.lucide&&window.lucide.createIcons({root:n});case 9:return t.a(2)}},t)}))()}},window.HealthRecords=P,F={init:function(){return S(g().m(function e(){var t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,_;return g().w(function(e){for(;;)switch(e.n){case 0:return console.log(`Dashboard initialized`),e.n=1,T.getProfile();case 1:if(t=e.v,!t){e.n=4;break}return document.getElementById(`dash-name`).textContent=t.name.split(` `)[0]||`User`,e.n=2,T.getCurrentGestationalWeek();case 2:return n=e.v,e.n=3,T.getCurrentTrimester();case 3:r=e.v,document.getElementById(`dash-week`).textContent=`Week ${n}`,i=`FIRST TRIMESTER`,r===2&&(i=`SECOND TRIMESTER`),r===3&&(i=`THIRD TRIMESTER`),document.getElementById(`dash-trimester-label`).textContent=i,a=40,o=Math.min(Math.round(n/a*100),100),document.getElementById(`dash-progress-bar`).style.width=`${o}%`,document.getElementById(`dash-progress-text`).textContent=`${o}%`,s=Math.max(a*7-n*7,0),document.getElementById(`dash-days-left`).textContent=`${s} days to go`,c=[`🫐`,`🍇`,`🍓`,`🍋`,`🍑`,`🥑`,`🧅`,`🌽`,`🍆`,`🥥`,`🍍`,`🍉`],l=Math.floor(Math.min(n/4,c.length-1)),document.getElementById(`dash-baby-size`).textContent=c[l];case 4:return e.n=5,T.getLatestBP();case 5:return u=e.v,u&&(document.getElementById(`dash-vital-bp`).innerHTML=`${u.sys}<br><span style="font-size: 14px; font-weight: 500; color: var(--clr-text-muted);">/${u.dia}</span>`),e.n=6,T.getLogs(T.KEYS.VITALS_LOGS);case 6:if(d=e.v,d.length>0&&(f=d[0],f.weight&&(document.getElementById(`dash-vital-weight`).innerHTML=`${f.weight}<br><span style="font-size: 14px; font-weight: 500; color: var(--clr-text-muted);">kg</span>`),f.sleep&&(document.getElementById(`dash-vital-sleep`).innerHTML=`${f.sleep}<br><span style="font-size: 14px; font-weight: 500; color: var(--clr-text-muted);">hrs</span>`)),!M){e.n=8;break}return e.n=7,M.evaluateCurrentState();case 7:p=e.v,m=document.getElementById(`dash-risk-banner`),h=document.getElementById(`dash-risk-icon`),_=document.getElementById(`dash-risk-text`),m&&h&&_&&(m.style.borderLeftColor=p.color,m.style.backgroundColor=`${p.color}1A`,h.style.color=p.color,_.style.color=p.color,_.textContent=`${p.band} (${p.score})`,p.band===`Critical`&&(h.setAttribute(`data-lucide`,`alert-triangle`),window.lucide&&window.lucide.createIcons({root:m})));case 8:return e.a(2)}},e)}))()}},window.DashboardUI=F,I={drawSparkline:function(e,n){var r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:`#6DA171`,i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:3,a=document.getElementById(e);if(!(!a||!n||n.length===0)){var o=a.getContext(`2d`),s=a.width,c=a.height,l=window.devicePixelRatio||1;if(a.dataset.scaled||(a.style.width=s+`px`,a.style.height=c+`px`,a.width=s*l,a.height=c*l,o.scale(l,l),a.dataset.scaled=`true`),o.clearRect(0,0,s,c),n.length===1){o.beginPath(),o.arc(s/2,c/2,i,0,2*Math.PI),o.fillStyle=r,o.fill();return}var u=Math.min.apply(Math,t(n)),d=Math.max.apply(Math,t(n)),f=d-u===0?1:d-u,p=i*2,m=s-p*2,h=c-p*2,g=m/(n.length-1);o.beginPath(),o.strokeStyle=r,o.lineWidth=i,o.lineCap=`round`,o.lineJoin=`round`,n.forEach(function(e,t){var n=p+t*g,r=(e-u)/f,i=c-p-r*h;t===0?o.moveTo(n,i):o.lineTo(n,i)}),o.stroke()}}},window.Charts=I,window.Charts=I,L={init:function(){var e=this;return S(g().m(function t(){var n;return g().w(function(t){for(;;)switch(t.n){case 0:return console.log(`Medical History initialized`),t.n=1,T.getProfile();case 1:return n=t.v,n&&(document.getElementById(`hist-first-preg`).checked=n.isFirstPregnancy||!1,document.getElementById(`hist-multiple`).checked=n.multipleGestation||!1,document.getElementById(`hist-prior-pe`).checked=n.priorPE||!1,document.getElementById(`hist-chronic-htn`).checked=n.chronicHTN||!1,[`hist-first-preg`,`hist-multiple`,`hist-prior-pe`,`hist-chronic-htn`].forEach(function(t){document.getElementById(t).addEventListener(`change`,e.saveProfileChanges)})),t.n=2,e.renderBPChart();case 2:return t.a(2)}},t)}))()},saveProfileChanges:function(){return S(g().m(function e(){var t,n;return g().w(function(e){for(;;)switch(e.n){case 0:return e.n=1,T.getProfile();case 1:if(n=e.v,n){e.n=2;break}n={};case 2:return t=n,t.isFirstPregnancy=document.getElementById(`hist-first-preg`).checked,t.multipleGestation=document.getElementById(`hist-multiple`).checked,t.priorPE=document.getElementById(`hist-prior-pe`).checked,t.chronicHTN=document.getElementById(`hist-chronic-htn`).checked,e.n=3,T.saveProfile(t);case 3:E.showToast(`Profile updated`,`success`),M&&F&&F.init();case 4:return e.a(2)}},e)}))()},renderBPChart:function(){return S(g().m(function e(){var t,n,r,i;return g().w(function(e){for(;;)switch(e.n){case 0:return e.n=1,T.getLogs(T.KEYS.BP_LOGS);case 1:if(t=e.v,n=document.getElementById(`hist-bp-logs`),n){e.n=2;break}return e.a(2);case 2:if(n.innerHTML=``,t.length!==0){e.n=3;break}return n.innerHTML=`<p style="text-align: center; color: var(--clr-text-muted); font-size: 14px;">No logs yet</p>`,e.a(2);case 3:t.slice(0,3).forEach(function(e){var t=document.createElement(`div`);t.style.cssText=`display: flex; justify-content: space-between; font-size: 14px;`,t.innerHTML=`
                <span style="color: var(--clr-text-muted);">${e.date||``} ${e.time||``}</span>
                <span style="font-weight: 600;">${e.sys}/${e.dia}</span>
            `,n.appendChild(t)}),r=t.slice(0,10).reverse().map(function(e){return e.sys}),I&&(i=document.getElementById(`bp-history-chart`),i&&i.dataset.scaled&&(i.dataset.scaled=``),I.drawSparkline(`bp-history-chart`,r,`#6DA171`,4));case 4:return e.a(2)}},e)}))()}},window.MedicalHistory=L,R={currentPage:null,history:[],init:function(){var e=this;return S(g().m(function t(){var n,r;return g().w(function(t){for(;;)switch(t.n){case 0:if(console.log(`App Initializing...`),N&&N.init(),T&&T.initSyncEngine(),window.addEventListener(`hashchange`,e.handleRoute.bind(e)),setTimeout(function(){var e=document.getElementById(`splash-screen`);e&&(e.classList.add(`fade-out`),setTimeout(function(){return e.remove()},500))},1e3),!(!window.location.hash||window.location.hash===`#/`)){t.n=2;break}return t.n=1,T.getProfile();case 1:r=t.v,n=r!==null,window.location.hash=n?`#/dashboard`:`#/onboarding`,t.n=3;break;case 2:e.handleRoute();case 3:return t.a(2)}},t)}))()},handleRoute:function(){var e=this;return S(g().m(function t(){var n,r,i,a,o;return g().w(function(t){for(;;)switch(t.n){case 0:return n=(window.location.hash||`#/`).replace(`#/`,``)||`onboarding`,console.log(`Routing to: ${n}`),r=[`onboarding`,`signin`,`signup`].includes(n),t.n=1,T.getProfile();case 1:if(o=t.v,a=o===null,!a){t.n=2;break}a=!r;case 2:if(!a){t.n=3;break}return window.location.hash=`#/onboarding`,t.a(2);case 3:if(i=document.getElementById(`page-${n}`),i){t.n=5;break}return t.n=4,e.loadPageTemplate(n);case 4:i=t.v;case 5:return e.transitionTo(i,n),E.updateBottomNav(n),t.n=6,e.initPage(n);case 6:return t.a(2)}},t)}))()},loadPageTemplate:function(e){return S(g().m(function t(){var n,r,a,f;return g().w(function(t){for(;;)switch(t.p=t.n){case 0:if(t.p=0,n=Object.assign({"../../pages/bluetooth.html":i,"../../pages/care-guide.html":o,"../../pages/contractions.html":s,"../../pages/dashboard.html":c,"../../pages/health-hub.html":l,"../../pages/kick-counter.html":u,"../../pages/log-bp.html":d,"../../pages/log-vitals.html":p,"../../pages/medical-history.html":m,"../../pages/onboarding.html":h,"../../pages/profile.html":_,"../../pages/reminders.html":y,"../../pages/risk-assessment.html":b,"../../pages/signin.html":x,"../../pages/signup.html":C})[`../../pages/${e}.html`],n){t.n=1;break}throw Error(`Page template not found for route: ${e}`);case 1:return r=document.createElement(`div`),r.innerHTML=n.trim(),a=r.firstElementChild,(!a||!a.classList.contains(`page`))&&(a=document.createElement(`div`),a.id=`page-${e}`,a.className=`page`,a.innerHTML=n),document.getElementById(`app-root`).appendChild(a),window.lucide&&window.lucide.createIcons({root:a}),t.a(2,a);case 2:return t.p=2,f=t.v,console.error(`Error loading page ${e}:`,f),t.a(2,null)}},t,null,[[0,2]])}))()},transitionTo:function(e,t){if(e){if(this.currentPage&&this.currentPage!==t){var n=document.getElementById(`page-${this.currentPage}`);n&&n.classList.remove(`active`),this.history.push(this.currentPage)}e.classList.add(`active`),this.currentPage=t,window.scrollTo(0,0),e.scrollTop=0}},goBack:function(){this.history.length>0?(this.history.pop(),window.history.back()):window.location.hash=`#/dashboard`},initPage:function(e){return S(g().m(function t(){var n,r;return g().w(function(t){for(;;)switch(t.n){case 0:r=e,t.n=r===`onboarding`?1:r===`signin`||r===`signup`?2:r===`bluetooth`?3:r===`contractions`?4:r===`dashboard`?6:r===`health-hub`?8:r===`kick-counter`?10:r===`log-vitals`?11:r===`log-bp`?12:r===`medical-history`?13:r===`reminders`?15:r===`risk-assessment`?16:17;break;case 1:return t.a(3,17);case 2:return D&&D.init(e),t.a(3,17);case 3:return O&&O.init(),t.a(3,17);case 4:if(!k){t.n=5;break}return t.n=5,k.initContractions();case 5:return t.a(3,17);case 6:if(!F){t.n=7;break}return t.n=7,F.init();case 7:return M&&(window.Scoring=M),t.a(3,17);case 8:if(!P){t.n=9;break}return t.n=9,P.init();case 9:return t.a(3,17);case 10:return k&&k.init(),t.a(3,17);case 11:return A&&A.initVitalsPage(),t.a(3,17);case 12:return A&&A.initBPPage(),t.a(3,17);case 13:if(!L){t.n=14;break}return t.n=14,L.init();case 14:return t.a(3,17);case 15:return t.a(3,17);case 16:return j&&j.init(),t.a(3,17);case 17:window.UI=E,window.Store=T,n=document.getElementById(`bottom-nav`),n&&([`dashboard`,`health-hub`,`care-guide`,`profile`].includes(e)?(n.classList.remove(`hidden`),document.querySelectorAll(`.nav-item`).forEach(function(t){t.getAttribute(`data-target`)===e?t.classList.add(`active`):t.classList.remove(`active`)})):n.classList.add(`hidden`));case 18:return t.a(2)}},t)}))()}},document.addEventListener(`DOMContentLoaded`,function(){R.init()}),window.App=R}}})})();