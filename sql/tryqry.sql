SELECT
`id`             
, `episodeId`      
, `locationNum`    
, `locationName`   
, `locationProv`   
, `locationCountry`
, `song`           
, `startTime`      
From locations l
left join v_episodes e on e.id = l.episodeId
 