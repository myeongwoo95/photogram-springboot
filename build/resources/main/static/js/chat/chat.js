$(document).ready(function(){

    let ProfileImageUrl;

    function getUserProfile(){
        const userId = $("#principalId").val();
        $.ajax({
            type: "get",
            url: "/api/v1/users/" + userId,
            dataType: "json"
        }).done(res => {
            console.log("유저정보 불러오기 성공", res);
            ProfileImageUrl = res.data.profileImageUrl;
        }).fail(error => {
            console.log("유저정보 불러오기 에러", error);
        });
    }getUserProfile();

    const websocket = new WebSocket("ws://localhost:8080/ws/chat");

    websocket.onmessage = onMessage;
    websocket.onopen = onOpen;
    websocket.onclose = onClose;

    // 메세지 전송
    $(".btn-sending-message").on("click", function(e){
        e.preventDefault();

        let data = $(".text-box__textarea").val();
        let userId = $("#principalId").val();

        send(userId + ":" + ProfileImageUrl + ":" + data);

        // 뒤처리 작업
        $(".text-box__textarea").val("");
        $(".emoji-heart").show();
        $(".emoji-image").show();
        $(".btn-sending-message").hide();
        $(".emoticon-wrapper").remove();
    });

    $(document).on("click", "#disconn", function(e){
        disconnect();
    });

    function send(msg){
        console.log(msg);
        websocket.send(msg);
    }

    //채팅창에서 나갔을 때
    function onClose(evt) {
//        websocket.send();
    }

    //채팅창에 들어왔을 때
    function onOpen(evt) {
//        websocket.send();
    }

    function onMessage(msg) {

        console.log(msg);

        var data = msg.data;
        var arr = data.split(":");

        for(var i=0; i<arr.length; i++){
            console.log('arr[' + i + ']: ' + arr[i]);
        }

        // 현재 세션에 로그인 한 사람
        var cur_session = $("#principalId").val();

        // 메세지에서 정보 뽑기
        var sessionId = arr[0];
        var profileImageUrl = arr[1];
        var message = arr[2];

        if(sessionId == cur_session){
            if($(".chat-box > div").last().hasClass("my-message")){
                $(".chat-box > div").last().children("img").remove();
                $(".chat-box > div").last().css("margin-right", "24px");
            }

            let item = `<div class="chat-item-box chat-box__my-chat my-message">
                                <img src="/upload/s_${profileImageUrl}" alt="profile" onerror="this.src='/images/Avatar.jpg'">
                                <span>${message}</span>

                                <div class="content-option-box-wrapper">
                                    <i class="fas fa-ellipsis-h btn-content-options"></i>

                                    <div class="content-option-box">
                                        <span class="btn-message-like">좋아요</span>
                                        <span class="btn-message-copy">복사</span>
                                        <span class="btn-message-report">신고</span>
                                    </div>
                                </div>
                            </div>`;

            $(".chat-box").append(item);

            //스크롤 맨 아래로 내리기
            $('.chat-box').scrollTop($('.chat-box')[0].scrollHeight);

        }
        else{

            if($(".chat-box > div").last().hasClass(`${sessionId}`)){
                $(".chat-box > div").last().children("img").remove();
                $(".chat-box > div").last().css("margin-left", "24px");
            }

            let item = `<div class="chat-item-box chat-box__opponent-chat ${sessionId}">
                <img src="/upload/s_${profileImageUrl}" alt="profile" onerror="this.src='/images/Avatar.jpg'">
                <span>${message}</span>

                <div class="content-option-box-wrapper">
                    <i class="fas fa-ellipsis-h btn-content-options"></i>

                    <div class="content-option-box">
                        <span class="btn-message-like">좋아요</span>
                        <span class="btn-message-copy">복사</span>
                        <span class="btn-message-report">신고</span>
                    </div>
                </div>
            </div>`;

            $(".chat-box").append(item);

            //스크롤 맨 아래로 내리기
            $('.chat-box').scrollTop($('.chat-box')[0].scrollHeight);
        }
    }

    // 이모지 클릭 시 해당 이모지 textarea에 삽입
    $(document).on("click", ".emoticon-item", function(){
        let data = $(this).text();
        let dataTextArea = $(".text-box__textarea").val();
     
        $(".text-box__textarea").val(dataTextArea+data)
    })

    // textarea에 focus시 이모지 박스 닫기
    $(".text-box__textarea").on("focus", function(){
        $(".emoticon-wrapper").remove();
    })

    // 메세지 hover, leave 했을때 option dotdotdot 보여주고 숨기기
    $(document).on("mouseover", ".chat-item-box",function () {
        $(this).children(".content-option-box-wrapper").children("i").css("display", "inline");
    });

    $(document).on("mouseout", ".chat-item-box",function () {
        if($(this).children(".content-option-box-wrapper").children("i").next().css("display") == "none"){
            $(this).children(".content-option-box-wrapper").children("i").css("display", "none");
        }
    });

    // 메세지 옵션
    $(document).on("click", ".btn-content-options", function(){
        if($(this).next().css("display") == "none"){
            $(this).css("display", "block")
            $(this).css("color", "#333")
            $(this).next().css("display", "flex");
        }else{
            $(this).css("display", "none")
            $(this).css("color", "#dbdbdb")
            $(this).next().css("display", "none");
        }
    });

    // 파일 전송
    $(".emoji-image").on("click", function(){
        $(".text-box__input-file").trigger("click");

        //스크롤 맨 아래로 내리기
        $('.chat-box').scrollTop($('.chat-box')[0].scrollHeight);
    })

    // btn 메세지 좋아요
    $(document).on("click", ".btn-message-like", function(){
        alert("test1")
    })

    // btn 메세지 복사
    $(document).on("click", ".btn-message-copy", function(){
        alert("test2")
    })

    // btn 메세지 신고
    $(document).on("click", ".btn-message-report", function(){
        alert("복사 되었습니다.")
    })

    // 하트 전송
    $(".emoji-heart").on("click", function(){
        if($(".chat-box > div").last().hasClass("last-my-message")){
            $(".chat-box > div").last().children("img").remove();
            $(".chat-box > div").last().css("margin-right", "24px");
        }

        let message = `<div class="chat-box__my-chat last-my-message">
                            <img src="/images/insta2.jpg" alt="profile">
                            <span class="emoji-heart-message">❤️</span>

                            <div class="content-option-box-wrapper">
                                <i class="fas fa-ellipsis-h btn-content-options"></i>

                                <div class="content-option-box">
                                    <span class="btn-message-like">좋아요</span>
                                    <span class="btn-message-copy">복사</span>
                                    <span class="btn-message-report">신고</span>
                                </div>
                            </div>
                        </div>`;
        $(".chat-box").append(message);

        //스크롤 맨 아래로 내리기
        $('.chat-box').scrollTop($('.chat-box')[0].scrollHeight);
    })

    //textarea에 글자를 입력했을 경우 button 보내기 보이기
    $(".text-box__textarea").on("change keyup paste", function(){
        if($(".text-box__textarea").val()){
            $(".emoji-heart").hide();
            $(".emoji-image").hide();
            $(".btn-sending-message").show();
        }else{
            $(".emoji-heart").show();
            $(".emoji-image").show();
            $(".btn-sending-message").hide();
        }
    })

    // 채팅 유저 추천 선택 추가
    $(".red-friend-item").change(function(){
       
        if($(this).is(":checked")){
            let data = $(this).prev().children(".user-item__id").text();
            let div = `<div class="invite-member-item ${data}">
                            <span>${data}</span>
                            <i data-id="${data}" class="btn-cancel-chat-member fas fa-times"></i>
                        </div>`;
            
            $(".invite-member-list").append(div);
            $(".search-friend-input").val("");
            $(".rec-users").show();
            $(".searched-users").hide();

        }else{
            let dataId = $(this).attr("data-id");
            $(".invite-member-list").children(`.${dataId}`).remove();
        }
    })

    // 채팅 유저 선택 삭제
    $(document).on("click",".btn-cancel-chat-member",function(){
        $(this).parent().remove();
        let data = $(this).attr("data-id");

        $(`.red-friend-item[data-id=${data}]`).prop("checked", false);
    })

    // 채팅으로 이동
    $(document).on("click", ".chat-item", function(){
        if($(this).hasClass("active")){
            return;
        }

        $(".chat-list").children().removeClass("active")

        //비동기 api로직

        $(this).addClass("active");
        $(".chat-wrapper__right__new-message").hide();
        $(".chat-wrapper__right__exist-message").show();
        $(".details-info").hide();
    })

    // 1초뒤에 실행되어야함.
    $(".search-friend-input").on("change keyup paste", function(){
        //api 로직

        if($(this).val()){
            $(".rec-users").hide();
            $(".searched-users").show();
            
        }else{
            $(".rec-users").show();
            $(".searched-users").hide();
        }
    })

    // new Message 모달 켜기
    $(".btn-newMessage").on("click", function(){
        $(".modal-newMessage-wrapper").css("display", "flex");
    })

    // new make chat room
    $(".btn-make-newMessage").on("click", function(){


        // if($(".invite-member-list").children(".invite-member-item")){
        //     alert("존재함")
        // }else{
        //     alert("존재안함")
        // }

        alert("api 로직 및 대화방 만들기")
        // 추천목록에서 체크한거 해제, rec-users div 안에 user-item들의 input!
        $(".modal-newMessage-wrapper").hide();

        $(".chat-wrapper__right__new-message").hide();
        $(".chat-wrapper__right__exist-message").show();
        $(".details-info").hide();

        let divItem = `<div class="chat-item">
                            <img src="/images/insta1.jpg" alt="profile">
                            <div>
                                <span>Asia posdifjw 님</span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>`;
    
        $(".invite-member-list").html("")
        $(".invite-member-list").append(`<h3 class="mb-10">받는 사람:</h3>`);
        $(".chat-list").append(divItem);
    })

    // new Message 모달 닫기
    $(".btn-close-modal-newMessage").on("click", function(){
        $(".modal-newMessage-wrapper").hide();
        $(".search-friend-input").val("");
        $(".invite-member-list").html("")
        $(".invite-member-list").append(`<h3 class="mb-10">받는 사람:</h3>`);
        $(".red-friend-item").prop("checked", false);
        $(".rec-users").show();
        $(".searched-users").hide();
    })

    // Textarea 높이 자동조절
    $('.text-box__textarea').keyup(function(e) {
        $(this).css('height', 'auto');
        $(this).height(this.scrollHeight);
    });

    // 채팅에서 -> 상세정보 전환
    $(".btn-change-details-info").on("click", function(){
        $(".chat-wrapper__right__exist-message").hide();
        $(".details-info").show();
    })

    // 상세정보에서 -> 채팅 전환
    $(".btn-change-exist-message").on("click", function(){
        $(".chat-wrapper__right__exist-message").show();
        $(".details-info").hide();
    })

    // 채팅 삭제
    $(".btn-delete-chatting").on("click", function(){
        $(".modal-deleteChat-wrapper").css("display", "flex");
    })
    $(".btn-chat-delete").on("click", function(){
        alert("채팅삭제 로직");
        $(".modal-deleteChat-wrapper").hide();
    })
    $(".btn-close-modal-deleteChat").on("click", function(){
        $(".modal-deleteChat-wrapper").hide();
    })

    // 차단 
    $(".btn-block-user").on("click", function(){
        $(".modal-blockUser-wrapper").css("display", "flex");
    })
    $(".btn-blockUser").on("click", function(){
        alert("api 로직");
        $(".modal-blockUser-wrapper").hide();
    })
    $(".btn-close-blockUser").on("click", function(){
        $(".modal-blockUser-wrapper").hide();
    })

    // 신고
    $(".btn-sue").on("click", function(){
        $(".modal-reportList-wrapper").css("display", "flex");
    })
    $(".cancel-reportList").on("click", function(){
        $(".modal-reportList-wrapper").hide();
    })
    $(".modal-reportList ul li").on("click", function(){
        $(".modal-reportList-wrapper").hide();
        $(".modal-reported-wrapper").css("display", "flex");
    })
    $(".btn-close-reported").on("click", function(){
        $(".modal-reported-wrapper").hide();
    })
});
