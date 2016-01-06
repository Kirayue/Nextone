$(document).ready(function(){
     $.post('/userdata', function(userdata){
     	$('#username').text(userdata.name);
	$("#make-score").dialog({
		autoOpen:false,
		modal: true,
		buttons: {
			"Confirm" : function(){
				$(this).dialog("close");
			}
		},
		close: function(event, ui){window.location.href = "/user"}
	});
	$("#score").dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			"Accept" : function(){
				$("#make-score").dialog("open");
			},
			"Hell no": function(){
				$(this).dialog("close");
			}
		},
		close: function(event, ui){window.location.href = "/user"}
	});
	$("#invite-ask").dialog({
		autoOpen: false,
		modal: false
	});
	$("#leave").click(function(){
		$("#score").dialog("open");
		$.post('/chat/leave', function(){
			console.log('leave');
		});
	});
	$('#invite').click(function(){
		$("#invite-ask").dialog("open");
		$.post('/chat/invite', function(roommate){
			console.log('imagine one');
		});
		$(this).unbind();
	});
     });
     $.post('/chat/label',function(data){
       //socket.io 
       // var socket = io();

       var chatroom = io.connect('luffy.ee.ncku.edu.tw:8104/chatroom'); 

       

	var number = data.label;
	chatroom.on('Getmessage', function(data){
		if(data.number==number){
			$('.chatbox').append('<p>'+data.text);
		}
	});
	var text = '';
	var send = function(){
	     text=$('.cont').val();
	     chatroom.emit('Sendmessage',{user:'test_user',text:text,number:number});
	     $('.cont').val('');
	};
        $(".send").click(send);
	$('.cont').keypress(function(event){
	     if(event.keyCode == 13){
	        send();
	     }	
	});
      });
      $('.starbox').starbox({
      	average: 0.5,
	changeable: 'once',
	autoUpdateAverage: true,
	ghosting: true
	});
});
