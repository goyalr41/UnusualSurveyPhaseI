window.onload = function() {

  function getScrollTop() {
    if (typeof window.pageYOffset !== 'undefined' ) {
      // Most browsers
      return window.pageYOffset;
    }

    var d = document.documentElement;
    if (d.clientHeight) {
      // IE in standards mode
      return d.scrollTop;
    }

    // IE in quirks mode
    return document.body.scrollTop;
  }

  window.onscroll = function() {
    var box = document.getElementById('movablebtn'),
        scroll = getScrollTop();

	var maxalw = $( document ).height() - $("#survey_container").height() -300;
    if (scroll <= 10 || scroll >= maxalw) {
      box.style.top = "0px";
    }
    else {
      box.style.top = (scroll) + "px";
    }
  };

};

$(function(){

	
	var serverurl = 'feature5.andrew.cmu.edu';
     
    var participantid =  store.session.get('unusualcommitpid') 		
	var username = store.session.get('unusualcommitusername');
	var reponame = store.session.get('unusualcommitreponame');
	var commitiddata =   store.session.get('unusualcommitdata');
		
	if(commitiddata == null || username == null || reponame == null) {
		window.location.href = "index.html";
	}
	
	//This function is here because inside it is not behaving properly.
	$('.myfileschanged').on('click', function(){
		var id = '.myjscollapse';
		if($(".details-collapse ol").hasClass(id)) {
			$(".details-collapse ol").hide();
			$(".details-collapse ol").removeClass(id);
		}else {	
			$(".details-collapse ol").show();
			$(".details-collapse ol").addClass(id);

		}	
	});
	
	formwizardfun();
	
	var question = new Object();
	question[1] = ['I would want this commit to be brought to my attention.', 'I would <font color="red">not</font> want this commit to be brought to my attention.'];
	question[2] = ['I would care about this commit.','I would <font color="red">not</font> care about this commit.'];
	question[3] = ['This commit is important.','This commit is <font color="red">not</font> important.'];
	question[4] = ['This commit will likely lead to issues in future. (Make changes harder, bugs, vulnerabilities)','This commit will <font color="red">not</font> likely lead to issues in future. (Does <font color="red">not</font> make changes harder, bugs, vulnerabilities)'];
	question[5] = ['This seems to be an unusual commit.'];

	function showcommitdata(commitindex){
		
		var requri = 'https://api.github.com/repos/';
		requri = requri + username + "/" + reponame + "/commits/" + commitiddata[commitindex].commitid +"?client_id=1c54432c86cdc98a9db8&client_secret=d95c77fc4fc509b9e0f50d905654c2866525ef9f";
	
		$(".myloader").css("display","block");
		$(".nowshowcommitdata").css("display","none");
		$(".nowshowsurveydata").css("display","none");
		
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
      
      		$(".content.js-transitionable").html("");
      		$(".diff-view").html("");
      	    
			if($(".details-collapse ol").hasClass('.myjscollapse')) {
					$(".details-collapse ol").removeClass('.myjscollapse');
			}

      		$(".myfileschanged").html(files.length + ' changed files');
			$(".myadditions").html(stats.additions + ' additions');
			$(".mydeletions").html(stats.deletions + ' deletions');
			commit.message = commit.message.replace("&","&amp;");
     		commit.message = commit.message.replace("<","&lt;");
     		commit.message = commit.message.replace(">","&gt;");
			var fg = commit.message.split("\n");
			if(fg.length > 1) {
				$(".commit-title").html(commit.message.split("\n")[0]);
				$(".mycommit-desc").html(commit.message.substring(commit.message.split("\n")[0].length+2,commit.message.length));
			}else {
				$(".commit-title").html(commit.message);
			}
			$(".mycommit").html('commit <span class="sha js-selectable-text">'+json.sha+'</span>');
        	$(".myparent").html(parents.length + ' parent ');
        
        	$.each(parents, function(index) {
        		$(".myparent").append('<a href="' + parents[index].html_url + '" class="sha" target="_blank" data-hotkey="p">' + parents[index].sha.substring(0,7) +'</a>');
        	});
        
        	$(".authorship").html('<img alt="@' + author.login  + '" class="avatar" data-user="' + author.id +'" height="24" src="' + author.avatar_url + '&amp;s=48" width="24" /> <span class="author-name"><a href="' +author.html_url + '" rel="author" target="_blank">' + author.login + '</a></span> &nbsp;authored on <time datetime="'+commit.author.date +'" is="relative-time">'+commit.author.date.split("T")[0]+'</time>');
        
        	$.each(files, function(index) {
        		var outhtml = '<li>';
    			outhtml = outhtml + '<span class="diffstat right">';
    			outhtml = outhtml + '<span class="text-diff-added">';
    			outhtml = outhtml + '+' + files[index].additions +  '</span><span class="text-diff-deleted">';
    			outhtml = outhtml + '&nbsp;−' + files[index].deletions +  '</span>&nbsp;';
    			outhtml = outhtml + '<a href="#diff-' +  files[index].sha;
    			outhtml = outhtml + '" class="tooltipped tooltipped-s" aria-label="' + files[index].changes + ' &nbsp;lines changed">';
    			outhtml = outhtml + '<span class = "octicon octicon-info" style = "color:black;"></span></a></span>';
    			outhtml = outhtml + '<span class="octicon octicon-diff-' + files[index].status + '" title="' + files[index].status + '"></span>';
    			outhtml = outhtml + '<a href="#diff-' + files[index].sha + '">' + files[index].filename + '</a>';
    			outhtml = outhtml + '</li>';
    		$(".content.js-transitionable").append(outhtml);
    		
    		
     		outhtml =  '<a name="diff-' + files[index].sha + '"></a>';
     		outhtml =  outhtml + '<div id="diff-' + index + '" class="file js-details-container">';
     		outhtml =  outhtml + '<div class="file-header" data-path="' + files[index].filename + '">';
     		outhtml =  outhtml + '<div class="file-actions">'; 
     		outhtml =  outhtml + '<a href="' + files[index].blob_url +'" target="_blank" class="btn btn-sm tooltipped tooltipped-n" rel="nofollow" aria-label="View the whole file at this commit">View</a>&nbsp;';
     		outhtml =  outhtml + '<button class="btn btn-sm tooltipped tooltipped-n btnexpansion" rel="nofollow" aria-label="Collapse" id="' +files[index].sha +'"><i class="fa fa-angle-up" style="color:black; font-weight:bold;"></i></button>';
     		outhtml =  outhtml + '</div><div class="file-info">';
     		outhtml =  outhtml + '<span class="diffstat tooltipped tooltipped-e" aria-label="' + files[index].additions + ' additions &amp;' + files[index].deletions + ' deletions">' + files[index].changes + '&nbsp;<span class="diffstat-bar"></span></span>';
     		outhtml =  outhtml + '<span class="js-selectable-text" title="' + files[index].filename +'">' + files[index].filename + '</span></div></div>';
     		outhtml =  outhtml + '<div class="data highlight blob-wrapper"><table class="diff-table  tab-size-8" id ="tab' + files[index].sha + '">';
     		
     		if(files[index].patch != undefined) {
    		var ks = files[index].patch.split("\n");
     		$.each(ks, function(k){
     		    ks[k] = ks[k].replace("&","&amp;");
     			ks[k] = ks[k].replace("<","&lt;");
     			ks[k] = ks[k].replace(">","&gt;");
     			
            	if(ks[k].substring(0,2) === '@@') {
              		outhtml = outhtml + '<tr><td class="blob-code blob-code-inner blob-code-hunk">' + ks[k] + '</td></tr>';
              	}else if(ks[k].substring(0,1) === '+'){
            	  	outhtml = outhtml + '<tr><td class="blob-code blob-code-addition"><span class="blob-code-inner">'+ ks[k] +'</span></td></tr>';
              	}else if(ks[k].substring(0,1) === '-'){
              		outhtml = outhtml + '<tr><td class="blob-code blob-code-deletion"><span class="blob-code-inner">'+ ks[k] +'</span></td></tr>';
              	}else {
              		outhtml = outhtml + '<tr><td class="blob-code blob-code-content"><span class="blob-code-inner">'+ ks[k] +'</span></td></tr>';
              	}
     		});   
     		}
     		outhtml = outhtml + '</table></div></div>';
    		$(".diff-view").append(outhtml);

		});
		
		for(j = 97; j<=101; j++) { 
 				var nameofrad = 'que' + (commitindex+1) + '-' + String.fromCharCode(j);
 				var ty = Math.floor(Math.random()*(question[j-96].length));
 				var appending = (j-96) +'.&nbsp; ' + question[j-96][ty];
 				$('.'+nameofrad).html(appending);
 				//alert($('.'+nameofrad).html());
 				//alert($('input[name="'+nameofrad+'"]:checked', 'form#wrapped').val());
 		}
		
		$(".details-collapse ol").hide();
				$(".details-collapse ol").hide();

		$(".details-collapse ol").hide();

		$(".details-collapse.table-of-contents.js-details-container").css("display","block");
		$(".diff-view").css("display","block");
		$('.btnexpansion').on('click', function(){
			var id = '#tab' + $(this).attr("id");
			if($(id).hasClass("collapse")) {
				$(this).attr("aria-label","Collapse");
				$(this).html('<i class="fa fa-angle-up" style="color:black; font-weight:bold;">');
				$(id).removeClass("collapse");
			}else {
				//var id = '#tab' + $(this).attr("id");
				$(this).attr("aria-label","Expand");
				$(this).html('<i class="fa fa-angle-down" style="color:black; font-weight:bold;">');
				$(id).addClass("collapse");
			}	
		});
		
		$(".myloader").css("display","none");
		$(".nowshowcommitdata").css("display","block");
		$(".nowshowsurveydata").css("display","block");
		
		/*function goToByScroll(){
	        id = "mycommittop";
	        $('html,body').scrollTop($("#"+id).offset().top);
    	}

    	$(".forward").on('click',function(e) { 
          	e.preventDefault(); 
        	goToByScroll();           
    	});*/
	
     	}
     });
     }
    
	
	function requestJSON(url, callback) {
    $.ajax({
      url: url,
      complete: function(xhr) {
        callback.call(null, xhr.responseJSON);
      }
    });
    }
    
    function formwizardfun() {
				showcommitdata(0);
				//  Basic wizard with validation
				//$('form#wrapped').attr('action', '$("#progressbar").hide()');
				/*$( "form#wrapped" ).submit(function( event ) {
 					 event.preventDefault();
 					 for(i = 1; i <= 10; i++){
						 for(j = 97; j<=101; j++) { 
 					 		var nameofrad = 'que' + i + '-' + String.fromCharCode(j);
 					 			alert($('.'+nameofrad).html());
 					 			alert($('input[name="'+nameofrad+'"]:checked', 'form#wrapped').val());
 					 	 }
 					 }
				});*/
				
				$("#survey_container").wizard({
					stepsWrapper: "#wrapped",
					submit: ".submit",
					beforeSelect: function( event, state ) {
						if (!state.isMovingForward)
  						 return true;
						var inputs = $(this).wizard('state').step.find(':input');
						return !inputs.length || !!inputs.valid();
					}
			

				}).validate({
					errorPlacement: function(error, element) { 
						if ( element.is(':radio') || element.is(':checkbox') ) {
							error.insertBefore( element.next() );

						} else { 
							error.insertAfter( element );
						}
					}
				});
				

				//  progress bar
				$("#progressbar").progressbar();

				$("#survey_container").wizard({
					afterSelect: function( event, state ) {

						$("#progressbar").progressbar("value", state.percentComplete);
						$("#location").text("(" + state.stepsComplete + "/" + state.stepsPossible + ")");
						if(state.stepsComplete != state.stepsPossible) {
							$('html,body').scrollTop(0);
							showcommitdata(state.stepsComplete);
							submitsurveydata(state.stepsComplete);
						}else {
							$(".nowshowcommitdata").css("display","none");
							$("#top-wizardform").text("Thanks! But Wait....");
							$("#bottom-wizard").hide();
							submitsurveydata(state.stepsComplete);
						}
						
						
					}
				});
    }
    
    function submitsurveydata(i) {
    			var outdata = "";
    			outdata = outdata + username +"/"+ reponame+"\t";

    			outdata = outdata + commitiddata[i-1].commitid + " \t" ;
    			outdata = outdata + (Math.round(commitiddata[i-1].Decisionval * 10000) / 10000) + " \t";
    			for(j = 97; j<=101; j++) { 
 					 	var nameofrad = 'que' + i + '-' + String.fromCharCode(j);
 						var que = $('.'+nameofrad).html();
 						que = que.replace("&nbsp;","");
 						que = que.replace('<font color="red">',"");
 						que = que.replace('</font>',"");
 						outdata = outdata + que + " \t";
 			 			var ans = $('input[name="'+nameofrad+'"]:checked', 'form#wrapped').val();
 			 			if(ans != undefined) {
 			 				outdata = outdata + ans + " \t";
 			 			}else {
 			 				outdata = outdata + "-" + " \t";
 			 			}
 			 	 }
 			 	 if($('#que'+i+'comment').val() == "") {
 			 	 	 outdata = outdata + "Comment\t" + "-" + " \t";
 			 	 }else {
 			 	 	outdata = outdata + "Comment\t" + $('#que'+i+'comment').val().split('\n').join(' ') + " \t";
 			 	 }
 			 	 	 outdata = outdata + Date.now() +"\n"; 			 	 
 			 	 
 			 	 var surveyclass = new Object();
 			 	 surveyclass.participantid = participantid;
 			 	 surveyclass.data = outdata;
 			 	 
 			 	    $.ajax({
        url: 'http://'+serverurl+':8080/UnusualGitCommit/mainsurvey',
        type: 'POST',
        dataType: 'json',
		crossDomain: true,
        data: JSON.stringify(surveyclass),
        contentType: 'application/json',
        mimeType: 'application/json',
 
        success: function (data) {

        },
        
        error:function(status,er) {
            //alert("error:  status: "+status+" er:"+er);
        }
    });
    
 		 
    }
  
});