  <div class="pagehead repohead instapaper_ignore readability-menu">
     

      <div class="container">
        
        <h1 itemscope itemtype="http://data-vocabulary.org/Breadcrumb" class="entry-title public">
          <span class="mega-octicon octicon-repo"></span>
          <span class="author"></span><!--
       --><span class="path-divider">/</span><!--
       --><strong class="myreponame"></strong>

          <span class="page-context-loader">
            <img alt="" height="16" src="https://assets-cdn.github.com/assets/spinners/octocat-spinner-32-e513294efa576953719e4e2de888dd9cf929b7d62ed8d05f25e731d02452ab6c.gif" width="16" />
          </span>

        </h1>
      </div><!-- /.container -->
    </div><!-- /.repohead -->
    

myfileschanged
myadditions
mydeletions

class="content collapse js-transitionable"
    
    var outhtml = '<li>';
    outhtml = outhtml + '<span class="diffstat right">';
    outhtml = outhtml + '<span class="text-diff-added">';
    outhtml = outhtml + '+' + files[i].additions +  '</span><span class="text-diff-deleted">';
    outhtml = outhtml + '-' + files[i].deletions +  '</span>';
    outhtml = outhtml + '<a href="#diff-' +  files[i].sha;
    outhtml = outhtml + '" class="tooltipped tooltipped-s" aria-label="' + files[i].changes + 'lines changed">';
    outhtml = outhtml + '</a></span>';
    outhtml = outhtml + '<span class="octicon octicon-diff-' + files[i].status + '" title="' + files[i].status + '"></span>';
    outhtml = outhtml + '<a href="#diff-' + files[i].sha + '">' + files[i].filename + '</a>';
    outhtml = outhtml + '</li>';


<div id="files" class="diff-view">
     
     
     
     var outhtml =  '<a name="diff' + files[i].sha + '"></a>';
     outhtml =  outhtml + '<div id="diff-' + index + '" class="file js-details-container">';
     outhtml =  outhtml + '<div class="file-header" data-path="' + files[i].filename + '">';
     outhtml =  outhtml + '<div class="file-actions">';            
     outhtml =  outhtml + '<a href="' + files[i].blob_url +'"class="btn btn-sm tooltipped tooltipped-n" rel="nofollow" aria-label="View the whole file at this commit">View</a>';
     outhtml =  outhtml + '</div><div class="file-info">';
     outhtml =  outhtml + '<span class="diffstat tooltipped tooltipped-e" aria-label="' + files[i].additions + ' additions &amp;' + files[i].deletions + ' deletions">' + files[i].changes + '<span class="diffstat-bar"></span></span>';
     outhtml =  outhtml + '<span class="js-selectable-text" title="' + files[i].filename '">' + files[i].filename + '</span></div></div>';
     outhtml =  outhtml + '<div class="data highlight blob-wrapper"><table class="diff-table  tab-size-8 ">';
     
     var ks = files[i].patch.split("\n");
     $.each(ks, function(k){
              if(k.startsWith('@@')) {
              	outhtml = outhtml + '<tr><td class="blob-code blob-code-inner blob-code-hunk">' + k + '</td></tr>';
              }else if(k.startsWith('+')){
              	outhtml = outhtml + '<tr><td class="blob-code blob-code-addition"><span class="blob-code-inner">'+ k +'</span></td></tr>';
              }else if(k.startsWith('-')){
              	outhtml = outhtml + '<tr><td class="blob-code blob-code-deletion"><span class="blob-code-inner">'+ k +'</span></td></tr>';
              }else {
              	outhtml = outhtml + '<tr><td class="blob-code blob-code-content"><span class="blob-code-inner">'+ k +'</span></td></tr>';
              }
     });   
     outhtml = outhtml + '</table></div></div>';