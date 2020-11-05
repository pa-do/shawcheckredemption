
# 유저 정보 : 퍼스널컬러(spring, summer, fall, winter) / 언제 / 어디에 / 가진옷(선택) + 체형
# 코디셋 구성 항목 : 상의(필), 하의(필), 신발(필), 아우터, 가방, 시계, 모자, 액세서리

# 언제/어디에로 스타일 분류
# 분류 종류 : 캐주얼 / 포멀 / 스포티 / 스트릿 / 댄디 (casual / formal / sporty / street / dandy)

# 혼자 - 가중치 없음 / 친구 - 가중치 없음 / 여사친 - 댄디,캐주얼 / 교수님, 상사 - 포멀
# 학교 - 캐주얼, 스트릿 / 아르바이트 - 캐주얼 / 운동 - 스포티 / pc방 - 포멀, 댄디 제외 / 발표 - 포멀, 댄디 / 결혼식, 장례식 - 아우터와 하의 블랙 + 포멀 
# 우선순위 : 결혼식, 장례식 > 발표 > 운동 > 교수님, 상사 > 여사친

# => 타겟 스타일 나옴

# 유저가 가진 옷을 선택했을 경우
# 해당 옷의 분류(상의, 하의) 내에서 타겟 스타일 + 유저의 옷 컬러로 최대 20개를 뽑는다
# (20개 이상일 경우 random을 돌린다)
# 유사도 측정을 돌려 상위 5개를 추린다.



# 유저가 가진 옷을 선택하지 않았을 경우
# 상의-하의-아우터-신발-가방-시계-모자-액세서리 순으로 뽑는다.


# 체형 (저체중 / 비만 / 키작은 / 어깨좁은)

# 추천 순서
# 상의 (포멀 - 셔츠 > 스포티 - 셔츠제외 니트제외 > 여름 - 니트제외    반팔티, 긴팔티, 민소매, 셔츠, 카라티, 맨투맨, 후드, 니트)
# 상의 -> 하의
# 하의 -> 신발
# 상의 -> 아우터
# 신발 -> 가방
# 가방 or 신발 -> 시계
# 아우터 or 상의 -> 모자
# 액세서리 (포멀 - 넥타이 > 겨울 - 목도리 > 벨트는 하의에 영향받음)



# 스타일 정의 알고리즘
style = {"casual": 0, "street": 0, "dandy": 0, "formal": 0, "sporty": 0}
who = "교수님/상사"
where = "외식"
weather = "winter"
user_pick_item = {"top": [3, "white"], "watch": [0, "black"]}
personal_color = ["퍼스널 관련 컬러"] # 무채색은 필수로 넣음

if who == "교수님/상사":
    style["formal"] += 10
    style["casual"] -= 5
    style["street"] -= 5
    style["sporty"] -= 5
elif who == "여사친/여친/썸녀":
    style["dandy"] += 5
else:
    pass

if where == "결혼식" or where == "장례식":
    style["formal"] += 20
elif where == "운동":
    style["sporty"] += 20
elif where == "발표":
    style["formal"] += 10
    style["dandy"] += 10
elif where == "학교":
    style["casual"] += 5
    style["street"] += 5
elif where == "외식":
    style["casual"] += 5
elif where == "pc방/편한 곳":
    style["formal"] -= 5
    style["dandy"] -= 5

sorted_style = sorted(style.items(), key=lambda x: x[1], reverse=True)
first_style = sorted_style[0][0]
second_style = sorted_style[1][0]
print(first_style, second_style)



if "top" in user_pick_item:    # 입력한 아이템이 있을 때 상의 선택 알고리즘

    top = {i for i in range(8)}     # {"반팔티", "긴팔티", "민소매", "셔츠", "카라티", "맨투맨", "후드", "니트"}
    target_top = user_pick_item["top"][0]
    target_top_color = user_pick_item["top"][1]

    # 상의 DB에서 카테고리 + 컬러가 일치하는 아이템들을 뽑아온다.
    # 뽑힌 아이템이 20개 이상이면 random으로 20개를 뽑는다.
    # 유사도 알고리즘을 돌려 user_pick_item의 이미지와 가장 유사한 아이템 5개를 20개 중에 뽑는다.

else: # 입력한 아이템이 없을 때 상의 선택 알고리즘

    top = {i for i in range(8)}     # {"반팔티", "긴팔티", "민소매", "셔츠", "카라티", "맨투맨", "후드", "니트"}

    # 현재 날씨로 필터
    if weather == "summer":
        top -= {1, 5, 6, 7}
    else:
        top -= {0, 2}

    # 스타일로 필터
    if first_style == "formal":
        top -= {0, 1, 2, 4, 5, 6, 7}
    if second_style == "formal" or first_style == "dandy":
        top -= {2, 6}
    if second_style == "dandy":
        top -= {2}
    if first_style == "sporty":
        top -= {7, 3}

    print(top)
    # top에 해당하는 상의 카테고리에서 퍼스널 컬러들을 타겟 컬러로 지정하여
    # 상의 DB에서 카테고리 + 컬러 + 스타일이 일치하는 아이템들을 뽑아온다.
    # 뽑힌 아이템이 20개 이상이면 random으로 20개를 뽑는다.
    # (여기에서 체형을 고려할 수 있음) 추가적인 알고리즘으로 5개를 뽑는다.



if "pants" in user_pick_item:    # 입력한 아이템이 있을 때 하의 선택 알고리즘

    pants = {i for i in range(5)}     # {"데님", "코튼", "슬랙스", "조거", "숏"}
    target_pants = user_pick_item["pants"][0]
    target_pants_color = user_pick_item["pants"][1]

    # 하의 DB에서 카테고리 + 컬러가 일치하는 아이템들을 뽑아온다.
    # 뽑힌 아이템이 20개 이상이면 random으로 20개를 뽑는다.
    # 유사도 알고리즘을 돌려 user_pick_item의 이미지와 가장 유사한 아이템 5개를 20개 중에 뽑는다.

else: # 입력한 아이템이 없을 때 하의 선택 알고리즘

    pants = {i for i in range(5)}     # {"데님", "코튼", "슬랙스", "조거", "숏"}

    # 현재 날씨로 필터
    if weather == "summer":
        pass
    else:
        pants -= {4}
    
    # 스타일로 필터
    if first_style == "formal":
        pants -= {0, 3, 4}
    if first_style == "dandy" or second_style == "formal":
        pants -= {3, 4}
    if first_style == "sporty":
        pants -= {0, 1, 2}
    
    print(pants)
    # pants에 해당하는 하의 카테고리에서 상의 컬러에 조화로운 색을 타겟 컬러로 지정하여
    # 하의 DB에서 카테고리 + 컬러 + 스타일이 일치하는 아이템들을 뽑아온다.
    # 뽑힌 아이템이 20개 이상이면 random으로 20개를 뽑는다.
    # (여기에서 체형을 고려할 수 있음) 추가적인 알고리즘으로 5개를 뽑는다.


if "shoes" in user_pick_item:    # 입력한 아이템이 있을 때 신발 선택 알고리즘

    shoes = {i for i in range(8)}    # {"캔버스,단화", "러닝화", "구두", "부츠", "로퍼", "모카신", "샌들", "슬리퍼"}
    target_shoes = user_pick_item["shoes"][0]
    target_shoes_color = user_pick_item["shoes"][1]

    # 신발 DB에서 카테고리 + 컬러가 일치하는 아이템들을 뽑아온다.
    # 뽑힌 아이템이 20개 이상이면 random으로 20개를 뽑는다.
    # 유사도 알고리즘을 돌려 user_pick_item의 이미지와 가장 유사한 아이템 5개를 20개 중에 뽑는다.

else: # 입력한 아이템이 없을 때 신발 선택 알고리즘

    shoes = {i for i in range(8)}    # {0"캔버스,단화", 1"러닝화", 2"구두", 3"부츠", 4"로퍼", 5"모카신", 6"샌들", 7"슬리퍼"}

    # 현재 날씨로 필터
    if weather != "winter":
        shoes -= {3, 5}
    if weather != "summer":
        shoes -= {6, 7}
    
    # 스타일로 필터
    if first_style == "formal":
        shoes -= {0, 1, 3, 5, 6, 7}
    if first_style == "dandy" or second_style == "formal":
        shoes -= {1, 6, 7}
    if first_style == "sporty":
        shoes -= {0, 2, 3, 4, 5, 6, 7}
    if first_style == "casual":
        shoes -= {2}
    if first_style == "street":
        shoes -= {2, 7}
    
    print(shoes)
    # shoes에 해당하는 신발 카테고리에서 하의 컬러에 조화로운 색을 타겟 컬러로 지정하여
    # 신발 DB에서 카테고리 + 컬러 + 스타일이 일치하는 아이템들을 뽑아온다.
    # 뽑힌 아이템이 20개 이상이면 random으로 20개를 뽑는다.
    # (여기에서 체형을 고려할 수 있음) 추가적인 알고리즘으로 5개를 뽑는다.


if "outer" in user_pick_item:    # 입력한 아이템이 있을 때 아우터 선택 알고리즘

    # {0"후드집업", 1"블루종", 2"라이더", 3"트러커", 4"블레이저", 5"가디건", 6"아노락", 7"플리스", 8"트레이닝", 9"스타디움", 10"환절기 코트"}
    # {11"겨울싱글코트", 12"겨울기타코트", 13"롱패딩/헤비", 14"숏패딩.헤비", 15"패딩베스트", 16"베스트", 17"사파리", 18"코치"}

    outer = {i for i in range(19)}
    target_outer = user_pick_item["outer"][0]
    target_outer_color = user_pick_item["outer"][1]

    # 아우터 DB에서 카테고리 + 컬러가 일치하는 아이템들을 뽑아온다.
    # 뽑힌 아이템이 20개 이상이면 random으로 20개를 뽑는다.
    # 유사도 알고리즘을 돌려 user_pick_item의 이미지와 가장 유사한 아이템 5개를 20개 중에 뽑는다.

else: # 입력한 아이템이 없을 때 아우터 선택 알고리즘

    # {0"후드집업", 1"블루종", 2"라이더", 3"트러커", 4"블레이저", 5"가디건", 6"아노락", 7"플리스", 8"트레이닝", 9"스타디움", 10"환절기 코트"}
    # {11"겨울싱글코트", 12"겨울기타코트", 13"롱패딩/헤비", 14"숏패딩.헤비", 15"패딩베스트", 16"베스트", 17"사파리", 18"코치"}
    
    outer = {i for i in range(19)}

    # 현재 날씨로 필터
    if weather == "summer": # 여름에 못입는거
        outer -= {0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 16, 17, 18}
    if weather == "winter": # 겨울에 못입는거
        outer -= {0, 2, 3, 5, 10, 16, 18}
    if weather != "winter": # 겨울에만 입는거
        outer -= {11, 12, 13, 14, 15}
    
    # 스타일로 필터
    if first_style == "formal":
        outer -= {0, 1, 2, 3, 5, 6, 7, 8, 9, 13, 14, 15, 17, 18}
    if first_style == "dandy" or second_style == "formal":
        outer -= {0, 1, 2, 6, 7, 8, 9, 13, 14, 15, 17}
    if first_style == "sporty":
        outer -= {1, 2, 3, 4, 5, 10, 11, 12, 13, 16, 17, 18}
    if first_style == "casual":
        outer -= {4, 8}
    if first_style == "street":
        outer -= {0, 4, 8}
    
    print(outer)
    # outer에 해당하는 카테고리에서 상의 컬러에 조화로운 색을 타겟 컬러로 지정하여
    # 아우터 DB에서 카테고리 + 컬러 + 스타일이 일치하는 아이템들을 뽑아온다.
    # 뽑힌 아이템이 20개 이상이면 random으로 20개를 뽑는다.
    # (여기에서 체형을 고려할 수 있음) 추가적인 알고리즘으로 5개를 뽑는다.

if "bag" in user_pick_item:    # 입력한 아이템이 있을 때 가방 선택 알고리즘

    # {0"백팩", 1"메신저/크로스", 2"숄더/토드", 3"에코", 4"보스턴/드럼/더플", 5"웨이스트", 6"클러치", 7"파우치", 8"브리프케이스"}

    bag = {i for i in range(9)}
    target_bag = user_pick_item["bag"][0]
    target_bag_color = user_pick_item["bag"][1]

    # 가방 DB에서 카테고리 + 컬러가 일치하는 아이템들을 뽑아온다.
    # 뽑힌 아이템이 20개 이상이면 random으로 20개를 뽑는다.
    # 유사도 알고리즘을 돌려 user_pick_item의 이미지와 가장 유사한 아이템 5개를 20개 중에 뽑는다.

else: # 입력한 아이템이 없을 때 가방 선택 알고리즘

    # {0"백팩", 1"메신저/크로스", 2"숄더/토드", 3"에코", 4"보스턴/드럼/더플", 5"웨이스트", 6"클러치", 7"파우치", 8"브리프케이스"}

    bag = {i for i in range(9)}

    # 현재 날씨로 필터
    if weather == "winter": 
        bag -= {1, 3, 7}
    
    # 스타일로 필터
    if first_style == "formal":
        bag -= {3, 4, 5, 7}
    if first_style == "dandy" or second_style == "formal":
        bag -= {4, 5, 7}
    if first_style == "sporty":
        bag -= {1, 2, 3, 6, 7, 8}
    if first_style == "casual":
        bag -= {5, 6, 7, 8}
    if first_style == "street":
        bag -= {3, 7, 8}
    
    print(bag)
    # bag에 해당하는 카테고리에서 신발 컬러에 조화로운 색을 타겟 컬러로 지정하여
    # 가방 DB에서 카테고리 + 컬러 + 스타일이 일치하는 아이템들을 뽑아온다.
    # 뽑힌 아이템이 20개 이상이면 random으로 20개를 뽑는다.
    # (여기에서 체형을 고려할 수 있음) 추가적인 알고리즘으로 5개를 뽑는다.


if "watch" in user_pick_item:    # 입력한 아이템이 있을 때 시계 선택 알고리즘

    watch = {0} # 통합
    target_watch_color = user_pick_item["watch"][1]

    # 시계 DB에서 컬러가 일치하는 아이템들을 뽑아온다.
    # 뽑힌 아이템이 20개 이상이면 random으로 20개를 뽑는다.
    # 유사도 알고리즘을 돌려 user_pick_item의 이미지와 가장 유사한 아이템 5개를 20개 중에 뽑는다.

else: # 입력한 아이템이 없을 때 시계 선택 알고리즘

    watch = {0} # 통합

    print(watch)
    # 가방 또는 신발 컬러에 조화로운 색을 타겟 컬러로 지정하여
    # 시계 DB에서 컬러 + 스타일이 일치하는 아이템들을 뽑아온다.
    # 뽑힌 아이템이 20개 이상이면 random으로 20개를 뽑는다.
    # (여기에서 체형을 고려할 수 있음) 추가적인 알고리즘으로 5개를 뽑는다.


if "headwear" in user_pick_item:    # 입력한 아이템이 있을 때 모자 선택 알고리즘

    headwear = {i for i in range(6)}    # {0"캡", 1"베레", 2"페도라", 3"버킷", 4"비니", 5"트루퍼"}
    target_headwear = user_pick_item["headwear"][0]
    target_headwear_color = user_pick_item["headwear"][1]

    # 모자 DB에서 카테고리 + 컬러가 일치하는 아이템들을 뽑아온다.
    # 뽑힌 아이템이 20개 이상이면 random으로 20개를 뽑는다.
    # 유사도 알고리즘을 돌려 user_pick_item의 이미지와 가장 유사한 아이템 5개를 20개 중에 뽑는다.

else: # 입력한 아이템이 없을 때 모자 선택 알고리즘

    headwear = {i for i in range(6)}    # {0"캡", 1"베레", 2"페도라", 3"버킷", 4"비니", 5"트루퍼"}

    # 현재 날씨로 필터
    if weather == "summer": 
        headwear -= {1, 2, 4, 5}
    if weather != "winter":
        headwear -= {5}

    # 스타일로 필터
    if first_style == "formal":
        headwear -= {0, 1, 2, 3, 4, 5}
    if first_style == "dandy" or second_style == "formal":
        headwear -= {0, 3, 4, 5}
    if first_style == "sporty":
        headwear -= {1, 2, 3}
    if first_style == "casual":
        headwear -= {2}
    
    print(headwear)
    # headwear에 해당하는 카테고리에서 아우터 또는 상의 컬러에 조화로운 색을 타겟 컬러로 지정하여
    # 모자 DB에서 카테고리 + 컬러 + 스타일이 일치하는 아이템들을 뽑아온다.
    # 뽑힌 아이템이 20개 이상이면 random으로 20개를 뽑는다.
    # (여기에서 체형을 고려할 수 있음) 추가적인 알고리즘으로 5개를 뽑는다.


if "acc" in user_pick_item:    # 입력한 아이템이 있을 때 액세서리 선택 알고리즘

    acc = {i for i in range(3)}    # {0"벨트", 1"넥타이", 2"머플러"}
    target_acc = user_pick_item["acc"][0]
    target_acc_color = user_pick_item["acc"][1]

    # 액세서리 DB에서 카테고리 + 컬러가 일치하는 아이템들을 뽑아온다.
    # 뽑힌 아이템이 20개 이상이면 random으로 20개를 뽑는다.
    # 유사도 알고리즘을 돌려 user_pick_item의 이미지와 가장 유사한 아이템 5개를 20개 중에 뽑는다.

else: # 입력한 아이템이 없을 때 액세서리 선택 알고리즘

    acc = {i for i in range(3)}    # {0"벨트", 1"넥타이", 2"머플러"}

    # 현재 날씨로 필터
    if weather != "winter":
        acc -= {2}
    
    # 스타일로 필터
    if first_style == "formal":
        acc -= {2}
    if first_style in ["casual", "street", "sporty"]:
        acc -= {1}

    print(acc)
    # acc에 해당하는 카테고리에서 하의 컬러에 조화로운 색을 타겟 컬러로 지정하여
    # 액세서리 DB에서 카테고리 + 컬러 + 스타일이 일치하는 아이템들을 뽑아온다.
    # 뽑힌 아이템이 20개 이상이면 random으로 20개를 뽑는다.
    # (여기에서 체형을 고려할 수 있음) 추가적인 알고리즘으로 5개를 뽑는다.