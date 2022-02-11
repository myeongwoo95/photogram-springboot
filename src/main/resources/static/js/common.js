let scrollTop;
function saveScroll(){
    scrollTop = $(document).scrollTop();
}

function scroll(){
    $(document).scrollTop(scrollTop);
}

const principalId = $("#principalId").val();

let pageNumOfStoryModalComment = 0;

$(document).ready(function(){
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

    // 이미지 상세보기 -> 신고 -> (차단) 및 팔로우 취소
    $(".modal-reported__btn-block-user").on("click", function(e){
        e.preventDefault();
        alert("차단 API로직")
        $(".modal-reported-wrapper").hide();
    })

    // 이미지 상세보기 -> 신고 -> 차단 및 (팔로우 취소) 다른 btn이랑 로직이 겹치니까 그거사용
    $(".modal-reported__btn-cancel-following").on("click", function(e){
        e.preventDefault();
        alert("팔로우취소 API로직")
        $(".modal-reported-wrapper").hide();
    })

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
    $(".header__search-input").on("change keyup paste focus", function(e){
        e.preventDefault();
        
        if(!$(this).val()){
            $(".search-list").hide();
        }else{
            //api 로직
            $(".search-list").show();
            $(".header__dropdown").css("display", "none");
            $(".header__notice-box").css("display", "none");
        }
    })

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

            //프로파일 변경
            $(".comment-modal-view__comment-list__header img").attr("src", "/upload/" + res.data.user.profileImageUrl);
            $(".comment-modal-view__comment-list__header span").text(res.data.user.username);

            //description 프로파일 변경
            $(".comment-modal-view__comment-list__body__user img").attr("src", "/upload/" + res.data.user.profileImageUrl);
            $(".comment-modal-view__comment-list__body__user span").text(res.data.user.username);

            $(".comment-modal-view__comment-list__body__caption__description").text(res.data.description);
            $(".comment-modal-view__comment-list__body__caption__tags").text("");

            //댓글 변경
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
                                         <i class="fas fa-ellipsis-h modal-comment-dotdotdot cursor-pointer"></i>
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
                                         <i class="fas fa-ellipsis-h modal-comment-dotdotdot cursor-pointer"></i>
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

            // 게시글 등록날짜 수정
            $(".modal-comment-wrapper .modal-storyDate").text(res.data.createDate.substr(0, 10));

            // 모달 켜기
            $(".modal-comment-wrapper").css("display", "flex");

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
    $(document).on("click", ".content-like-modal", function(e){
         $.ajax({
             type: "post",
             url: `/api/v1/images/${imageId}/likes`,
             dataType: "json"
         }).done(res => {

         }).fail(error => {
             console.log("스토리 모달 좋아요 에러", error);
         });
    });

    // 모달 저장하기, 저장하기 취소
    $(document).on("click", ".content-like-modal", function(e){
         $.ajax({
             type: "post",
             url: `/api/v1/images/${imageId}/likes`,
             dataType: "json"
         }).done(res => {

         }).fail(error => {
             console.log("스토리 모달 좋아요 에러", error);
         });
    });


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
                                     <i class="fas fa-ellipsis-h modal-comment-dotdotdot cursor-pointer"></i>
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
    $(document).on("click", ".content-comment-like", function(e){
        e.preventDefault();

        if($(this).hasClass("far")){
            $(this).css("color", "#ED4956");
            $(this).addClass("fas");
            $(this).removeClass("far");
        }else{
            $(this).css("color", "");
            $(this).addClass("far");
            $(this).removeClass("fas");
        }
    })

    // 대댓글 좋아요, 좋아요 취소
    $(document).on("click", ".comment-comment-like", function(e){
        e.preventDefault();

        if($(this).hasClass("far")){
            $(this).css("color", "#ED4956");
            $(this).addClass("fas");
            $(this).removeClass("far");
        }else{
            $(this).css("color", "");
            $(this).addClass("far");
            $(this).removeClass("fas");
        }
    })

    // 북마크, 북마크 취소
    $(document).on("click", ".content-bookmark", function(e){
        e.preventDefault();

        if($(this).hasClass("far")){
            $(this).css("color", "#333");
            $(this).addClass("fas");
            $(this).removeClass("far");
        }else{
            $(this).css("color", "");
            $(this).addClass("far");
            $(this).removeClass("fas");
        }
    });

    // 댓글의 댓글 확인 버튼
    $(".comment-deep-button").on("click", function(){
        $(this).next().toggle();
    })

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

        console.log(description, location, caption, isCommentActive);

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
    })

    $(document).on("focus", ".content-comment-textarea", function(){
        $(".emoticon-wrapper").remove();
    })

    // 댓글 업로드
    $(document).on("click", ".upload-comment", function(e){
        e.preventDefault();

        if($(this).prev().val() == ""){
            alert("내용이 없습니다.")
            return;
        }

        addComment($(this).data("id"), $(this).prev().val());

        //textarea 초기화, 이모지 닫기
        $(this).prev().val("");
        $(".emoticon-wrapper").remove();
    })

    function addComment(imageId, content){

    	let commentList = $(`.comments-list-${imageId}`);
    	let commentCount = $(`.comment-count-${imageId}`);

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
    		console.log("댓글등록 성공", res);

    		commentList.empty();

            res.data.content.forEach(comment => {
                let content = `<div class="comment-items mt-5">
                                   <b class="fw-900">${comment.user.username}</b>
                                   <span>${comment.content}</span>
                                       <i class="far fa-heart content-comment-like"></i>
                               </div>`;
                commentList.append(content);
            });

            commentCount.text(res.data.totalElements);

    	}).fail(error => {
    		console.log("댓글등록 에러", error);
    	});
    };

    // 콘텐츠 dotdotdot 옵션 모달 켜기
    $(document).on("click", ".btn-content-option", function(){
        $("body").addClass("stopScroll");
        $(".modal-content-option-wrapper").css("display", "flex");
    });

    $(".cancle-content-option").on("click", function(){
        $(".modal-content-option-wrapper").hide();
        $("body").removeClass("stopScroll");
    });

    // 콘텐츠 dotdotdot 옵션 모달 닫기
    $(".modal-content-option .report").on("click", function(){
        $(".modal-content-option-wrapper").hide();
        $(".modal-reportList-wrapper").css("display", "flex");
    });

    // 신고 사유 선택
    $(".cancel-reportList").on("click", function(){
        $(".modal-reportList-wrapper").hide();
    });

    // 신고 완료
    $(".modal-reportList ul li button").on("click", function(){
        $(".modal-reportList-wrapper").hide();
        $(".modal-reported-wrapper").css("display", "flex");
    })

    $(".btn-close-reported").on("click", function(){
        $(".modal-reported-wrapper").hide();
        $("body").removeClass("stopScroll");
    })

    // 콘텐츠 옵션에서 팔로우 취소 눌렀을때 보여주는 (모달)
    $(".cancel-following").on("click", function(){
        $(".modal-content-option-wrapper").hide();
        $(".modal-requestCancelFollowing-wrapper").css("display", "flex");
    })

    // 팔로우 취소 모달 닫기 
    $(".btn-close-requestCancelFollowing").on("click", function(){
        $(".modal-requestCancelFollowing-wrapper").hide();
        $("body").removeClass("stopScroll");
    })

    // 팔로우 취소API
    $(".btn-cancel-following").on("click", function(){
        //로직
        alert("팔로우 취소 api 실행");
        $(".modal-requestCancelFollowing-wrapper").hide();
        $("body").removeClass("stopScroll");
    })

    // 콘텐츠 옵션에서 링크 복사 눌렀을때 보여주는 (모달)
    $(".btn-link-copy").on("click", function(){
        
        //로직
        alert("링크가 복사되었습니다.")
        $(".modal-content-option-wrapper").hide();
        $("body").removeClass("stopScroll");
    })
});