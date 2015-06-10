$(function(){
    //To check store.min.js support.
	if(store.session.has('unusualcommitusername')) {
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

	
	var serverurl = 'feature5.andrew.cmu.edu';
  	var glbusername = "";
  	var glbreponame = "";
  	var participantid = "";
    	
    
    $('.startsurveybtn').on('click',function(e){
    	 e.preventDefault();
    	 $('.startsurvey').hide();
    	  var user = new Object();
    	  user.agree = "Agreed";
    $.ajax({
        url: 'http://'+serverurl+':8080/UnusualGitCommit/participantid',
        type: 'POST',
        dataType: 'json',
		crossDomain: true,
        data: JSON.stringify(user),
        contentType: 'application/json',
        mimeType: 'application/json',
 
        success: function (data) {
        	participantid = data.participantid;
        	$('.pid').html('<strong>PID: </strong>'+participantid);
        },
        
        error:function(status,er) {
            //alert("error:  status: "+status+" er:"+er);
        }
    });
    
    	 $('.actualsurvey').css('display','block');
    });
    
  
    $('[data-toggle="tooltip"]').tooltip();
    
    $('#ghusername').keypress(function(e) {
  		if (e.keyCode == 13 ) {
  		    e.preventDefault();
    		maincallerfunc();
  		}
  	});
  	
   $('#ghsubmitbtn').on('click', function(e){
   	    e.preventDefault();
   	    maincallerfunc();
   });
   
    function maincallerfunc(){
    $('#ghapidata').html('<div class="text-center"><i class="fa fa-spinner fa-pulse fa-5x" style="color:black; font-size:40px"></i></div>');
 
    var username = $('#ghusername').val();
    var requri   = 'https://api.github.com/users/'+username+"?client_id=1c54432c86cdc98a9db8&client_secret=d95c77fc4fc509b9e0f50d905654c2866525ef9f";
    var repouri  = 'https://api.github.com/users/'+username+'/subscriptions?per_page=100'+"&client_id=1c54432c86cdc98a9db8&client_secret=d95c77fc4fc509b9e0f50d905654c2866525ef9f";
    var repouri2  = 'https://api.github.com/users/'+username+'/repos?per_page=100'+"&client_id=1c54432c86cdc98a9db8&client_secret=d95c77fc4fc509b9e0f50d905654c2866525ef9f";
    var repoorguri  = 'https://api.github.com/users/'+username+'/orgs?per_page=100'+"&client_id=1c54432c86cdc98a9db8&client_secret=d95c77fc4fc509b9e0f50d905654c2866525ef9f"; //Extract repos_url from this
    
    requestJSON(requri, function(json) {
      if(json.message == "Not Found" || username == '') {
        $('#ghapidata').html("<h2>No User Info Found</h2>");
      }
      
      else {
        // else we have a user and we display their info
        var fullname   = json.name;
        var username   = json.login;
        var aviurl     = json.avatar_url;
        var profileurl = json.html_url;
        var location   = json.location;
        var followersnum = json.followers;
        var followingnum = json.following;
        var reposnum     = json.public_repos;
        
        if(fullname == undefined) { fullname = username; }
        
        var outhtml = '<div class = "row-fluid myrow">';
        outhtml = outhtml + '<div class="col-md-4">';
        outhtml =  outhtml + '<div class="ghcontent"><div class="avi"><a href="'+profileurl+'" target="_blank"><img src="'+aviurl+'" width="80" height="80" alt="'+username+'"></a></div>';
        outhtml = outhtml + '<p class="lead">'+fullname+' <span><a href="'+profileurl+'" target="_blank"><span class="octicon octicon-mark-github"></span></a></span></p>';
        outhtml = outhtml + '<p class="follower">Followers: '+followersnum+' - Following: '+followingnum+'<br>Repos: '+reposnum+'</p></div></div>';
        
        outhtml = outhtml + '<div class="col-md-4"><span class="pull-right">';
        outhtml = outhtml + '<p>Add another repository by <strong>'+ username +'</strong>, if not listed:</p>';
        outhtml = outhtml + '<div class="input-group">';
        outhtml = outhtml +  '<input class="form-control" type="text" name="addrepo"  id="addrepo" placeholder="Other Repo: Username/Reponame" />'
        outhtml = outhtml + '<span class="input-group-btn"><button type="button" class="btn btn-danger custbtn addbtn" id="addbtn">  <i class="fa fa-angle-right" style="font-weight:bold"></i></button></span>';
        outhtml = outhtml + '</div></div>';
        
        outhtml = outhtml + '<div class="col-md-4"><span class="pull-right">';
        outhtml = outhtml + '<div class="input-group">';
        outhtml = outhtml +  '<input class="form-control" type="text" name="searchrepo"  id="searchrepo" placeholder="Search in repository list" />'
        outhtml = outhtml + '<span class="input-group-btn"><button type="button" class="btn btn-danger custbtn" id="searchbtn">  <i class="fa fa-search"></i></button></span>';
        outhtml = outhtml + '</div></div></div>';
        
               
        var repositories = [],repositories1,repositories2,repositories3;
        var repositories1new = [];
        var repositories3new = [];
        var repourls = [];
        	
        var orgs;
        var async1 = $.getJSON(repouri, function(json){
          	repositories1 = json; 
        }); 
        
        var async2 = $.getJSON(repouri2, function(json){
        	repositories2 = json;  
    	});   

        var async3 = $.getJSON(repoorguri, function(json){
            repositories3 = [];
     		orgs = json;
    	  	$.each(orgs, function(index) {  
    	  		$.getJSON(orgs[index].repos_url, function(json){
        			repositories3 = json; 
        		}); 
    	  	});
        }); 
        
        $.when(async3, async2, async1).done(function() {

        	if(repositories2 != undefined) {
        		$.each(repositories2, function(index) {
        			repourls.push(repositories2[index].html_url);
        		});
        	}
        	if(repositories1 != undefined) {
        		$.each(repositories1, function(index) {
        			if ($.inArray(repositories1[index].html_url, repourls) === -1) {
        				repourls.push(repositories1[index].html_url);
        				repositories1new.push(repositories1[index]);
    				}
        		});
        	}
        	
        	if(repositories3 != undefined) {
        		$.each(repositories3, function(index) {
        			if ($.inArray(repositories3[index].html_url, repourls) === -1) {
        				repourls.push(repositories3[index].html_url);
        				repositories3new.push(repositories3[index]);
    				}
        		});
        	}
        	
        	outputPageContent();    
        }); 
        
        
        function outputPageContent() {
        
          outhtml = outhtml + '<hr style="background-color:rgba(0,0,0,0.6)"/>';
          outhtml = outhtml + '<div class="repolist mainrepolist clearfix">';

		  	outhtml = outhtml + '<div class="repolist addedrepo clearfix" style="display:none">';
			outhtml = outhtml + '<p>Added Repositories:</p>';
          	outhtml = outhtml + '<ul>';
           	outhtml = outhtml + '</ul></div>'; 
           				
          if(repositories1new.length == 0 && repositories3new.length == 0 && repositories2.length == 0) { outhtml = outhtml + '<p>No repos!</p></div>'; }

          if(repositories1new.length == 0) { }
          else {
                    outhtml = outhtml + '<div class="repolist clearfix">';

            outhtml = outhtml + '<p> <strong>' +  fullname +"</strong>'s watched repositories:</p>";
          	outhtml = outhtml + '<ul>';
            $.each(repositories1new, function(index) {
            //outhtml = outhtml + '<li><a href="commit.html?owner='+ repositories[index].owner.login + '&reponame=' + repositories[index].name +'" class = "btn btn-danger reponame" id = "' + repositories[index].full_name +'"><span class="octicon octicon-repo"></span>&nbsp;<sub>'+ repositories[index].owner.login + '</sub>&nbsp;' + repositories[index].name + '</a></li>';
        	outhtml = outhtml + '<li><button type="button" class = "amt btn btn-danger reponame" id = "' + repositories1new[index].full_name +'" data-toggle="modal" data-target=".modal-survey"><span class="octicon octicon-repo"></span>&nbsp;<sub>'+ repositories1new[index].owner.login + '</sub>&nbsp;' + repositories1new[index].name + '</button></li>';
            });
            outhtml = outhtml + '</ul></div>'; 
          }
          
            if(repositories2.length == 0) { }
          else {
            outhtml = outhtml + '<div class="repolist clearfix">';
            outhtml = outhtml + '<p><strong>' +  fullname +"</strong>'s repositories:</p>";
          	outhtml = outhtml + '<ul>';
            $.each(repositories2, function(index) {
            //outhtml = outhtml + '<li><a href="commit.html?owner='+ repositories[index].owner.login + '&reponame=' + repositories[index].name +'" class = "btn btn-danger reponame" id = "' + repositories[index].full_name +'"><span class="octicon octicon-repo"></span>&nbsp;<sub>'+ repositories[index].owner.login + '</sub>&nbsp;' + repositories[index].name + '</a></li>';
        	outhtml = outhtml + '<li><button type="button" class = "amt btn btn-danger reponame" id = "' + repositories2[index].full_name +'" data-toggle="modal" data-target=".modal-survey"><span class="octicon octicon-repo"></span>&nbsp;<sub>'+ repositories2[index].owner.login + '</sub>&nbsp;' + repositories2[index].name + '</button></li>';
            });
            outhtml = outhtml + '</ul></div>'; 
          }
          
            if(repositories3new.length == 0) { }
          else {
            outhtml = outhtml + '<div class="repolist clearfix">';
            outhtml = outhtml + '<p> Repositories from <Strong>' +  fullname +"</strong>'s organizations:</p>";
          	outhtml = outhtml + '<ul>';
            $.each(repositories3new, function(index) {
            //outhtml = outhtml + '<li><a href="commit.html?owner='+ repositories[index].owner.login + '&reponame=' + repositories[index].name +'" class = "btn btn-danger reponame" id = "' + repositories[index].full_name +'"><span class="octicon octicon-repo"></span>&nbsp;<sub>'+ repositories[index].owner.login + '</sub>&nbsp;' + repositories[index].name + '</a></li>';
        	outhtml = outhtml + '<li><button type="button" class = "amt btn btn-danger reponame" id = "' + repositories3new[index].full_name +'" data-toggle="modal" data-target=".modal-survey"><span class="octicon octicon-repo"></span>&nbsp;<sub>'+ repositories3new[index].owner.login + '</sub>&nbsp;' + repositories3new[index].name + '</button></li>';
            });
            outhtml = outhtml + '</ul>'; 
            outhtml = outhtml + '</ul></div>'; 
          }
          
                      outhtml = outhtml + '</div>'; 
          $('#ghapidata').html(outhtml);
           
            $('#searchbtn').on('click', function(e){
    			e.preventDefault();
    			var reponame = $('#searchrepo').val();
   			 	$(".btn.btn-danger.reponame").each(function() {
          	 	var currentId = $(this).attr('id');
          	 	if(currentId.toLowerCase().indexOf(reponame.toLowerCase()) <= -1) {
          	 		$(this).hide();
          	 	}
          		});
    		});
    		
    		$('#searchrepo').keyup(function(e){
    			e.preventDefault();
    			var reponame = $('#searchrepo').val();
   			 	$(".btn.btn-danger.reponame").each(function() {
          	 	var currentId = $(this).attr('id');
          	 	if(currentId.toLowerCase().indexOf(reponame.toLowerCase()) <= -1) {
          	 		$(this).hide();
          	 	}else {
          	 		$(this).show();

          	 	}
          		});
    		});
    		
    		$('#searchrepo').on('click', function(e){
    			e.preventDefault();
   			 	$(".btn.btn-danger.reponame").each(function() {
          	 		$(this).show();
          		});
    		});
    		
    		$('#addrepo').val(username+"/");
    		
    		 $('#addrepo').keypress(function(e) {
  				if (e.keyCode == 13 ) {
  		    		e.preventDefault();
    				addbtnfunc();
  				}
  			});
  	
    		$('#addbtn').on('click', function(e){
    			e.preventDefault();	
    			addbtnfunc();
    		});
    		
    		function addbtnfunc(){
    			requri = 'https://api.github.com/repos/'+$('#addrepo').val();
    			
    			requestJSON(requri, function(json) {
      			if(json.message == "Not Found") {
      				$('.addbtn').popover({html: true,trigger: 'manual', container: 'body'});
      				$('.addbtn').attr("data-toggle","popover");
    				$('.addbtn').attr("data-trigger","focus");
    				$('.addbtn').attr("data-placement","right");
    				$('.addbtn').attr("data-original-title", "Doesn't Exist");
    				$('.addbtn').attr("data-content","Repository doesn't exist, please check format 'Username/Reponame'.");
        			$('.addbtn').popover("show");
        			 setTimeout(function() {$('.addbtn').popover('destroy')},3000);

    			}else{
    				$('.addbtn').popover("hide");
    				$('.addedrepo').css("display","block");
    				outhtml = '<li><button type="button" class = "amt btn btn-danger reponame" id = "' + json.full_name +'" data-toggle="modal" data-target=".modal-survey"><span class="octicon octicon-repo"></span>&nbsp;<sub>'+ json.owner.login + '</sub>&nbsp;' + json.name + '</button></li>';
           			$('.addedrepo ul').prepend(outhtml);
           			$('.reponame').on('click', function(e){
    			var fullname = $(this).attr("id");
    			var ids = fullname.split("/");
    			ids[0] = ids[0].toLowerCase();
    			ids[1] = ids[1].toLowerCase();
    			glbusername = ids[0];
    			glbreponame = ids[1];
    			sendAjaxPost(ids[0],ids[1]);
				sendAjaxStatus(ids[0],ids[1]);
    		});
    				
    			}
    			});
    		}
    		
    		$('.reponame').on('click', function(e){
    			var fullname = $(this).attr("id");
    			var ids = fullname.split("/");
    			ids[0] = ids[0].toLowerCase();
    			ids[1] = ids[1].toLowerCase();
    			glbusername = ids[0];
    			glbreponame = ids[1];
    			sendAjaxPost(ids[0],ids[1]);
				sendAjaxStatus(ids[0],ids[1]);
    		});
        } // end outputPageContent()
      } // end else statement
    }); // end requestJSON Ajax call
  }; // end click event handler
   
  var que1comment = "", que2comment="", que3comment=""; 
  
  //Not required anymore as now just dismissing the modal, not closing it.
  /*$('.presurveyclose').on('click', function(e){
  	que1comment = $('#que1comment').val();
  	que2comment = $('#que2comment').val();
  	que3comment = $('#que3comment').val();
  });
  
  $('.reponame').on('click', function(e){
   	$('#que1comment').val(que1comment);
  	$('#que2comment').val(que2comment);
  	$('#que3comment').val(que3comment);
  });*/
      
  $('#whymonitor').on('click', function(e){
  	$('.whymonitor').css("display","block");
  }); 
  
  $('#whymonitor1').on('click', function(e){
  	$('.whymonitor').css("display","block");
  });
     
   $('#whynotmonitor').on('click', function(e){
  	$('.whymonitor').css("display","none");
  }); 
  
  function requestJSON(url, callback) {
    $.ajax({
      url: url,
      complete: function(xhr) {
        callback.call(null, xhr.responseJSON);
      }
    });
      }
   
   //For building model
    function sendAjaxPost(username, reponame) {

    $('.gotoanothermodal').html('<i class="fa fa-spinner fa-pulse" style="color:white;"></i>');
    $('.gotoanothermodal').removeAttr("data-target");
    $('.gotoanothermodal').removeAttr("data-dismiss");
    $('.reposizeinfo').html('');
    $('.tooltip-toolong').show();
    $('.pleasewait').show();



    var CommitIn = new Object();
    CommitIn.username = username;
    CommitIn.reponame = reponame;
    CommitIn.commitids = [];
    
    //console.log(''+serverurl+':8080/UnusualGitCommit/unusualcommitsurvey');
 
    $.ajax({
        url: 'http://'+serverurl+':8080/UnusualGitCommit/unusualcommitsurvey',
        type: 'POST',
        dataType: 'json',
		crossDomain: true,
        data: JSON.stringify(CommitIn),
        contentType: 'application/json',
        mimeType: 'application/json',
 
        success: function (data) {
        	if(glbusername == data[0].username && glbreponame == data[0].reponame) {
        		 if(parseInt(data[0].numofcommits) >= 40) {
        			$('.reposizeinfo').html('Model for selected repository prepared. Please click <Strong style="color:red">Next</Strong>.');
        			$('.gotoanothermodal').html('Next <i class="fa fa-angle-right" style="color:white;"></i>');
        			$('.gotoanothermodal').attr("data-target",".modal-info-commits");
        			$('.gotoanothermodal').attr("data-dismiss","modal");
        			$('.gotoanothermodal').on('click',function(e){
    					e.preventDefault();	
        				submitsurveydata();
        			});
        			$('.tooltip-toolong').hide();
        			$('.pleasewait').hide();
        			store.session.set('unusualcommitusername', data[0].username);
        			store.session.set('unusualcommitreponame', data[0].reponame);
        			store.session.set('unusualcommitdata',data);
        			store.session.set('unusualcommitpid',participantid);
        			$('.gotocommits').attr("href","commits.html");
        		
         		} else {
         			$(".statusofmodel").text("'" + glbusername + "/" + glbreponame + "':    " + "Very few commits: Please select another");
         			glbusername = "";
					glbreponame = "";
        			$(".reposizeinfo").html('This repository have very few commits, <Strong style="color:red">please select another</Strong>.');
					$(".modelprogress").css("width","20%");
					$(".modelprogress").text("20% Completed");
					$(".modelprogress").text("Very Few Commits");
					$(".modelprogress").removeClass('active');
        		}
        	}
        },
        
        error:function(status,er) {
            //alert("error:  status: "+status+" er:"+er);
        }
    });

}

function sendAjaxStatus(username, reponame) {
	clearInterval(interval); //for other repo if its doing
	$(".modelprogress").css("width","0%");
	$(".modelprogress").text("0% Completed");
	$(".statusofmodel").text("Sending Request to Server");
	$(".modelprogress").addClass('active');
	$(".reposizeinfo").html('');


	var CommitIn = new Object();
		CommitIn.username = username;
		CommitIn.reponame = reponame;
		CommitIn.commitids = null;
		
		var interval = null;
		    
		var ajax_call = function() {
			$.ajax({
		        url: 'http://'+serverurl+':8080/UnusualGitCommit/unusualcommitstatus',
		        type: 'POST',
		        dataType: 'json',
				crossDomain: true,
		        data: JSON.stringify(CommitIn),
		        contentType: 'application/json',
		        mimeType: 'application/json',
		 
		        success: function (msg) {
		        
		        if(glbusername == msg.username && glbreponame == msg.reponame) {
		        	
		        	if(msg.status.indexOf("Completed") > -1) {
		        		clearInterval(interval);
		        	}
				
					if(msg.status.indexOf("Cloning") > -1) {
						$(".modelprogress").css("width","0%");
						$(".modelprogress").text("0% Completed");
						$(".statusofmodel").text("'" + glbusername + "/" + glbreponame + "':    " + msg.status);
					}else if(msg.status.indexOf("Building") > -1) {
						$(".modelprogress").css("width","20%");
						$(".modelprogress").text("20% Completed");
						$(".statusofmodel").text("'" + glbusername + "/" + glbreponame + "':    " + msg.status);
						var numofc = msg.status.split(" ");
						if(numofc.length == 5) {
							var numberofcommits = parseInt(numofc[3]);
							if(numberofcommits < 40) {
								$(".reposizeinfo").html('This repository have very few commits, <Strong style="color:red">please select another</Strong>.');
								$(".statusofmodel").text("'" + glbusername + "/" + glbreponame + "':    " + "Very few commits: Please select another");
								glbusername = "";
								glbreponame = "";
								$(".modelprogress").css("width","20%");
								$(".modelprogress").text("20% Completed");
								$(".modelprogress").text("Very Few Commits");
								$(".modelprogress").removeClass('active');
								clearInterval(interval);

							}
							if(numberofcommits >= 40 && numberofcommits < 3000){
								$(".reposizeinfo").html('This repository should take less than a minute.');
							}
							if(numberofcommits >= 3000 && numberofcommits < 7000)  {
								$(".reposizeinfo").html('This repository should take less than 2 minutes.');
							}
							if(numberofcommits >= 7000 && numberofcommits < 15000)  {
								$(".reposizeinfo").html('This repository should take less than 3 minutes.');
							}
							if(numberofcommits >= 15000 && numberofcommits < 50000)  {
								$(".reposizeinfo").html('This repository is big, it should take less than 5 minutes.');
							}
							if(numberofcommits >= 50000)  {
								$(".reposizeinfo").html('This repository is very big, it should take about 10 minutes.');
							}
						}
					}else if(msg.status.indexOf("Detecting") > -1) {
						$(".modelprogress").css("width","60%");
						$(".modelprogress").text("60% Completed");
						$(".statusofmodel").text("'" + glbusername + "/" + glbreponame + "':    " + msg.status);
					}else if(msg.status.indexOf("Completed") > -1) {
						$(".modelprogress").css("width","100%");
						$(".modelprogress").text("100% Completed");
						$(".modelprogress").removeClass('active');
						$(".statusofmodel").text("'" + glbusername + "/" + glbreponame + "':    " + msg.status);
					}else if(msg.status.indexOf("Fetching") > -1) {
						$(".modelprogress").css("width","40%");
						$(".modelprogress").text("40% Completed");
						$(".statusofmodel").text("'" + glbusername + "/" + glbreponame + "':    " + msg.status);
					}
				}
			
		        },
		        
		        error:function(data,status,er) {
		           // alert("error: "+data+" status: "+status+" er:"+er);
		        }
		    });

		};
	 
		interval = setInterval(ajax_call, 500); // 0.5 sec
}

function submitsurveydata() {
				var outdata = "";
				outdata = outdata + glbusername +"/"+glbreponame+"\n";
    			for(j = 1; j<=5; j++) { 
 					 	var nameofrad = 'que' + j;
 						var que = $('.'+nameofrad).html();
 						que = que.replace('<i class="fa fa-question-circle" style="color:black;"></i> &nbsp;',"");
 						outdata = outdata + que + " \t";
 			 			var ans = $('input[name="'+nameofrad+'"]:checked').val();
 			 			if(ans != undefined) {
 			 				outdata = outdata + ans + " \n";
 			 			}else {
 			 				outdata = outdata + "-" + " \n";
 			 			}
 			 	 }
 			 	 for(j = 6; j <= 7; j++) {
 			 	 	var nameofrad = 'que' + j;
 						var que = $('.'+nameofrad).html();
 						que = que.replace('<i class="fa fa-question-circle" style="color:black;"></i> &nbsp;',"");
 						outdata = outdata + que + " \t";
 			 			if($('#que'+j+'comment').val() == "") {
 			 	 	 		outdata = outdata + "-" + " \n";
 			 			}else {
 			 	 			outdata = outdata + $('#que'+j+'comment').val().split('\n').join(' ') + " \n";
 			 	 		}
 			 	 }
				
				 outdata = outdata + Date.now() +"\n"; 			 	 
 			 	 
 			 	 var surveyclass = new Object();
 			 	 surveyclass.participantid = participantid;
 			 	 surveyclass.data = outdata;
 			 	 
 			 	    $.ajax({
        url: 'http://'+serverurl+':8080/UnusualGitCommit/presurvey',
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