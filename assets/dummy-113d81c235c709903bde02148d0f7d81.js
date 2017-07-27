"use strict"
define("dummy/app",["exports","ember-application","dummy/resolver","ember-load-initializers","dummy/config/environment"],function(e,t,n,i,a){Object.defineProperty(e,"__esModule",{value:!0})
var s=t.default.extend({modulePrefix:a.default.modulePrefix,podModulePrefix:a.default.podModulePrefix,Resolver:n.default});(0,i.default)(s,a.default.modulePrefix),e.default=s}),define("dummy/components/event-display",["exports","ember-component","ember-service/inject","ember-array/utils"],function(e,t,n,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default.extend({classNames:["eventDisplay"],userActivity:(0,n.default)(),eventName:"userActive",events:null,init:function(){this._super.apply(this,arguments),this.set("events",(0,i.A)())},didInsertElement:function(){this.get("userActivity").on(this.get("eventName"),this,this.registerActivity)},willDestroyElement:function(){var e=this.get("userActivity"),t=this.get("eventName")
e.off(t,this,this.registerActivity),e.disableEvent(t)},registerActivity:function(e){this.get("events").unshiftObject(e.type)},actions:{close:function(){this.get("close")(this.get("eventName"))}}})}),define("dummy/components/idle-display",["exports","ember-component","ember-computed","ember-service/inject"],function(e,t,n,i){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default.extend({classNames:["idleDisplay"],userIdle:(0,i.default)(),isIdle:n.default.readOnly("userIdle.isIdle"),status:(0,n.default)("isIdle",function(){return this.get("isIdle")?"idle":"not idle"})})}),define("dummy/controllers/index",["exports","ember-controller","ember-array/utils"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default.extend({eventNames:null,init:function(){this._super.apply(this,arguments),this.set("eventNames",(0,n.A)(["userActive","scroll","mousedown","keydown","touchstart"]))},actions:{addEvent:function(e,t){13!==t.which||this.get("eventNames").includes(e)||this.get("eventNames").pushObject(e)},removeEvent:function(e){this.get("eventNames").removeObject(e)}}})}),define("dummy/helpers/app-version",["exports","ember","dummy/config/environment","ember-cli-app-version/utils/regexp"],function(e,t,n,i){function a(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}
return t.hideSha?s.match(i.versionRegExp)[0]:t.hideVersion?s.match(i.shaRegExp)[0]:s}Object.defineProperty(e,"__esModule",{value:!0}),e.appVersion=a
var s=n.default.APP.version
e.default=t.default.Helper.helper(a)}),define("dummy/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","dummy/config/environment"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0})
var i=n.default.APP,a=i.name,s=i.version
e.default={name:"App Version",initialize:(0,t.default)(a,s)}}),define("dummy/initializers/container-debug-adapter",["exports","ember-resolver/resolvers/classic/container-debug-adapter"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0]
e.register("container-debug-adapter:main",t.default),e.inject("container-debug-adapter:main","namespace","application:main")}}}),define("dummy/initializers/export-application-global",["exports","ember","dummy/config/environment"],function(e,t,n){function i(){var e=arguments[1]||arguments[0]
if(n.default.exportApplicationGlobal!==!1){var i
if("undefined"!=typeof window)i=window
else if("undefined"!=typeof global)i=global
else{if("undefined"==typeof self)return
i=self}var a,s=n.default.exportApplicationGlobal
a="string"==typeof s?s:t.default.String.classify(n.default.modulePrefix),i[a]||(i[a]=e,e.reopen({willDestroy:function(){this._super.apply(this,arguments),delete i[a]}}))}}Object.defineProperty(e,"__esModule",{value:!0}),e.initialize=i,e.default={name:"export-application-global",initialize:i}}),define("dummy/resolver",["exports","ember-resolver"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("dummy/router",["exports","ember-router","dummy/config/environment"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0})
var i=t.default.extend({location:n.default.locationType})
i.map(function(){}),e.default=i}),define("dummy/services/scroll-activity",["exports","ember-user-activity/services/scroll-activity"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("dummy/services/user-activity",["exports","ember-user-activity/services/user-activity"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("dummy/services/user-idle",["exports","ember-user-activity/services/user-idle"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default.extend({IDLE_TIMEOUT:1e4})}),define("dummy/templates/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"t4YUPSnn",block:'{"statements":[[1,[26,["outlet"]],false],[0,"\\n"]],"locals":[],"named":[],"yields":[],"hasPartials":false}',meta:{moduleName:"dummy/templates/application.hbs"}})}),define("dummy/templates/components/event-display",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"gW5bBLkQ",block:'{"statements":[[11,"h3",[]],[15,"class","eventName"],[13],[1,[26,["eventName"]],false],[14],[0,"\\n"],[11,"span",[]],[15,"class","close"],[5,["action"],[[28,[null]],"close"]],[13],[0,"x"],[14],[0,"\\n"],[11,"p",[]],[13],[0,"Events Fired: "],[1,[28,["events","length"]],false],[14],[0,"\\n"],[11,"div",[]],[15,"class","eventList"],[13],[0,"\\n"],[6,["each"],[[28,["events"]]],null,{"statements":[[0,"    "],[11,"div",[]],[13],[0,"\\n      "],[1,[28,["event"]],false],[0,"\\n    "],[14],[0,"\\n"]],"locals":["event"]},null],[14]],"locals":[],"named":[],"yields":[],"hasPartials":false}',meta:{moduleName:"dummy/templates/components/event-display.hbs"}})}),define("dummy/templates/components/idle-display",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"S/Xevi9A",block:'{"statements":[[11,"p",[]],[13],[0,"Do nothing for 10 seconds to see your idle status change."],[14],[0,"\\n"],[11,"p",[]],[13],[0,"User is "],[11,"span",[]],[15,"class","idleStatus"],[13],[1,[26,["status"]],false],[14],[0,"."],[14]],"locals":[],"named":[],"yields":[],"hasPartials":false}',meta:{moduleName:"dummy/templates/components/idle-display.hbs"}})}),define("dummy/templates/index",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"NuoDQzLl",block:'{"statements":[[11,"h1",[]],[15,"class","title"],[13],[11,"a",[]],[15,"href","https://github.com/elwayman02/ember-user-activity"],[15,"target","_blank"],[13],[0,"Ember User Activity Demo"],[14],[14],[0,"\\n\\n"],[11,"span",[]],[15,"class","badges"],[13],[0,"\\n  "],[11,"span",[]],[15,"class","badgeInner"],[13],[0,"\\n    "],[11,"a",[]],[15,"href","https://travis-ci.org/elwayman02/ember-user-activity"],[15,"target","_blank"],[13],[0,"\\n      "],[11,"img",[]],[15,"src","https://travis-ci.org/elwayman02/ember-user-activity.svg?branch=master"],[13],[14],[0,"\\n    "],[14],[0,"\\n    "],[11,"a",[]],[15,"href","https://emberobserver.com/addons/ember-user-activity"],[15,"target","_blank"],[13],[0,"\\n      "],[11,"img",[]],[15,"src","https://emberobserver.com/badges/ember-user-activity.svg"],[13],[14],[0,"\\n    "],[14],[0,"\\n    "],[11,"a",[]],[15,"href","https://codeclimate.com/github/elwayman02/ember-user-activity"],[15,"target","_blank"],[13],[0,"\\n      "],[11,"img",[]],[15,"src","https://codeclimate.com/github/elwayman02/ember-user-activity/badges/gpa.svg"],[13],[14],[0,"\\n    "],[14],[0,"\\n  "],[14],[0,"\\n"],[14],[0,"\\n\\n"],[11,"p",[]],[13],[0,"This demo is running EUA "],[1,[26,["app-version"]],false],[14],[0,"\\n\\n"],[11,"p",[]],[13],[0,"Scroll, click, or press keys to see events fire!"],[14],[0,"\\n\\n"],[11,"p",[]],[13],[0,"\\n  Add "],[11,"a",[]],[15,"href","https://developer.mozilla.org/en-US/docs/Web/Events"],[15,"target","_blank"],[13],[0,"another event"],[14],[0,":\\n  "],[11,"input",[]],[16,"value",[26,["newEvent"]],null],[16,"oninput",[33,["action"],[[28,[null]],[33,["mut"],[[28,["newEvent"]]],null]],[["value"],["target.value"]]],null],[16,"onkeydown",[33,["action"],[[28,[null]],"addEvent",[28,["newEvent"]]],null],null],[13],[14],[0,"\\n"],[14],[0,"\\n\\n"],[1,[26,["idle-display"]],false],[0,"\\n\\n"],[11,"div",[]],[15,"class","flexContainer"],[13],[0,"\\n"],[6,["each"],[[28,["eventNames"]]],null,{"statements":[[0,"    "],[1,[33,["event-display"],null,[["eventName","close"],[[28,["event"]],[33,["action"],[[28,[null]],"removeEvent"],null]]]],false],[0,"\\n"]],"locals":["event"]},null],[14]],"locals":[],"named":[],"yields":[],"hasPartials":false}',meta:{moduleName:"dummy/templates/index.hbs"}})}),define("dummy/config/environment",["ember"],function(e){var t="dummy"
try{var n=t+"/config/environment",i=document.querySelector('meta[name="'+n+'"]').getAttribute("content"),a=JSON.parse(unescape(i)),s={default:a}
return Object.defineProperty(s,"__esModule",{value:!0}),s}catch(e){throw new Error('Could not read config from meta tag with name "'+n+'".')}}),runningTests||require("dummy/app").default.create({name:"ember-user-activity",version:"0.9.0"})
