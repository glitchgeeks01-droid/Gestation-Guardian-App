
const UserCollection = require('../models/UserCollection');
class SyncMapper {
    static toEntity(dto) {
        return new UserCollection(dto.userId, dto.key, dto.data, new Date());
    }
}
module.exports = SyncMapper;
