select
    `scriptures`.`locationId` AS `locationId`,
    count(`scriptures`.`id`) AS `numScriptsAtLocation`
from `scriptures`
group by `scriptures`.`locationId`