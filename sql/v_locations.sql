SELECT `l`.`id`            AS `id`
	,`l`.`episodeId`       AS `episodeId`
	,`l`.`locationNum`     AS `locationNum`
	,`l`.`locationName`    AS `locationName`
	,`l`.`locationProv`    AS `locationProv`
	,`l`.`locationCountry` AS `locationCountry`
	,`l`.`song`            AS `song`
	,`l`.`startTime`       AS `startTime`
	,`l2`.`startTime`      AS `endTime`
	, TIME_FORMAT(TIMEDIFF(COALESCE(CONCAT('00:',`l2`.`startTime`), '00:27:00'), CONCAT('00:', `l`.`startTime`)), '%i:%s') AS `duration`
	,`e`.`episodeTag`      AS `episodeTag`
	,CONCAT (
		`e`.`episodeTag`
		,'-L'
		,lpad(`l`.`locationNum`, 2, '0')
		) AS `locationTag`
	,(
		CASE 
			WHEN (COALESCE(trim(`l`.`locationProv`), '-') IN ( '' ,'-'))
            THEN CONCAT (
						`l`.`locationName`
						,', '
						,`l`.`locationCountry`
						)
			ELSE CONCAT (
					`l`.`locationName`
					,', '
					,`l`.`locationProv`
					,', '
					,`l`.`locationCountry`
					)
			END
		) AS `locationDesc`
FROM (
	`locations` `l` 
    LEFT JOIN `v_episodes` `e`  ON ((`e`.`id` = `l`.`episodeId`))
    LEFT JOIN `locations`  `l2` ON ((`l2`.`episodeId`   = `l`.`episodeId`) 
                                AND (`l2`.`locationNum` = `l`.`locationNum` + 1)  )
	)
