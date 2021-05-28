import cv2
import json
import numpy as np
import matplotlib.pyplot as plt


IMG_PATH = 'sgrouplogo.png'
OUT_JSON = 'sgroup.json'

def get_contour_precedence(contour, cols):
    tolerance_factor = 10
    origin = cv2.boundingRect(contour)
    return ((origin[1] // tolerance_factor) * tolerance_factor) * cols + origin[0]


def sort_contours(cnts, method="left-to-right"):
    # initialize the reverse flag and sort index
    reverse = False
    i = 0

    # handle if we need to sort in reverse
    if method == "right-to-left" or method == "bottom-to-top":
        reverse = True

    # handle if we are sorting against the y-coordinate rather than
    # the x-coordinate of the bounding box
    if method == "top-to-bottom" or method == "bottom-to-top":
        i = 1

    # construct the list of bounding boxes and sort them from top to
    # bottom
    boundingBoxes = [cv2.boundingRect(c) for c in cnts]
    (cnts, boundingBoxes) = zip(*sorted(zip(cnts, boundingBoxes),
                                        key=lambda b: b[1][i], reverse=reverse))

    # return the list of sorted contours and bounding boxes
    return cnts, boundingBoxes

def grab_contours(cnts):
    # if the length the contours tuple returned by cv2.findContours
    # is '2' then we are using either OpenCV v2.4, v4-beta, or
    # v4-official
    if len(cnts) == 2:
        cnts = cnts[0]

    # if the length of the contours tuple is '3' then we are using
    # either OpenCV v3, v4-pre, or v4-alpha
    elif len(cnts) == 3:
        cnts = cnts[1]

    # otherwise OpenCV has changed their cv2.findContours return
    # signature yet again and I have no idea WTH is going on
    else:
        raise Exception(("Contours tuple must have length 2 or 3, "
            "otherwise OpenCV changed their cv2.findContours return "
            "signature yet again. Refer to OpenCV's documentation "
            "in that case"))

    # return the actual contours array
    return cnts
    re

def x_cord_contour(contours):
    #Returns the X cordinate for the contour centroid
    if cv2.contourArea(contours) > 10:
        M = cv2.moments(contours)
        return (int(M['m10']/M['m00']))
    else:
        pass

def resize(img, scale_percent = 1):
    width = int(img.shape[1] * scale_percent)
    height = int(img.shape[0] * scale_percent)
    dim = (width, height)
    resized = cv2.resize(img, dim, interpolation = cv2.INTER_AREA)
    return resized

image = cv2.imread(IMG_PATH)
orig = image.copy()

image = resize(image, 0.8)
# convert the image to grayscale, blur it, and find edges
# in the image
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
gray = cv2.bilateralFilter(gray, 11, 17, 17)

edged = cv2.Canny(gray, 30, 200)


# find contours in the edged image, keep only the largest
# ones, and initialize our screen contour
cnts  = cv2.findContours(edged.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
contours = grab_contours(cnts)

# contours= sorted(contours, key=cv2.contourArea)
# contours= sorted(contours, key=lambda x:get_contour_precedence(x, image.shape[1]))
# contours= sorted(contours, key=x_cord_contour)


# sort the contours according to the provided method
# (contours, boundingBoxes) = sort_contours(contours, method="top-to-bottom")



# Labeling Contours for tracking
# for (i,c)  in enumerate(contours):
#     cv2.drawContours(image, [c], -1, (0,0,255), 3)  
#     M = cv2.moments(c)
#     cx = int(M['m10'] / M['m00'])
#     cy = int(M['m01'] / M['m00'])
#     cv2.putText(image, str(i+1), (cx, cy), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
#     cv2.imshow('6 - Left to Right Contour', image)
#     cv2.waitKey(0)
#     (x, y, w, h) = cv2.boundingRect(c)  
    
#     # Let's now crop each contour and save these images
#     cropped_contour = image[y:y + h, x:x + w]
#     image_name = "output_shape_number_" + str(i+1) + ".jpg"
#     print(image_name)
#     # cv2.imwrite(image_name, cropped_contour)
    
# cv2.destroyAllWindows()


contours = np.vstack(contours).squeeze()
data = []
for x, y in contours:
    data.append({"x": int(x), "y": int(y)}) 


with open(OUT_JSON, 'w') as f:
    json.dump(data, f, indent=2)




x = [item['x'] for item in data];
y = [item['y'] for item in data]

# s = [1] * len(x)
# plt.scatter(x, y, s)
plt.plot(x, y)
plt.show()



# cv2.imshow('name', image)

# cv2.waitKey(0)
# cv2.destroyAllWindows()