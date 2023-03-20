# Resilient Homeland Data Map 韌性家園數據監測地圖系統 - 測試版
瀏覽網頁(建議尺寸 1920x1080) https://yunchen-lee.github.io/GIAAIL_Resilient-Homeland-Data-Map_v0/

目前功能測試
* 串接國網資料庫 API
* 滾動式視覺化地圖，透過滑鼠來回捲動於各資料集間切換

## 首頁介面
於首頁總覽地圖上所有資料集的分布
![image](https://github.com/yunchen-lee/GIAAIL_Resilient-Homeland-Data-Map_v0/blob/main/ref/0-cover.PNG)

## 資料集介面
* A 顯示資料集簡介，或切換為顯示資料集的資料內容 (圖片、影片、文字、連結等等)
* B 將資料視覺化於地圖
* C 縮小版地圖以大尺度查看資料集所在位置

![image](https://github.com/yunchen-lee/GIAAIL_Resilient-Homeland-Data-Map_v0/blob/main/ref/1-infocard-2.png)

## 資料庫 API 串接 - 以交大建築物圖片為例
![image](https://github.com/yunchen-lee/GIAAIL_Resilient-Homeland-Data-Map_v0/blob/main/ref/2-nchcImages-data.PNG)

點擊資料點時透過 API url 抓取圖片 (圖片讀取目前需要約3秒，此問題後續將進行優化)
![image](https://github.com/yunchen-lee/GIAAIL_Resilient-Homeland-Data-Map_v0/blob/main/ref/2-nchcImages.PNG)

## 3D 地景模式
可在 2D 地圖與 3D 地圖之間切換
![image](https://github.com/yunchen-lee/GIAAIL_Resilient-Homeland-Data-Map_v0/blob/main/ref/3-terrin.PNG)
