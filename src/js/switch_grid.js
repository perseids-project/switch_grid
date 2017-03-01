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
