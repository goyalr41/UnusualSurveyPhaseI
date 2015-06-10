$(window).unload(function() {
	if(store.session.has('unusualcommitusername')){
		store.session.remove('unusualcommitusername');
	}
	if(store.session.has('unusualcommitreponame')) {
		store.session.remove('unusualcommitreponame');
	}
	if(store.session.has('unusualcommitdata')) {
		store.session.remove('unusualcommitdata');
	}
	if(store.session.has('unusualcommitpid')) {
		store.session.remove('unusualcommitpid');
	}
});

$(function(){
	/*
HeatColor, by Josh Nathanson
A plugin for jQuery
See copyright at end of file
Complete documentation at http://www.jnathanson.com/blog/client/jquery/heatcolor/index.cfm
*/

jQuery.fn.heatcolor = function( valueFunction, options ) {
	
	var settings = {
					elementFunction : function() { return jQuery(this); },
					minval : 0,
					maxval : 0,
					lightness : 0.75,
					colorStyle : 'roygbiv',
					reverseOrder : false
	};
	
	if( options ) {
		jQuery.extend( settings, options );
	};
	
	// helper functions
	var helpers = {
		
		findcolor : function(curval, mn, mx) {
	
			// value between 1 and 0
			var position = (curval - mn) / (mx - mn); 
			
			// this adds 0.5 at the top to get red, and limits the bottom at x= 1.7 to get purple
			var shft = settings.colorStyle == 'roygbiv'
				? 0.5*position + 1.7*(1-position)
				: position + 0.2 + 5.5*(1-position);
			
			// scale will be multiplied by the cos(x) + 1 
			// (value from 0 to 2) so it comes up to a max of 255
			var scale = 128;
			
			// period is 2Pi
			var period = 2*Math.PI;
			
			// x is place along x axis of cosine wave
			var x = shft + position * period;
			
			// shift to negative if greentored
			x = settings.colorStyle != 'roygbiv'
				? -x
				: x;
				
			var r = this.process( Math.floor((Math.cos(x) + 1) * scale) );
			var g = this.process( Math.floor((Math.cos(x+Math.PI/2) + 1) * scale) );
			var b = this.process( Math.floor((Math.cos(x+Math.PI) + 1) * scale) );
			
			return '#' + r + g + b;
		
		},
	
		process: function( num ) {
			
			// adjust lightness
			var n = Math.floor( num + settings.lightness * (256 - num));
			
			// turn to hex
			var s = n.toString(16);
			
			// if no first char, prepend 0
			s = s.length == 1 ? '0' + s : s;
			
			return s;		
		},
	
		setMaxAndMin : function( els ) {
			
			var vals = [];
			els.each(function() {
				vals.push( valueFunction.apply( jQuery(this) ) );
			});			
			vals = vals.sort( function(a,b) { return a - b; } );
			settings.maxval = !settings.reverseOrder
								? vals[vals.length-1]
								: vals[0]; 
			settings.minval = !settings.reverseOrder
								? vals[0]
								: vals[vals.length-1]; 
		}
		
	}; // close helper functions
	
	if ( !settings.minval && !settings.maxval )
		helpers.setMaxAndMin( jQuery(this) );
	else
		if ( settings.reverseOrder ) {
			var temp = settings.minval;
			settings.minval = settings.maxval;
			settings.maxval = temp;
		}
	
	jQuery(this).each(function() {
		// iterate over jQuery object (array of elements)
		
		var el = jQuery(this); // current element
		
		// get the value to find in range
		var curval = valueFunction.apply( el );

		// get current color
		var curcolor = helpers.findcolor( curval, settings.minval, settings.maxval );
				
		// find the element to color
		var elToColor = settings.elementFunction.apply( el );
		
		// color it
		if ( elToColor[0].nodeType == 1 )
			elToColor.css( "background-color", curcolor );
		else if ( elToColor[0].nodeType == 3 )
			elToColor.css( "color", curcolor );
				
	});
	
	return (this);
	
}

/*
+-----------------------------------------------------------------------+
| Copyright (c) 2007 Josh Nathanson                  |
| All rights reserved.                                                  |
|                                                                       |
| Redistribution and use in source and binary forms, with or without    |
| modification, are permitted provided that the following conditions    |
| are met:                                                              |
|                                                                       |
| o Redistributions of source code must retain the above copyright      |
|   notice, this list of conditions and the following disclaimer.       |
| o Redistributions in binary form must reproduce the above copyright   |
|   notice, this list of conditions and the following disclaimer in the |
|   documentation and/or other materials provided with the distribution.|
|                                                                       |
| THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS   |
| "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT     |
| LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR |
| A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT  |
| OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, |
| SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT      |
| LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, |
| DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY |
| THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT   |
| (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE |
| OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.  |
|                                                                       |
+-----------------------------------------------------------------------+
*/

		var serverurl = 'feature5.andrew.cmu.edu';

	    var participantid =  store.session.get('unusualcommitpid') 		
	var username = store.session.get('unusualcommitusername');
	var reponame = store.session.get('unusualcommitreponame');
	var commitiddata =   store.session.get('unusualcommitdata');
	
	if(commitiddata == null || username == null || reponame == null) {
		window.location.href = "index.html";
	}
	
	var reason = new Object();
    	reason['totalloc'] = '/X or more <strong>lines of code</strong> are <font color=red>/Y</font> <strong>changed</strong>. (only in <strong>/HH%</strong> of all commits)';
    	reason['totallocauth'] = "/X or more <strong>lines of code</strong> are <font color=red>/Y</font> <strong>changed</strong> by <font color=blue>/A</font>. (only in <strong>/HH%</strong> of commits by /A)";
    	reason['locadded'] = '/X or more <strong>lines of code</strong>  are <font color=red>/Y</font> <strong>added</strong>. (only in <strong>/HH%</strong> of all commits)';
    	reason['locaddedauth'] = "/X or more <strong>lines of code</strong> are <font color=red>/Y</font> <strong>added</strong> by <font color=blue>/A</font>. (only in <strong>/HH%</strong> of all commits by /A)";
    	reason['locremoved'] = '/X or more <strong>lines of code</strong> are <font color=red>/Y</font> <strong>removed</strong>. (only in <strong>/HH%</strong> of all commits)';
    	reason['locremovedauth'] = '/X or more <strong>lines of code</strong> are <font color=red>/Y</font> <strong>removed</strong> by <font color=blue>/A</font>. (only in <strong>/HH%</strong> of commits by /A)';
    	reason['totalfilechanged'] = '/X or more <strong>files</strong> are <font color=red>/Y</font> <strong>changed</strong>. (only in <strong>/HH%</strong> of all commits)';
    	reason['totalfilechangedauth'] = '/X or more <strong>files</strong> are <font color=red>/Y</font> <strong>changed</strong> by <font color=blue>/A</font>. (only in <strong>/HH%</strong> of commits by /A)';
    	reason['totalfileaddedauth'] = '/X or more <strong>files</strong> are <font color=red>/Y</font> <strong>added</strong> by <font color=blue>/A</font>. (only in <strong>/HH%</strong> of commits by /A)';
    	reason['totalfileremovedauth'] = '/X or more <strong>files</strong> are <font color=red>/Y</font> <strong>removed</strong> by <font color=blue>/A</font>. (only in <strong>/HH%</strong> of commits by /A)';
		reason['commitmsg'] = 'Commit message with /X <strong>words</strong> is much longer than a typical <strong>commit message</strong>. (only <strong>/HH%</strong> of commit messages are longer)';
    	reason['commitmsgauth'] = 'Commit message with /X <strong>words</strong> is much longer than a typical <strong>commit message</strong> by <font color=blue>/A</font>. (only <strong>/HH%</strong> of commit messages by /A are longer)';
    	reason['timeofcommitauth'] = '<font color=blue>/A</font> <font color=red>/Y</font> commits around <strong>/X</strong>. (only in <strong>/HH%</strong> of commits by /A)';
    	reason['filpercentchan'] = '<font color=green>/X</font> files are <font color=red>/Y</font> changed. (only <strong>/HH%</strong> of all files changed)';
    	reason['filpercentchanauth'] = '<font color=green>/X</font> files are <font color=red>/Y</font> changed by <font color=blue>/A</font>. (only <strong>/HH%</strong> of all files changed by /A)';
    	reason['filpercommit'] = '<font color=green>/X</font> files <font color=red>/Y</font> <strong>occur</strong> in a commit. (only in <strong>/HH%</strong> of all commits)';
    	reason['filpercommitauth'] = '<font color=green>/X</font> files <font color=red>/Y</font> <strong>occur</strong> in a commit by <font color=blue>/A</font>. (only in <strong>/HH%</strong> of commits by /A)';
    	reason['combfrequency'] = '<font color=green>/X</font> files are <font color=red>/Y</font> changed <strong>together</strong>. (only in <strong>/HH%</strong> of all commits)';
    	reason['combfrequencyauth'] = '<font color=green>/X</font> files are <font color=red>/Y</font> changed <strong>together</strong> by <font color=blue>/A</font>. (only in <strong>/HH%</strong> of commits by /A)';
		reason['combprobability'] = '<font color=green>/X</font> files are <font color=red>/Y</font> changed in this <strong>ratio</strong>. (only in <strong>/HH%</strong> of all commits)';
    	reason['combprobabilityauth'] = '<font color=green>/X</font> files are <font color=red>/Y</font> changed in this <strong>ratio</strong> by <font color=blue>/A</font>. (only in <strong>/HH%</strong> of commits by /A)';
    	
    var unusualness = new Object();
    unusualness['quitenormal'] = 'Do you agree this is a <font color="#330065">quite normal</font> commit?';
    unusualness['normal'] = 'We rate this commit as <font color="green">normal</font>. What do you think?';
    unusualness['average'] = 'Do you agree this is an <font color="#330065">average</font> commit?';
    unusualness['lessunusual'] = 'Do you agree this is a <font color="#330065">less unusual</font> commit?';
	unusualness['unusual'] = 'We rate this commit as <font color="#FF6600">unusual</font>. What do you think?';
    unusualness['veryunusual'] = 'We rate this commit as <font color="darkred">very unsual</font>. What do you think?';

     var unusualnessdecision = new Object();
    unusualnessdecision['normal'] = '<font color="green">Normal</font>';
	unusualnessdecision['unusual'] = '<font color="#FF6600">Unusual</font>';
    unusualnessdecision['veryunusual'] = '<font color="darkred">Very Unsual</font>';

    	
	
	$(".myloader").css("display","block");
	$(".nowshowcommitdata").css("display","none");
	
	 minvaldec = 1.0;
    $.each(commitiddata, function(i){
    	minvaldec = Math.min(parseFloat(commitiddata[i].Decisionval),minvaldec);
    });
	
	minvaldec = Math.min(minvaldec,0.6);
		
	$.each(commitiddata, function(commitindex){
		
		var requri = 'https://api.github.com/repos/';
		requri = requri + username + "/" + reponame + "/commits/" + commitiddata[commitindex].commitid +"?client_id=1c54432c86cdc98a9db8&client_secret=d95c77fc4fc509b9e0f50d905654c2866525ef9f";
			
    	requestJSON(requri, function(json) {
      		if(json.message == "Not Found") {
				alert("Something went Wrong");
      	}
      	else {
      		var stats = json.stats;
      		var files   = json.files;
      		var commit = json.commit;
      		var parents = json.parents;
      		var author = json.author;
      		if(author == null) {
      			author = json.commit.author;
      			author.login = json.commit.author.name;
      			author.avatar_url = "https://2.gravatar.com/avatar/299d2dffa2b23dc5771658a4f9739476?d=https%3A%2F%2Fassets-cdn.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png";
      			author.html_url = 'javascript:;';
      			author.id = -5;
      		}
      		
      	    
			var outhtml =  '<li class="commit commits-list-item table-list-item js-navigation-item js-details-container js-socket-channel js-updatable-content" >';
			outhtml = outhtml + '<div class="table-list-cell commit-avatar-cell">';
			outhtml = outhtml + '<div class="avatar-parent-child">';
			outhtml = outhtml + '<a href="' +  author.html_url +  '" target="_blank" data-skip-pjax="true" rel="contributor"><img alt="@' + author.login  + '" class="avatar" data-user="' + author.id +'" height="36" src="' + author.avatar_url + '&amp;s=72" width="36" /> </a> </div>  </div>';    
			outhtml = outhtml + '<div class="table-list-cell"> <p class="commit-title ">';
			commit.message = commit.message.replace("&","&amp;");
			commit.message = commit.message.replace("<","&lt;");
			commit.message = commit.message.replace(">","&gt;");
			var fg = commit.message.split("\n");
			if(fg.length > 1) {
				outhtml = outhtml + '<a href="https://github.com/' + username +"/"+ reponame + "/commit/" + commitiddata[commitindex].commitid + '" " target="_blank" class="message" data-pjax="true">' + commit.message.split("\n")[0] + '</a>';
				outhtml = outhtml +  '<span class="hidden-text-expander inline"><a href="#" class="js-details-target">…</a></span>';
				outhtml = outhtml + '</p><div class="commit-meta">';
				outhtml = outhtml +  '<a href="' +author.html_url + '" class="commit-author" rel="contributor" target="_blank">' + author.login + '</a></span> &nbsp;authored <time datetime="'+commit.author.date +'" is="relative-time">'+commit.author.date.split("T")[0]+'</time></div>';
				outhtml = outhtml +  '<div class="commit-desc"><pre></pre>'+commit.message.substring(commit.message.split("\n")[0].length+2,commit.message.length)+'</div>';
			}else {
				outhtml = outhtml + '<a href="https://github.com/' + username +"/"+ reponame + "/commit/" + commitiddata[commitindex].commitid + '" " target="_blank" class="message" data-pjax="true">' + commit.message + '</a>';
				outhtml = outhtml + '</p><div class="commit-meta">';
				outhtml = outhtml +  '<a href="' +author.html_url + '" class="commit-author" rel="contributor" target="_blank">' + author.login + '</a></span> &nbsp;authored <time datetime="'+commit.author.date +'" is="relative-time">'+commit.author.date.split("T")[0]+'</time></div>';
			}
			
  			outhtml = outhtml + '<div class="container reasonforit"><pre style="color:black; margin-top:5px;">'+ '\n<strong>Score: ' + unusualnessdecisionval(commitiddata[commitindex].Decisionval)  +'</strong> (' + Math.round(commitiddata[commitindex].Decisionval * 10000) / 10000 + ')\n' + getreason(commitiddata[commitindex].reasonlist, author.login, commitiddata[commitindex].Decisionval) +'</pre></div>';
  			outhtml = outhtml + '<div class="row" style="margin-top:15px;"><div class="col-md-12"><ul class="data-list" id="terms"><li style="color:rgba(0,0,0,0.8); font-size:16px;     font-family: "Open Sans", Arial, sans-serif;"><i class="fa fa-question-circle" style="color:black;"></i> &nbsp;<strong>'+ unusualnessquestion(commitiddata[commitindex].Decisionval) +'</strong></li></ul></div>';
            
            outhtml = outhtml + '<div class ="col-md-3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label class="radio-inline" style="font-size:15px; color:black;">'
                        +'<input name="que'+commitindex+'" type="radio"  value="Normal">Normal</label></div><div class ="col-md-3">'
						+'<label class="radio-inline" style="font-size:15px; color:black;">'
					    +'<input name="que'+commitindex+'"  type="radio"  value="Unusual">Unusual'
						+'</label>'
					    +'</div><div class ="col-md-4"><label class="radio-inline" style="font-size:15px; color:black;">'
						+'<input name="que'+commitindex+'" type="radio"  value="Very Unusual">Very Unusual</label></div>';
						
			            outhtml = outhtml + '</div>';

  
  			outhtml = outhtml + '<br></div>';
  			
  			
 			outhtml = outhtml + '<div class="commit-links-cell table-list-cell"> <div class="commit-links-group btn-group">'
  			outhtml = outhtml + '<a href="https://github.com/' + username +"/"+ reponame + "/commit/" + commitiddata[commitindex].commitid + '" " target="_blank" class="sha btn btn-outline tooltipped tooltipped-s my' + commitindex + '" aria-label="Anamoly Score: ' + Math.round(commitiddata[commitindex].Decisionval * 10000) / 10000 + '" id = "' + commitiddata[commitindex].commitid + '">' + commitiddata[commitindex].commitid+'</a> ';
  			var compare_value = parseFloat(commitiddata[commitindex].Decisionval);
			
  			//outhtml = outhtml +  '<a href="#" aria-label="Statistics" class="btn btn-outline tooltipped tooltipped-s statsbutton" rel="nofollow"><span class="octicon octicon-graph" type="button"></span></a></div>'; 
  			//outhtml = outhtml +  '<a aria-label="Agree?" class="btn btn-outline tooltipped tooltipped-s agreebutton"><span class="octicon octicon-check" type="button"></span></a></div>'; 

  			outhtml = outhtml + '</li>';
  
  			$('ol').append(outhtml);
  			var classname = ".my"+commitindex;
  			
  			$(classname).heatcolor(function() {return compare_value; },
  			{	
    				lightness: 0,
    				colorStyle: 'greentored',
    				maxval: 1.05,
    				minval: minvaldec,
    				reverseOrder: true
    						
    				}
    			)
     		}
     		if(compare_value < 0.9) {
  				$(classname).css("background-color","#99FF33");
  			}
     		$("a.sha.btn.btn-outline").css("color", "black");
     		
		});
		
		  	

     });
     
     		
    		$('.agreebutton').on('click', function(){
			if($(this).hasClass("selected")) {
				$(this).removeClass("selected");
				$(this).css("background-color","white");
			}else {
				$(this).addClass("selected");
				$(this).css("background-color","green");
			}
			
     });
     		
   
		

    $(".myloader").css("display","none");
	$(".nowshowcommitdata").css("display","block");
    
	
	function requestJSON(url, callback) {
    $.ajax({
      url: url,
      complete: function(xhr) {
        callback.call(null, xhr.responseJSON);
      }
    });
    }
    
    function unusualnessquestion(decisionval){
    	var decvalff = parseFloat(decisionval);
    	if (decvalff < 0.9){
            return unusualness['normal'] ;
        }else if(decvalff >= 0.90 && decvalff < 0.95) {
         	return unusualness['unusual'];
        }else if(decvalff >= 0.95) {
         	return unusualness['veryunusual'];
        }
  };
    
      function unusualnessdecisionval(decisionval){
    	var decvalff = parseFloat(decisionval);
    	if (decvalff < 0.9){
            return unusualnessdecision['normal'] ;
        }else if(decvalff >= 0.90 && decvalff < 0.95) {
         	return unusualnessdecision['unusual'];
        }else if(decvalff >= 0.95) {
         	return unusualnessdecision['veryunusual'];
        }
  };
  
    function getreason(datareason ,authorname, decisionval) {
    	
    	var thereasonis = "";
		$.each(datareason, function(i){
			if(i > 4) {
				return false;
			}
			//if(datareason[i].name == 'totalloc') {
				var temp = reason[datareason[i].name];
		
				if(datareason[i].name == 'timeofcommitauth') {
					if(datareason[i].value > 12) {
						temp = temp.replace('/X', datareason[i].value-12 + 'pm UTC');
					}else if(datareason[i].value < 12) {
						temp = temp.replace('/X', datareason[i].value + 'am UTC');
					}else {
						temp = temp.replace('/X', datareason[i].value + 'pm UTC');
					}
				}else {
					temp = temp.replace('/X', datareason[i].value);
				}
				
				var H;
				var flag = 1;
				var theval = parseFloat(datareason[i].valorg);
				var thevalrnd = parseFloat(datareason[i].valorg).toPrecision(1);
				if(theval == 0.0) {
					H = 'never';
				}else if(theval > 0.0 && theval <= 1.0) {
					H = 'almost never';
				}else if(theval > 1.0 && theval <= 3.0) {
					H = 'very rarely';
				}else if(theval > 3.0 && theval <= 6.0) {
					H = 'rarely';
				}else if(theval > 6.0 && theval < 10.0) {
					H = 'less commonly';
				}else {
					flag = 0;
				}
				
				if(flag == 1) {
					temp = temp.replace('/Y',H);
					temp = temp.replace('/A', authorname);
					temp = temp.replace('/A', authorname);
					temp = temp.replace('/HH',thevalrnd);
					thereasonis= thereasonis + temp + "\n";

				}
				
			//}
		});
		if(thereasonis != "") {
			var decvalff = parseFloat(decisionval);
    	if (decvalff < 0.9){
            	thereasonis = "\n<strong>Reason: </strong><i>Not enough high-valued outliers, lead to rate this commit as <strong>normal</strong>.</i>\n"+thereasonis; 
        }else if(decvalff >= 0.90 && decvalff < 0.95) {
            	thereasonis = "\n<strong>Reason: </strong><i>Many high-valued outliers, lead to rate this commit as <strong>unusual</strong>.</i>\n"+thereasonis; 
        }else if(decvalff >= 0.95) {
            	thereasonis = "\n<strong>Reason: </strong><i>Many high-valued outliers, lead to rate this commit as <strong>very unusual</strong>.</i>\n"+thereasonis; 
        }
        
		}
		return thereasonis;
    	
    }
    
    $('.submitdata').on('click',function(e){
    	e.preventDefault();
    	submitsurveydata();
    });
    
       function submitsurveydata() {
    			var outdata = "";
    			outdata = outdata + username +"/"+reponame+"\n";
    			for(i = 0; i < 5; i++) {
    			outdata = outdata + commitiddata[i].commitid + " \t" ;
    			outdata = outdata + (Math.round(commitiddata[i].Decisionval * 10000) / 10000) + " \t";
    		
 					 	var nameofrad = 'que' + i;
 						
 			 			var ans = $('input[name="'+nameofrad+'"]:checked').val();
 			 			if(ans != undefined) {
 			 				outdata = outdata + ans + " \n";
 			 			}else {
 			 				outdata = outdata + "-" + " \n";
 			 			}
 			 	 
 			 	
 			 	 }
 			 	 	outdata = outdata + Date.now() +"\n"; 			 	 
 			 	 
 			 	 var surveyclass = new Object();
 			 	 surveyclass.participantid = participantid;
 			 	 surveyclass.data = outdata;
 			 	 
 			 	 //console.log(surveyclass.data);
 			 	 
 			 	    $.ajax({
        url: 'http://'+serverurl+':8080/UnusualGitCommit/postsurvey',
        type: 'POST',
        dataType: 'json',
		crossDomain: true,
        data: JSON.stringify(surveyclass),
        contentType: 'application/json',
        mimeType: 'application/json',
 
        success: function (data) {
    		window.location.href = "index.html";
        },
        
        error:function(status,er) {
            //alert("error:  status: "+status+" er:"+er);
        }
    });
    

    
 		 
    }
    
  
});