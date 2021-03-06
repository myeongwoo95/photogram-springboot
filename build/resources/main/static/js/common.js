//let scrollTop;
//function saveScroll(){
//    scrollTop = $(document).scrollTop();
//}
//
//function scroll(){
//    $(document).scrollTop(scrollTop);
//}

$(document).ready(function(){

    // paging
    const principalId = $("#principalId").val();
    let pageNumOfStoryModalComment = 0;

    // 검색할때 ajax 딜레이용
    var checkAjaxSetTimeout;

    // 파일 업로드 swiper
    var mySwiper = new Swiper ('.file-upload-swiper', {
        pagination: {
            el: '.swiper-pagination',
        },

        navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        },

        scrollbar: {
        el: '.swiper-scrollbar',
        },
        
        observer: true
    });

    // 영역 외 클릭
    $(document).click(function(e){
        //로직추가
    });

    // 헤더 프로필 클릭
    $(".header__profile-picture").on("click", function(){
        if( $(".header__dropdown").css("display") == "none"){
            $(".header__dropdown").css("display", "flex");

            $(".header__notice-box").css("display", "none")
            $(".search-list").css("display", "none");
        }else{
            $(".header__dropdown").css("display", "none");
        }
    })

    // 헤더 알림 클릭 
    $(".notice-heart").on("click", function(){
        $(".header__notice-box").toggle();
        $(".header__dropdown").css("display", "none");
        $(".search-list").css("display", "none");
    })

    // 헤더 검색
    $(".header__search-input").on("keyup", function(){
        const keyword = $(this).val();
        let item = `<img src="/images/loading-spinner.gif"
        style="width: 50%; height: 50%; object-fit: cover; transform: translate(50%, 40%);">`

        $(".search-list").empty();
        $(".search-list").append(item);
        $(".search-list").show();
        $(".header__dropdown").css("display", "none");
        $(".header__notice-box").css("display", "none");

        console.log("테스트")

        clearTimeout(checkAjaxSetTimeout);
        checkAjaxSetTimeout = setTimeout(function(){
            if(keyword != ""){
                $.ajax({
                    type: "get",
                    url: "/api/v1/users/keyword/" + keyword,
                    dataType: "json"
                }).done(res => {
                    console.log("검색 ajax 성공", res);

                    $(".search-list").empty();
                    res.data.forEach((user)=>{
                        item = `<div class="search-item" onclick="location.href = '/user/${user.id}/profile'">
                                    <img src="/upload/s_${user.profileImageUrl}" onerror="this.src='/images/Avatar.jpg'" alt="profile">
                                    <div class="search-item__info">
                                        <span class="mb-5">${user.username}</span>
                                        <span>${user.name}</span>
                                    </div>
                                </div>`;

                        $(".search-list").append(item);
                    });

                    $(".search-list").show();
                }).fail(error => {
                    console.log("검색 ajax 에러", error);
                    $(".search-list").empty();
                    let item = `<p style="color:#8E8E8E; text-align:center; height: 100%; padding-top: 40%;">검색 결과가 없습니다.</p>`;
                    $(".search-list").append(item);
                });

            }
        }, 1500);
    });

    $(document).on("click", ".header__search-btn", function(e){
        e.preventDefault();
    });

    //스토리 게시글 (모달) 켜기
    $(document).on("click", ".content-class, .comment-count", function(e){
        e.preventDefault();

        const imageId = $(this).data("id");
        pageNumOfStoryModalComment = 0;

        $.ajax({
            url: `/api/v1/images/${imageId}`,
            dataType: "json"
        }).done(res => {
            console.log("이미지 모달 로드 성공", res);

            //swiper 이미지 변경
            $(".modal-comment-wrapper .swiper-wrapper").empty();

            res.data.files.forEach(data=>{
                let item = "";

                if(data.type.includes("video")){
                    item += `<div class="swiper-slide">
                                <video src="/uploadImage/${data.fileUrl}" controls></video>
                            </div>`;


                }else{
                    item += `<div class="swiper-slide">
                                <img src="/uploadImage/${data.fileUrl}" alt="picture">
                            </div>`;
                }

                $(".modal-comment-wrapper .swiper-wrapper").append(item);
            });
            comment_swiper_fn();

            // 프로파일 변경
            $(".comment-modal-view__comment-list__header img").attr("src", "/upload/" + res.data.user.profileImageUrl);
            $(".comment-modal-view__comment-list__header span").text(res.data.user.username);

            // btn-content-option 값 설정 (신고 및 팔로우 취소등에 사용)
            $(".comment-modal-view__comment-list__header .btn-content-option").data("id", res.data.id);
            $(".comment-modal-view__comment-list__header .btn-content-option").data("userid", res.data.user.id);
            $(".comment-modal-view__comment-list__header .btn-content-option").data("url", res.data.user.profileImageUrl);
            $(".comment-modal-view__comment-list__header .btn-content-option").data("username", res.data.user.username);

            // description 프로파일 변경
            $(".comment-modal-view__comment-list__body__user img").attr("src", "/upload/" + res.data.user.profileImageUrl);
            $(".comment-modal-view__comment-list__body__user span").text(res.data.user.username);

            $(".comment-modal-view__comment-list__body__caption__description").text(res.data.description);
            $(".comment-modal-view__comment-list__body__caption__tags").text("");

            // 댓글 변경
            $(".comment-modal-view__comment-list__body__commentList").empty();

            //나의 댓글 먼저 출력 후
            $.ajax({
                url: `api/v1/comments/images/${imageId}/users/${principalId}`,
                dataType: "json"
            }).done(res => {
                console.log("나의 댓글 불러오기 성공", res);

                res.data.forEach(comment=> {

                    let profileImageUrl = comment.user.profileImageUrl;
                    let username = comment.user.username;
                    let content = comment.content;
                    let date = (comment.createDate).substr(0,10);
                    let likeCount = comment.likeCommentCount;
                    let commentId = comment.id;

                    let item = `<div class="comment-modal-view__comment-list__body__commentList__item mt-20">`;

                                if(comment.likeCommentState){
                                    item += `<i class="fas fa-heart content-comment-like-modal" data-id="${comment.id}" style="color: rgb(237, 73, 86)"></i>`;
                                }else{
                                    item += `<i class="far fa-heart content-comment-like-modal" data-id="${comment.id}"></i>`
                                }

                                item += `<img src="/upload/${profileImageUrl}" onerror="this.src='/images/Avatar.jpg'" alt="user">
                                     <p class="pl-45">
                                         <span>${username}</span>
                                         ${content}
                                     </p>

                                     <div class="zpw pl-45 mt-10">
                                         <span class="mr-5 cursor-pointer">${date}</span>
                                         <span class="cursor-pointer story-modal-comment-like-count"
                                          data-likecount="${likeCount}" data-id="${comment.id}">좋아요 ${likeCount}개</span>
                                         <i class="fas fa-ellipsis-h modal-comment-dotdotdot cursor-pointer"
                                         data-id="${commentId}" data-commentowner="true"></i>
                                     </div>
                                 </div>`;
                    $(".comment-modal-view__comment-list__body__commentList").prepend(item);
                });

            }).fail(error => {
                console.log("나의 댓글 불러오기 실패", error);
            });

            //모든 댓글 출력(10개씩, 나의 댓글 제외)
            $.ajax({
                url: `api/v1/comments/images/${imageId}/users/except/${principalId}?page=${pageNumOfStoryModalComment}`,
                dataType: "json"
            }).done(res => {
                console.log("모든 댓글 불러오기 성공", res);

                res.data.forEach(comment=> {

                    let profileImageUrl = comment.user.profileImageUrl;
                    let username = comment.user.username;
                    let content = comment.content;
                    let date = (comment.createDate).substr(0,10);
                    let likeCount = comment.likeCommentCount;
                    let commentId = comment.id;

                    let item = `<div class="comment-modal-view__comment-list__body__commentList__item mt-20">`;

                                    if(comment.likeCommentState){
                                        item += `<i class="fas fa-heart content-comment-like-modal" data-id="${comment.id}" style="color: rgb(237, 73, 86)"></i>`;
                                    }else{
                                        item += `<i class="far fa-heart content-comment-like-modal" data-id="${comment.id}"></i>`
                                    }

                                    item += `<img src="/upload/${profileImageUrl}" onerror="this.src='/images/Avatar.jpg'" alt="user">
                                     <p class="pl-45">
                                         <span>${username}</span>
                                         ${content}
                                     </p>

                                     <div class="zpw pl-45 mt-10">
                                         <span class="mr-5 cursor-pointer">${date}</span>
                                         <span class="cursor-pointer story-modal-comment-like-count"
                                         data-likecount="${likeCount}" data-id="${comment.id}">좋아요 ${likeCount}개</span>
                                         <i class="fas fa-ellipsis-h modal-comment-dotdotdot cursor-pointer"
                                         data-id="${commentId}" data-commentowner="false"></i>
                                     </div>
                                 </div>`;

                    $(".comment-modal-view__comment-list__body__commentList").append(item);

                });

                if(res.data.length == 10){
                    $(".modal-comment-wrapper .more-comment-modal").data("id", imageId);
                    $(".modal-comment-wrapper .more-comment-modal").show();
                }else{
                    $(".modal-comment-wrapper .more-comment-modal").hide();
                }

            }).fail(error => {
                console.log("모든 댓글 불러오기 실패", error);
                $(".modal-comment-wrapper .more-comment-modal").hide();
            });

            // 좋아요 관련
            $(".modal-comment-wrapper .content-like-modal").data("id", imageId);
            $(".modal-comment-wrapper .modal-like-count").data("like", res.data.likeCount);
            $(".modal-comment-wrapper .modal-like-count").text("좋아요 " + res.data.likeCount + "개")

            if(res.data.likeState){
                $(".modal-comment-wrapper .content-like-modal").removeClass("far");
                $(".modal-comment-wrapper .content-like-modal").addClass("fas");
                $(".modal-comment-wrapper .content-like-modal").css("color", "#ED4956");
            }else{
                $(".modal-comment-wrapper .content-like-modal").removeClass("fas");
                $(".modal-comment-wrapper .content-like-modal").addClass("far");
                $(".modal-comment-wrapper .content-like-modal").css("color", "#111");
            }

            // 북마크관련
            $(".modal-comment-wrapper .content-bookmark").data("id", imageId);

            if(res.data.bookmarkState){
                $(".modal-comment-wrapper .content-bookmark").removeClass("far");
                $(".modal-comment-wrapper .content-bookmark").addClass("fas");
                $(".modal-comment-wrapper .content-bookmark").css("color", "rgb(51, 51, 51)");
            }else{
                $(".modal-comment-wrapper .content-bookmark").removeClass("fas");
                $(".modal-comment-wrapper .content-bookmark").addClass("far");
            }

            // 게시글 등록날짜 수정
            $(".modal-comment-wrapper .modal-storyDate").text(res.data.createDate.substr(0, 10));

            // 모달 켜기
            $(".modal-comment-wrapper").css("display", "flex");

            // 댓글 업로드 btn에 imageId 값 넣어주기
            $(".btn-comment-upload").data("id", imageId);

        }).fail(error => {
            console.log("이미지 모달 로드 실패", error);
        });

    });

    // 모달 좋아요, 좋아요 취소
    $(document).on("click", ".content-like-modal", function(e){
        e.preventDefault();

        let imageId = $(this).data("id");

        if($(this).hasClass("far")){
            $.ajax({
                type: "post",
                url: `/api/v1/images/${imageId}/likes`,
                dataType: "json"
            }).done(res => {
                // likeCount 증가
                let likeCountStr = $(".modal-like-count").data("like");
                let likeCount = Number(likeCountStr) + 1;
                $(".modal-like-count").data("like", likeCount);
                $(".modal-like-count").text("좋아요 " + likeCount + "개");

                // 모달 하트색깔 변경 작업
                $(this).css("color", "#ED4956");
                $(this).addClass("fas");
                $(this).removeClass("far");

                // 외부 likeCount 증가
                let likeCountStr2 = $(`#imageLikeCount-${imageId}`).data("like");
                let likeCount2 = Number(likeCountStr) + 1;
                $(`#imageLikeCount-${imageId}`).data("like", likeCount);
                $(`#imageLikeCount-${imageId}`).text("좋아요 " + likeCount + "개");

                // 외부 하트색깔 변경 작업
                $(`.content-like[data-id="${imageId}"]`).css("color", "#ED4956");
                $(`.content-like[data-id="${imageId}"]`).addClass("fas");
                $(`.content-like[data-id="${imageId}"]`).removeClass("far");

            }).fail(error => {
                console.log("스토리 모달 좋아요 에러", error);
            });

        }else{
            $.ajax({
                type: "delete",
                url: `/api/v1/images/${imageId}/likes`,
                dataType: "json"
            }).done(res => {
                //likeCount 감소
                let likeCountStr = $(".modal-like-count").data("like");
                let likeCount = Number(likeCountStr) - 1;
                $(".modal-like-count").data("like", likeCount);
                $(".modal-like-count").text("좋아요 " + likeCount + "개");

                // .. .하트색깔 변경 작업
                $(this).css("color", "#111");
                $(this).addClass("far");
                $(this).removeClass("fas");

                // 외부 likeCount 증가
                let likeCountStr2 = $(`#imageLikeCount-${imageId}`).data("like");
                let likeCount2 = Number(likeCountStr) - 1;
                $(`#imageLikeCount-${imageId}`).data("like", likeCount);
                $(`#imageLikeCount-${imageId}`).text("좋아요 " + likeCount + "개");

                // 외부 하트색깔 변경 작업
                $(`.content-like[data-id="${imageId}"]`).css("color", "#111");
                $(`.content-like[data-id="${imageId}"]`).addClass("far");
                $(`.content-like[data-id="${imageId}"]`).removeClass("fas");


            }).fail(error => {
                console.log("스토리 모달 좋아요 취소 에러", error);
            });
        }
    });

    // 모달 댓글 달기
    $(document).on("click", ".btn-comment-upload", function(e){
        e.preventDefault();

        let imageId = $(this).data("id");
        let content = $(this).prev().val();

        if($(this).prev().val() == ""){
           alert("내용이 없습니다.")
           return;
        }

        let data = {
            imageId: imageId,
            content: content
        }

        $.ajax({
            type: "post",
            url: `/api/v1/comment`,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(res => {
            console.log("스토리 모달 댓글 업로드 성공", res);

            let profileImageUrl = res.data.content[0].user.profileImageUrl;
            let username = res.data.content[0].user.username;
            let content = res.data.content[0].content;
            let date = (res.data.content[0].createDate).substr(0,10);
            let likeCount = res.data.content[0].likeCount;

            let commentId = res.data.content[0].id;

            // 모달창에 댓글 추가 및 후속 작업 처리
            let item = `<div class="comment-modal-view__comment-list__body__commentList__item mt-20">
                             <i class="far fa-heart content-comment-like-modal" data-id="${commentId}"></i>
                             <img src="/upload/${profileImageUrl}" onerror="this.src='/images/Avatar.jpg'" alt="user">
                             <p class="pl-45">
                                 <span>${username}</span>
                                 ${content}
                             </p>

                             <div class="zpw pl-45 mt-10">
                                 <span class="mr-5 cursor-pointer">${date}</span>
                                 <span class="cursor-pointer story-modal-comment-like-count"
                                 data-likecount="0" data-id="${commentId}">좋아요 0개</span>
                                 <i class="fas fa-ellipsis-h modal-comment-dotdotdot cursor-pointer"
                                 data-id="${commentId}" data-commentowner="true"></i>
                             </div>
                         </div>`;

            $(".comment-modal-view__comment-list__body__commentList").prepend(item);

            $(".modal-write-comment").val("");

            // index page 일 경우
            if($(document).find("title").text() == "Photogram"){
                itemStoryComment = `<div class="comment-items mt-5">
                             <b class="fw-900">${username}</b>
                             <span>${content}</span>
                             <i class="far fa-heart content-comment-like" data-id="${commentId}"></i>
                         </div>`;

                $(`.comments-list-${imageId}`).prepend(itemStoryComment);
                let commentCountStr = $(`.comment-count-${imageId}`).text();
                let commentCount = Number(commentCountStr) + 1;
                $(`.comment-count-${imageId}`).text(commentCount);
            }

            // explore page 일 경우

            // profile page 일 경우

        }).fail(error => {
            console.log("스토리 모달 댓글 업로드 에러", error);
        });
    });

    // 북마크, 북마크 취소
    $(document).on("click", ".content-bookmark", function(e){
         e.preventDefault();

         const imageId = $(this).data("id");

         if($(this).hasClass("far")){
            $.ajax({
                type: "post",
                url: `/api/v1/images/${imageId}/bookmarks`,
                dataType: "json"
            }).done(res => {
               console.log("북마크 성공", res);

               $(this).css("color", "#333");
               $(this).addClass("fas");
               $(this).removeClass("far");

               // index page 라면
               if($(document).find("title").text() == "Photogram"){
                   $(`.content-bookmark[data-id="${imageId}"]`).css("color", "#333");
                   $(`.content-bookmark[data-id="${imageId}"]`).addClass("fas");
                   $(`.content-bookmark[data-id="${imageId}"]`).removeClass("far");
               }

            }).fail(error => {
                console.log("북마크 에러", error);
            });

         }else{

            $.ajax({
                type: "delete",
                url: `/api/v1/images/${imageId}/bookmarks`,
                dataType: "json"
            }).done(res => {
               console.log("북마크 취소 성공", res);

               $(this).css("color", "");
               $(this).addClass("far");
               $(this).removeClass("fas");

               // index page 라면
               if($(document).find("title").text() == "Photogram"){
                   $(`.content-bookmark[data-id="${imageId}"]`).css("color", "");
                   $(`.content-bookmark[data-id="${imageId}"]`).addClass("far");
                   $(`.content-bookmark[data-id="${imageId}"]`).removeClass("fas");
               }

            }).fail(error => {
                console.log("북마크 취소 에러", error);
            });

         }
    });

    // 모달 댓글 더보기
    $(document).on("click", ".modal-comment-wrapper .more-comment-modal", function(e){
        e.preventDefault();

        const imageId = $(this).data("id");
        pageNumOfStoryModalComment++;

        $.ajax({
            url: `api/v1/comments/images/${imageId}/users/except/${principalId}?page=${pageNumOfStoryModalComment}`,
            dataType: "json"
        }).done(res => {
            console.log("댓글 더 불러오기 성공", res);

            res.data.forEach(comment=> {

                let profileImageUrl = comment.user.profileImageUrl;
                let username = comment.user.username;
                let content = comment.content;
                let date = (comment.createDate).substr(0,10);
                let likeCount = comment.likeCount;

                let item = `<div class="comment-modal-view__comment-list__body__commentList__item mt-20">
                                 <i class="far fa-heart comment-comment-like"></i>
                                 <img src="/upload/${profileImageUrl}" onerror="this.src='/images/Avatar.jpg'" alt="user">
                                 <p class="pl-45">
                                     <span>${username}</span>
                                     ${content}
                                 </p>

                                 <div class="zpw pl-45 mt-10">
                                     <span class="mr-5 cursor-pointer">${date}</span>
                                     <span class="cursor-pointer">좋아요 ${likeCount}개</span>
                                     <i class="fas fa-ellipsis-h modal-comment-dotdotdot cursor-pointer"
                                     data-id="${commentId}" data-commentowner="false"></i>
                                 </div>
                             </div>`;

                $(".comment-modal-view__comment-list__body__commentList").append(item);

            });

            if(res.data.length == 10){
                $(".modal-comment-wrapper .more-comment-modal").data("id", imageId);
                $(".modal-comment-wrapper .more-comment-modal").show();
            }else{
                $(".modal-comment-wrapper .more-comment-modal").hide();
            }

        }).fail(error => {
            console.log("댓글 더 불러오기 실패", error);
            $(".modal-comment-wrapper .more-comment-modal").hide();
        });

    });

    function comment_swiper_fn(){
        // 사진 상세보기 swiper
        const swiperComment = new Swiper('.comment-swiper', {
            direction: 'horizontal',
            loop: false,

            pagination: {
                el: '.swiper-pagination',
            },

            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

            observer: true,
            observeParents: true,
            watchOverflow : true
        });
    }

    // btn 스토리 게시글 (모달) 닫기 
    $(".cancel-comment-modal").on("click", function(e){
        e.preventDefault();

        $(".modal-comment-wrapper").hide();

        // 댓글 창 비워주기
        $(".modal-write-comment").val("");
       
        // 이모지 박스 닫아주기
        $(".emoticon-wrapper").remove();
    });

    // 댓글 좋아요, 좋아요 취소
    $(document).on("click", ".content-comment-like, .content-comment-like-modal", function(e){
        e.preventDefault();

        const commentId = $(this).data("id");

        if($(this).hasClass("far")){
            $.ajax({
                type: "post",
                url: `/api/v1/comments/${commentId}/likes`,
                dataType: "json"
            }).done(res => {
               console.log("댓글 좋아요 성공", res);

               $(this).css("color", "#ED4956");
               $(this).addClass("fas");
               $(this).removeClass("far");

               // 모달이라면
               if($(this).hasClass("content-comment-like-modal")){
                   let likeCountStr = $(`.story-modal-comment-like-count[data-id="${commentId}"]`).data("likecount");
                   let likeCount = Number(likeCountStr) + 1;
                   $(`.story-modal-comment-like-count[data-id="${commentId}"]`).data("likecount", likeCount);
                   $(`.story-modal-comment-like-count[data-id="${commentId}"]`).text(`좋아요 ${likeCount}개`);
               }

               // index page 라면
               if($(document).find("title").text() == "Photogram"){

                   // modal의 좋아요를 눌렀다면
                   if($(this).hasClass("content-comment-like-modal")){
                      // story 좋아요 수정
                      $(`.content-comment-like[data-id="${commentId}"]`).css("color", "#ED4956");
                      $(`.content-comment-like[data-id="${commentId}"]`).addClass("fas");
                      $(`.content-comment-like[data-id="${commentId}"]`).removeClass("far");
                   }
               }

            }).fail(error => {
                console.log("댓글 좋아요 실패", error);
            });


        }else{

            $.ajax({
                type: "delete",
                url: `/api/v1/comments/${commentId}/likes`,
                dataType: "json"
            }).done(res => {
               console.log("댓글 좋아요 취소 성공", res);

               $(this).css("color", "");
               $(this).addClass("far");
               $(this).removeClass("fas");

               // 모달이라면
               if($(this).hasClass("content-comment-like-modal")){
                   let likeCountStr = $(`.story-modal-comment-like-count[data-id="${commentId}"]`).data("likecount");
                   let likeCount = Number(likeCountStr) - 1;
                   $(`.story-modal-comment-like-count[data-id="${commentId}"]`).data("likecount", likeCount);
                   $(`.story-modal-comment-like-count[data-id="${commentId}"]`).text(`좋아요 ${likeCount}개`);
               }

               // index page 라면
               if($(document).find("title").text() == "Photogram"){

                   // modal의 좋아요를 눌렀다면
                   if($(this).hasClass("content-comment-like-modal")){
                      // story 좋아요 수정
                      $(`.content-comment-like[data-id="${commentId}"]`).css("color", "");
                      $(`.content-comment-like[data-id="${commentId}"]`).addClass("far");
                      $(`.content-comment-like[data-id="${commentId}"]`).removeClass("fas");
                   }

               }

            }).fail(error => {
                console.log("댓글 좋아요 취소 실패", error);
            });

        }
    });

    // 콘텐츠 dotdotdot 옵션 모달 켜기
    $(document).on("click", ".btn-content-option", function(e){
        e.preventDefault();

        const imageId = $(this).data("id");
        const userId = $(this).data("userid");
        const url = $(this).data("url");
        const username = $(this).data("username");

        if(principalId == userId){
            $(".modal-content-option .btn-delete-content").parent().remove();
            let item = `<li><button class="btn-delete-content">삭제</button></li>`;
            $(".modal-content-option ul").prepend(item);
            $(".modal-content-option .btn-delete-content").data("id", imageId);

            $(".modal-content-option .report").parent().remove();
            $(".modal-content-option .cancel-following").parent().remove();
        }else{
            $(".modal-content-option .btn-delete-content").parent().remove();

            $(".modal-content-option .cancel-following").parent().remove();
            let item2 = `<li><button class="cancel-following">팔로우 취소</button></li>`;
            $(".modal-content-option ul").prepend(item2);
            $(".modal-content-option .cancel-following").data("userid", userId);
            $(".modal-content-option .cancel-following").data("url", url);
            $(".modal-content-option .cancel-following").data("username", username);

            $(".modal-content-option .report").parent().remove();
            let item1 = `<li><button class="report">신고</button></li>`;
            $(".modal-content-option ul").prepend(item1);
            $(".modal-content-option .report").data("id", imageId);
        }

        $(".modal-content-option .btn-link-copy").data("userid", userId);
        $(".modal-content-option-wrapper").css("display", "flex");
    });

    // 콘텐츠 dotdotdot 모달 닫기
    $(document).on("click", ".cancel-content-option", function(e){
        e.preventDefault();
        $(".modal-content-option-wrapper").hide();
    });

    // 콘텐츠 삭제
    $(document).on("click", ".btn-delete-content", function(e){
        e.preventDefault();

        const imageId = $(this).data("id");

        $.ajax({
            type: "delete",
            url: "/api/v1/images/" + imageId,
            dataType: "json"
        }).done(res => {
            console.log("컨텐츠 삭제 성공", res);
            location.reload();
        }).fail(error => {
            console.log("컨텐츠 삭제 실패", error);
            alert("삭제 실패");
        });

    });

    // 콘텐츠 신고1
    $(document).on("click", ".modal-content-option .report", function(e){
        e.preventDefault();

        const imageId = $(this).data("id");

        $(".modal-content-option-wrapper").hide();
        $(".modal-reportList-wrapper modal-reportList")
        $(".modal-reportList-wrapper").css("display", "flex");
        $(".modal-reportList-wrapper").data("id", imageId);
    });

    // 신고 사유 선택
    $(document).on("click", ".modal-reportList ul li button", function(e){
        e.preventDefault();

        const imageId = $(this).parent().parent().parent().parent().data("id");
        const text = $(this).text();

        let data = {message: text};

        $.ajax({
            type: "post",
            url: `/api/v1/images/${imageId}/report`,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(res => {
           console.log("컨텐츠 신고 성공", res);

           $(".modal-reportList-wrapper").hide();

           $(".modal-reported-wrapper").data("username", res.data.image.user.username);
           $(".modal-reported-wrapper").data("userid", res.data.image.user.id);
           $(".modal-reported__btn-cancel-following").text(res.data.image.user.username+"님 팔로우 취소");
           $(".modal-reported__btn-cancel-following").data("userid", res.data.image.user.id);

           $(".modal-reported-wrapper").css("display", "flex");

        }).fail(error => {
            console.log("컨첸츠 신고 실패", error);
            alert(error.responseJSON.message);
        });

    })

    // 신고 사유 선택 닫기
    $(".cancel-reportList").on("click", function(e){
        e.preventDefault();
        $(".modal-reportList-wrapper").hide();
    });

    // 신고 완료3 -> 팔로우 취소 클릭
    $(".modal-reported__btn-block-user").on("click", function(e){
        e.preventDefault();

        alert("차단 API로직")
        $(".modal-reported-wrapper").hide();
    });

    // 신고 완료3 - 모달 닫기
    $(".btn-close-reported").on("click", function(e){
        e.preventDefault();
        $(".modal-reported-wrapper").hide();
    });

    // 신고이전 - 팔로우 취소
    $(document).on("click", ".btn-cancel-following, .modal-reported__btn-cancel-following", function(e){
        e.preventDefault();

        const toUserId = $(this).data("userid");

        $.ajax({
            type: "delete",
            url: "/api/v1/unsubscribe/" + toUserId,
            dataType: "json"
        }).done(res => {
            console.log("팔로우 취소 성공", res);
            location.reload();
        }).fail(error => {
            console.log("팔로우 취소 실패", error);
        });

    });

    // 콘텐츠 dotdotdot 에서 팔로우 취소 모달 열기
    $(document).on("click", ".cancel-following", function(e){
        e.preventDefault();

        const userId = $(this).data("userid");
        const userProfileUrl = $(this).data("url");
        const username = $(this).data("username");

        $(".modal-requestCancelFollowing img").attr("src", "/upload/" + userProfileUrl);
        $(".modal-requestCancelFollowing p").text(`${username}님의 팔로우를 취소하시겠습니까?`);
        $(".modal-requestCancelFollowing .btn-cancel-following").data("userid", userId);

        $(".modal-content-option-wrapper").hide();
        $(".modal-requestCancelFollowing-wrapper").css("display", "flex");
    })

    // 팔로우 취소 모달 닫기
    $(document).on("click", ".btn-close-requestCancelFollowing", function(e){
        e.preventDefault();
        $(".modal-requestCancelFollowing-wrapper").hide();
    });

    // 콘텐츠 옵션에서 링크 복사 눌렀을때 보여주는 (모달)
    $(document).on("click", ".btn-link-copy", function(e){
        e.preventDefault();

        const userId = $(this).data("userid");

        // 서버 호스팅시 수정필요!
        $('#clip_target').val("http://localhost:8080/user/" + userId + "/profile");
        $('#clip_target').select();

        try {
            var successful = document.execCommand('copy');

            if(successful){
                alert("주소가 복사되었습니다");
            }else {
                alert("복사 실패");
            }

         } catch (err) {
           alert('이 브라우저는 지원하지 않습니다.')
         }

        $(".modal-content-option-wrapper").hide();
    });

    // 댓글 신고 -- 스토리 모달 댓글 dotdotdot 클릭 시
    $(document).on("click", ".report-modal-comment-btn", function(e){
        e.preventDefault();

        const commentId = $(this).data("id");

        $.ajax({
            type: "post",
            url: `/api/v1/comments/${commentId}/report`,
            dataType: "json"
        }).done(res => {
            console.log("댓글 신고 성공", res);
            alert("정상적으로 신고되었습니다.");
            $(".modal-comment-dotdotdot-wrapper").hide();
        }).fail(error => {
            console.log("댓글 신고  실패", error);
            alert(error.responseJSON.message);
        });

    });

    // 댓글 삭제 -- 스토리 모달 댓글 dotdotdot 클릭 시
    $(document).on("click", ".cancel-modal-comment-delete-btn", function(e){
        e.preventDefault();

        const commentId = $(this).data("id");

        $.ajax({
            type: "delete",
            url: `/api/v1/comments/${commentId}`,
            dataType: "json"
        }).done(res => {
            console.log("댓글 삭제 성공", res);

            // 모달에서 댓글삭제
            $(`.content-comment-like-modal[data-id="${commentId}"]`).parent().remove();

            // index page 일 경우
            if($(document).find("title").text() == "Photogram"){
                if($(`.content-comment-like[data-id="${commentId}"]`)){
                    $(`.content-comment-like[data-id="${commentId}"]`).parent().remove();
                }
            }

        }).fail(error => {
            console.log("댓글 삭제  실패", error);
            alert("댓글 삭제 에러");
        }).always(() => {
            $(".modal-comment-dotdotdot-wrapper").hide();
        });

    });

    // 스토리 모달 댓글 dotdotdot 클릭 시
    $(document).on("click", ".modal-comment-dotdotdot", function(e){
        e.preventDefault();

        const commentId = $(this).data("id");
        const commentOwnerState = $(this).data("commentowner");

        if(commentOwnerState == true){

            if(!$(".report-modal-comment-btn").next().hasClass("cancel-modal-comment-delete-btn")){
                let item = `<button class="cancel-modal-comment-delete-btn">삭제</button>`;
                $(".report-modal-comment-btn").after(item);
            }

        }else{
            $(".cancel-modal-comment-delete-btn").remove();
        }

        $(".report-modal-comment-btn").data("id", commentId);
        if($(".cancel-modal-comment-delete-btn")){
            $(".cancel-modal-comment-delete-btn").data("id", commentId);
        }

        $(".modal-comment-dotdotdot-wrapper").css("display", "flex");
    });

    $(document).on("click", ".cancel-modal-comment-dotdotdot-option-btn", function(e){
        e.preventDefault();
        $(".modal-comment-dotdotdot-wrapper").hide();
    });

    // ---------- 파일 업로드 -------------
    // 파일 업로드 모달 켜기
    $(".btn-fileupload").on("click", function(){
        $("body").addClass("stopScroll");
        $(".modal-fileupload-wrapper").css("display", "flex");
    })

    function fileuploadClear(){
        // input file 초기화
        $("#input_imgs").val("");

        // swiper 초기화
        $(".file-upload-swiper .swiper-wrapper").html("");

        // header 변경
        $(".header-file h3").html("새 게시물 만들기");
        $(".header-file i").hide();
        $(".header-file button").hide();

        //body 변경
        $(".body-file__nofile-box").css("display", "flex")
        $(".file-upload-swiper").hide();
        $(".btn-fileupload-multi").hide();
        
        $(".modal-fileupload-wrapper").css("display", "none");
        
        $(".modal-fileupload").css("width", "38vw");
        $(".file-upload-options").hide();
        $(".file-upload-swiper").css("flex-basis", "");
        $(".file-upload-swiper img").css("border-bottom-right-radius", "9px");
        $(".btn-fileupload-multi").css("display", "none");

        //input 초기화
        $(".file-upload-options__input-caption").val("");
        $(".file-upload-options__input-location").val("");
        $(".file-upload-options__input-alt").val("");
        $(".file-upload-options__input-switch").prop('checked', false) ;

        // options 닫기
        $(".btn-toggle-file-upload-options_option").addClass("fa-chevron-down");
        $(".btn-toggle-file-upload-options_option").removeClass("fa-chevron-up");
        $(".file-upload-options_option > div:nth-child(2)").hide();
        $(".file-upload-options_option > div:nth-child(1)").css("border-bottom", "1px solid #dbdbdb")

        //접근성 닫기
        $(".btn-toggle-file-upload-options_accessibility").addClass("fa-chevron-down");
        $(".btn-toggle-file-upload-options_accessibility").removeClass("fa-chevron-up");
        $(".file-upload-options_accessibility > div:nth-child(2)").hide();
        $(".file-upload-options_accessibility > div:nth-child(1)").css("border-bottom", "1px solid #dbdbdb");

        // 파일업로드 성공 이미지 닫기
        $("#image-spinner").show();
        $("#image-spinner").next().hide();
    }

    // 파일 업로드 모달 끄기
    $(".btn-close-fileUploadModal").on("click", function(){
        fileuploadClear();
        $("body").removeClass("stopScroll");
    })

    // 파일 업로딩 모달 닫기
    $("i.btn-close-fileupload-loading-modal").on("click", function(){
        $(".modal-fileupload-uploading-wrapper").hide();
        fileuploadClear();
        $("body").removeClass("stopScroll");
    })

    // 파일 업로드 고급 옵션 토글
    $(".btn-toggle-file-upload-options_option").on("click", function(){
        if($(this).hasClass("fa-chevron-down")){
            $(this).removeClass("fa-chevron-down");
            $(this).addClass("fa-chevron-up");
            $(".file-upload-options_option > div:nth-child(2)").show();
            $(".file-upload-options_option > div:nth-child(1)").css("border-bottom", "none")
           
        }else{
            $(this).addClass("fa-chevron-down");
            $(this).removeClass("fa-chevron-up");
            $(".file-upload-options_option > div:nth-child(2)").hide();
            $(".file-upload-options_option > div:nth-child(1)").css("border-bottom", "1px solid #dbdbdb")
        }
    })

    // 파일 업로드 접근성 옵션 토글
    $(".btn-toggle-file-upload-options_accessibility").on("click", function(){
        if($(this).hasClass("fa-chevron-down")){
            $(this).removeClass("fa-chevron-down");
            $(this).addClass("fa-chevron-up");
            $(".file-upload-options_accessibility > div:nth-child(2)").show();
            $(".file-upload-options_accessibility > div:nth-child(1)").css("border-bottom", "none");
        }else{
            $(this).addClass("fa-chevron-down");
            $(this).removeClass("fa-chevron-up");
            $(".file-upload-options_accessibility > div:nth-child(2)").hide();
            $(".file-upload-options_accessibility > div:nth-child(1)").css("border-bottom", "1px solid #dbdbdb");
        }
    })

     // 파일 업로드 다음 버튼1
     $(".btn-fileupload-step1").on("click", function(e){
        e.preventDefault();

        // 뒤로가기, 다음 버튼 step2로 변경
        $(".header-file h3").text("편집");
        $(this).hide();
        $(".btn-fileupload-step2").css("display", "inline-flex");

        $(".header-file i.back-step1").hide();
        $(".header-file i.back-step2").css("display", "inline-flex");

        // css 변경
        $(".modal-fileupload").css("width", "54vw");
        $(".file-upload-options").show();
        $(".file-upload-swiper").css("flex-basis", "69%");
        $(".file-upload-swiper img").css("border-bottom-right-radius", "0px");
        $(".btn-fileupload-multi").hide();
    })

    // 파일 업로드 다음 버튼2(파일 업로드)
    $(".btn-fileupload-step2").on("click", function(e){
        e.preventDefault();

        $(".modal-fileupload-uploading-wrapper").css("display", "flex");
        $(".modal-fileupload-wrapper").hide();

        //서버에 이미지 전송 준비
        let filesForm = $("#filesForm")[0];

        let description = $(`textarea[name="description"]`).val();
        let location = $(`input[name="location"]`).val();
        let caption = $(`input[name="caption"]`).val();
        let isCommentActive = $('input:checkbox[name="isCommentActive"]').is(":checked");

        let formData = new FormData(filesForm);
        formData.append("description", description);
        formData.append("caption", location);
        formData.append("location", caption);
        formData.append("isCommentActive", isCommentActive);

        $.ajax({
            type: "post",
            url: `/api/v1/images`,
            data: formData,
            contentType: false,
            processData: false,
            enctype: "multipart-form-data"
        }).done(res => {
            setTimeout(function() {
                $("#image-spinner").hide();
                $("#image-spinner").next().show();
            }, 2000);

        }).fail(error => {
            console.log("사진 변경 오류", error);
            alert("프로필 사진 변경에 실패하였습니다.");
         });

    })

    // 파일 업로드 뒤로가기 버튼1 모달 켜기
    $(".header-file i.back-step1").on("click", function(){
        $(".modal-fileupload-undo-wrapper").css("display", "flex");
    })

    // 파일 업로드 뒤로가기 버튼2
    $(".header-file i.back-step2").on("click", function(){

        // 뒤로가기, 다음 버튼 step1로 변경
        $(".header-file h3").text("사진 추가");
        $(".btn-fileupload-step2").hide();
        $(".btn-fileupload-step1").css("display", "inline-flex");

        $(this).hide();
        $(".header-file i.back-step1").css("display", "inline-flex");

        // css 변경
        $(".modal-fileupload").css("width", "38vw");
        $(".file-upload-options").hide();
        $(".file-upload-swiper").css("flex-basis", "");
        $(".file-upload-swiper img").css("border-bottom-right-radius", "9px");
        $(".btn-fileupload-multi").css("display", "inline-flex");
        
    });
    
    // 첫번째 input file 클릭
    $(".btn-fileupload-multi-first-click").on("click", function(){
        $("#input_imgs").click();
    })

    // 두번째 이후 input file 클릭
    $(".btn-fileupload-multi").on("click", function(){
        $("#input_imgs").click();
    })

    // btn video play
    $(document).on("click", ".btn-video-play", function(){
        $(this).parent().children("video").get(0).play();
        $(this).hide();
        $(".btn-video-stop").show();
    })

    // btn video stop
    $(document).on("click", ".btn-video-stop", function(){
        $(this).parent().children("video").get(0).pause();
        $(this).hide();
        $(".btn-video-play").show();
    })

    // 파일 업로드 취소
    $(".btn-fileupload-undo").on("click", function(){
        $(".modal-fileupload-undo-wrapper").hide();

        // input file 초기화
        $("#input_imgs").val("");

        // swiper 초기화
        $(".file-upload-swiper .swiper-wrapper").html("");

        // header 변경
        $(".header-file h3").html("새 게시물 만들기");
        $(".header-file i").hide();
        $(".header-file button").hide();

        //body 변경
        $(".body-file__nofile-box").css("display", "flex")
        $(".file-upload-swiper").hide();
        $(".btn-fileupload-multi").hide();
    })

    // 파일 업로드 모달 닫기
    $(".btn-fileupload-undo-cancel").on("click", function(){
        $(".modal-fileupload-undo-wrapper").hide();
    })

    var sel_files = [];
    $("#input_imgs").on("change", handleImgsFilesSelect);

    function handleImgsFilesSelect(e) {
        var files = e.target.files;
        var filesArr = Array.prototype.slice.call(files);

        filesArr.forEach(function(f) {
            // 확장자 제한, input에서 accept 처리도 해둠
            if(f.type.match("image.*") || f.type.match("video.*")) {
                // do nothing
            }else{
                alert("확장자는 이미지 및 비디오만 사용가능합니다.");
                return;
            }

            sel_files.push(f);

            var reader = new FileReader();
            
            // swiper에 video. image 미리보기 슬라이드 추가
            reader.onload = function(e) {
                var img_html = "";

                if(f.type.includes("video")){
                    img_html += "<div class='swiper-slide'>";
                    img_html += "<video src=\"" + e.target.result + "\" /></video>"
                    img_html += `<i class="far fa-play-circle btn-video-play"></i>`;
                    img_html += `<i class="far fa-stop-circle btn-video-stop"></i>`;
                    img_html += `</div>`;
                }else if(f.type.includes("image")){
                    img_html += "<div class='swiper-slide'>"+"<img src=\"" + e.target.result + "\" />"+"</div>";
                }
                $(".file-upload-swiper > .swiper-wrapper").append(img_html);
            }
            reader.readAsDataURL(f);

            // header 변경
            $(".header-file h3").html("사진 추가");
            $(".header-file i.back-step1").css("display", "inline-flex");
            $(".header-file button.btn-fileupload-step1").css("display", "inline-flex");

            //body 변경
            $(".body-file__nofile-box").hide();
            $(".file-upload-swiper").show();
            $(".btn-fileupload-multi").css("display", "inline-flex");
        });
    }

    // 이모지
    $(document).on("click", ".btn-emoticon-icon", function(){

        let emojiDiv = `<div class="emoticon-wrapper">
                            <div class="emoticon-wrapper__best-emojis"> 
                                <h3>최고 인기 이모티콘</h3>
                                <span class="emoticon-item">😂</span>
                                <span class="emoticon-item">😮</span>
                                <span class="emoticon-item">😍</span>
                                <span class="emoticon-item">😢</span>
                                <span class="emoticon-item">👏</span>
                                <span class="emoticon-item">🔥</span>
                                <span class="emoticon-item">🎉</span>
                                <span class="emoticon-item">💯</span>
                                <span class="emoticon-item">❤️</span>
                                <span class="emoticon-item">🤣</span>
                                <span class="emoticon-item">🥰</span>
                                <span class="emoticon-item">😘</span>
                                <span class="emoticon-item">😭</span>
                                <span class="emoticon-item">😊</span>
                            </div>
                            <div class="emoticon-wrapper__smile-and-people"> 
                                <h3>웃는 얼굴 및 사람</h3>
                                <span class="emoticon-item">😀</span>
                                <span class="emoticon-item">😃</span>
                                <span class="emoticon-item">😄</span>
                                <span class="emoticon-item">😄</span>
                                <span class="emoticon-item">😄</span>
                                <span class="emoticon-item">😄</span>
                                <span class="emoticon-item">😄</span>
                                <span class="emoticon-item">😁</span>
                                <span class="emoticon-item">😆</span>
                                <span class="emoticon-item">😅</span>
                                <span class="emoticon-item">🤣</span>
                                <span class="emoticon-item">😂</span>
                                <span class="emoticon-item">🙂</span>
                                <span class="emoticon-item">🙃</span>
                                <span class="emoticon-item">😉</span>
                                <span class="emoticon-item">😊</span>
                                <span class="emoticon-item">😇</span>
                                <span class="emoticon-item">🥰</span>
                                <span class="emoticon-item">😍</span>
                                <span class="emoticon-item">🤩</span>
                                <span class="emoticon-item">😘</span>
                                <span class="emoticon-item">😗</span>
                                <span class="emoticon-item">😚</span>
                                <span class="emoticon-item">😙</span>
                                <span class="emoticon-item">😋</span>
                                <span class="emoticon-item">😛</span>
                                <span class="emoticon-item">😜</span>
                                <span class="emoticon-item">🤪</span>
                                <span class="emoticon-item">😝</span>
                                <span class="emoticon-item">🤑</span>
                                <span class="emoticon-item">🤗</span>
                                <span class="emoticon-item">🤭</span>
                                <span class="emoticon-item">🤫</span>
                                <span class="emoticon-item">🤔</span>
                                <span class="emoticon-item">🤐</span>
                                <span class="emoticon-item">🤨</span>
                                <span class="emoticon-item">😐</span>
                                <span class="emoticon-item">😑</span>
                                <span class="emoticon-item">😶</span>
                                <span class="emoticon-item">😏</span>
                                <span class="emoticon-item">😒</span>
                                <span class="emoticon-item">🙄</span>
                                <span class="emoticon-item">😬</span>
                                <span class="emoticon-item">🤥</span>
                                <span class="emoticon-item">😌</span>
                                <span class="emoticon-item">😔</span>
                                <span class="emoticon-item">😪</span>
                                <span class="emoticon-item">🤤</span>
                                <span class="emoticon-item">😴</span>
                                <span class="emoticon-item">😷</span>
                                <span class="emoticon-item">🤒</span>
                                <span class="emoticon-item">🤕</span>
                                <span class="emoticon-item">🤢</span>
                                <span class="emoticon-item">🤮</span>
                                <span class="emoticon-item">🤧</span>
                                <span class="emoticon-item">🥵</span>
                                <span class="emoticon-item">🥶</span>
                                <span class="emoticon-item">🥴</span>
                                <span class="emoticon-item">😵</span>
                                <span class="emoticon-item">🤯</span>
                                <span class="emoticon-item">🤠</span>
                                <span class="emoticon-item">🥳</span>
                                <span class="emoticon-item">😎</span>
                                <span class="emoticon-item">🤓</span>
                                <span class="emoticon-item">🧐</span>
                                <span class="emoticon-item">😕</span>
                                <span class="emoticon-item">😟</span>
                                <span class="emoticon-item">🙁</span>
                                <span class="emoticon-item">😮</span>
                                <span class="emoticon-item">😯</span>
                                <span class="emoticon-item">😲</span>
                                <span class="emoticon-item">😳</span>
                                <span class="emoticon-item">🥺</span>
                                <span class="emoticon-item">😦</span>
                                <span class="emoticon-item">😧</span>
                                <span class="emoticon-item">😨</span>
                                <span class="emoticon-item">😰</span>
                                <span class="emoticon-item">😥</span>
                                <span class="emoticon-item">😢</span>
                                <span class="emoticon-item">😭</span>
                                <span class="emoticon-item">😱</span>
                                <span class="emoticon-item">😖</span>
                                <span class="emoticon-item">😣</span>
                                <span class="emoticon-item">😞</span>
                                <span class="emoticon-item">😓</span>
                                <span class="emoticon-item">😩</span>
                                <span class="emoticon-item">😫</span>
                                <span class="emoticon-item">😤</span>
                                <span class="emoticon-item">😡</span>
                                <span class="emoticon-item">😠</span>
                                <span class="emoticon-item">🤬</span>
                                <span class="emoticon-item">😈</span>
                                <span class="emoticon-item">👿</span>
                                <span class="emoticon-item">💀</span>
                                <span class="emoticon-item">☠</span>
                                <span class="emoticon-item">💩</span>
                                <span class="emoticon-item">🤡</span>
                                <span class="emoticon-item">👹</span>
                                <span class="emoticon-item">👺</span>
                                <span class="emoticon-item">👻</span>
                                <span class="emoticon-item">👽</span>
                                <span class="emoticon-item">👾</span>
                                <span class="emoticon-item">🤖</span>
                                <span class="emoticon-item">😺</span>
                                <span class="emoticon-item">😸</span>
                                <span class="emoticon-item">😹</span>
                                <span class="emoticon-item">😻</span>
                                <span class="emoticon-item">😼</span>
                                <span class="emoticon-item">😽</span>
                                <span class="emoticon-item">🙀</span>
                                <span class="emoticon-item">😿</span>
                                <span class="emoticon-item">😾</span>
                                <span class="emoticon-item">💋</span>
                                <span class="emoticon-item">👋</span>
                                <span class="emoticon-item">🤚</span>
                                <span class="emoticon-item">🖐</span>
                                <span class="emoticon-item">✋</span>
                                <span class="emoticon-item">🖖</span>
                                <span class="emoticon-item">👌</span>
                                <span class="emoticon-item">👌</span>
                                <span class="emoticon-item">✌</span>
                                <span class="emoticon-item">🤞</span>
                                <span class="emoticon-item">🤟</span>
                                <span class="emoticon-item">🤘</span>
                                <span class="emoticon-item">🤙</span>
                                <span class="emoticon-item">👈</span>
                                <span class="emoticon-item">👉</span>
                                <span class="emoticon-item">👆</span>
                                <span class="emoticon-item">🖕</span>
                                <span class="emoticon-item">👇</span>
                                <span class="emoticon-item">☝</span>
                                <span class="emoticon-item">👍</span>
                                <span class="emoticon-item">👎</span>
                                <span class="emoticon-item">✊</span>
                                <span class="emoticon-item">👊</span>
                                <span class="emoticon-item">🤛</span>
                                <span class="emoticon-item">🤜</span>
                                <span class="emoticon-item">👏</span>
                                <span class="emoticon-item">🙌</span>
                                <span class="emoticon-item">👐</span>
                                <span class="emoticon-item">🤲</span>
                                <span class="emoticon-item">🤝</span>
                                <span class="emoticon-item">🙏</span>
                                <span class="emoticon-item">✍</span>
                                <span class="emoticon-item">💅</span>
                                <span class="emoticon-item">🤳</span>
                                <span class="emoticon-item">💪</span>
                                <span class="emoticon-item">🦵</span>
                                <span class="emoticon-item">🦶</span>
                                <span class="emoticon-item">👂</span>
                                <span class="emoticon-item">👃</span>
                                <span class="emoticon-item">🧠</span>
                                <span class="emoticon-item">🦷</span>
                                <span class="emoticon-item">🦴</span>
                                <span class="emoticon-item">👀</span>
                                <span class="emoticon-item">👁</span>
                                <span class="emoticon-item">👅</span>
                                <span class="emoticon-item">👄</span>
                                <span class="emoticon-item">👶</span>
                                <span class="emoticon-item">🧒</span>
                                <span class="emoticon-item">👦</span>
                                <span class="emoticon-item">👧</span>
                                <span class="emoticon-item">🧑</span>
                                <span class="emoticon-item">👱</span>
                                <span class="emoticon-item">👨</span>
                                <span class="emoticon-item">🧔</span>
                                <span class="emoticon-item">👨</span>
                                <span class="emoticon-item">👨</span>
                                <span class="emoticon-item">👨</span>
                                <span class="emoticon-item">👨</span>
                                <span class="emoticon-item">👨</span>
                                <span class="emoticon-item">👩</span>
                                <span class="emoticon-item">👱</span>
                                <span class="emoticon-item">🧓</span>
                                <span class="emoticon-item">👴</span>
                                <span class="emoticon-item">👵</span>
                                <span class="emoticon-item">🙍</span>
                                <span class="emoticon-item">🙍</span>
                                <span class="emoticon-item">🙎</span>
                                <span class="emoticon-item">🙅</span>
                                <span class="emoticon-item">🙆</span>
                                <span class="emoticon-item">💁</span>
                                <span class="emoticon-item">🙋</span>
                                <span class="emoticon-item">🙇</span>
                                <span class="emoticon-item">🤦</span>
                                <span class="emoticon-item">🤷</span>
                                <span class="emoticon-item">👨</span>
                                <span class="emoticon-item">👩</span>
                                <span class="emoticon-item">🕵</span>
                                <span class="emoticon-item">💂</span>
                                <span class="emoticon-item">👷</span>
                                <span class="emoticon-item">🤴</span>
                                <span class="emoticon-item">👸</span>
                                <span class="emoticon-item">👳</span>
                                <span class="emoticon-item">👲</span>
                                <span class="emoticon-item">🧕</span>
                                <span class="emoticon-item">🤵</span>
                                <span class="emoticon-item">👰</span>
                                <span class="emoticon-item">🤰</span>
                                <span class="emoticon-item">🤱</span>
                                <span class="emoticon-item">👼</span>
                                <span class="emoticon-item">🎅</span>
                                <span class="emoticon-item">🤶</span>
                                <span class="emoticon-item">🦸</span>
                                <span class="emoticon-item">🦸</span>
                                <span class="emoticon-item">🦹</span>
                                <span class="emoticon-item">🧙</span>
                                <span class="emoticon-item">🧙</span>
                                <span class="emoticon-item">🧚</span>
                                <span class="emoticon-item">🧛</span>
                                <span class="emoticon-item">🧜</span>
                                <span class="emoticon-item">🧝</span>
                                <span class="emoticon-item">🧞</span>
                                <span class="emoticon-item">🧟</span>
                                <span class="emoticon-item">💆</span>
                                <span class="emoticon-item">💇</span>
                                <span class="emoticon-item">🚶</span>
                                <span class="emoticon-item">🏃</span>
                                <span class="emoticon-item">💃</span>
                                <span class="emoticon-item">🕺</span>
                                <span class="emoticon-item">🕴</span>
                                <span class="emoticon-item">👯</span>
                                <span class="emoticon-item">🧖</span>
                                <span class="emoticon-item">🧖</span>
                                <span class="emoticon-item">🧘</span>
                                <span class="emoticon-item">👭</span>
                                <span class="emoticon-item">👫</span>
                                <span class="emoticon-item">👬</span>
                                <span class="emoticon-item">💏</span>
                                <span class="emoticon-item">💑</span>
                                <span class="emoticon-item">👪</span>
                                <span class="emoticon-item">🗣</span>
                                <span class="emoticon-item">👤</span>
                                <span class="emoticon-item">👥</span>
                                <span class="emoticon-item">👣</span>
                                <span class="emoticon-item">🧳</span>
                                <span class="emoticon-item">🌂</span>
                                <span class="emoticon-item">☂</span>
                                <span class="emoticon-item">🧵</span>
                                <span class="emoticon-item">🧶</span>
                                <span class="emoticon-item">👓</span>
                                <span class="emoticon-item">🕶</span>
                                <span class="emoticon-item">🥽</span>
                                <span class="emoticon-item">🥼</span>
                                <span class="emoticon-item">👔</span>
                                <span class="emoticon-item">👕</span>
                                <span class="emoticon-item">👖</span>
                                <span class="emoticon-item">🧣</span>
                                <span class="emoticon-item">🧤</span>
                                <span class="emoticon-item">🧥</span>
                                <span class="emoticon-item">🧦</span>
                                <span class="emoticon-item">👗</span>
                                <span class="emoticon-item">👘</span>
                                <span class="emoticon-item">👙</span>
                                <span class="emoticon-item">👚</span>
                                <span class="emoticon-item">👛</span>
                                <span class="emoticon-item">👜</span>
                                <span class="emoticon-item">👝</span>
                                <span class="emoticon-item">🎒</span>
                                <span class="emoticon-item">👞</span>
                                <span class="emoticon-item">👟</span>
                                <span class="emoticon-item">🥾</span>
                                <span class="emoticon-item">🥿</span>
                                <span class="emoticon-item">👠</span>
                                <span class="emoticon-item">👡</span>
                                <span class="emoticon-item">👢</span>
                                <span class="emoticon-item">👑</span>
                                <span class="emoticon-item">👒</span>
                                <span class="emoticon-item">🎩</span>
                                <span class="emoticon-item">🎓</span>
                                <span class="emoticon-item">🧢</span>
                                <span class="emoticon-item">⛑</span>
                                <span class="emoticon-item">💄</span>
                                <span class="emoticon-item">💍</span>
                                <span class="emoticon-item">💼</span>
                            </div>
                            <div class="emoticon-wrapper__animal-and-nature"> 
                                <h3>동물 및 자연</h3>
                                <span class="emoticon-item">🙈</span>
                                <span class="emoticon-item">🙉</span>
                                <span class="emoticon-item">🙊</span>
                                <span class="emoticon-item">💥</span>
                                <span class="emoticon-item">💫</span>
                                <span class="emoticon-item">💦</span>
                                <span class="emoticon-item">💨</span>
                                <span class="emoticon-item">🐵</span>
                                <span class="emoticon-item">🐒</span>
                                <span class="emoticon-item">🦍</span>
                                <span class="emoticon-item">🐶</span>
                                <span class="emoticon-item">🐕</span>
                                <span class="emoticon-item">🐩</span>
                                <span class="emoticon-item">🐺</span>
                                <span class="emoticon-item">🦊</span>
                                <span class="emoticon-item">🦝</span>
                                <span class="emoticon-item">🐱</span>
                                <span class="emoticon-item">🐈</span>
                                <span class="emoticon-item">🦁</span>
                                <span class="emoticon-item">🐯</span>
                                <span class="emoticon-item">🐅</span>
                                <span class="emoticon-item">🐆</span>
                                <span class="emoticon-item">🐴</span>
                                <span class="emoticon-item">🐎</span>
                                <span class="emoticon-item">🦄</span>
                                <span class="emoticon-item">🦓</span>
                                <span class="emoticon-item">🦌</span>
                                <span class="emoticon-item">🐮</span>
                                <span class="emoticon-item">🐂</span>
                                <span class="emoticon-item">🐃</span>
                                <span class="emoticon-item">🐄</span>
                                <span class="emoticon-item">🐷</span>
                                <span class="emoticon-item">🐖</span>
                                <span class="emoticon-item">🐗</span>
                                <span class="emoticon-item">🐽</span>
                                <span class="emoticon-item">🐏</span>
                                <span class="emoticon-item">🐑</span>
                                <span class="emoticon-item">🐐</span>
                                <span class="emoticon-item">🐪</span>
                                <span class="emoticon-item">🐫</span>
                                <span class="emoticon-item">🦙</span>
                                <span class="emoticon-item">🦙</span>
                                <span class="emoticon-item">🦒</span>
                                <span class="emoticon-item">🐘</span>
                                <span class="emoticon-item">🦏</span>
                                <span class="emoticon-item">🦛</span>
                                <span class="emoticon-item">🐭</span>
                                <span class="emoticon-item">🐁</span>
                                <span class="emoticon-item">🐀</span>
                                <span class="emoticon-item">🐹</span>
                                <span class="emoticon-item">🐰</span>
                                <span class="emoticon-item">🐇</span>
                                <span class="emoticon-item">🐿</span>
                                <span class="emoticon-item">🦔</span>
                                <span class="emoticon-item">🦇</span>
                                <span class="emoticon-item">🐻</span>
                                <span class="emoticon-item">🐨</span>
                                <span class="emoticon-item">🐼</span>
                                <span class="emoticon-item">🦘</span>
                                <span class="emoticon-item">🦡</span>
                                <span class="emoticon-item">🐾</span>
                                <span class="emoticon-item">🦃</span>
                                <span class="emoticon-item">🐔</span>
                            </div>
                        </div>`;
    
        if($(this).next().hasClass("emoticon-wrapper")){
            $(this).next().remove();
        }else{
            $(this).parent().append(emojiDiv);
        }
    })

    // 이모지 클릭 시 해당 이모지 textarea에 삽입 (인코딩 문제로 비활성화)
    $(document).on("click", ".emoticon-item", function(){
//        let data = $(this).text();
//        let dataTextArea = $(this).parent().parent().parent().next().val();
//        $(this).parent().parent().parent().next().val(dataTextArea+data);
        alert("인코딩 문제로 현재 사용 불가능합니다.");
        $(this).parent().parent().remove();
    });

});