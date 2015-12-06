$(document).ready(function(){
  var socket = io();
  $.post('/chat/label',function(data){
     var number = data.label;
     socket.on('Getmessage',function(data){
        if(data.number==number){
          $('.chatbox').append('<p>'+data.text); 
	}
     });
     var text = '';
     var send = function(){
      text=$('.cont').val();
      socket.emit('Sendmessage',{user:'test_user',text:text,number:number});
      $('.cont').val('');
    };
    $(".send").click(send);
    $('.cont').keypress(function(event){
      if(event.keyCode == 13){
	send();
      }
    });
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
