/**
 * Remove newlines and tabs
 */
String.prototype.smoosh = function() {
	return this.replace(/(\r\n+|\n+|\r+|\t+)/gm,'');
}

/**
 * Splice in a string at a specified index
 *
 * @param { string } _string
 * @param { int } _index The position in the string
 */
String.prototype.splice = function( _string, _index ) {
    return ( this.slice( 0, Math.abs( _index ) ) + _string + this.slice( Math.abs( _index )));
};

/**
 * Strip html tags
 */
String.prototype.stripTags = function() {
	return this.replace(/<\/?[^>]+(>|$)/g, '' );
}

/**
 * Remove extra spaces
 */
String.prototype.oneSpace = function() {
	return this.replace(/\s{2,}/g, ' ');
}

/**
 * Alpha-numeric and spaces only
 */
String.prototype.alphaSpaceOnly = function() {
	return this.replace(/[^\w\s]/gi, '');
}

/**
 * Alpha-numeric characters only
 */
String.prototype.alphaOnly = function() {
	return this.replace(/[^\w]/gi, '');
}

/**
 * Capitalize the first letter of a string
 */
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

/**
 * Repeat a string n times
 *
 * @param {string} _n How many times you want to repeat a string
 */
String.prototype.repeat = function( _n ) {
	return new Array( _n + 1 ).join( this );
}

/**
 * Count the occurences of a string in a larger string
 *
 * @parm {string} _sub : The search string
 * @param {boolean} _overlap : Optional. Default: false
 * @return {int} : The count
 */
String.prototype.occurs = function( _search, _overlap ) {
	var string = this;
	//------------------------------------------------------------
	//  If _search is null just return a char count
	//------------------------------------------------------------
	if ( _search == undefined ) {
		return string.length;
	}
	//------------------------------------------------------------
	//  Make sure _search is a string
	//------------------------------------------------------------
	_search+="";
	//------------------------------------------------------------
	//  If no search term is past just return a character count
	//------------------------------------------------------------
	if ( _search.length <= 0 ) {
		return string.length;
	}
	//------------------------------------------------------------
	//  Otherwise start counting.
	//------------------------------------------------------------
	var n=0;
	var pos=0;
	var step = ( _overlap ) ? 1 : _search.length;
	while ( true ) {
		pos = string.indexOf( _search, pos );
		if ( pos >= 0 ) {
			n++;
			pos += step;
		}
		else {
			break;
		}
	}
	return n;
}

/**
 * Find the positions of occurences of a substring
 *
 * @parm {string} _sub : The search string
 * @param {boolean} _overlap : Optional. Default--false.
 * @param {boolean} _ignoreXML : Optional. Check to see if string is inside XML/HTML element.
 * @param {boolean} _onlyWords : Optional. Make sure string is a discrete word.
 * @return {Array} : An array of integers.
 */
String.prototype.positions = function( _search, _overlap, _ignoreXML, _onlyWords ) {
//	console.log( '----------' );
//	console.log( _search );
	var string = this;
	//------------------------------------------------------------
	//  Make sure _search is a string
	//------------------------------------------------------------
	_search+="";
	//------------------------------------------------------------
	//  Otherwise start counting.
	//------------------------------------------------------------
	var pos=0;
	//------------------------------------------------------------
	//  String overlapping allowed?
	//------------------------------------------------------------
	var step = ( _overlap ) ? 1 : _search.length;
	var p = [];
	while ( true ) {
		var ok = true;
		pos = string.indexOf( _search, pos );
		if ( pos >= 0 ) {
			//------------------------------------------------------------
			//  Ignore if search string was found within an XML/HTML tag
			//------------------------------------------------------------
			if ( _ignoreXML == true ) {
				for ( var i=pos; i<string.length; i++ ) {
					if ( string[i] == '<' ) {
						break;
					}
					if ( string[i] == '>' ) {
						ok = false;
					}
				}
			}
			//------------------------------------------------------------
			//  Check to see if search string is an isolated word
			//------------------------------------------------------------
			if ( _onlyWords == true ) {
//				console.log( string.substr((pos-1),(pos+_search.length+1)) );
//				console.log( string.substr((pos-1),(pos+_search.length+1)).isAlphaNum() );
				if ( string.substr((pos-1),(pos+_search.length+1)).isAlphaNum() == true ) {
					ok = false;
				}
			}
			//------------------------------------------------------------
			//  If everything is good
			//------------------------------------------------------------
			if ( ok == true ) {
				p.push( pos );
			}
			pos += step;
		}
		else {
			break;
		}
	}
	return p;
}

/*
 * Insert a substring at a particular index
 *
 * @return { string } The modified string
 */
String.prototype.insertAt = function( _index, _string ) {
	return this.substr( 0, _index) + _string + this.substr( _index );
}

/*
 * Turn a string with HTTP GET style parameters to an object
 *
 * @return { obj } A collection of keys and values
 */
String.prototype.params = function() {
	var arr = this.split('?');
	var get = arr[1];
	arr = get.split('&');
	var out = {};
	for ( var i=0, ii=arr.length; i<ii; i++ ) {
		if ( arr[i] != undefined ) {
			var pair = arr[i].split('=');
			out[ pair[0] ] = pair[1];
		}
	}
	return out;
}

/*
 * Check for the existence of an upper-case letter
 *
 * @return { boolean }
 */
String.prototype.hasUpper = function() {
	return /[A-Z]/.test( this );
}

/*
 * Create a word frequency report object
 *
 * @return { obj } Report object
 */
String.prototype.report = function() {
	var words = this.toLowerCase().split(' ');
	var stats = {};
	for ( var i=0, ii=words.length; i<ii; i++ ) {
		var word = words[i];
		if ( ! ( word in stats ) ) {
			stats[word] = 1;
		}
		else {
			stats[word] += 1;
		}
	}
	return stats;
}

/*
 * Divide text into an array of lines by splitting on linebreaks
 *
 * @return { array } An array of lines
 */
String.prototype.lines = function() {
	return this.split("\n");
}

/*
 * Check to see if string is composed of only alphanumeric characters
 *
 * @return { boolean }
 */
String.prototype.isAlphaNum = function() {
	if ( /[^a-zA-Z0-9]/.test( this ) ) {
		return false;
	}
	return true;
}

/*
 * Divide text into an array of individual sentences
 * This is English-centric.  Forgive me.
 *
 * @return { array } An array of sentences
 */
String.prototype.sentences = function() {
	var check = this.match( /[^\.!\?]+[\.!\?]+/g );
	
	//------------------------------------------------------------
	//  Make sure characters aren't used for purposes other than
	//  sentences.
	//------------------------------------------------------------
	var vowels = [ 'a','e','i','o','u','y' ];
	var out = [];
	var carry = '';
	for ( var i=0; i<check.length; i++ ) {
		//------------------------------------------------------------
		//  Clean up.
		//------------------------------------------------------------
		var strCheck = carry + check[i];
		carry = '';
		//------------------------------------------------------------
		//  Check for the existence of a vowel, so we aren't
		//  accidentally thinking part of an abbreviation is its
		//  own sentence.
		//------------------------------------------------------------
		var merge = true;
		for ( var j=0; j<vowels.length; j++ ) {
			if ( strCheck.indexOf( vowels[j] ) != -1 ) {
				merge = false;
				break;
			}
		}
		//------------------------------------------------------------
		//  Also check for a capital letter on the first word.  
		//  Most sentences have those too.
		//------------------------------------------------------------
		var capTest = strCheck.trim();
		if ( ! capTest[0].hasUpper() ) {
			merge = true;
		}
		//------------------------------------------------------------
		//  If no vowel exists in the sentence you're probably
		//  dealing with an abbreviation.  Merge with last sentence.  
		//------------------------------------------------------------
		if ( merge ) {
			if ( out.length > 0 ) {
				out[ out.length-1 ] += strCheck;
			}
			else {
				carry = strCheck;
			}
			continue;
		}
		
		//------------------------------------------------------------
		//  Prepare output.
		//------------------------------------------------------------
		out.push( strCheck.smoosh().trim() );
	}
	return out;
}
;(function(jQuery) {
	
	/**
	 * Holds default config, adds user defined config, and initializes the plugin
	 *
	 * @param { obj } _elem The DOM element where the plugin will be drawn
	 * @param { obj } _config Key value pairs to hold the plugin's configuration
	 * @param { string } _id The id of the DOM element
	 */
	function toggle_switch( _elem, _config, _selector ) {
		var self = this;
		self.elem = _elem;
		self.selector = _selector;
		self.init( _elem, _config );
	}
	
	/**
	 * Holds default config, adds user defined config, and initializes the plugin
	 *
	 * @param { obj } _elem The DOM element where the plugin will be drawn
	 * @param { obj } _config Key value pairs to hold the plugin's configuration
	 */
	toggle_switch.prototype.init = function( _elem, _config ) {
		var self = this;
		//------------------------------------------------------------
		//	User config 
		//------------------------------------------------------------
		self.config = jQuery.extend({
			animation_s: 0.3
		}, _config );
		//------------------------------------------------------------
		//	Events
		//------------------------------------------------------------
		self.events = {
			switch: 'toggle_switch-SWITCH'
		}
		//------------------------------------------------------------
		//	Get the name
		//------------------------------------------------------------
		self.name = jQuery( self.elem ).attr( 'name' );
		//------------------------------------------------------------
		//	Create a tag id
		//------------------------------------------------------------
		self.tagId = self.name.alphaOnly().toLowerCase();
		//------------------------------------------------------------
		//	Build the thing
		//------------------------------------------------------------
		self.build();
	}
	
	/**
	 * Build the toggle switch
	 */
	toggle_switch.prototype.build = function() {
		var self = this;
		jQuery( self.elem ).append('\
			<label>'+self.name+'</label>\
			<div class="toggle_switch">\
				<input type="checkbox" name="toggle_switch" class="toggle_switch-checkbox" id="'+self.tagId+'" checked>\
				<label class="toggle_switch-label" for="'+self.tagId+'">\
					<div class="toggle_switch-inner"></div>\
					<div class="toggle_switch-switch"></div>\
				</label>\
			</div>\
		');
		self.start();
	}
	
	/**
	 * Toggle switch position
	 *
	 * @param {bool} _quiet (Optional) If set to true, switch event is not announced.
	 *
	 */
	toggle_switch.prototype.toggle = function( _quiet ) {
		var self = this;
		switch ( self.position() ) {
			case 'on':
				self.off( _quiet );
				break;
			case 'off':
				self.on( _quiet );
				break;
		}
	}
	
	/**
	 * Start the touch events
	 */
	toggle_switch.prototype.start = function() {
		var self = this;
		jQuery( '.toggle_switch-label', self.elem ).on( 'touchstart click', function( _e ) {
			//------------------------------------------------------------
			//	Wait for animation to announce
			//------------------------------------------------------------
			self.announce();
		});
	}
	
	/**
	 * Wait for animation to announce and announce a switch event
	 */
	toggle_switch.prototype.announce = function() {
		var self = this;
		//------------------------------------------------------------
		//	Wait for animation to announce
		//------------------------------------------------------------
		setTimeout( function() {
			//------------------------------------------------------------
			//	Announce the switch event passing along name and state
			//------------------------------------------------------------
			jQuery( window ).trigger( self.events['switch'], [ self.name, self.position(), self.tagId ] );
		}, self.config.animation_s*1000 );
	}
	
	/**
	 * Set switch to on position
	 *
	 * @param {bool} _quiet (Optional) If set to true, switch event is not announced.
	 */
	toggle_switch.prototype.on = function( _quiet ) {
		var self = this;
		if ( self.position() == 'on' ) {
			return
		}
		jQuery( '.toggle_switch-checkbox', self.elem ).prop( 'checked', true );
		if ( _quiet == true ) {
			return
		}
		self.announce();
	}
	
	/**
	 * Check switch position
	 */
	toggle_switch.prototype.position = function() {
		var self = this;
		var state = jQuery( '.toggle_switch-checkbox', self.elem ).prop( 'checked' );
		switch( state ) {
			case true:
				return 'on'
				break;
			case false:
				return 'off'
				break;
		}
	}
	
	/**
	 * Set switch to off position
	 *
	 * @param {bool} _quiet (Optional) If set to true, switch event is not announced.
	 */
	toggle_switch.prototype.off = function( _quiet ) {
		var self = this;
		if ( self.position() == 'off' ) {
			return
		}
		jQuery( '.toggle_switch-checkbox', self.elem ).prop( 'checked', false );
		if ( _quiet == true ) {
			return
		}
		self.announce();
	}
	
	//----------------
	//	Extend JQuery 
	//----------------
	jQuery( document ).ready( function( jQuery ) {
		jQuery.fn.toggle_switch = function( _config ) {
			var selector = jQuery( this ).selector;
			var switches = [];
			this.each( function() {
				switches.push( new toggle_switch( this, _config, selector ) );
			});
			return switches;
		};
	})
})(jQuery);

;(function(jQuery) {
	
	/**
	 * Holds default config, adds user defined config, and initializes the plugin
	 *
	 * @param { obj } _selector The DOM selector
	 * @param { obj } _config Key value pairs to hold the plugin's configuration
	 */
	function switch_grid( _selector, _config ) {
		this.init( _selector, _config );
	}
	
	/**
	 * Holds default config, adds user defined config, and initializes the plugin
	 *
	 * @param { obj } _elem The DOM element where the plugin will be drawn
	 * @param { obj } _config Key value pairs to hold the plugin's configuration
	 */
	switch_grid.prototype.init = function( _selector, _config ) {
		var self = this;
		//------------------------------------------------------------
		// Store the selector
		//------------------------------------------------------------
		self.selector = _selector;
		//------------------------------------------------------------
		//	User config 
		//------------------------------------------------------------
		self.config = jQuery.extend({
			animation_s: 0.3,
			off: {},
			on: {},
			toggle: {},
			callback: {}
		}, _config );
		//------------------------------------------------------------
		//  Events
		//------------------------------------------------------------
		self.events = {
			switch: 'switch_grid-SWITCH'
		}
		//------------------------------------------------------------
		//  State History
		//------------------------------------------------------------
		self.history = [];
		//------------------------------------------------------------
		//  Get the switches
		//------------------------------------------------------------
		self.switches = jQuery( _selector ).toggle_switch();
		//------------------------------------------------------------
		//  Build the switch map
		//------------------------------------------------------------
		self.switch_map = self.switchMap();
		//------------------------------------------------------------
		//  Start!
		//------------------------------------------------------------
		self.start();
	}
	
	/**
	 * Build the switch instance name map
	 */
	switch_grid.prototype.switchMap = function() {
		var self = this;
		var map = {};
		for ( var i=0; i<self.switches.length; i++ ) {
			var name = self.switches[i]['name'];
			map[name] = self.switches[i];
		}
		return map;
	}
	
	/**
	 * Start the events
	 */
	switch_grid.prototype.start = function() {
		var self = this;
		//------------------------------------------------------------
		//  Mark initial state
		//------------------------------------------------------------
		var state = self.state();
		//------------------------------------------------------------
		//  Listen for toggle switch events
		//------------------------------------------------------------
		jQuery( window ).on( 'toggle_switch-SWITCH', function( _e, _name, _position, _tagId ) {
			//------------------------------------------------------------
			//  Run the callbackback associated with current switch
			//------------------------------------------------------------
			self.callback( _name );
			//------------------------------------------------------------
			//  Throw linked switches
			//------------------------------------------------------------
			var linkChange = 0;
			linkChange += self.toggleLinks( _name, _position );
			linkChange += self.offLinks( _name, _position );
			linkChange += self.onLinks( _name, _position );
			//------------------------------------------------------------
			//  If any linked switches were toggled you have to wait
			//  for their animations to run
			//------------------------------------------------------------
			if ( linkChange > 0 ) {
				setTimeout( function() {
					var state = self.state();
					//------------------------------------------------------------
					//  Find out what's different and run their callback back functions.
					//------------------------------------------------------------
					var diffs = self.diff( _name );
					for ( var i=0; i<diffs.length; i++ ) {
						self.callback( diffs[i].name );
					}
					//------------------------------------------------------------
					//  Announce the change
					//------------------------------------------------------------
					jQuery( window ).trigger( self.events['switch'], [ state, diffs ] );
				}, self.config.animation_s*1000 );
			}
			//------------------------------------------------------------
			//  If nothing changed just store the latest state and 
			//  announce the change.
			//------------------------------------------------------------
			else {
				var state = self.state();
				jQuery( window ).trigger( self.events['switch'], [ state, self.switch_map[ _name ] ] );
			}
		});
	}
	
	/**
	 * Off linked switches.
	 */
	switch_grid.prototype.offLinks = function( _name, _position ) {
		var self = this;
		return self.links( _name, _position, 'off' );
	}
	
	/**
	 * On linked switches.
	 */
	switch_grid.prototype.onLinks = function( _name, _position ) {
		var self = this;
		return self.links( _name, _position, 'on' );
	}
	
	/**
	 * Toggle linked switches.
	 */
	switch_grid.prototype.toggleLinks = function( _name, _position ) {
		var self = this;
		return self.links( _name, _position, 'toggle' );
	}
	
	/**
	 * Toggle linked switches.
	 */
	switch_grid.prototype.links = function( _name, _position, _type, _circular ) {
		//------------------------------------------------------------
		//  Check position in on and off mode.
		//------------------------------------------------------------
		switch( _type ) {
			case 'on':
				if ( _position == 'off' ) {
					return 0;
				}
				break;
			case 'off':
				if ( _position == 'on' ) {
					return 0;
				}
				break;
		}
		//------------------------------------------------------------
		//  Keep track of what's already been toggled to 
		//  avoid infinite circular switching
		//------------------------------------------------------------
		_circular = ( _circular == undefined ) ? {} : _circular;
		_circular[_name] = 1;
		//------------------------------------------------------------
		//  Get the names of the linked switches.
		//------------------------------------------------------------
		var self = this;
		var switch_names = undefined;
		switch( _type ) {
			case 'on':
				switch_names = self.config['on'][_name];
				break;
			case 'off':
				switch_names = self.config['off'][_name];
				break;
			case 'toggle':
				switch_names = self.config['toggle'][_name];
				break;
		}
		//------------------------------------------------------------
		//  No linked switches? Get out of there
		//------------------------------------------------------------
		if ( switch_names == undefined ) {
			return 0;
		}
		//------------------------------------------------------------
		//  Toggle the linked switches...
		//------------------------------------------------------------
		var total = 0;
		for ( var i=0; i<switch_names.length; i++ ) {
			var name = switch_names[i];
			var swit = self.switch_map[name];
			//------------------------------------------------------------
			//  Avoid infinite circular switching
			//------------------------------------------------------------
			if ( _circular[swit.name] == 1 ) {
				continue;
			}
			//------------------------------------------------------------
			//  Toggle the switch appropriately
			//------------------------------------------------------------
			switch( _type ) {
				case 'on':
					swit.on( true );
					break;
				case 'off':
					swit.off( true );
					break;
				case 'toggle':
					swit.toggle( true );
					break;
			}
			//------------------------------------------------------------
			//  Throw linked switches -- daisy chain style.
			//------------------------------------------------------------
			total+=self.links( swit.name, swit.position(), _type, _circular );
			total++;
		}
		return total;
	}
	
	/**
	 * Run the switch callback back function
	 */
	switch_grid.prototype.callback = function( _name ) {
		var self = this;
		var callback = self.config['callback'][ _name ];
		if ( typeof callback == 'function' ) {
			var position = self.switch_map[ _name ].position();
			callback( position );
		}
	}
	
	/**
	 * Gather all the switch states
	 */
	switch_grid.prototype.state = function() {
		var self = this;
		var state = [];
		for ( var i=0; i<self.switches.length; i++ ) {
			var name = self.switches[i]['name'];
			var tagId = self.switches[i]['tagId'];
			var position = self.switches[i].position();
			state.push({ name: name, tagId: tagId, position: position });
		}
		self.history.push( state );
		return state;
	}
	
	/**
	 * What changed?
	 */
	switch_grid.prototype.diff = function( _ignore ) {
		var self = this;
		if ( self.history.length < 2 ) {
			return;
		}
		var now = self.history[ self.history.length-1 ];
		var before = self.history[ self.history.length-2 ];
		var diffs = [];
		for ( var i=0; i<now.length; i++ ) {
			if ( now[i].position != before[i].position && now[i].name != _ignore ) {
				diffs.push( now[i] );
			}
		}
		return diffs;
	}
	
	//----------------
	//	Extend JQuery 
	//----------------
	jQuery( document ).ready( function( jQuery ) {
		jQuery.fn.switch_grid = function( _config ) {
			return new switch_grid( this, _config );
		};
	})
})(jQuery);

