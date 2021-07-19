@if(count($reviews) > 0)
    @foreach($reviews as $review)
        @php
            //Lấy thông tin user qua user_id
            $user = \App\Customer::where("id", @$review -> user_id)->first();
            //dd($user);
        @endphp
        <div class="pro_review mt-5">
            <div class="review_thumb">
                <img alt="review images" src="{{ asset("picture/User-Default.jpg") }}">
            </div>
            <div class="review_details">
                <div class="review_info mb-10 rating-info">
                    <ul class="product-rating d-flex mb-10">
                        @for($i = 0; $i < 5; ++$i)
                            <li class="star-rating @if($i < @$review -> rating)selected @endif"><i class='fa fa-star fa-fw'></i></li>
                        @endfor
                    </ul>
                    <h5>{{ @$user -> name }} - <span> {{ date_format(@$review -> updated_at, "d/m/Y H:i:s") }}</span></h5>

                </div>
                <div class="main-content">
                    <p class="review-content m-0">{{ @$review -> content }}</p>
                </div>
            </div>
        </div>
    @endforeach
@endif
