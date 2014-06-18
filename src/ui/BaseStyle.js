(function() {
	"use strict"
	
	var style = {
		'user-select': 'none',
		'box-sizing': 'border-box',
		'margin': 0,
		'padding': 0,

		'*': {
			'box-sizing': 'border-box',
			'margin': 0,
			'padding': 0
		},
		'::selection': {
			'background-color': '#cc3c09',
			'color': '#fff',
			'text-shadow': 'none'
		},

		// classes
		'..fit': {
			'position': 'absolute !important',
			'top': 0,
			'left': 0,
			'right': 0,
			'bottom': 0,
			'overflow': 'hidden'
		},
		'..abs': {
			'position': 'absolute !important'
		},
		'..abs.h': {
			'width': '100%'
		},
		'..abs.v': {
			'height': '100%'
		},
		'..abs.top': {
			'left': '0',
			'top': '0'
		},
		'..abs.left': {
			'top': '0',
			'left': '0'
		},
		'..abs.right': {
			'top': '0',
			'right': '0'
		},
		'..abs.bottom': {
			'left': '0',
			'bottom': '0'
		},		
		'..fixed': {
			'position': 'absolute !important'
		},
		'..fixed.h': {
			'width': '100%'
		},
		'..fixed.v': {
			'height': '100%'
		},
		'..fixed.top': {
			'left': '0',
			'top': '0'
		},
		'..fixed.left': {
			'top': '0',
			'left': '0'
		},
		'..fixed.right': {
			'top': '0',
			'right': '0'
		},
		'..fixed.bottom': {
			'left': '0',
			'bottom': '0'
		},
		'..border': {
			'border': '1px solid rgba(255,255,255, 0.1)'
		},
		'..boxshadow': {
			'box-shadow': '0 0 5px rgba(25,25,25,0.3)'
		},
		'..round': {
			'border-radius': 5
		},
		'..glass': {
			'background-image': 'linear-gradient(top, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 50%)',
			'border-top': '1px solid rgba(255, 255, 255, 0.4)',
			'border-bottom': '1px solid rgba(0, 0, 0, 0.3)'
		},
		'..pad': {
			'margin': 5,
			'padding': 5
		},
		'..innerpad': {
			'padding': 5
		},
		'..outerpad': {
			'margin': 5
		},
		'..clickable': {
			'cursor': ['hand', 'pointer']
		},
		'..bg-stripe': {
			'background-image': 'url(data:image/gif;base64,R0lGODlhBwABAKIAAAAAAP///8G2pMzDtP///wAAAAAAAAAAACH5BAEAAAQALAAAAAAHAAEAAAMEKKozCQA7)'
		},
		'..bg-transparent': {
			'background-color': 'white',
			'background-image': 'url(data:image/gif;base64,R0lGODlhAgACAJEAAAAAAP///8DAwP///yH5BAEAAAMALAAAAAACAAIAAAID1CYFADs=)',
			'background-size': '16px'
		}
	};
})();