$(document).ready(function(){
  
        $(".send").click(function(){
          var text=$('.cont').val();
              
            
          $.post("/Send",{text:text}, function(data){
            if(data==='done')
              {
                alert("login success");
              }
          });
	  $('.chatbox').append('<p>'+text+'</p>');
	  $('.cont').val('');
        });
});
