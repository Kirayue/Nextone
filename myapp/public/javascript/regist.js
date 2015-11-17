/*global $ */
$(document).ready(function() {         
      $("#signup button[type='submit']").click(function(e){
          var username = $('#usr').val();
          var pw = $('#pw').val();
          var email = $('#mai').val();
	  e.preventDefault();

          $.ajax({
              url:'/Signup' ,
              data: 'username=' + username + '&pw=' + pw +'&email=' + email,
              type: "POST",
              dataType: 'json',
	      cache: false,

              success:function(){
                console.log('ok');
          },
     
        });
      });
    $(".form2").hide();
    $(".tab1").click(function(){
         $(".form2").hide();
         $(".form1").fadeIn();
  });
    $(".tab2").click(function(){
        $(".form1").hide();
        $(".form2").fadeIn();
    });
});
