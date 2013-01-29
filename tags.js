/*
	Copywrite Square Bracket LLC - Sean Clark 2012-3012
	http://square-bracket.com 	
	http://connect.ai	
	http://youtube.com/optikalefxx
*/
(function($) {
	$.fn.tags = function(opts) {
		var selector = this.selector;	
		//console.log("selector",selector);	
		// updates the original input					
		function update($original) {
			var all = [];
			var list = $original.closest(".tags-wrapper").find("li.tag span").each(function() {
				all.push($(this).text());
			});
			all = all.join(",");
			$original.val(all);
		}
	
		return this.each(function() {
			var self = this,
				$self = $(this),
				$wrapper = $("<div class='tags-wrapper'><ul></ul></div");
				tags = $self.val(),
				tagsArray = tags.split(","),
				$ul = $wrapper.find("ul");
			
			
			
			// make sure have opts
			if(!opts) opts = {};
			opts.maxSize = 50;
			
			// add tags to start
			tagsArray.forEach(function(tag) {
				if(tag) {
					$ul.append("<li class='tag'><span>"+tag+"</span><a href='#'>x</a></li>");
				}
			});
			
			
			// get classes on this element
			if(opts.classList) $wrapper.addClass(opts.classList);
			
			// add input
			$ul.append("<li class='tags-input'><input type='text' class='tags-secret'/></li>");
			// set to dom
			$self.after($wrapper);
			// add the old element
			$wrapper.append($self);
			
			// size the text
			var $input = $ul.find("input"),
				size = parseInt($input.css("font-size"))-4;
			
			// delete a tag
			$wrapper.on("click","li.tag a",function(e) {
				e.preventDefault();
				$(this).closest("li").remove();
				$self.trigger("tagRemove",$(this).closest("li").find("span").text());
				update($self);
			});
			
			// backspace needs to check before keyup
			$wrapper.on("keydown","li input",function(e) {
				// backspace
				if(e.keyCode == 8 && !$input.val()) {
					var $li = $ul.find("li.tag:last").remove();
					update($self);
					$self.trigger("tagRemove",$li.find("span").text());
				}
				// prevent for tab
				if(e.keyCode == 9) {
					e.preventDefault();
				}
				
			});
			
			// as we type
			$wrapper.on("keyup","li input",function(e) {
				e.preventDefault();
				$ul = $wrapper.find("ul");
				var $next = $input.next(),
					usingAutoFill = $next.hasClass("autofill-bg"),
					$inputLi = $ul.find("li.tags-input");
					
				// regular size adjust
				$input.width($input.val().length * (size) );
				
				// if combined with autofill, check the bg for size
				if(usingAutoFill) {
					$next.width($next.val().length * (size) );
					$input.width($next.val().length * (size) );
					// make sure autofill doesn't get too big
					if($next.width() < opts.maxSize) $next.width(opts.maxSize);
					var list = $next.data().data;
				}
				
				// make sure we don't get too high
				if($input.width() < opts.maxSize) $input.width(opts.maxSize);
				
				// tab, comma, enter
				if(!!~[9,188,13].indexOf(e.keyCode)) {
					var val = $input.val().replace(",","");
					var otherCheck = true;
					
					// requring a tag to be in autofill
					if(opts.requireData && usingAutoFill) {
						if(!~list.indexOf(val)) {
							otherCheck = false;
							$input.val("");
						}
					}
					
					// unique
					if(opts.unique) {
						// found a match already there
						if(!!~$self.val().split(",").indexOf(val)) {
							otherCheck = false;
							$input.val("");
							$next.val("");
						}
					}
					
					// max tags
					if(opts.maxTags) {
						if($self.val().split(",").length == opts.maxTags) {
							otherCheck = false;
							$input.val("");
							$next.val("");
						}
					}
					
					// if we have a value, and other checks pass, add the tag
					if(val && otherCheck) {
						// place the new tag
						$inputLi.before("<li class='tag'><span>"+val+"</span><a href='#'>x</a></li>");
						// clear the values
						$input.val("");
						if(usingAutoFill) $next.val("");
						update($self);
						$self.trigger("tagAdd",val);
					}
				}
	
			});	
			
		});
	}
})(jQuery);