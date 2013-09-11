(function($){
	$.fn.lock = function(options){
		var doc = document;
		var op = $.extend(this,{
			pattern : 'a', // a(alphabet) , r(rundom) , n(numeric)
			match : 3, // matching
			limitCount : 4,
			cols : 6,
			rows : 6,
			tdWidth : 30,
			tdHeight: 30,
			comment : 'Please press table',
			lock : "",
			unlock : "",
			limit	: ""
		},options);
					
		Array.prototype.shuffle = function() {var i = this.length;while(i){var j = Math.floor(Math.random()*i);var t = this[--i];this[i] = this[j];this[j] = t;}return this;}	
		var an = [];
		var al = 'abcdefghijklmnopqrstuvwxhzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		
		function createAry(e){
			var s = new Array();
			for(var i = 0; i < e.length;i++){
				s.push(e.substring(i,i+1));		
			}
			return s;
		}
		
		function createNumericAry(e){
			var s = new Array();
			for(var i = 0; i < e; i++ ){
				s.push(i);				
			}
			return s;
		}
		
		function createRandomArray(){
			if(op.pattern == 'a'){
				if(op.rows * op.cols > 51){
					op.rows = 7;
					op.cols = 7;					
				}
				return  createAry(al).shuffle().slice(0,op.cols * op.rows);
			}else if(op.pattern == 'n'){
				return  createNumericAry(op.cols * op.rows).shuffle();
			}else if(op.pattern == 'r'){
				return createAry(al).concat(createNumericAry(op.cols * op.rows * 5)).shuffle().slice(0,op.cols * op.rows);
			}					
		}
		
		function createAnswer(ary){
			var c = {
				index : 0,
				limit : op.limitCount + op.match,
				array : '',
				match : op.match,
				answer : {}
			};
			var ar = [];
			for(var i = 0; i < op.match; i++){
				var ti = Math.floor(Math.random() * ary.length);
				var d = ary.splice(ti,1)[0];
				c.answer[d] = false;
				ar.push(d);
			}
			c.array = ar;
			return c;
		}
		
		
		
		function createTable(t){				
			var count = 0;
			var e = doc.createElement('table');
			e.setAttribute('class','lock_table');
			e.setAttribute("style","width:" + (op.cols * op.tdWidth) + 'px;table-layout:fixed');
			for(var i = 0; i < op.rows; i++){
				var r = e.insertRow(i);
				for(var h = 0; h < op.cols; h++){
					var c = r.insertCell(h);
					c.innerHTML = t[count];
					c.setAttribute('class','lock_class');
					c.setAttribute("style","height:" + op.tdHeight + 'px');
					count++;		
				}
			}
			return e;
		}
		function createAnswerTable(t){
			var e = doc.createElement('table');
			e.setAttribute('class','answer_table');		
			for(var i = 0; i < 3; i++){
				var r = e.insertRow(i);
				if(i == 0){
					if(op.comment){
						var c = r.insertCell(0);
						c.setAttribute('colspan',op.match);
						c.setAttribute('class','answer_top')
						c.innerHTML = op.comment;
					}else{
						r.setAttribute("style","height:0px");
					}
				}else if(i == 1){
					for(var h = 0; h < op.match; h++){
						var c = r.insertCell(h);
						c.innerHTML = t.array[h];
						c.setAttribute('class','answer_class');
					}
				}else if( i == 2){
					var c = r.insertCell(0);
					c.setAttribute('colspan',op.match);
					c.setAttribute('class','answer_word');
					c.innerHTML = "LOCK";
				}
			}
			return e;
			
		}
		return this.each(function(e){
			if($.isFunction(op.lock))op.lock();
			var t = createRandomArray();
			var parent = $(this);
			var lock = $(this).append(createTable(t)).find('.lock_class');
			var r = createAnswer(t);
			var answer = $(this).append(createAnswerTable(r));			
			lock.bind("click",function(){
				var w = isNaN(Number($(this).text())) == true ? $(this).text() : Number($(this).text());
				var o = r.array.indexOf(w);
				if(o >= 0){
					r.answer[w] = true;
				}
				var cou = 0;
				for(var key in r.answer){
					if(r.answer[key]){cou++}
				}
				if(cou == r.match){
					//unlock処理
					answer.find('.answer_word').text('UNLOCK');
					if($.isFunction(op.unlock))op.unlock();
					return;					
				}
				r.index++;
				if(r.index >= r.limit){
					if($.isFunction(op.limit))op.limit();					
				}
			});	
		});
	};
})(jQuery);
