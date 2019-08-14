function makeScoresArray(){
    return [
        {
            id:1,
            initials:'ABC',
            score:12
        },
        {
            id:2,
            initials:'ABd',
            score:13
        },
        {
            id:3,
            initials:'ABe',
            score:14
        },
        {
            id:4,
            initials:'ABf',
            score:15
        },
        {
            id:5,
            initials:'ABg',
            score:16
        },
    ]
}

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
              scores`
        )
        .then(() => 
            Promise.all([
              trx.raw(`ALTER SEQUENCE scores_id_seq minvalue 0 START WITH 1`), 
              trx.raw(`SELECT setval('scores_id_seq', 0)`), 
            ])
        )
    )
}

function seedScores(db, scores) {
    const preppedScores= scores.map(score => ({
        ...score,
    }))
    return db.into('scores').insert(preppedScores)
        .then(() =>
        //update the auto sequence to stay in sync
            db.raw(
            `SELECT setval('scores_id_seq', ?)`,
                [scores[scores.length - 1].id],
            )
        )
    }

module.exports = {
    makeScoresArray,
    cleanTables,
    seedScores
}