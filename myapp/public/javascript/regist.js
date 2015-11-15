/*global $ */
$(document).ready(function() {         
      $("#signup button[type='submit']").click(function(e){
          var username = $('#signup #username').val();
          var pw = $('#signup #password').val();
          var email = $('#signup #emai').val();
	  e.preventDefault();

          $.ajax({
              url:'/Signup' ,
              data: 'username=' + username + '&password=' + pw +'&email=' + email,
              type: "POST",
              dataType: 'json',
	      cache: false,

              success:function(){
                console.log('ok');
          },
        });
      });


      $("#login input[type='submit']").click(function(e){
          var username = $('#login #username').val();
          var password = $('#login #password').val();
          
	  e.preventDefault();

          $.ajax({
              url:'/login' ,
              data: 'username=' + username + '&password=' + password,
              type: "POST",
              dataType: 'json',
	      cache: false,
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
