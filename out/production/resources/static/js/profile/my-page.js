$(document).ready(function(){

    let principalId = $("#principalId").val();

    $(".btn-subscribeApi").on("click", function(e){
        e.preventDefault();

        let toUserId = $(this).data('pageuserid');

        if ($(this).text() === "구독취소") {

            $.ajax({
                type: "delete",
                url: `/api/v1/unsubscribe/${toUserId}`,
                dataType: "json"
            }).done(res => {
                $(this).text("구독하기")
                $(this).css("background", "0");
                $(this).css("border", "1px solid #dbdbdb");
                $(this).css("color", "#333");

                let count = parseInt($(".followerCountValue").text());
                count = count - 1;
                $(".followerCountValue").text(count);

            }).fail(error => {
                console.log("구독 취소하기 실패", error);
            });

        } else {

            $.ajax({
                type: "post",
                url: `/api/v1/subscribe/${toUserId}`,
                dataType: "json"
            }).done(res => {
                $(this).text("구독취소")
                $(this).css("background", "#0095F6");
                $(this).css("border", "0");
                $(this).css("color", "#fff");

                let count = parseInt($(".followerCountValue").text());
                count = count + 1;
                $(".followerCountValue").text(count);
            }).fail(error => {
                console.log("구독하기 실패", error);
            });

        }
    });

    // 탭 전환 
    $(".btn-photo").on("click", function(){
        $(this).addClass("on")
        $(".btn-save").removeClass("on")
        $(".btn-tag").removeClass("on")

        $(".my-content-tab").show();
        $(".my-save-tab").hide();
        $(".tagged-tab").hide();

    })

    $(".btn-save").on("click", function(){
        $(this).addClass("on")
        $(".btn-photo").removeClass("on")
        $(".btn-tag").removeClass("on")

        $(".my-save-tab").show();
        $(".my-content-tab").hide();
        $(".tagged-tab").hide();
    
    })

    $(".btn-tag").on("click", function(){
        $(this).addClass("on")
        $(".btn-photo").removeClass("on")
        $(".btn-save").removeClass("on")

        $(".tagged-tab").show();
        $(".my-content-tab").hide();
        $(".my-save-tab").hide();
    })

     // btn collection
     $(".btn-collection").on("click", function(e){
        e.preventDefault();
        $(".modal-collection-step1-wrapper").css("display", "flex");
    })

    // btn close collection1
    $(".btn-close-collection1").on("click", function(e){
        e.preventDefault();
        $(".modal-collection-step1-wrapper").hide();
        $(".collection-naming").val("");
    })

    // btn close collection2
    $(".btn-close-collection2").on("click", function(e){
        e.preventDefault();
        $(".modal-collection-step2-wrapper").hide();
    })

    // btn back collection2 -> collection2
    $(".btn-back-from2to1").on("click", function(){
        
        $(".modal-collection-step2-wrapper").hide();
        $(".modal-collection-step1-wrapper").css("display", "flex");
    })

    // btn step -> step2
    $(".btn-modal-collection-step2").on("click", function(){
        if($(this).hasClass("disabled")){
            return;
        }else{
            $(".modal-collection-step1-wrapper").hide();
            $(".modal-collection-step2-wrapper").css("display", "flex");
        }
    })

    // 컬렉션 naming시 value값 있을 때와 없을 때 처리
    $(".collection-naming").on("keyup", function(e){
        if(!$(this).val()){
            $(".btn-modal-collection-step2").addClass("disabled");
            $(".btn-modal-collection-step2").css("color", "gray");
        }else{
           
            $(".btn-modal-collection-step2").removeClass("disabled");
            $(".btn-modal-collection-step2").css("color", "#0095F6");
        }
    });

    // image 클릭시 
    $(".photo-item").on("click", function(){
        $(".modal-comment-wrapper").css("display", "flex");
    })

    // btn 팔로워 모달 켜기
    $(".btn-followers-modal-open").on("click", function(){

        $(".modal-mypage-following__user-list").empty();

        let pageUserId = $(this).data("id");

        $.ajax({
            type: "get",
            url: `/api/v1/users/${pageUserId}/followers`,
            dataType: "json"
        }).done(res => {
            console.log(res.data);

            res.data.forEach(user => {
                let item = `<div class="modal-mypage-following__user-list__item">
                                <img src="/upload/s_${user.profileImageUrl}" onerror="this.src='/images/Avatar.jpg'" alt="profile">
                                <div>
                                    <span>${user.username}</span>
                                    <span>${user.name}</span>
                                </div>`;

                                if(!user.equalUserState){ // 동일 유저가 아닐 때 버튼이 만들어져야함
                                    if(user.subscribeState){ // 구독한 상태
                                        item += `<button data-id="${user.id}" class="btn-subscribeApi2">구독취소</button>`;
                                    } else{ // 구독안한 상태
                                        item += `<button data-id="${user.id}" class="btn-subscribeApi2">구독하기</button>`;
                                    }
                                }

                                item += `</div>`;

                $(".modal-mypage-following__user-list").append(item);
            });

        }).fail(error => {
            console.log("구독정보 불러오기 실패", error);
        });

        $(".modal-mypage-following-wrapper").find("h3").text("팔로워")
        $(".modal-mypage-following-wrapper").css("display", "flex");
    })

     // btn 팔로우 모달 켜기
    $(".btn-followings-modal-open").on("click", function(){

        $(".modal-mypage-following__user-list").empty();
        let pageUserId = $(this).data("id");

        $.ajax({
            type: "get",
            url: `/api/v1/users/${pageUserId}/subscribes`,
            dataType: "json"
        }).done(res => {
            console.log(res.data);

            res.data.forEach(user => {
                let item = `<div class="modal-mypage-following__user-list__item">
                                 <img src="/upload/s_${user.profileImageUrl}" onerror="this.src='/images/Avatar.jpg'" alt="profile">
                                 <div>
                                     <span>${user.username}</span>
                                     <span>${user.name}</span>
                                 </div>`;

                                 if(!user.equalUserState){ // 동일 유저가 아닐 때 버튼이 만들어져야함
                                     if(user.subscribeState){ // 구독한 상태
                                         item += `<button data-id="${user.id}" class="btn-subscribeApi2">구독취소</button>`;
                                     } else{ // 구독안한 상태
                                         item += `<button data-id="${user.id}" class="btn-subscribeApi2">구독하기</button>`;
                                     }
                                 }

                                 item += `</div>`;

                $(".modal-mypage-following__user-list").append(item);
            });
        }).fail(error => {
            console.log("구독정보 불러오기 실패", error);
        });

        $(".modal-mypage-following-wrapper").find("h3").text("팔로우");
        $(".modal-mypage-following-wrapper").css("display", "flex");
    })

    $(document).on("click", ".btn-subscribeApi2", function(e){
        e.preventDefault();

        let toUserId = $(this).data('id');

        if ($(this).text() === "구독취소") {

            $.ajax({
                type: "delete",
                url: `/api/v1/unsubscribe/${toUserId}`,
                dataType: "json"
            }).done(res => {
                $(this).text("구독하기")
                $(this).css("background", "0");
                $(this).css("border", "1px solid #dbdbdb");
                $(this).css("color", "#333");
            }).fail(error => {
                console.log("구독 취소하기 실패", error);
            });

        } else {
            $.ajax({
                type: "post",
                url: `/api/v1/subscribe/${toUserId}`,
                dataType: "json"
            }).done(res => {
                $(this).text("구독취소")
                $(this).css("background", "#0095F6");
                $(this).css("border", "0");
                $(this).css("color", "#fff");
            }).fail(error => {
                console.log("구독하기 실패", error);
            });

        }
    });

    // btn 팔로워 모달 끄기
    $(".btn-close-modal-mypage-following").on("click", function(){
        $(".modal-mypage-following-wrapper").hide();
    })

    // btn 설정 톱니바퀴 모달 켜기
    $(".btn-edit-profile-gear").on("click", function(){
        alert("test3")
    })

    //btn 설정 톱니바퀴 모달 끄기

        //btn 로그아웃 run
});