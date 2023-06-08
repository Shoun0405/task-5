const express = require('express')
const { 
    userRegisterCtrl,
    userLoginCtrl,
    allUsersCtrl,
    deleteUserCtrl,
    userProfileCtrl,
    updateUserCtrl,
    blockOrUnblockUserCtrl,
    blockOrUnblockUsersCtrl,
    deleteUsersCtrl
 } = require('../controller/authCtrl')

 const authMiddleware = require('../middlewares/auth/authMiddleware')

const authRouts = express.Router()

authRouts.post("/register",userRegisterCtrl)
authRouts.get("/allusers", allUsersCtrl)
authRouts.post("/login",userLoginCtrl)
authRouts.get("/profile/:id",authMiddleware, userProfileCtrl)
authRouts.put("/:id",authMiddleware, updateUserCtrl)
authRouts.put("/change-status/:id",authMiddleware, blockOrUnblockUserCtrl)
authRouts.post("/change-statuses/",authMiddleware, blockOrUnblockUsersCtrl)
authRouts.delete("/delete/:id", authMiddleware, deleteUserCtrl)
authRouts.post("/deletes", authMiddleware, deleteUsersCtrl)

module.exports = authRouts