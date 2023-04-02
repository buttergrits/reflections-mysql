-- Active: 1680460815096@@fizzypi.lan@3306@reflections
select `episodes`.`id` AS `id`,
    `episodes`.`seasonNum` AS `seasonNum`,
    `episodes`.`episodeNum` AS `episodeNum`,
    `episodes`.`episodeNumAlt` AS `episodeNumAlt`,
    elc.locationCount,
    concat(
        'S', lpad(`episodes`.`seasonNum`    , 2, '0'),
        'E', lpad(`episodes`.`episodeNum`   , 2, '0'),
        '.', lpad(`episodes`.`episodeNumAlt`, 2, '0')
    ) AS `episodeTag`,
    `episodes`.`notes` AS `notes`
from `episodes`
left join `v_episode_locationCount` elc on elc.id = `episodes`.`id`
