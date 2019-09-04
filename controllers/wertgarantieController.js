exports.policies = function getPolicies(req, res) {
    // return mock policies
    res.send({
        title: "Dingenskirchen",
        benefits: [
            "Schutz bei Displaybrüchen",
            "Schutz bei Wasserschäden",
            "Schutz bei Akku-Defekten"
        ]
    })
}