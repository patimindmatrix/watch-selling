(function ($){
    $(document).ready(function (){
        /*------ ADD TO CART ------*/
        $(".cart-btn").on('click', function (e){
            e.preventDefault();

            let url = $(this).data('url');

            $.ajax({
                type: "GET",
                url: url,

                beforeSend: function (){
                    $(".overlay-snipper").addClass("open");
                },

                success: function (data){
                    if(data.code === 200){
                        $('.sweet-alert').fadeIn('slow');
                        setInterval(function (){
                            location.reload().fadeIn("slow");
                        }, 1000)
                    }
                },

                complete: function (){
                    $(".overlay-snipper").removeClass("open");
                    setTimeout(function (){
                        $('.sweet-alert').fadeOut(500);
                    },500)
                },

                error: function (){

                }
            })

        })

        $(".cart-quantity").on("submit", function (e){
            e.preventDefault();

            let quantity = $(this).find('input[type=number]').val();

            let url = $(this).data("url");

            $.ajax({
                type: "GET",
                url: url,
                data:{
                    "quantity": quantity
                },

                beforeSend: function (){
                    $(".overlay-snipper").addClass("open");
                },

                success: function (data){
                    if(data.code === 200){
                        $('.sweet-alert').fadeIn('slow');
                        setInterval(function (){
                            location.reload().fadeIn("slow");
                        }, 1000)
                    }
                },

                complete: function (){
                    $(".overlay-snipper").removeClass("open");
                    setTimeout(function (){
                        $('.sweet-alert').fadeOut(500);
                    },500)
                },

                error: function (){

                }
            })
        })

        /*------ UPDATE CART ------*/
        //This will "delegate" the event. It will run for all .update-btn links no matter when they are added to the DOM.
        $(document).on('click', '.update-btn', updateCart);
        function updateCart(ev){
            ev.preventDefault();

            let array = [];
            let totalProduct = $(".cart-detail");
            let id = totalProduct.find(".id-product");
            let quantity = totalProduct.find(".quantity-input");
            let url = $(".table-content").data("url");

            for(var i = 0; i < totalProduct.length; ++i){
                array.push({
                    "id": id[i].value,
                    "quantity": quantity[i].value
                })
            }

            $.ajax({
                url: url,
                data: {
                    data : array
                },

                beforeSend: function (){
                    $(".overlay-snipper").addClass("open");
                },

                success: function (data){
                    if(data.code === 200){
                        $("#cart-table").html(data.data);
                    }
                },

                complete: function (){
                    $(".overlay-snipper").removeClass("open");
                },

                error: function (){

                }
            })
        }

        /*------ COUPON CART ------*/
        $(document).on("click", ".btn-coupon", applyCoupon);
        function applyCoupon(event){
            event.preventDefault();
            let nameCoupon = $(this).parent().find(".input-text").val();
            let url = $(this).data("url");

            $.ajax({
                url: url,
                type: "GET",
                data: {nameCoupon: nameCoupon},

                beforeSend: function (){
                    $(".overlay-snipper").addClass("open");
                },

                success: function (data){
                    if(data.code === 200){
                        $("#cart-table").html(data.data);
                    }
                },

                complete: function (){
                    $(".overlay-snipper").removeClass("open");
                },

                error: function (){

                }
            })
        }


        /*------ DELETE CART ------*/
        $(document).on("click", ".delete-cart", deleteCart);
        function deleteCart(ev){
            ev.preventDefault();

            let url = $("#cart-table").data("url");
            let id = $(this).data("id");
            $.ajax({
                type: "GET",
                url: url,
                data: {
                    id: id
                },

                beforeSend: function (){
                    $(".overlay-snipper").addClass("open");
                },

                success: function (data){
                    if(data.code === 200){
                        $("#cart-table").html(data.data);
                        setInterval(function (){
                            location.reload().fadeIn("slow")
                        },1000);
                    }
                },

                complete: function (){
                    $(".overlay-snipper").removeClass("open");
                },

                error: function (){

                }
            })
        }

        /*------ SORT PRODUCTS ------*/
        $("#sortby").on("change", function (e){
            let url = $(this).val();

            if(url){
                window.location = url;
            }

            return false;
        })

        /*------ Select address ------*/
        $("#select-province").on("change", function (){
            let province_id = $(this).val();
            let _this = $(this);

            let url = "http://myapp.com/thanh-toan/get-district";

            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $("meta[name='csrf-token']").attr("content")
                },
                url: url,
                type: "POST",
                data: {province_id: province_id},

                beforeSend: function (){
                    $(".overlay-snipper").addClass("open");
                },

                success: function (data){
                    //Khi thay đổi tỉnh/ thành thì load lại district và ward
                    $("select#select-district").html("");
                    $("select#select-ward").html("");
                    _this.parent().removeClass("has-error");
                    _this.parent().addClass("has-feedback");
                    $("<option />").text("Phường/ Xã").appendTo($("select#select-ward"));
                    if(data.code === 200){
                        var districts = data.data;
                        $("<option />").text("Quận/ Huyện").appendTo($("select#select-district"));
                        districts.forEach(function (item){
                            $("<option />").val(item.id).text(item._name).appendTo($("select#select-district"));
                        })
                    }
                },

                complete: function (){
                    $(".overlay-snipper").removeClass("open");
                }
            })
        })

        $("#select-district").on("change", function (){
            let district_id = $(this).val();
            let _this = $(this);
            let url = "http://myapp.com/thanh-toan/get-ward";

            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $("meta[name='csrf-token']").attr("content")
                },
                url: url,
                type: "POST",
                data: {district_id: district_id},

                beforeSend: function (){
                    $(".overlay-snipper").addClass("open");
                },

                success: function (data){
                    $("select#select-ward").html("");
                    _this.parent().removeClass("has-error");
                    _this.parent().addClass("has-feedback");
                    if(data.code === 200){
                        var wards = data.data;
                        $("<option />").text("Phường/ Xã").appendTo($("select#select-ward"));
                        wards.forEach(function (item){
                            $("<option />").val(item.id).text(item._name).appendTo($("select#select-ward"));
                        })
                    }
                },

                complete: function (){
                    $(".overlay-snipper").removeClass("open");
                }
            })
        })

        $("#select-ward").on("change", function (){
           $(this).parent().removeClass("has-error");
           $(this).parent().addClass("has-feedback");
        });


        /*------ Checkout ------*/
        $("button.btn-place-order").on("click", function (ev){
            ev.preventDefault();

            let url = $(this).data("href");
            let name = $("#ck-name").val().trim();
            let phone = $("#ck-phone").val().trim();
            let email = $("#ck-email").val().trim();
            let homeAdrres = $("#ck-home-address").val().trim();
            let province = $("#select-province").val();
            let district = $("#select-district").val();
            let ward = $("#select-ward").val();

            if(name === ""){
                checkValidate($("#ck-name"), "Tên không được rỗng");
            }
            if(phone === ""){
                checkValidate($("#ck-phone"), "Số điện thoại không được rỗng");
            }
            if(email === "") {
                checkValidate($("#ck-email"), "Email không được rỗng");
            }else if(!checkEmail(email)){
                checkValidate($("#ck-email"), "Email không đúng định dạng");
            }
            if(homeAdrres === ""){
                checkValidate($("#ck-home-address"), "Địa chỉ nhà không được rỗng");
            }
            if(isNaN(province)){
                checkValidate($("#select-province"));
            }
            if(isNaN(district)){
                checkValidate($("#select-district"));
            }
            if(isNaN(ward)){
                checkValidate($("#select-ward"));
            }

            if($(".single-form-row").hasClass("has-error") === false){
                var formData = new FormData(document.getElementById("form-address-checkout"));
                $.ajax({
                    headers: {
                        'X-CSRF-TOKEN' : $("meta[name='csrf-token']").attr("content")
                    },
                    url: url,
                    type: "POST",
                    processData: false,
                    cache: false,
                    contentType: false,
                    data: formData,

                    beforeSend: function (){
                        $(".overlay-snipper").addClass("open");
                    },

                    success: function (data){
                        if(data.code === 200){
                            window.location = "http://myapp.com/thanh-toan/ghi-nhan-don-hang";
                        }
                    },

                    complete: function (){
                        $(".overlay-snipper").removeClass("open");
                    }
                })
            }
        })

        $("#ck-name").keydown(function (){
            let parent = $(this).parent();
            changeStatus(parent);
        })

        $("#ck-phone").keydown(function (){
            let parent = $(this).parent();
            changeStatus(parent);
        })

        $("#ck-email").keydown(function (){
            let parent = $(this).parent();
            changeStatus(parent);
        })

        $("#ck-home-address").keydown(function (){
            let parent = $(this).parent();
            changeStatus(parent);
        })

        function changeStatus(element){
            element.find(".chkvl").html("");
            element.find(".chkvl").removeClass("validate-error");
            element.removeClass("has-error");
            element.addClass("has-feedback");
            element.find(".chkvl").addClass("form-control-feedback");
            element.find(".form-control-feedback").append("<i class=\"fas fa-check\"></i>");
        }

        function checkValidate(input, message = ""){
            let formControl = input.parent();//Single form row
            let errorMessage = formControl.find(".chkvl");
            formControl.removeClass("has-feedback");
            formControl.addClass("has-error");
            errorMessage.addClass("validate-error");
            errorMessage.html(message);
        }

        function checkEmail(email){
            return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email);
        }

        /*------ WishList ------*/
        $(".wishlist-btn").on("click", function (event){
            event.preventDefault();
            let url = $(this).data("url");
            $.ajax({
                url: url,
                type: "GET",

                beforeSend: function (){
                    $(".overlay-snipper").addClass("open");
                },

                success: function (data){
                    if(data.code === 200){
                        $('.sweet-alert').fadeIn('slow');
                        setInterval(function (){
                            location.reload().fadeIn("slow");
                        }, 1000)
                    }
                },

                complete: function (){
                    $(".overlay-snipper").removeClass("open");
                }
            })

        })

        $(document).on("click",".delete-wishlist",deleteWishProduct);

        function deleteWishProduct(event){
            event.preventDefault();
            let url = $(".wishlist-table").data("url");

            let id = $(this).data("id");

            $.ajax({
                type: "GET",
                url: url,
                data: {
                    id: id
                },

                beforeSend: function (){
                    $(".overlay-snipper").addClass("open");
                },

                success: function (data){
                    if(data.code === 200){
                        $(".wishlist-table").html(data.data);
                        setInterval(function (){
                            location.reload().fadeIn("slow")
                        },1000);
                    }
                },

                complete: function (){
                    $(".overlay-snipper").removeClass("open");
                },

                error: function (){

                }
            })
        }

        /*----------- Start Comment Blog-----------*/
        $(".actions-comment").on("click" , function (){
            let parent = $(this).parent();
            parent.find(".action-dropdown").toggleClass("open");
        })

        $(document).mouseup(function(e)
        {
            var container = $(".action-dropdown");

            // if the target of the click isn't the container nor a descendant of the container
            if (!container.is(e.target) && container.has(e.target).length === 0)
            {
                container.removeClass("open");
            }
        });

        $(document).on("click", ".reply-text", showReplyBox);
        function showReplyBox(e){
            e.preventDefault();
            let defaulPicture = $(this).parents(".user-comments").find(".user-image-comment").attr("src");
            let _token = $(this).data("token");
            let url = $(this).data("url");
            let parentID = $(this).data("id");

            let replyForm = '<form method="post" class="reply-box form-action" action="'+url+'">\n' +
                '<input type="hidden" name="_token" value="'+_token+'"> \n' +
                '<input type="hidden" name="parent_id" value="'+parentID+'"> \n' +
                '<div class="comment-form">\n' +
                '    <div class="comment-form-comment mt-15">\n' +
                '        <div class="d-flex">\n' +
                '            <img class="user-image-comment" src="'+defaulPicture+'" alt="">\n' +
                '            <textarea class="comment-notes" required="required" rows="3" name="content"></textarea>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '    <div class="comment-form-submit mt-30 d-flex justify-content-end">\n' +
                '        <button class="btn btn-secondary mr-2 text-white btn-cancel">Cancel</button>\n' +
                '        <input type="submit" value="Trả lời" class="comment-submit">\n' +
                '    </div>\n' +
                '</div></form>'

            let formExists = $(this).parents(".user-comments").find(".reply-box").length;

            if(formExists == 0 || formExists < 1){
                $(this).parent('.bottom-comment').append(replyForm);
            }
        }

        $(document).on("click", ".delete-comment", deleteComment);
        function deleteComment(e){
            e.preventDefault();
            let _this = $(this);
            let url = $(this).data('url');
            Swal.fire({
                title: 'Thông Báo',
                text: "Bạn có chắc muốn xóa bình luận này không ?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xóa'
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: 'GET',
                        url: url,

                        success: function (data){
                            Swal.fire(
                                'Xóa thành công',
                                'Dữ liệu đã được xóa.',
                                'thành công'
                            )

                            if(data.type === 'notParent'){
                                _this.closest(".user-comments").remove();
                            }
                            else if(data.type === 'parentComment'){
                                _this.parents(".comment-wrapper").remove();
                            }
                        },

                        error: function (data){

                        }
                    })
                }
            })
        }

        $(document).on("click", ".edit-comment", editComment);
        function editComment(e){
            e.preventDefault();
            let url = $(this).data("url");
            let _token = $(this).attr("_token");
            let value = $(this).closest(".main-content").find(".content-of-comment").text();

            let editForm = '<form method="post" class="edit-box form-action" action="'+url+'">\n' +
                '<input type="hidden" name="_token" value="'+_token+'"> \n' +
                '<div class="comment-form">\n' +
                '    <div class="comment-form-comment mt-15">\n' +
                '        <div class="d-flex">\n' +
                '            <textarea class="comment-notes" required="required" rows="3" name="content">'+value+'</textarea>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '    <div class="comment-form-submit mt-30 d-flex justify-content-end">\n' +
                '        <button class="btn btn-secondary mr-2 text-white btn-edit-cancel">Cancel</button>\n' +
                '        <input type="submit" value="Sửa" class="comment-submit">\n' +
                '    </div>\n' +
                '</div></form>'

            let formExists = $(this).closest(".user-comments").find(".edit-box").length;

            if(formExists == 0 || formExists < 1){
                $(this).closest(".user-comments").find(".user-info").after(editForm);
                $(this).closest(".user-comments").find(".bottom-comment").hide();
                $(this).closest(".user-comments").find(".main-content").hide();
            }
        }

        $(document).on("click", ".btn-cancel", removeReplyBox);
        function removeReplyBox(e){
            e.preventDefault();
            $(this).closest(".form-action").remove();
        }

        $(document).on("click", ".btn-edit-cancel", removeEditBox);
        function removeEditBox(e){
            e.preventDefault();
            $(this).closest(".user-comments").find(".bottom-comment").show();
            $(this).closest(".user-comments").find(".main-content").show();
            $(this).closest(".form-action").remove();
        }
        /*----------- End Comment Blog-----------*/

        /*----------- Start Review Product-----------*/
        //Hover star
        $("#stars li").on("mouseover", hoverStar).on("mouseout", hoverOutStar);

        function hoverStar(){
            var onStar = parseInt($(this).data("count"), 10); //Sao đang được trỏ tới

            // highlight tất cả ngôi sao nếu nó ko lớn hơn ngôi sao đc hover
            $(this).parent().children("li.star").each(function (e){
                if(e < onStar){
                    $(this).addClass("hover");
                }
                else{
                    $(this).removeClass("hover");
                }
            });
        }

        function hoverOutStar(){
            $(this).parent().children("li.star").each(function (e){
                $(this).removeClass("hover");
            })
        }

        //Action to perform click
        $("#stars li").on("click", selectStar);
        function selectStar(){
            var onStar = parseInt($(this).data("count"), 10); //Ngôi sao đang được selected
            var stars = $(this).parent().children("li.star");

            for (i = 0; i < stars.length; ++i){
                $(stars[i]).removeClass("selected");
            }

            for (i = 0; i < onStar; ++i){
                $(stars[i]).addClass("selected");
            }

            var ratingValue = parseInt($(this).last().data('count'), 10);
            $(".rating-input").val(ratingValue);
        }


        /*----------- End Review Product-----------*/
    })

})(jQuery);