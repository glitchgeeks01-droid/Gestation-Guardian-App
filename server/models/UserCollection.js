
class UserCollection {
    constructor(userId, collectionKey, data, lastUpdated) {
        this.userId = userId;
        this.collectionKey = collectionKey;
        this.data = data;
        this.lastUpdated = lastUpdated;
    }
}
module.exports = UserCollection;
