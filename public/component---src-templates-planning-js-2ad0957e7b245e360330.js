(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{"/00s":function(e,t,a){},"1lST":function(e,t,a){"use strict";a.r(t);var n=a("q1tI"),i=a.n(n),r=a("Wbzz"),s=a("xHx8"),o=a("Bl7J"),p=a("3CW5");a("/00s");t.default=function(e){var t=e.data.wordpressWpPlanning,a=e.pageContext,n=i.a.createElement(p.b,{previous:a.previous,next:a.next}),l={metaDescription:t.wpc_seo.meta.description||null,metaRobots:t.wpc_seo.meta.robots||[],classes:"wpc-post",pageTitle:t.title,path:e.path},c=void 0;if(t.wpc_gatsby&&t.wpc_gatsby.forms&&t.wpc_gatsby.forms.length){var u=t.wpc_gatsby.forms.shift();c={src:u.permalink||"",title:u.title||"",origins:[a.formOrigin],resizeLog:!1}}var m={data:t,wpc_protected:a.wpc_protected,isSingle:!0,displayContentFull:!0,headerPrefix:i.a.createElement(r.Link,{to:"/community/planning/"},"From our Planning Blog"),paginationAdj:n,isPlanning:!0,displaySubscribe:!0,appendForm:c};return i.a.createElement(o.a,l,i.a.createElement(s.a,m))}},"3CW5":function(e,t,a){"use strict";a.d(t,"a",(function(){return c})),a.d(t,"b",(function(){return l}));var n=a("q1tI"),i=a.n(n),r=a("QSOs"),s=function(){return i.a.createElement("svg",{role:"presentation",className:"wpc-icon wpc-icon--arrow--left",version:"1.1",xmlns:"http://www.w3.org/2000/svg",x:"0px",y:"0px",viewBox:"0 0 25 50"},i.a.createElement("polygon",{points:"25,50 0,26 25,0 "}))},o=function(){return i.a.createElement("svg",{role:"presentation",className:"wpc-icon wpc-icon--arrow--right",version:"1.1",xmlns:"http://www.w3.org/2000/svg",x:"0px",y:"0px",viewBox:"0 0 25 50"},i.a.createElement("polygon",{points:"0,0 25,24 0,50 "}))},p=function(e){var t=e.single,a=e.previous,n=e.next,p="wpc-pagination-adj",l=[];if(a){var c=i.a.createElement("span",{className:"wpc-pagination-adj__label"},i.a.createElement(s,null)," ",i.a.createElement("span",null,a.title||a.name));p+=" wpc-pagination-adj--prev",l.push({classes:"wpc-pagination-adj__prev",path:a.path,text:c,aria_label:"Previous "+t+": "+(a.title||a.name)})}if(n){var u=i.a.createElement("span",{className:"wpc-pagination-adj__label"},i.a.createElement("span",null,n.title||n.name)," ",i.a.createElement(o,null));p+=" wpc-pagination-adj--next",l.push({classes:"wpc-pagination-adj__next",path:n.path,text:u,aria_label:"Next "+t+": "+(n.title||n.name)})}if(l){var m={classes:p,aria_label:"Pagination",list:l};return i.a.createElement(r.a,m)}return null},l=function(e){var t=e.previous,a=e.next;return i.a.createElement(p,{single:"post",previous:t,next:a})},c=function(e){var t=e.previous,a=e.next;return i.a.createElement(p,{single:"podcast",previous:t,next:a})}}}]);
//# sourceMappingURL=component---src-templates-planning-js-2ad0957e7b245e360330.js.map