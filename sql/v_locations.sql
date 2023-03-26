SELECT 
     `l`.`id` AS `id`
	,`l`.`episodeId` AS `episodeId`
	,`l`.`locationNum` AS `locationNum`
	,`l`.`locationName` AS `locationName`
	,`l`.`locationProv` AS `locationProv`
	,`l`.`locationCountry` AS `locationCountry`
	,`l`.`song` AS `song`
	,`l`.`startTime` AS `startTime`
	,`e`.`episodeTag` AS `episodeTag`
	,CONCAT (
		`e`.`episodeTag`
		,'-L'
		,lpad(`l`.`locationNum`, 2, '0')
		) AS `locationTag`
	,CONCAT (
		`l`.`locationName`
		,', '
		,`l`.`locationProv`
		,', '
		,`l`.`locationCountry`
		) AS `locationDesc`
FROM (
	           `locations` `l` 
    LEFT JOIN `v_episodes` `e` ON ((`e`.`id` = `l`.`episodeId`))
	)
