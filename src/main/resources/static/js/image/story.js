$(document).ready(function(){

    const principalId = $("#principalId").val();
    let pageNumOfStory = 0;

    function storyLoad() {
    	$.ajax({
    		url: `/api/v1/images?page=${pageNumOfStory}`,
    		dataType: "json"
    	}).done(res => {
    		console.log(res);

    		res.data.forEach(image =>{
    			let storyItem = getStoryItem(image);
    			$("#storyList").append(storyItem);
    			swiper_fn();
    		})

    	}).fail(error => {
    		console.log("스토리 로드 실패", error);
    	});
    }storyLoad();

    $(window).scroll(() => {
        let checkNum = $(window).scrollTop() - ($(document).height() - $(window).height()) // 스크롤탑 - 문서의 높이 - 윈도우 높이

        if(checkNum < 1 && checkNum > -1){ // 대략 스크롤이 끝까지 다 내려갔다면…~
            pageNumOfStory++;
            storyLoad()
        }
    });

    function swiper_fn(){

        // 스토리 이미지 swiper
        const swiperImage = new Swiper('.image-swiper', {
            // Optional parameters
            direction: 'horizontal',
            loop: false,

            // If we need pagination
            pagination: {
                el: '.swiper-pagination',
            },

            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

            observer: true,
            observeParents: true,
            watchOverflow : true
        });
    }

    function getStoryItem(image){
        let commentCount = 1;

        let item = `<!-- item -->
                    <div class="item-list__image-item">

                        <!-- header -->
                        <div class="item-list__image-item__header">
                            <img src="/upload/${image.user.profileImageUrl}" onerror="this.src='/images/Avatar.jpg'" onclick="location.href='/user/${image.user.id}/profile';" alt="user">
                            <span onclick="location.href='/user/${image.user.id}/profile';">${image.user.username}</span>
                            <i class="fas fa-ellipsis-h btn-content-option" onclick="btnContentOption(${image.id})"></i>
                        </div>

                        <!-- body(image) -->
                        <div class="item-list__image-item__body">
                            <div class="image-swiper">
                                <div class="swiper-wrapper">`;

                                image.files.forEach(data=>{

                                    if(data.type.includes("video")){
                                        item += `<div class="swiper-slide">
                                                    <video src="/uploadImage/${data.fileUrl}" controls></video>
                                                </div>`;


                                    }else{
                                        item += `<div class="swiper-slide">
                                                    <img src="/uploadImage/${data.fileUrl}" alt="picture">
                                                </div>`;
                                    }
                                })

                            item += `</div>
                                <div class="swiper-pagination"></div>

                                <div id="content-button-prev" class="swiper-button-prev"></div>
                                <div id="content-button-prev" class="swiper-button-next"></div>
                            </div>
                        </div>

                        <!-- footer (comment written)-->
                        <div class="item-list__image-item__comment-list">
                            <div>
                                <ul>`;

                                 if(image.likeState){
                                     item += `<li><a href="#"><i class="fas fa-heart content-like" data-id="${image.id}" style="color: rgb(237, 73, 86)"></i></a></li>`;
                                 }else{
                                     item += `<li><a href="#"><i class="far fa-heart content-like" data-id="${image.id}"></i></a></li>`;
                                 }

                           item += `<li><a href="#"><i class="far fa-comment content-class" data-id="${image.id}"></i></a></li>`;

                                 if(image.bookmarkState){
                                    item += `<li><a href="#"><i class="fas fa-bookmark content-bookmark" data-id="${image.id}" style="color: rgb(51, 51, 51)"></i></a></li>`
                                 }else{
                                    item += `<li><a href="#"><i class="far fa-bookmark content-bookmark" data-id="${image.id}"></i></a></li>`
                                 }


                           item += `</ul>
                            </div>

                            <span class="like-count" id="imageLikeCount-${image.id}" data-like="${image.likeCount}">좋아요 ${image.likeCount}개</span>

                            <div class="image-caption">
                                <span class="user">${image.user.username}</span>
                                <div class="caption">${image.description}</div>
                            </div>

                            <div class="comments mt-15">
                                <span class="comment-count cursor-pointer" data-id="${image.id}">댓글
                                    <span class="comment-count-${image.id}">${image.comments.length}</span>개 모두 보기
                                </span>

                                <!-- 댓글리스트 -->
                                <div class="comments-list-${image.id}">`;

                                for(let i=0; i<5; i++){
                                    if(image.comments[i] != null){
                                        item += `<div class="comment-items mt-5">
                                                     <b class="fw-900">${image.comments[i].user.username}</b>
                                                     <span>${image.comments[i].content}</span>`;
//                                        댓글 삭제버튼
//                                        if(principalId == image.comments[i].user.id){ // 로그인 유저와 comment 작성자의 유저가 동일하면 x버튼을 그려줌
//                                            item+=`<i class="fas fa-times" data-id="${image.comments[i].id}"></i>`;
//                                        }

                                        if(image.comments[i].likeCommentState){
                                            item += `<i class="fas fa-heart content-comment-like" data-id="${image.comments[i].id}" style="color: rgb(237, 73, 86)"></i></div>`;
                                        }else{
                                            item += `<i class="far fa-heart content-comment-like" data-id="${image.comments[i].id}"></i></div>`;
                                        }

                                    }
                                }

                                item += `</div>
                            </div>
                        </div>

                        <!-- footer2 (comment write)-->
                        <div class="item-list__image-item__comment-write">
                            <div class="emoticon-container">
                                <i class="far fa-smile-wink btn-emoticon-icon"></i>
                            </div>
                            <textarea class="content-comment-textarea" rows="1" placeholder="댓글 달기..."></textarea>
                            <button class="upload-comment" data-id="${image.id}">게시</button>
                        </div>

                    </div>
                    <!-- item -->`;
        return item;
    }

    // 친구 추천 swiper
    const swiperFriendsRecommendation = new Swiper('.friend-recommentation-swiper', {
        // Optional parameters
        direction: 'horizontal',
        loop: false,

        speed : 1000,

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // 이모지 클릭 시 해당 이모지 textarea에 삽입
//    $(document).on("click", ".emoticon-item", function(){
//        let data = $(this).text();
//        let dataTextArea = $(".content-comment-textarea").val();
//
//        $(".content-comment-textarea").val(dataTextArea+data)
//    })


    //Textarea onchange 버튼 활성화
    $(document).on("input propertychange", ".content-comment-textarea", function(){
        $(".upload-comment").css("opacity", 0.3);
    
        if(this.value.length){
            $(".upload-comment").css("opacity", 1.);
        }
    });

    //Textarea focus시 emoji 닫기
    $(document).on("focus", ".content-comment-textarea", function(){
        $(".emoticon-wrapper").remove();
    })

    // 좋아요, 좋아요 취소
    $(document).on("click", ".content-like", function(e){
        e.preventDefault();

        let imageId = $(this).data("id");

        	if ($(this).hasClass("far")) { // 좋아요

        		$.ajax({
        			type: "post",
        			url: `/api/v1/images/${imageId}/likes`,
        			dataType: "json"
        		}).done(res => {
        			// likeCount 증가
        			let likeCountStr = $(`#imageLikeCount-${imageId}`).data("like");
        			let likeCount = Number(likeCountStr) + 1;
        			$(`#imageLikeCount-${imageId}`).data("like", likeCount);
        			$(`#imageLikeCount-${imageId}`).text("좋아요 " + likeCount + "개");

        			// .. .하트색깔 변경 작업
        			$(this).css("color", "#ED4956");
                    $(this).addClass("fas");
                    $(this).removeClass("far");
        		}).fail(error => {
        			console.log("좋아요 에러", error);
        		});

        	} else { // 좋아요 취소
        		$.ajax({
        			type: "delete",
        			url: `/api/v1/images/${imageId}/likes`,
        			dataType: "json"
        		}).done(res => {
        			//likeCount 감소
        			let likeCountStr = $(`#imageLikeCount-${imageId}`).data("like");
        			let likeCount = Number(likeCountStr) - 1;
        			$(`#imageLikeCount-${imageId}`).data("like", likeCount);
        			$(`#imageLikeCount-${imageId}`).text("좋아요 " + likeCount + "개");

        			// .. .하트색깔 변경 작업
        			$(this).css("color", "");
                    $(this).addClass("far");
                    $(this).removeClass("fas");
        		}).fail(error => {
        			console.log("좋아요 취소 에러", error);
        		});
        	}

    });

    // 친구추천에서 팔로잉 눌렀을 때
    $(".btn-friend-rec-following").on("click", function(){
        //로직
        if($(this).hasClass("false")){
            $(this).removeClass("false")
            $(this).addClass("true")

            $(this).css("color", "#333")
        }else{
            $(this).removeClass("true")
            $(this).addClass("false")
            $(this).css("color", "#0095f6")
        }
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
                                       <i class="far fa-heart content-comment-like" data-id="${comment.id}"></i>
                               </div>`;
                commentList.append(content);
            });

            commentCount.text(res.data.totalElements);

        }).fail(error => {
            console.log("댓글등록 에러", error);
        });
    };
    
});
