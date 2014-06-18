Appbus.Styles.get('global').add('base', {
	'body': {
		'background-color': '#242428',
		'font-family': '"나눔 고딕", "맑은 고딕", "돋움", Dotum, "sans-serif"',
		'color': 'white',
		'font-size': '11px',
		'margin': '0',
		'padding': '0'
	}
});

Appbus.View.styles.add('a', {
	'a': {
	}
});
	
/*'::-webkit-scrollbar': {
		'width': '6px'
	},	 
	'::-webkit-scrollbar-track': {
		'-webkit-box-shadow': 'inset 0 0 8px rgba(0,0,0,0.6)',
		'border-radius': '10px',
		'border': '1px solid rgba(15,15,15,1)',
		'margin': '10px'
	},	 
	'::-webkit-scrollbar-thumb': {
		'background': 'rgba(0,0,0,0.5)',
		'border': '1px solid black',
		'border-radius': '10px',
		'-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.5)'
	}
});
*/
/*
Appbus.defineStyle('.list', {
	'': {
		'color': 'white',
	},
	'.title': {
		'font-size': '11px !important',
		'color': 'white'
	},
	'.desc': {
		'font-size': '10px !important',
		'color': 'white'
	},
	'..round > ul': {
		'border': 'none !important'
	},
	'ul > li': {
		'border-top': '1px dotted rgba(62,69,85,0.5)',
		'border-bottom': 'none'
	},
	'ul > li:nth-last-child(1)': {
		'border-bottom': '1px dotted rgba(62,69,85,0.5)'
	},
	'.pressed > div' : {
		'background-image': 'none',
		'background-color': '#cf3621 !important'
	},
	'.selected > div' : {
		'background-image': 'none',
		'background-color': '#cf3621 !important'
	}
});

Appbus.defineStyle('.list.white', {
	'': {
		'color': 'black',
	},
	'.title': {
		'font-size': '11px !important',
		'color': 'black'
	},
	'.desc': {
		'font-size': '10px !important',
		'color': 'black'
	}
});

Appbus.defineStyle('.ctext', {
	'.text': {
		'color': 'white',
		'text-shadow': 'none',
		'font-size': '12px'
	},
	'.desc': {
		'color': '#eee !important',
		'text-shadow': 'none !important',
		'font-size': '11px !important'
	}
});

Appbus.defineStyle('.ctitle', {
	'h1' : {
		'font-size': '14px !important',
		'line-height': '20px !important'
	}
});

Appbus.defineStyle('.ctitle.category', {
	'': {
		'-webkit-box-shadow': 'none !important',
		'color': 'rgba(100,200,255,0.8) !important',
		'border-top': '1px dotted rgba(62,69,85,0.5) !important',		
		'border-bottom': '0px dotted rgba(62,69,85,0.5) !important',
		'background-color': 'rgba(94,94,94,0.2) !important',
		'background-image': 'none !important'
	}
});

Appbus.defineStyle('.ctitle.header', {
	'h1' : {
		'color': 'rgba(100,200,255,0.8) !important',
		'font-size': '13px !important',
		'font-weight': 'bold !important',
		'text-shadow': 'none !important'
	}
});
*/

/*
function Test(){
    this.__defineSetter__("styles", function(v){
        console.log('setter', v);
        this._c = v;
    });
    this.__defineGetter__("styles", function(){
        console.log('getter called');
        return this._c;
    });
    this._c = new Object();
};

var test = new Test();
test.styles.a = 'a';
test.styles.b = 'b';
test.styles.c = 'c';
console.log(test);



var style = {
	'class': 'a b c',
	'': {
		'border': '1px solid black'
	},
	'.sub': {
		'background': 'silver'
	}
};

var cmp_styleset = {
	'base': {
		'class': 'a b c',
		'': {
			'border': '1px solid black'
		},
		'.sub': {
			'background': 'silver'
		}
	},
	'classes': {
		'a': {
			'': {
				'border': '1px solid black'
			},
			'.sub': {
				'background': 'silver'
			}
		},
		'b': {
			'': {
				'border': '1px solid black'
			},
			'.sub': {
				'background': 'silver'
			}
		},
		'c': {
			'': {
				'border': '1px solid black'
			},
			'.sub': {
				'background': 'silver'
			}
		}
	},
	'phone': {
		'class': 'a b c',
		'': {
			'border': '1px solid black'
		},
		'.sub': {
			'background': 'silver'
		}
	},
	'phone.landscape': {
		'class': 'a b c',
		'': {
			'border': '1px solid black'
		},
		'.sub': {
			'background': 'silver'
		}
	},
	'desktop': {
		'class': 'a b c',
		'': {
			'border': '1px solid black'
		},
		'.sub': {
			'background': 'silver'
		}
	},
	'tablet': {
		'class': 'a b c',
		'': {
			'border': '1px solid black'
		},
		'.sub': {
			'background': 'silver'
		}
	},
	'tablet.landscape': {
		'class': 'a b c',
		'': {
			'border': '1px solid black'
		},
		'.sub': {
			'background': 'silver'
		}
	}
};

var theme = {
	'variables': {
		'red': '#881111'
	},
	'cmp': cmp_styleset,
	'view': {
	}
};
*/