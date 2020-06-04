module.exports.lockSchema = {
    "type": "object",
    "properties": {
        priceRanges: {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    minClose: {
                        "type": "integer"
                    },
                    maxOpen: {
                        "type": "integer"
                    },
                    requiredLockPrice: {
                        "type": "integer"
                    }
                }
            }
        }
    }
}
