
$(document).ready(function(){

    let pageNumOfPopular = 0;

    function popularLoad() {
        $.ajax({
            url: `/api/v1/images/popular?page=${pageNumOfPopular}`,
            dataType: "json"
        }).done(res => {
            if(res.data.length == 0){
                return;
            }
            console.log(res);

            let popularItem = `<div class="explore-container__only-images mb-25">`;

            res.data.forEach((image, index, array) =>{
                let item = getPopularItem(image, index, array);
                popularItem += item;
            });

            popularItem += `</div>`;
            $(".explore-container").append(popularItem);

        }).fail(error => {
            console.log("인기사진 로드 실패", error);
        });
    }popularLoad();

    $(window).scroll(() => {
        let checkNum = $(window).scrollTop() - ($(document).height() - $(window).height()) // 스크롤탑 - 문서의 높이 - 윈도우 높이

        if(checkNum < 1 && checkNum > -1){ // 대략 스크롤이 끝까지 다 내려갔다면…~
            pageNumOfPopular++;
            popularLoad();
        }
    });


    function getPopularItem(image, index, array){
        console.log(index);
        console.log(array);
        console.log("hehe", array.length);

        let item = "<div class='only_images__image-item ";

                   if(array.length == 9){
                       if(index == 0){
                           item += "grid-right"
                       }

                       if(index == 1){
                           item += "grid-left"
                       }
                   }

                   if(array.length >= 3 && array.length != 9){
                       if(index == 0){
                          item += "grid-left"
                       }
                   }

                   item += "'>";

                   if(image.files[0].type.indexOf("video") > -1){
                        item += `<video src="/uploadImage/${image.files[0].fileUrl}"></video>`;
                        item += `<i class="fas fa-play"></i>`;

                   }else{
                        item += `<img src="/uploadImage/${image.files[0].fileUrl}" alt="photo">`;
                        if(image.files.length > 1){
                            item += `<i class="fas fa-clone"></i>`;
                        }
                   }

                   item += `<div class="only_images__image-item__info">
                            <div>
                                <i class="fas fa-heart"></i>
                                <span>${image.likeCount}</span>
                            </div>

                            <div>
                                <i class="fas fa-comment"></i>
                                <span>0</span>
                            </div>
                        </div>
                   </div>`;
        return item;
    }



    $(document).on("mouseover", ".only_images__image-item", function(){
        $(this).find(".only_images__image-item__info").css("display", "flex")
    })

    $(document).on("mouseout", ".only_images__image-item", function(){
        $(this).find(".only_images__image-item__info").css("display", "none")
    })

    $(document).on("click", ".only_images__image-item", function(){
        $(".modal-comment-wrapper").css("display", "flex");
    })
});