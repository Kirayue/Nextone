/*global $ */
$(document).ready(function() {         
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
