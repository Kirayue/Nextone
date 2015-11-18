$(document).ready(function(){
        var getMessage = function(){
	    $.post('/chat/message',function(data){
	         $('.chatbox').append('<p>'+data+'</p>');
	    });
	};   

	setInterval(getMessage,5000);
	var text = '';
	var send = function(){
	     text=$('.cont').val();
	     $.post('/Send',{text:text},function(data){
	        console.log('Successly send!');
	     });
	     $('.cont').val('');
	};
        $(".send").click(send);
	$('.cont').keypress(function(event){
	     if(event.keyCode == 13){
	        send();
	     }
	
	});
});
