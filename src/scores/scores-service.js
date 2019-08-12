const ScoresService = {
    getAllScores(db){
        return db
            .from('scores')
            .select('*')
    },
    serializeScore(score) {
        return {
            id: score.id,
            initials: score.initials,
            score: score.score
        }
    },
    insertScore(db, newScore){
        return db
            .insert(newScore)
            .into('scores')
            .returning('*')
            .then(([score]) => score)
    }
}

module.exports = ScoresService