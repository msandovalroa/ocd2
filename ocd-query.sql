SELECT
    IFNULL(IF(latitude_way = 1 AND longitude_way = 1, 'Noreste', 
	IF(latitude_way = 1 AND longitude_way = 0, 'Noroeste', IF(latitude_way = 0 AND longitude_way = 1, 
	'Sureste', IF(latitude_way = 0 AND longitude_way = 0, 'Suroeste', '') ) ) ), '-') AS direccion
FROM `obd_data_1`.`gps_data_2018` WHERE obd_data_1.gps_data_2018.car_id IN (2694, 2721)
group by car_id;


SELECT * FROM `obd_data_1`.`gps_data_2018` WHERE car_id != 2694;

select * from trip_driver;

SELECT *
                 FROM obd_config.TCars 
 
                     INNER JOIN obd_config.TOrganization
                         ON obd_config.TCars.o_path = obd_config.TOrganization.o_path 
                     INNER JOIN obd_data_1.trip_data
                         ON obd_config.TCars.c_id = obd_data_1.trip_data.car_id
 
                 WHERE obd_config.TCars.c_id = 2694 AND 
    TIMESTAMP(DATE_SUB(obd_data_1.trip_data.start_time, INTERVAL 360 MINUTE)) >= '2017-01-01 00:00:01' 
ORDER BY obd_data_1.trip_data.start_time DESC;



SELECT * FROM obd_data_1.alarm_data;


SELECT c_id, c_vehicleNO, o_name, MAX(end_time) as final, end_addr, obd_data_1.trip_data.status, 
 (SELECT IFNULL(IF(obd_data_1.gps_data_2018.latitude_way = 1 AND obd_data_1.gps_data_2018.longitude_way = 1, 'NE', 
 IF(obd_data_1.gps_data_2018.latitude_way = 1 AND obd_data_1.gps_data_2018.longitude_way = 0, 'NO', 
 IF(obd_data_1.gps_data_2018.latitude_way = 0 AND obd_data_1.gps_data_2018.longitude_way = 1, 'SE', 
 IF(obd_data_1.gps_data_2018.latitude_way = 0 AND obd_data_1.gps_data_2018.longitude_way = 0, 'SO', '') ) ) ), '-')
 FROM obd_data_1.gps_data_2018 WHERE  obd_data_1.gps_data_2018.car_id=obd_config.TCars.c_id
  AND collect_datetime = (SELECT MAX(collect_datetime) FROM obd_data_1.gps_data_2018 WHERE car_id = obd_config.TCars.c_id)) AS direccion,
(SELECT speed
 FROM obd_data_1.gps_data_2018 WHERE  obd_data_1.gps_data_2018.car_id=obd_config.TCars.c_id
  AND collect_datetime = (SELECT MAX(collect_datetime) FROM obd_data_1.gps_data_2018 WHERE car_id = obd_config.TCars.c_id)) as speed
 
                 FROM obd_config.TCars 
                     INNER JOIN obd_config.TOrganization
                         ON obd_config.TCars.o_path = obd_config.TOrganization.o_path 
                     INNER JOIN obd_data_1.trip_data
                         ON obd_config.TCars.c_id = obd_data_1.trip_data.car_id
                 WHERE obd_config.TCars.c_id IN (2694, 2721)
group by c_id;


SELECT c_id, c_vehicleNO, o_name, MAX(end_time) as final, end_addr, obd_data_1.trip_data.status, 
				 (SELECT IFNULL(IF(obd_data_1.gps_data_2018.latitude_way = 1 AND obd_data_1.gps_data_2018.longitude_way = 1, 'NE', 
				 IF(obd_data_1.gps_data_2018.latitude_way = 1 AND obd_data_1.gps_data_2018.longitude_way = 0, 'NO', 
				 IF(obd_data_1.gps_data_2018.latitude_way = 0 AND obd_data_1.gps_data_2018.longitude_way = 1, 'SE', 
				 IF(obd_data_1.gps_data_2018.latitude_way = 0 AND obd_data_1.gps_data_2018.longitude_way = 0, 'SO', '') ) ) ), '-')
				 FROM obd_data_1.gps_data_2018 WHERE  obd_data_1.gps_data_2018.car_id=obd_config.TCars.c_id
				  AND collect_datetime = (SELECT MAX(collect_datetime) FROM obd_data_1.gps_data_2018 WHERE car_id = obd_config.TCars.c_id)) AS direccion,
				(SELECT speed
				 FROM obd_data_1.gps_data_2018 WHERE  obd_data_1.gps_data_2018.car_id=obd_config.TCars.c_id
				  AND collect_datetime = (SELECT MAX(collect_datetime) FROM obd_data_1.gps_data_2018 WHERE car_id = obd_config.TCars.c_id)) as speed
				 
				                 FROM obd_config.TCars 
				                     INNER JOIN obd_config.TOrganization
				                         ON obd_config.TCars.o_path = obd_config.TOrganization.o_path 
				                     INNER JOIN obd_data_1.trip_data
				                         ON obd_config.TCars.c_id = obd_data_1.trip_data.car_id
				                 WHERE obd_config.TCars.c_id IN (1,1,3113,3115,1,2981,3396,2944,3114,3601,2925,2994,3485,1,2993,2938,2982,2936,2942,2940,1,2932,2935,2941,3034,2927,2931,2934,2939,2992,2926,2930,2933,2937,2943,3397,2928,1,2895,1,3033,2929)
				group by c_id;

SELECT IFNULL(SUM(IF(type = 2 OR type = 4 OR type = 5 OR type = 8,  1, 0)), 0) AS conteo,
          IFNULL(SUM(IF(type = 2, 1, 0)), 0) AS speeding, IFNULL(SUM(IF(type = 4, 1, 0)) , 0)AS acceleration, 
          IFNULL(SUM(IF(type = 5, 1, 0)), 0) AS braking, IFNULL(SUM(IF(type = 8, 1, 0)), 0) AS rpm
        FROM obd_data_1.alarm_data 
        WHERE car_id IN (2721) AND TIMESTAMP(DATE_SUB(d_time, INTERVAL 300 MINUTE)) 
          BETWEEN '" -" . $start_month . "-" . $start_day . " " . $start_hour . ":" . $start_minute . ":" . $start_second . "' 
                       AND '" . $end_year . "-" . $end_month . "-" . $end_day . " " . $end_hour . ":" . $end_minute . ":" . $end_second . "' ;


SELECT car_id, d_time_d, c_vehicleNO, IFNULL(SUM(IF(type = 2 OR type = 4 OR type = 5 OR type = 8, 1, 0)), 0) AS conteo, IFNULL(SUM(IF(type = 2, 1, 0)), 0) AS speeding, IFNULL(SUM(IF(type = 4, 1, 1)) , 0)AS acceleration, IFNULL(SUM(IF(type = 5, 1, 0)), 0) AS braking, IFNULL(SUM(IF(type = 8, 1, 0)), 0) AS rpm FROM obd_data_1.alarm_data INNER JOIN obd_config.TCars
ON obd_data_1.alarm_data.car_id =obd_config.TCars.c_id  WHERE car_id IN ( '1,1,3113,3115,1,2981,3396,2944,3114,3601,2925,2994,3485,1,2993,2938,2982,2936,2942,2940,1,2932,2935,2941,3034,2927,2931,2934,2939,2992,2926,2930,2933,2937,2943,3397,2928,1,2895,1,3033,2929' ) AND TIMESTAMP(DATE_SUB(d_time, INTERVAL '300' MINUTE)) BETWEEN '2018-03-13 20:05:15' AND '2018-03-12 20:05:15'  ;