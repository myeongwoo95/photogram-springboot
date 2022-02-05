$(document).ready(function(){

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
                                    item += `<div class="swiper-slide">
                                                 <img src="/uploadImage/${data.fileUrl}" alt="picture">
                                             </div>`;
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

                           item += `
                                    <li><a href="#"><i class="far fa-comment content-class"></i></a></li>
                                    <li><a href="#"><i class="fab fa-telegram-plane"></i></a></li>
                                    <li><a href="#"><i class="far fa-bookmark content-bookmark"></i></a></li>
                                </ul>
                            </div>

                            <span class="like-count" id="imageLikeCount-${image.id}" data-like="${image.likeCount}">좋아요 ${image.likeCount}개</span>

                            <div class="image-caption">
                                <span class="user">${image.user.username}</span>
                                <div class="caption">${image.description}</div>
                            </div>

                            <div class="comments mt-15">
                                <span class="comment-count cursor-pointer">댓글 0개 모두 보기</span>

                                <!-- 댓글리스트 -->
                                <div class="comments-list-${image.id}">`;


                                image.comments.forEach((comment) => {
                                    item += `<div class="comment-items mt-5">
                                                 <b class="fw-900">${comment.user.username}</b>
                                                 <span>${comment.content}</span>
                                                     <i class="far fa-heart content-comment-like"></i>
                                             </div>`;
                                });


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
    $(document).on("click", ".emoticon-item", function(){
        let data = $(this).text();
        let dataTextArea = $("#content-comment-textarea").val();
     
        $("#content-comment-textarea").val(dataTextArea+data)
    })

    // textarea에 focus시 이모지 박스 닫기
    $("#content-comment-textarea").on("focus", function(){
        $(".emoticon-wrapper").remove();
    })

    // btn 게시글 업로드
    $(".upload-comment").on("click", function(e){
        e.preventDefault();
        
        if($("#content-comment-textarea").val() === ""){
            alert("내용이 없습니다.")
            return;
        }

        alert("로직")
        $("#content-comment-textarea").val("");

        //이모지 닫기
        $(".emoticon-wrapper").remove();
    });

    // 콘텐츠 caption 더보기 (수정 필요)
    $('.image-caption').each(function(){
        var content = $(this).children('.caption');
        var content_txt = content.text();
        var content_txt_short = content_txt.substring(0,100)+"...";
        var btn_more = $('<a href="javascript:void(0)" class="more"> 더 보기</a>');
    
        $(this).append(btn_more);
        
        if(content_txt.length >= 100){
            content.html(content_txt_short)
        }else{
            btn_more.hide()
        }
        
        btn_more.click(toggle_content);
      
        function toggle_content(){
            if($(this).hasClass('short')){
                // 접기 상태
                $(this).html('더보기');
                content.html(content_txt_short)
                $(this).removeClass('short');
            }else{
                // 더보기 상태
                $(this).html('접기');
                content.text(content_txt);
                $(this).addClass('short');
    
            }
        }
    });
    
    // Textarea 높이 자동조절
    $('#content-comment-textarea').keyup(function(e) {
        $(this).css('height', 'auto');
        $(this).height(this.scrollHeight);
    });
    
    //Textarea onchange 버튼 활성화
    $('#content-comment-textarea').bind('input propertychange', function() {
        $(".upload-comment").css("opacity", 0.3);
    
        if(this.value.length){
            $(".upload-comment").css("opacity", 1.);
        }
    });

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
    
});
