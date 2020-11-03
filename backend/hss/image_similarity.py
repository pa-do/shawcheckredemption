# import cv2
# import numpy
# print('OpenCV = ', cv2.__version__)
#
# fileList = []
# for i in range(1, 19):
#     ans = str(i) + '.png'
#     fileList.append(ans)
#
# imgList = []
# for file in fileList:
#     img = cv2.imread(file, cv2.IMREAD_GRAYSCALE)
#     imgList.append(img)
#
# contours = []
# for im in imgList:
#     ret, imgBin = cv2.threshold(im, 127, 255,0)
#     conts, hierarchy = cv2.findContours(imgBin, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
#     contour = conts[0]
#     contours.append(contour)
#
# print("Shape Distances Between \n-------------------------")
# index = 0
# for contour in contours:
#     m = cv2.matchShapes(contours[0], contour, 1, 0)
#     print("{0} and {1} : {2}".format(fileList[0], fileList[index], m))
#     index = index + 1
# cv2.waitKey()

from PIL import Image
import imagehash
import time

hash = imagehash.average_hash(Image.open('1.PNG'))
A = time.time()
for i in range(1,6):
    ans = str(i) + '.PNG'
    otherhash = imagehash.average_hash(Image.open(ans))
    print(str(i) + '번째', hash - otherhash)
B = time.time()
print('걸린시간', B-A)
