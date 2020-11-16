
# 유저 정보 : 퍼스널컬러(spring, summer, fall, winter) / 언제 / 어디에 / 가진옷(선택) + 체형
# 코디셋 구성 항목 : 상의(필), 하의(필), 신발(필), 아우터, 가방, 시계, 모자, 액세서리

# 언제/어디에로 스타일 분류
# 분류 종류 : 캐주얼 / 포멀 / 스포티 / 스트릿 / 댄디 (casual / formal / sporty / street / dandy)

# 혼자 - 가중치 없음 / 친구 - 가중치 없음 / 여사친 - 댄디,캐주얼 / 교수님, 상사 - 포멀
# 학교 - 캐주얼, 스트릿 / 아르바이트 - 캐주얼 / 운동 - 스포티 / pc방 - 포멀, 댄디 제외 / 발표 - 포멀, 댄디 / 결혼식, 장례식 - 아우터와 하의 블랙 + 포멀 
# 우선순위 : 결혼식, 장례식 > 발표 > 운동 > 교수님, 상사 > 여사친

# => 타겟 스타일 나옴

# 유저가 가진 옷을 선택했을 경우
# 해당 옷의 분류(상의, 하의) 내에서 타겟 스타일 + 유저의 옷 컬러가 일치하는 아이템을 뽑는다
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
# 신발 -> 시계
# 상의 -> 모자
# 액세서리 (포멀 - 넥타이 > 겨울 - 목도리 > 벨트는 하의에 영향받음)

from .serializers import *
from .models import *
from PIL import Image
import os
import imagehash
import random
import datetime

# 이미지 유사도 분석 알고리즘
def image_similarity(target_item, image_list, category):  #target_item : 유저가 올린 이미지 주소 / image_list : 유사도 분석할 아이템 리스트(objects)
    # target_item = 'media/test.png'   # 테스트 코드 (프론트 연결 후에 지워야함)
    hash = imagehash.average_hash(Image.open(target_item))
    sim_list = []
    for i in range(len(image_list)):
        try:
            ans = 'media/{}/{}'.format(category, image_list[i].img)
            otherhash = imagehash.average_hash(Image.open(ans))
            sim_list.append([abs(hash - otherhash), i])
        except:
            pass
    sim_list.sort()
    result = []
    for i in range(5):
        result.append(image_list[sim_list[i][1]].pk)
    return result

# 퍼스널 컬러 추가 알고리즘
def set_personal_color(user_personal_color):
    personal_color = ["검정색", "흰색", "회색", "라이트 그레이", "다크 그레이", 
    "아이보리", "네이비", "데님", "연청", "중청", "진청", "흑청"] # 무채색은 필수로 넣음

    if user_personal_color == "spring":
        personal_color.extend(["라즈베리", "페일 핑크", "코랄", "노란색", "머스타드", "금색", 
        "라이트 그린", "민트", "올리브 그린", "네온 블루", "라벤더", "갈색", "로즈 골드", 
        "레드 브라운", "카키 베이지", "카멜", "샌드", "베이지색"])
    elif user_personal_color == "summer":
        personal_color.extend(["라이트 핑크", "피치", "라이트 옐로우", "네온 그린", "민트", 
        "스카이 블루", "라벤더", "베이지색"])
    elif user_personal_color == "fall":
        personal_color.extend(["딥레드", "오렌지 핑크", "카키", "다크 그린", "자주", 
        "보라색", "다크 바이올렛", "버건디", "갈색", "로즈 골드", "레드 브라운", "카키 베이지", 
        "카멜"])
    else:
        personal_color.extend(["은색", "빨간색", "네온 핑크", "분홍색", "라이트 오렌지", 
        "네온 오렌지", "주황색", "녹색", "네온 블루", "파란색", "샌드"])
    
    return personal_color


# 스타일 정의 알고리즘

# school: '학교',
# funeral: '장례식',
# marry: '결혼식',
# exercise: '운동',
# presentation: '발표',
# comfortable: 'PC방/편한 곳',
# restaurant: '외식',
# professor: '교수님',
# girlFriend: '여사친',
# friend: '친구',
# family: '가족'

def set_style(who, where):
    style = {"casual": 0, "street": 0, "dandy": 0, "formal": 0, "sporty": 0}

    if who == "professor":
        style["formal"] += 10
        style["casual"] -= 5
        style["street"] -= 5
        style["sporty"] -= 5
    elif who == "girlFriend":
        style["dandy"] += 5
    else:
        pass

    if where == "marry" or where == "funeral":
        style["formal"] += 20
    elif where == "exercise":
        style["sporty"] += 20
    elif where == "presentation":
        style["formal"] += 10
        style["dandy"] += 10
    elif where == "school":
        style["casual"] += 5
        style["street"] += 5
    elif where == "restaurant":
        style["casual"] += 5
    elif where == "comfortable":
        style["formal"] -= 5
        style["dandy"] -= 5

    sorted_style = sorted(style.items(), key=lambda x: x[1], reverse=True)
    first_style = sorted_style[0][0]
    second_style = sorted_style[1][0]
    return (first_style, second_style)


def set_top(user_info):
    user_pick_item = user_info["user_pick_item"]
    weather = user_info["weather"]
    first_style, second_style = user_info["style"]
    who = user_info["who"]
    where = user_info["where"]
    personal_color = user_info["personal_color"]
    

    if "top" in user_pick_item:    # 입력한 아이템이 있을 때 상의 선택 알고리즘
        top = {i for i in range(8)}     # {"반팔티", "긴팔티", "민소매", "셔츠", "카라티", "맨투맨", "후드", "니트"}
        target_top = user_pick_item["top"][0]
        target_top_color = user_pick_item["top"][1]

        # 상의 DB에서 카테고리 + 컬러가 일치하는 아이템들을 뽑아온다.

        top_filter_with_category = Top.objects.filter(category=target_top)
        top_filter_with_color = top_filter_with_category.filter(color__contains=target_top_color)
        if len(top_filter_with_color) < 5:
            # 카테고리 필터에서 유사도 분석
            top_list = top_filter_with_category
        else:
            # 컬러 필터에서 유사도 분석
            top_list = top_filter_with_color

        sim_result = image_similarity(user_pick_item["top"][2], top_list, 'top')
        return sim_result


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
        
        if where in ["funeral", "marry"]:
            top = {3}
        
        items = []
        for i in top:
            target_category_items = Top.objects.filter(category=i)
            for item in target_category_items:
                items.append([item.pk, 0])

        for item in items:
            target = Top.objects.get(pk=item[0])
            target_color = target.color.split()
            
            # 컬러 가중치
            if where not in ["funeral", "marry"]:
                for color in target_color:
                    if color in personal_color:
                        item[1] += 10
                        break

            # 스타일 가중치
            target_style = target.style.split(", ")
            for style in target_style:
                if style == first_style:
                    item[1] += 50
                elif style == second_style:
                    item[1] += 25
            # 날씨 가중치
            target_weather = target.season
            season_ko = {"spring": "봄", "summer": "여름", "fall": "가을", "winter": "겨울"}
            if season_ko[weather] in target_weather:
                item[1] += 30
            
            # 기타색상 제외
            if "기타색상" in target_color:
                item[1] = 0
            
            if where in ["funeral", "marry"]:
                if "formal" not in target_style:
                    item[1] = 0
                if "흰색" not in target_color:
                    item[1] = 0

        items.sort(key=lambda x: x[1], reverse=True)
        result = []
        for i in range(5):
            result.append(items[i][0])
        target = 5
        while True:
            if items[4][1] == 0:
                break
            elif items[4][1] == items[target][1]:
                result.append(items[target][0])
                target += 1
            else:
                break
        random.shuffle(result)
        result = result[:5]
        return result # 5개 리턴


def set_pants(user_info, top):
    user_pick_item = user_info["user_pick_item"]
    weather = user_info["weather"]
    first_style, second_style = user_info["style"]
    who = user_info["who"]
    where = user_info["where"]
    personal_color = user_info["personal_color"]
    top_item = Top.objects.get(pk=top)

    if "pants" in user_pick_item:    # 입력한 아이템이 있을 때 하의 선택 알고리즘

        pants = {i for i in range(5)}     # {"데님", "코튼", "슬랙스", "조거", "숏"}
        target_pants = user_pick_item["pants"][0]
        target_pants_color = user_pick_item["pants"][1]

        # 하의 DB에서 카테고리 + 컬러가 일치하는 아이템들을 뽑아온다.

        pants_filter_with_category = Pants.objects.filter(category=target_pants)
        pants_filter_with_color = pants_filter_with_category.filter(color__contains=target_pants_color)
        if len(pants_filter_with_color) < 5:
            # 카테고리 필터에서 유사도 분석
            pants_list = pants_filter_with_category
        else:
            # 컬러 필터에서 유사도 분석
            pants_list = pants_filter_with_color

        sim_result = image_similarity(user_pick_item["pants"][2], pants_list, 'pants')
        return sim_result

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
        
        # 상의 카테고리로 필터
         # {"반팔티", "긴팔티", "민소매", "셔츠", "카라티", "맨투맨", "후드", "니트"}
        if top_item.category in [3, 7]:
            pants -= {3}
        
        if where in ["funeral", "marry"]:
            pants = {2}


            
        # 컬러
        # 상의가 검정색을 제외한 무채색인 경우 (아이보리, 라이트 그레이 등 포함) 상의 색을 제외한 모든 색 추천 가능
        # 상의가 유채색인 경우 무채색 추천
        # 기타색상 제외

        # 패턴
        # 상의에 패턴이 있을 경우 (체크, 스트라이프, 도트 등 모든 패턴) 패턴 아이템 제거
        
        danger = ["기타색상"]
        pattern = ["스트라이프", "도트", "체크", "윈도우", "하운드", "페이즐리", "플라워", "트로피컬", "카모", "애니멀", "패치워크", "기타패턴"]
        chromatic_color = ["은색", "딥레드", "빨간색", "라즈베리", "네온 핑크", "분홍색", "라이트 핑크", "페일 핑크", "피치", "코랄", "라이트 오렌지", "네온 오렌지", "오렌지 핑크", "주황색", "라이트 옐로우", "노란색", "머스타드", "금색", "네온 그린", "라이트 그린", "민트", "녹색", "올리브 그린", "카키", "다크 그린", "스카이 블루", "네온 블루", "파란색", "자주", "라벤더", "보라색", "다크 바이올렛", "버건디", "갈색", "로즈골드", "레드 브라운", "카키 베이지", "카멜"]
        achromatic_color = ["흰색", "회색", "다크 그레이", "라이트 그레이", "아이보리", "네이비", "샌드", "베이지색"]
        for p in pattern:
            if p in top_item.color:
                danger = pattern
                break

        top_item_color = top_item.color.split()
        for color in top_item_color:
            if color in chromatic_color:
                danger.extend(chromatic_color)
                break
            elif color in achromatic_color:
                danger.append(color)
        
        
        items = []
        for i in pants:
            target_category_items = Pants.objects.filter(category=i)
            for item in target_category_items:
                items.append([item.pk, 0])

        for item in items:
            target = Pants.objects.get(pk=item[0])
            
            # 컬러 가중치
            target_color = target.color.split()
            for color in target_color:
                if color in personal_color:
                    item[1] += 10
                    break

            # 스타일 가중치
            target_style = target.style.split(", ")
            for style in target_style:
                if style == first_style:
                    item[1] += 50
                elif style == second_style:
                    item[1] += 25
            # 날씨 가중치
            target_weather = target.season
            season_ko = {"spring": "봄", "summer": "여름", "fall": "가을", "winter": "겨울"}
            if season_ko[weather] in target_weather:
                item[1] += 30

            # 위험 색상 제거
            for d in danger:
                if d in target.color:
                    item[1] = 0
                    break
            
            if where in ["funeral", "marry"]:
                if "검정색" not in target_color:
                    item[1] = 0
            

        items.sort(key=lambda x: x[1], reverse=True)
        result = []
        for i in range(5):
            result.append(items[i][0])
        target = 5
        while True:
            if items[4][1] == 0:
                break
            elif items[4][1] == items[target][1]:
                result.append(items[target][0])
                target += 1
            else:
                break
        random.shuffle(result)

        result = result[0]
        return result # 1개 리턴


def set_shoes(user_info, pants):
    user_pick_item = user_info["user_pick_item"]
    weather = user_info["weather"]
    first_style, second_style = user_info["style"]
    who = user_info["who"]
    where = user_info["where"]
    personal_color = user_info["personal_color"]
    pants_item = Pants.objects.get(pk=pants)

    if "shoes" in user_pick_item:    # 입력한 아이템이 있을 때 신발 선택 알고리즘

        shoes = {i for i in range(8)}    # {"캔버스,단화", "러닝화", "구두", "부츠", "로퍼", "모카신", "샌들", "슬리퍼"}
        target_shoes = user_pick_item["shoes"][0]
        target_shoes_color = user_pick_item["shoes"][1]

        # 신발 DB에서 카테고리 + 컬러가 일치하는 아이템들을 뽑아온다.

        shoes_filter_with_category = Shoes.objects.filter(category=target_shoes)
        shoes_filter_with_color = shoes_filter_with_category.filter(color__contains=target_shoes_color)
        if len(shoes_filter_with_color) < 5:
            # 카테고리 필터에서 유사도 분석
            shoes_list = shoes_filter_with_category
        else:
            # 컬러 필터에서 유사도 분석
            shoes_list = shoes_filter_with_color

        sim_result = image_similarity(user_pick_item["shoes"][2], shoes_list, 'shoes')
        return sim_result

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
        

        # 하의 카테고리로 필터
         # {"데님", "코튼", "슬랙스", "조거", "숏"}
        if pants_item.category == 2:
            shoes -= {1}
        elif pants_item.category == 3:
            shoes -= {2, 4}

        if where in ["funeral", "marry"]:
            shoes = {2}    
        
        danger = ["기타색상"]

        pants_item_color = pants_item.color.split()
        for color in pants_item_color:
            if color not in ["검정색", "회색", "다크 그레이", "라이트 그레이", "네이비"]:
                danger.append(color)
        

        items = []
        for i in shoes:
            target_category_items = Shoes.objects.filter(category=i)
            for item in target_category_items:
                items.append([item.pk, 0])

        for item in items:
            target = Shoes.objects.get(pk=item[0])
            
            if item[0] in [15, 27, 38,]:
                continue

            # 컬러 가중치
            target_color = target.color.split()
            for color in target_color:
                if color in personal_color:
                    item[1] += 10
                    break

            # 스타일 가중치
            target_style = target.style.split(", ")
            for style in target_style:
                if style == first_style:
                    item[1] += 50
                elif style == second_style:
                    item[1] += 25
            # 날씨 가중치
            target_weather = target.season
            season_ko = {"spring": "봄", "summer": "여름", "fall": "가을", "winter": "겨울"}
            if season_ko[weather] in target_weather:
                item[1] += 30

            # 위험 색상 제거
            for d in danger:
                if d in target.color:
                    item[1] = 0
                    break
            
            if where in ["funeral", "marry"]:
                if "검정색" not in target_color:
                    item[1] = 0
            

        items.sort(key=lambda x: x[1], reverse=True)
        result = []
        for i in range(5):
            result.append(items[i][0])
        target = 5
        while True:
            if items[4][1] == 0:
                break
            elif items[4][1] == items[target][1]:
                result.append(items[target][0])
                target += 1
            else:
                break
        random.shuffle(result)

        result = result[0]
        return result # 1개 리턴


def set_outer(user_info, top):
    user_pick_item = user_info["user_pick_item"]
    weather = user_info["weather"]
    first_style, second_style = user_info["style"]
    who = user_info["who"]
    where = user_info["where"]
    personal_color = user_info["personal_color"]
    top_item = Top.objects.get(pk=top)

    if "outer" in user_pick_item:    # 입력한 아이템이 있을 때 아우터 선택 알고리즘

        # {0"후드집업", 1"블루종", 2"라이더", 3"트러커", 4"블레이저", 5"가디건", 6"아노락", 7"플리스", 8"트레이닝", 9"스타디움", 10"환절기 코트"}
        # {11"겨울싱글코트", 12"겨울기타코트", 13"롱패딩/헤비", 14"숏패딩.헤비", 15"패딩베스트", 16"베스트", 17"사파리", 18"코치"}

        outer = {i for i in range(19)}
        target_outer = user_pick_item["outer"][0]
        target_outer_color = user_pick_item["outer"][1]

        # 아우터 DB에서 카테고리 + 컬러가 일치하는 아이템들을 뽑아온다.

        outer_filter_with_category = Outer.objects.filter(category=target_outer)
        outer_filter_with_color = outer_filter_with_category.filter(color__contains=target_outer_color)
        if len(outer_filter_with_color) < 5:
            # 카테고리 필터에서 유사도 분석
            outer_list = outer_filter_with_category
        else:
            # 컬러 필터에서 유사도 분석
            outer_list = outer_filter_with_color

        sim_result = image_similarity(user_pick_item["outer"][2], outer_list, 'outer')
        return sim_result

    else: # 입력한 아이템이 없을 때 아우터 선택 알고리즘

        if weather == "winter": # 무조건 입는다
            wear = 1
        elif weather == "summer": # 안입는다
            wear = 0
        else:
            random_list = [0, 1]
            random.shuffle(random_list)
            wear = random_list[0]
        
        if where in ["funeral", "marry"]:
            wear = 1

        if not wear:
            return -1
        else:

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

            # 상의 카테고리로 필터
            # {"반팔티", "긴팔티", "민소매", "셔츠", "카라티", "맨투맨", "후드", "니트"}
            if top_item.category in [0, 2, 4]:
                outer -= {15}
            elif top_item.category != 3:
                outer -= {16}
            elif top_item.category == 6:
                outer -= {0, 17, 18}
            
            if where in ["funeral", "marry"]:
                outer = {4, 10, 11}
            else:
                outer -= {4}
                
            
            danger = ["기타색상"]
            pattern = ["스트라이프", "도트", "체크", "윈도우", "하운드", "페이즐리", "플라워", "트로피컬", "카모", "애니멀", "패치워크", "기타패턴"]
            chromatic_color = ["은색", "딥레드", "빨간색", "라즈베리", "네온 핑크", "분홍색", "라이트 핑크", "페일 핑크", "피치", "코랄", "라이트 오렌지", "네온 오렌지", "오렌지 핑크", "주황색", "라이트 옐로우", "노란색", "머스타드", "금색", "네온 그린", "라이트 그린", "민트", "녹색", "올리브 그린", "카키", "다크 그린", "스카이 블루", "네온 블루", "파란색", "자주", "라벤더", "보라색", "다크 바이올렛", "버건디", "갈색", "로즈골드", "레드 브라운", "카키 베이지", "카멜"]
            achromatic_color = ["흰색", "회색", "다크 그레이", "라이트 그레이", "아이보리", "네이비", "샌드", "베이지색"]
            for p in pattern:
                if p in top_item.color:
                    danger = pattern
                    break

            top_item_color = top_item.color.split()
            for color in top_item_color:
                if color in chromatic_color:
                    danger.extend(chromatic_color)
                    break
                elif color in achromatic_color:
                    danger.append(color)
            
            
            items = []
            for i in outer:
                target_category_items = Outer.objects.filter(category=i)
                for item in target_category_items:
                    items.append([item.pk, 0])

            for item in items:
                target = Outer.objects.get(pk=item[0])
                
                # 컬러 가중치
                target_color = target.color.split()
                for color in target_color:
                    if color in personal_color:
                        item[1] += 10
                        break

                # 스타일 가중치
                target_style = target.style.split(", ")
                for style in target_style:
                    if style == first_style:
                        item[1] += 50
                    elif style == second_style:
                        item[1] += 25
                # 날씨 가중치
                target_weather = target.season
                season_ko = {"spring": "봄", "summer": "여름", "fall": "가을", "winter": "겨울"}
                if season_ko[weather] in target_weather:
                    item[1] += 30

                # 위험 색상 제거
                for d in danger:
                    if d in target.color:
                        item[1] = 0
                        break
                
                if where in ["funeral", "marry"]:
                    if "검정색" not in target_color:
                        item[1] = 0
                

            items.sort(key=lambda x: x[1], reverse=True)
            result = []
            for i in range(5):
                result.append(items[i][0])
            target = 5
            while True:
                if items[4][1] == 0:
                    break
                elif items[4][1] == items[target][1]:
                    result.append(items[target][0])
                    target += 1
                else:
                    break
            random.shuffle(result)

            result = result[0]
            return result # 1개 리턴


def set_bag(user_info, shoes):
    user_pick_item = user_info["user_pick_item"]
    weather = user_info["weather"]
    first_style, second_style = user_info["style"]
    who = user_info["who"]
    where = user_info["where"]
    personal_color = user_info["personal_color"]
    shoes_item = Shoes.objects.get(pk=shoes)

    if "bag" in user_pick_item:    # 입력한 아이템이 있을 때 가방 선택 알고리즘

        # {0"백팩", 1"메신저/크로스", 2"숄더/토드", 3"에코", 4"보스턴/드럼/더플", 5"웨이스트", 6"클러치", 7"파우치", 8"브리프케이스"}

        bag = {i for i in range(9)}
        target_bag = user_pick_item["bag"][0]
        target_bag_color = user_pick_item["bag"][1]

        # 가방 DB에서 카테고리 + 컬러가 일치하는 아이템들을 뽑아온다.

        bag_filter_with_category = Bag.objects.filter(category=target_bag)
        bag_filter_with_color = bag_filter_with_category.filter(color__contains=target_bag_color)
        if len(bag_filter_with_color) < 5:
            # 카테고리 필터에서 유사도 분석
            bag_list = bag_filter_with_category
        else:
            # 컬러 필터에서 유사도 분석
            bag_list = bag_filter_with_color

        sim_result = image_similarity(user_pick_item["bag"][2], bag_list, 'bag')
        return sim_result

    else: # 입력한 아이템이 없을 때 가방 선택 알고리즘

        if first_style == "formal": # 무조건 선택
            wear = 1
        else:
            random_list = [0, 1]
            random.shuffle(random_list)
            wear = random_list[0]

        if not wear:
            return -1
        else:

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

            # 신발 카테고리로 필터
            # {0"캔버스,단화", 1"러닝화", 2"구두", 3"부츠", 4"로퍼", 5"모카신", 6"샌들", 7"슬리퍼"}
            if shoes_item.category in [2, 3, 4]:
                bag -= {3}
            
            if where in ["funeral", "marry"]:
                bag = {1, 2, 8}
                
            
            danger = ["기타색상"]

            
            items = []
            for i in bag:
                target_category_items = Bag.objects.filter(category=i)
                for item in target_category_items:
                    items.append([item.pk, 0])

            for item in items:
                target = Bag.objects.get(pk=item[0])
                
                # 컬러 가중치
                target_color = target.color.split()
                for color in target_color:
                    if color in personal_color:
                        item[1] += 10
                        break

                # 스타일 가중치
                target_style = target.style.split(", ")
                for style in target_style:
                    if style == first_style:
                        item[1] += 50
                    elif style == second_style:
                        item[1] += 25
                # 날씨 가중치
                target_weather = target.season
                season_ko = {"spring": "봄", "summer": "여름", "fall": "가을", "winter": "겨울"}
                if season_ko[weather] in target_weather:
                    item[1] += 30

                # 위험 색상 제거
                for d in danger:
                    if d in target.color:
                        item[1] = 0
                        break
                
                shoes_item_color = shoes_item.color.split()
                for color in shoes_item_color:
                    if color in target_color:
                        item[1] += 20
                
                if where in ["funeral", "marry"]:
                    if "검정색" not in target_color:
                        item[1] = 0
                

            items.sort(key=lambda x: x[1], reverse=True)
            result = []
            for i in range(5):
                result.append(items[i][0])
            target = 5
            while True:
                if items[4][1] == 0:
                    break
                elif items[4][1] == items[target][1]:
                    result.append(items[target][0])
                    target += 1
                else:
                    break
            random.shuffle(result)

            result = result[0]
            return result # 1개 리턴


def set_watch(user_info, shoes):
    user_pick_item = user_info["user_pick_item"]
    weather = user_info["weather"]
    first_style, second_style = user_info["style"]
    who = user_info["who"]
    where = user_info["where"]
    personal_color = user_info["personal_color"]
    shoes_item = Shoes.objects.get(pk=shoes)

    if "watch" in user_pick_item:    # 입력한 아이템이 있을 때 시계 선택 알고리즘

        watch = {0} # 통합
        target_watch = user_pick_item["watch"][0]
        target_watch_color = user_pick_item["watch"][1]

        # 시계 DB에서 카테고리 + 컬러가 일치하는 아이템들을 뽑아온다.

        watch_filter_with_category = Watch.objects.filter(category=target_watch)
        watch_filter_with_color = watch_filter_with_category.filter(color__contains=target_watch_color)
        if len(watch_filter_with_color) < 5:
            # 카테고리 필터에서 유사도 분석
            watch_list = watch_filter_with_category
        else:
            # 컬러 필터에서 유사도 분석
            watch_list = watch_filter_with_color

        sim_result = image_similarity(user_pick_item["watch"][2], watch_list, 'watch')
        return sim_result

    else: # 입력한 아이템이 없을 때 시계 선택 알고리즘

        if first_style == "formal": # 무조건 선택
            wear = 1
        else:
            random_list = [0, 1]
            random.shuffle(random_list)
            wear = random_list[0]

        if not wear:
            return -1
        else:

            watch = {0} # 통합
            
            danger = ["기타색상"]

            
            items = []

            for i in range(51):
                items.append([i, 0])

            for item in items:
                target = Watch.objects.get(pk=item[0])
                
                # 컬러 가중치
                target_color = target.color.split()
                for color in target_color:
                    if color in personal_color:
                        item[1] += 10
                        break

                # 스타일 가중치
                target_style = target.style.split(", ")
                for style in target_style:
                    if style == first_style:
                        item[1] += 50
                    elif style == second_style:
                        item[1] += 25
                

                # 위험 색상 제거
                for d in danger:
                    if d in target.color:
                        item[1] = 0
                        break
                
                shoes_item_color = shoes_item.color.split()
                for color in shoes_item_color:
                    if color in target_color:
                        item[1] += 20

            items.sort(key=lambda x: x[1], reverse=True)
            result = []
            for i in range(5):
                result.append(items[i][0])

            random.shuffle(result)
            target = 5
            while True:
                if items[4][1] == 0:
                    break
                elif items[4][1] == items[target][1]:
                    result.append(items[target][0])
                    target += 1
                else:
                    break
            result = result[0]
            return result # 1개 리턴


def set_headwear(user_info, shoes):
    user_pick_item = user_info["user_pick_item"]
    weather = user_info["weather"]
    first_style, second_style = user_info["style"]
    who = user_info["who"]
    where = user_info["where"]
    personal_color = user_info["personal_color"]
    shoes_item = Shoes.objects.get(pk=shoes)

    if "headwear" in user_pick_item:    # 입력한 아이템이 있을 때 모자 선택 알고리즘

        headwear = {i for i in range(6)}    # {0"캡", 1"베레", 2"페도라", 3"버킷", 4"비니", 5"트루퍼"}
        target_headwear = user_pick_item["headwear"][0]
        target_headwear_color = user_pick_item["headwear"][1]

        # 모자 DB에서 카테고리 + 컬러가 일치하는 아이템들을 뽑아온다.

        headwear_filter_with_category = Headwear.objects.filter(category=target_headwear)
        headwear_filter_with_color = headwear_filter_with_category.filter(color__contains=target_headwear_color)
        if len(headwear_filter_with_color) < 5:
            # 카테고리 필터에서 유사도 분석
            headwear_list = headwear_filter_with_category
        else:
            # 컬러 필터에서 유사도 분석
            headwear_list = headwear_filter_with_color

        sim_result = image_similarity(user_pick_item["headwear"][2], headwear_list, 'headwear')
        return sim_result

    else: # 입력한 아이템이 없을 때 모자 선택 알고리즘

        if first_style == "formal" or second_style == "formal": # 무조건 선택안함
            wear = 0
        elif where in ["funeral", "marry"]:
            wear = 0
        else:
            random_list = [0, 1]
            random.shuffle(random_list)
            wear = random_list[0]

        if not wear:
            return -1
        else:

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
            
            # 신발 카테고리로 필터
            # {0"캔버스,단화", 1"러닝화", 2"구두", 3"부츠", 4"로퍼", 5"모카신", 6"샌들", 7"슬리퍼"}
            if shoes_item.category in [2, 3, 4]:
                headwear -= {0, 5}
                
            
            danger = ["기타색상"]

            
            items = []
            for i in headwear:
                target_category_items = Headwear.objects.filter(category=i)
                for item in target_category_items:
                    items.append([item.pk, 0])

            for item in items:
                target = Headwear.objects.get(pk=item[0])
                
                # 컬러 가중치
                target_color = target.color.split()
                for color in target_color:
                    if color in personal_color:
                        item[1] += 10
                        break

                # 스타일 가중치
                target_style = target.style.split(", ")
                for style in target_style:
                    if style == first_style:
                        item[1] += 50
                    elif style == second_style:
                        item[1] += 25

                # 위험 색상 제거
                for d in danger:
                    if d in target.color:
                        item[1] = 0
                        break
                
                shoes_item_color = shoes_item.color.split()
                for color in shoes_item_color:
                    if color in target_color:
                        item[1] += 20
                

            items.sort(key=lambda x: x[1], reverse=True)
            result = []
            for i in range(5):
                result.append(items[i][0])

            random.shuffle(result)
            target = 5
            while True:
                if items[4][1] == 0:
                    break
                elif items[4][1] == items[target][1]:
                    result.append(items[target][0])
                    target += 1
                else:
                    break
            result = result[0]
            return result # 1개 리턴


def set_acc(user_info, top):
    user_pick_item = user_info["user_pick_item"]
    weather = user_info["weather"]
    first_style, second_style = user_info["style"]
    who = user_info["who"]
    where = user_info["where"]
    personal_color = user_info["personal_color"]
    top_item = Top.objects.get(pk=top)
    if "acc" in user_pick_item:    # 입력한 아이템이 있을 때 액세서리 선택 알고리즘

        acc = {i for i in range(3)}    # {0"벨트", 1"넥타이", 2"머플러"}
        target_acc = user_pick_item["acc"][0]
        target_acc_color = user_pick_item["acc"][1]

        # 액세서리 DB에서 카테고리 + 컬러가 일치하는 아이템들을 뽑아온다.

        acc_filter_with_category = Accessory.objects.filter(category=target_acc)
        acc_filter_with_color = acc_filter_with_category.filter(color__contains=target_acc_color)
        if len(acc_filter_with_color) < 5:
            # 카테고리 필터에서 유사도 분석
            acc_list = acc_filter_with_category
        else:
            # 컬러 필터에서 유사도 분석
            acc_list = acc_filter_with_color

        sim_result = image_similarity(user_pick_item["acc"][2], acc_list, 'acc')
        return sim_result
    else: # 입력한 아이템이 없을 때 액세서리 선택 알고리즘

        if first_style == "formal": # 무조건 선택
            wear = 1
        elif where in ["funeral", "marry"]:
            wear = 1
        elif weather == "winter":
            random_list = [0, 1]
            random.shuffle(random_list)
            wear = random_list[0]
        else:
            wear = 0

        if not wear:
            return -1
        else:

            acc = {i for i in range(3)}    # {0"벨트", 1"넥타이", 2"머플러"}

            # 현재 날씨로 필터
            if weather == "winter":
                acc = {2}
            
            # 스타일로 필터
            if first_style == "formal":
                acc = {0, 1}

            # 상의 카테고리로 필터
            # {"반팔티", "긴팔티", "민소매", "셔츠", "카라티", "맨투맨", "후드", "니트"}
            if top_item.category != 3:
                acc -= {1}
            elif top_item.category in [0, 2, 4]:
                acc -= {2}
                
            
            danger = ["기타색상"]

            top_item_color = top_item.color.split()
            for color in top_item_color:
                if color != "검정색":
                    danger.append(color)
            
            items = []
            for i in acc:
                target_category_items = Accessory.objects.filter(category=i)
                for item in target_category_items:
                    items.append([item.pk, 0])

            for item in items:
                target = Accessory.objects.get(pk=item[0])
                
                # 컬러 가중치
                target_color = target.color.split()
                for color in target_color:
                    if color in personal_color:
                        item[1] += 10
                        break

                # 스타일 가중치
                target_style = target.style.split(", ")
                for style in target_style:
                    if style == first_style:
                        item[1] += 50
                    elif style == second_style:
                        item[1] += 25

                # 위험 색상 제거
                for d in danger:
                    if d in target.color:
                        item[1] = 0
                        break
                
                if where in ["funeral", "marry"]:
                    if "검정색" not in target_color:
                        item[1] = 0
                

            items.sort(key=lambda x: x[1], reverse=True)
            result = []
            for i in range(5):
                result.append(items[i][0])
            
            random.shuffle(result)
            target = 5
            while True:
                if items[4][1] == 0:
                    break
                elif items[4][1] == items[target][1]:
                    result.append(items[target][0])
                    target += 1
                else:
                    break
            result = result[0]
            return result # 1개 리턴



def run_self(user_info, user):
    user_info["personal_color"] = set_personal_color(user_info["user_personal_color"])    
    user_info["style"] = set_style(user_info["who"], user_info["where"])

    if user_info["where"] in ["funeral", "marry"]:
        user_info["personal_color"] = ["검정색"]
    
    coordiset = {
        "top": [],
        "pants": [],
        "shoes": [],
        "outer": [],
        "bag": [],
        "watch": [],
        "headwear": [],
        "acc": []
    }
    coordiset["top"] = set_top(user_info)
    for item in user_info["user_pick_item"]:
        if item == "pants":
            coordiset["pants"] = set_pants(user_info, 0)
        elif item == "shoes":
            coordiset["shoes"] = set_shoes(user_info, 0)
        elif item == "outer":
            coordiset["outer"] = set_outer(user_info, 0)
        elif item == "bag":
            coordiset["bag"] = set_bag(user_info, 0)
        elif item == "watch":
            coordiset["watch"] = set_watch(user_info, 0)
        elif item == "headwear":
            coordiset["headwear"] = set_headwear(user_info, 0)
        elif item == "acc":
            coordiset["acc"] = set_acc(user_info, 0)

    for top_item in coordiset["top"]:
        if "pants" not in user_info["user_pick_item"]:
            coordiset["pants"].append(set_pants(user_info, top_item))
        if "outer" not in user_info["user_pick_item"]:
            coordiset["outer"].append(set_outer(user_info, top_item))
        if "acc" not in user_info["user_pick_item"]:
            coordiset["acc"].append(set_acc(user_info, top_item))
    for pants_item in coordiset["pants"]:
        if "shoes" not in user_info["user_pick_item"]:
            coordiset["shoes"].append(set_shoes(user_info, pants_item))
    for shoes_item in coordiset["shoes"]:
        if "bag" not in user_info["user_pick_item"]:
            coordiset["bag"].append(set_bag(user_info, shoes_item))
        if "watch" not in user_info["user_pick_item"]:
            coordiset["watch"].append(set_watch(user_info, shoes_item))
        if "headwear" not in user_info["user_pick_item"]:
            coordiset["headwear"].append(set_headwear(user_info, shoes_item))
    result = []
    for z in range(5):
        one_set = dict()
        for c in ["top", "pants", "shoes", "outer", "bag", "watch", "headwear", "acc"]:
            one_set[c] = coordiset[c][z]
        for item in user_info["user_pick_item"]:    # 유저가 아이템을 옷장에서 선택한 경우
            one_set[item] = -2
    
        serializer = CoordiSerializer(data=one_set)
        merged = Image.new('RGBA', (150 * 3, 150 * 3), (250,250,250,0))
        i, j = 0, 0
        for idx, value in one_set.items():
            chk = 0
            if value == -1:
                continue
            if idx == 'headwear':
                i, j = 0, 0
                if value == -2:
                    chk = 1
                else:
                    A = Headwear.objects.get(pk=value)
            elif idx == 'top':
                i, j = 0, 1
                if value == -2:
                    chk = 1
                else:
                    A = Top.objects.get(pk=value)
            elif idx == 'outer':
                i, j = 0, 2
                if value == -2:
                    chk = 1
                else:
                    A = Outer.objects.get(pk=value)
            elif idx == 'acc':
                i, j = 1, 0
                if value == -2:
                    chk = 1
                else:
                    A = Accessory.objects.get(pk=value)
            elif idx == 'pants':
                i, j = 1, 1
                if value == -2:
                    chk = 1
                else:
                    A = Pants.objects.get(pk=value)
            elif idx == 'bag':
                i, j = 1, 2
                if value == -2:
                    chk = 1
                else:
                    A = Bag.objects.get(pk=value)
            elif idx == 'watch':
                i, j = 2, 0
                if value == -2:
                    chk = 1
                else:
                    A = Watch.objects.get(pk=value)
            elif idx == 'shoes':
                i, j = 2, 1
                if value == -2:
                    chk = 1
                else:
                    A = Shoes.objects.get(pk=value)
            if chk:
                im = Image.open(user_info['user_pick_item'][idx][2])
            else:
                imgpath = './media/' + idx + '/' + A.img
                im = Image.open(imgpath)
            merged.paste(im, (150 * j, 150 * i))

        now = datetime.datetime.now()
        nowDate = now.strftime('%M%H%S')
        targeturl = "usercoordi/" + user.username + '_' + nowDate + '_' + str(z) + '.png'
        merged.save('./media/' + targeturl)
        if serializer.is_valid():
            serializer.save(user=user, img=targeturl, c_code=0)
            uimg = UserCoordi.objects.last()
            result.append({'id' : uimg.id, 'img' : targeturl})
    
    return result



