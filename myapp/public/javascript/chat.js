$(document).ready(function(){

     $.post('/chat/label',function(data){
        var number = data.label;
        var getMessage = function(){
	    var d = new Date();
	    $.post('/chat/message',{number:number,time:d.getTime()},function(datas){
	         for(var index in datas){
		 var data = datas[index];
		 console.log(data.text);
	         $('.chatbox').append('<p>'+data.text+'</p>');
		 }
	    });
	};   
	setInterval(getMessage,1000);
	var text = '';
	var send = function(){
	     var d = new Date();
	     text=$('.cont').val();
	     $.post('/Send',{text:text,user:'user_test',number:number,time:d.getTime()},function(data){
	        console.log('Send successnumber');
	     });
	     $('.cont').val('');
	};
        $(".send").click(send);
	$('.cont').keypress(function(event){
	     if(event.keyCode == 13){
	        send();
	     }	
	  });
	$("#invite-ask").dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			"Accept" : function(){
				$(this).dialog("close");
			},
			"Hell no": function(){
				$(this).dialog("close");
			}
		},
		close: function(event, ui){window.location.href = "/user"}
	});
	$("#invite").click(function(){
		$.post('/chat/invite', function(){
			console.log('inviting');
		});
	});
	$("#leave").click(function(){
		$("#invite-ask").dialog("open");
		$.post('/chat/leave', function(){
			console.log('leave');
		});
	});
    });
});
