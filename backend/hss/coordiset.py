
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


# 반팔티 - 

############ 유저가 입력한 아이템이 없을 경우

# 스타일 정의 알고리즘
style = {"casual": 0, "street": 0, "dandy": 0, "formal": 0, "sporty": 0}
who = "교수님/상사"
where = "외식"
weather = "winter"
color = ["퍼스널 관련 컬러"]

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
    color = ["black"]
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




# 상의 선택 알고리즘
top = ["반팔티", "긴팔티", "민소매", "셔츠", "카라티", "맨투맨", "후드", "니트"]

# 현재 날씨로 필터
if weather == "summer":
    top.remove("긴팔티")
    top.remove("맨투맨")
    top.remove("후드")
    top.remove("니트")
else:
    top.remove("반팔티")
    top.remove("민소매")

# 스타일로 필터
if first_style == "formal":
    top.remove("반팔티")
    top.remove("긴팔티")
    top.remove("민소매")
    top.remove("카라티")
    top.remove("맨투맨")
    top.remove("후드")
    top.remove("니트")
if second_style == "formal" or first_style == "dandy":
    top.remove("민소매")
    top.remove("후드")
if second_style == "dandy":
    top.remove("민소매")
if first_style == "sporty":
    top.remove("니트")