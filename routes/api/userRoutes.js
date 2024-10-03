const router = require('express').Router();
const {
    getUsers,
    getSingleUser,
    updateUser,
    createUser,
    deleteUser,
    addFriend,
    removeFriend,
} = require('../../controllers/userController');

router.route('/').get(getUsers).post(createUser).delete(deleteUser);

router.route('/:userId').get(getSingleUser).post(updateUser);

router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;