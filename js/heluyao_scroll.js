var isFromiPhone = ("false" == "false" ? 0 : 1),
isFromAndroid = ("true" == "false" ? 0 : 1),
has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' : (/firefox/i).test(navigator.userAgent) ? 'Moz' : 'opera' in window ? 'O' : '',
trnOpen = 'translate' + (has3d ? '3d(' : '('),
trnClose = has3d ? ',0)' : ')';

function $id(e,elm){
	elm = elm || document;
	return document.getElementById(e);
}
function $classes(e,elm){
	elm = elm || document;
	return elm.querySelectorAll(e);
}
function ajax(d,c){
	c||(c={});
	var a=new XMLHttpRequest;
	d+=(-1==d.indexOf('?')?'?':'&')+'_='+Date.now();
	a.open('GET',d,!0);
	a.setRequestHeader&&a.setRequestHeader('X-Requested-With','XMLHttpRequest');
	a.onreadystatechange=function(){
		4==a.readyState&&(200!=a.status?c.error&&c.error(a.status,a.responseText):c.success&&c.success(a.responseText))
	};
	c.progress&&'function'==typeof a.addEventListener&&a.addEventListener('progress',function(a){c.progress(a)},!1);
	a.send(null);
	return a;
}
Lu_scroll = function(){
	function u(options){
		var t = this;
		this.options = {
			container:'container',
			scroll_wrap:'scroll_wrap',
			s_col:'s_col',
			center_col:'center_col',
			duration:'300ms',
			dw:document.documentElement.clientWidth,
			dh:document.documentElement.clientHeight
		}
		for (var key in options){
			this.options[key] = options[key];
		}
		this.touchStart=function(e,timeStamp){
			if (timeStamp instanceof Date) {
				timeStamp = timeStamp.valueOf();
			}
			if (typeof timeStamp !== "number") {
				throw new Error("Invalid timestamp value: " + timeStamp);
			}
			t.__lastTouch = timeStamp;
			t._currX = e[0].screenX;
			t._currY = e[0].screenY;
			t._isMoving = !1;
			t._mousedown = !0;
		}
		this.touchMove=function(e){
			if(!this._mousedown)return;
			this.DeltaX = e[0].screenX - this._currX;
			this.DeltaY = e[0].screenY - this._currY;
			if (!this._isMoving) this._doScrollX = Math.abs(this.DeltaX) > Math.abs(this.DeltaY),
				this._isMoving = !0,
				this._doScrollX && event.preventDefault();
			else if (this._doScrollX) {
				var n = 0;
				n = parseInt(this.DeltaX),
				this.cssTranslation(n, "0s", !0),
				event.preventDefault();
				if(!this.if_loadding){
					this.if_loadding = !0;
					if(n>0){
						this.is_next = !1;
						this.loadSlot>0?(this.loadSlot = this.loadSlot-1):(this.loadSlot = this.slideNum-1);
					}else{//next
						this.is_next = !0;
						this.loadSlot<(this.slideNum-1)?(this.loadSlot = this.loadSlot+1):(this.loadSlot = 0);
					}
					this.loadIndex = this.loadSlot % 3;
					$id('inner'+this.loadIndex).innerHTML = '';
					$id('inner'+this.loadIndex).style.height = this.options.dh + 'px';
					$id('inner'+this.loadIndex).appendChild(this.loadding);
				}
			}
		}
		this.touchEnd=function(timeStamp){
			
			var okTime = (timeStamp - this.__lastTouch) >= 200 ? !1:!0;
			var e = this.DeltaX;
			this._isMoving && this._doScrollX && ((e >= 10 && okTime) || e>=this.options.dw/2 ? t.prevPage() : (e < -10 && okTime) || Math.abs(e)>=this.options.dw/2 ? t.nextPage() : t.slideAction(1, "100ms",!0));
			this._mousedown = !1;
			this.if_loadding = !1;
		}
		this.init = function(){
			t.container = $id(t.options.container);
			t.scroll_wrapper = $id(t.options.scroll_wrap,t.container);
			t.col = $classes('.s_col',t.scroll_wrapper);
			t.csi=0;
			t.DeltaX = 0;
			t.DeltaY = 0;
			t._currentX = 0;
			t.pageSlot = 1;
			t.viewIndex = 1;
			t.loadSlot = 1;
			t.loadIndex = 1;
			t.if_loadding = !1;
			t.is_next = !1;
			t.loadding=document.createElement('li');
			t.loadding.className = "loadding";
			t.loadding.style.width = t.options.dw+'px';
			t.loadding.style.height = t.options.dh+'px';
			$id('inner1').appendChild(t.loadding);
			t.__lastTouch = 0;
			t.number={
				'0':[0,this.options.dw,-this.options.dw],
				'1':[-this.options.dw,0,this.options.dw],
				'2':[this.options.dw,-this.options.dw,0]
			}
			t.slideNum = 6;
			t.loadArr = [];
			t.loadDataArr = [];
			for (var i = 0; i < t.slideNum; i++) i == 1 ? this.loadArr.push(!0) : this.loadArr.push(!1);
			t.getData(1);
			if("ontouchstart" in window){
				this.container.addEventListener("touchstart",function(e){t.touchStart(event.touches,e.timeStamp)},!1),
				this.container.addEventListener("touchmove",function(e){t.touchMove(event.touches)},!1),
				this.container.addEventListener("touchend",function(e){t.touchEnd(e.timeStamp)},!1);
			}else{
				this.container.addEventListener("mousedown",function(e){t.touchStart([{screenX:e.screenX,screenY:e.screenY}],e.timeStamp)},!1),
				this.container.addEventListener("mousemove",function(e){t.touchMove([{screenX:e.screenX,screenY:e.screenY}])},!1),
				this.container.addEventListener("mouseup",function(e){t.touchEnd(e.timeStamp)},!1);
			}
		}
		this.init();
	}
	u.prototype = {
		getData:function(page){
			var t = this;
			ajax('php/data.php?p='+page,{
				error:function(){window.setTimeout(function(){console.info('error');},1E3)},
				success:function(a){
					t.render(a);
					t.loadDataArr[page] = a;
					t.loadArr[page] = !0;
				}
			});
		},
		render:function(a){
			var t = this;
			var obj = {};
			var json = JSON.parse(a);
			var datas = json['articles'];
			var len = datas.length,txt='',i=0;
			var TPL = $id('tpl-list').innerHTML.replace(/[\n\t\r]/g, '');
			for( ;i<len;i++){
				obj.id = datas[i].id;
				obj.title = datas[i].title;
				obj.snip = datas[i].snip;
				obj.date = datas[i].date;
				txt+=Mustache.to_html(TPL, obj);
			}
			setTimeout(function(){$id('inner'+t.viewIndex).removeChild(t.loadding);$id('inner'+t.viewIndex).innerHTML += txt;$id('inner'+t.viewIndex).style.height = 'auto';},10);
		},
		prevPage:function(){
			(this.pageSlot -1) <0?(this.pageSlot = this.slideNum-1):(this.pageSlot -= 1);
			this.viewIndex = this.pageSlot % 3;
			this.slideAction(0, this.options.duration);
			if(!this.loadArr[this.pageSlot]){
				this.getData(this.pageSlot);
			}else{
				this.render(this.loadDataArr[this.pageSlot]);
			}
		},
		nextPage:function(){
			(this.pageSlot +1) > (this.slideNum - 1)?(this.pageSlot = 0):(this.pageSlot += 1);
			this.viewIndex = this.pageSlot % 3;
			
			this.slideAction(2,this.options.duration);
			
			
			if(!this.loadArr[this.pageSlot]){
				this.getData(this.pageSlot);
			}else{
				this.render(this.loadDataArr[this.pageSlot]);
			}
			
		},
		slideAction:function(e, t, b){
			if(b){
				if(!this.is_next){
					
					this.loadSlot<(this.slideNum-1)?(this.loadSlot = this.loadSlot+1):(this.loadSlot = 0);
				}else{
					this.loadSlot>0?(this.loadSlot = this.loadSlot-1):(this.loadSlot = this.slideNum-1);
				}
			}
			var n = -(e-1) * this.options.dw;
			this.cssTranslation(n, t, b);
		},
		cssTranslation:function(e, t, b) {
			var w = this.scroll_wrapper;
			var c = this.col,len = c.length,i=0,that=this;
			if(!b){
				for( ;i<len;i++){
					c[i].classList.remove(that.options.center_col);
				}
				c[that.viewIndex].classList.add(that.options.center_col);
				
				setTimeout(function(){that.lastworker(w,c);},400);
			}
			w.style[vendor + 'Transform'] = trnOpen + parseInt(e) + 'px,' + '0' + trnClose + ' scale(1)';
			w.style[vendor + 'Transition'] = '-'+vendor+'-transform '+t+' ease-out';
		},
		lastworker:function(w,c){
			this.cssTranslation('0','0s',!0);
			c[0].style[vendor + 'Transform'] = trnOpen + this.number[this.viewIndex][0] + 'px,' + '0' + trnClose + ' scale(1)';
			c[1].style[vendor + 'Transform'] = trnOpen + this.number[this.viewIndex][1] + 'px,' + '0' + trnClose + ' scale(1)';
			c[2].style[vendor + 'Transform'] = trnOpen + this.number[this.viewIndex][2] + 'px,' + '0' + trnClose + ' scale(1)';
		}
	}
	return function(o){
		return new u(o);
	}
}();