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
			<label class="toggle_switch-name">'+self.name+'</label>\
			<div class="toggle_switch-wrap">\
				<input type="checkbox" name="toggle_switch" class="toggle_switch-checkbox" id="'+self.tagId+'" checked>\
				<label class="toggle_switch-label" for="'+self.tagId+'">\
					<div class="toggle_switch-inner"></div>\
					<div class="toggle_switch-switch"></div>\
				</label>\
			</div>\
		');
		jQuery( self.elem ).addClass( 'toggle_switch' );
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
