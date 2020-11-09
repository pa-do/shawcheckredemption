import cv2, sys
import numpy as np

# image 저장 경로
import os
from collections import defaultdict


color_name = ['흰색', '라이트그레이', '회색', '다크 그레이', '검정색', '딥레드', '빨간색', 
              '라즈베리', '네온 핑크', '분홍색', '라이트 핑크', '페일 핑크', '피치', '코랄', 
              '라이트 오렌지', '네온 오렌지', '오렌지 핑크', '주황색', '아이보리', '라이트 옐로우',
              '노란색', '머스타드', '네온 그린', '라이트 그린', '민트', '녹색', '올리브 그린', '카키',
              '다크 그린', '스카이 블루', '네온 블루', '파란색', '네이비', '자주', '라벤더', '보라색', 
              '버건디', '갈색', '로즈골드', '레드 브라운', '카키 베이지', '카멜', '샌드', '베이지색', 
              '데님', '연청', '중청', '진청', '흑청']

color_chip_hsv = [[160, 0, 240], [40, 6, 203], [40, 1, 146], [145, 11, 82], [160, 0, 0],
                  [234, 152, 90], [237, 232, 111], [231, 157, 131], [215, 193, 116], [215, 224, 124],
                  [232, 240, 197], [6, 115, 177], [11, 220, 184], [4, 193, 153], [20, 240, 120],
                  [14, 238, 120], [237, 178, 142], [7, 224, 129], [43, 240, 232], [32, 219, 176],
                  [37, 231, 138], [28, 209, 130], [45, 206, 122], [52, 238, 93], [113, 122, 121],
                  [74, 190, 90], [46, 92, 91], [39, 53, 70], [84, 93, 45], [131, 179, 152],
                  [139, 236, 113], [161, 234, 133], [147, 240, 46], [216, 240, 59], [182, 102, 153],
                  [188, 207, 55], [234, 133, 72], [22, 121, 57], [7, 119, 115], [16, 240, 89],
                  [29, 240, 76], [25, 163, 123], [24, 78, 165], [26, 166, 170], [140, 44, 106],
                  [142, 77, 122], [142, 85, 63], [148, 48, 38], [100, 7, 32]]


# 이미지 전처리, 
# input: 옷 사진
# output: 옷의 색상과 정방형의 png 파일
def image_preprocess(target_item):
    # image = cv2.imread(os.path.join(file_path , str(target_item) + '.jpg'), cv2.IMREAD_UNCHANGED)
    image = cv2.imread(target_item, cv2.IMREAD_UNCHANGED)
    image_hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    image_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
    
    ## 외곽선 검출 및 배경 제거
    blur = cv2.GaussianBlur(image_gray, ksize=(5,5), sigmaX=0)
    ret, thresh1 = cv2.threshold(blur, 127, 255, cv2.THRESH_BINARY)

    edged = cv2.Canny(blur, 10, 250)

    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (7,7))
    closed = cv2.morphologyEx(edged, cv2.MORPH_CLOSE, kernel)

    contours, _ = cv2.findContours(closed.copy(),cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # 경계선 내부 255로 채우기
    height, width, channel = image.shape
    mask = np.zeros((height, width, 4), np.uint8)
    cv2.fillPoly(mask, contours, (255,)*image.shape[2], )
    masked_image = cv2.bitwise_and(image, mask)
    new_img = cv2.bitwise_and(image, mask)
    
    # 색상 추출하기
    (B, G, R, A) = cv2.split(new_img)
    (H, S, V) = cv2.split(image_hsv)
    
    # 최빈값
    color = defaultdict(int)
    cnt = 0
    for i in range(len(A)):
        for j in range(len(A[0])):
            if A[i][j]:
                color[str(H[i][j]) + '-' + str(S[i][j]) + '-' + str(V[i][j])] += 1
                cnt += 1
    
    mod_h, mod_s, mod_v = sorted(color.items(), reverse=True, key=lambda item: item[1])[0][0].split('-')
    mod_h, mod_s, mod_v = int(mod_h), int(mod_s), int(mod_v)
    
    mod_diff = []
    for name, chip in zip(color_name, color_chip_hsv):
        mod_temp = (mod_h - chip[0])**2 + (mod_s - chip[1])**2 + (mod_v - chip[2])**2
        mod_diff.append(mod_temp)
    print(color_name[mod_diff.index(min(mod_diff))])
    result_color = color_name[mod_diff.index(min(mod_diff))]
    print(result_color)
            
    ## trim
    contours_xy = np.array(contours)
    
    x_min, x_max = 0,0
    y_min, y_max = 0,0
    xs = []
    ys = []
    for i in range(len(contours_xy)):
        for j in range(len(contours_xy[i])):
            xs.append(contours_xy[i][j][0][0]) 
            ys.append(contours_xy[i][j][0][1]) 
    x_min, x_max = min(xs), max(xs)
    y_min, y_max = min(ys), max(ys)

    x = x_min
    y = y_min
    w = x_max-x_min
    h = y_max-y_min
    
    img_trim = new_img[y:y+h, x:x+w]
    
    
    # 정방형으로 만들기
    height, width, channel = img_trim.shape
    size = max(height, width)
    resize_image = np.zeros((size, size, 4), np.uint8)
    if height == size:
        diff = (height // 2) - (width // 2)
        for i in range(size):
            for j in range(size):
                if j > diff and j < diff + width:
                    resize_image[i][j] = img_trim[i][j - diff]
    else:
        diff = (width // 2) - (height // 2)
        for i in range(size):
            for j in range(size):
                if i > diff and i < diff + height:
                    resize_image[i][j] = img_trim[i - diff][j]
    cv2.imwrite(os.path.join(file_save , str(0) + '.png'), resize_image)

    return result_color