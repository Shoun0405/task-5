const User = require('../model/auth')
const generateToken = require('../config/jwtToken')
const expressAsyncHandler = require('express-async-handler')
const validateMongodbId = require('../util/validateMongodbId')



//----------------------------------------
//               Register 
//----------------------------------------

const userRegisterCtrl = expressAsyncHandler(async (req,res) => {

    const {email} = req?.body

    const userExist = await User.findOne({email})

    const message = userExist ? 'User alredy exists' : 'Register successfully'

    const current = userExist ? false : true

    if (!userExist) {
      try {
  
          const user = await User.create({
  
              firstName:req?.body?.firstName,
              lastName:req?.body?.lastName,
              email:req?.body?.email,
              password:req?.body?.password
          })
          res.json({user,current,message})
  
      } catch (error) {
        return res.status(400).json(error.errors)
  
      }
    } else{
      res.status(400).json({current,message})
    }
    
    })

//----------------------------------------
//                LogIn 
//----------------------------------------

const userLoginCtrl = expressAsyncHandler(async (req,res) => {

    const {email,password} = req?.body

    const userFound = await User.findOne({ email })

    if (userFound && (await userFound.isPasswordMatched(password))) {

        res.json({
            _id:userFound?._id,
            firstName:userFound?.firstName,
            lastName:userFound?.lastName,
            email:userFound?.email,
            isBlocked:userFound?.isBlocked,
            token:generateToken(userFound?._id)
        })
        
    }else{
        res.status(401)
        throw new Error('Login filed')
    }
})

//----------------------------------------
//              All Users 
//----------------------------------------

const allUsersCtrl = expressAsyncHandler(async (req, res) => {
    try {
        const allUsers = await User.find({})
        res.json(allUsers)
    } catch (error) {
        res.errored(error)
    }
})

//----------------------------------------
//             Delete Users 
//----------------------------------------

const deleteUserCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    //check if user id is valid
    validateMongodbId(id);
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      res.json(deletedUser);
    } catch (error) {
      res.errored(error);
    }
  });

const deleteUsersCtrl = expressAsyncHandler(async (req, res) => {
  const deleteUsers = req?.body?.deleteUsers
  try {
    const findeDelete = await User.find({'_id':{$in:deleteUsers}}).deleteMany({})
    res.json(findeDelete);
  } catch (error) {
    console.log(error)
    res.errored(error);
  }



});

//----------------------------------------
//              User Profile 
//----------------------------------------

const userProfileCtrl = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
      const myProfile = await User.findById(id)
      res.json(myProfile);
    } catch (error) {
      res.json(error);
    }
  });

//----------------------------------------
//              Update Profile 
//----------------------------------------
  
  const updateUserCtrl = expressAsyncHandler(async (req, res) => {
    const { _id } = req?.user;
    validateMongodbId(_id);
    try {
      
    const user = await User.findByIdAndUpdate(
      _id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(user);
    } catch (error) {
      res.json(error)
    }
  });
  

//----------------------------------------
//              Block User 
//----------------------------------------


const blockOrUnblockUserCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req?.user;
  validateMongodbId(_id);
  try {
    
  const blockedOrUnblockedUser = await User.findByIdAndUpdate(
    _id,
    {
      isBlocked: req?.body?.isBlocked
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json(blockedOrUnblockedUser);
  } catch (error) {
    res.json(error)
  }
});
  

//----------------------------------------
//              Block Many User 
//----------------------------------------
  
const blockOrUnblockUsersCtrl = expressAsyncHandler(async (req, res) => {

  const blockedUsers = req?.body?.blockedUsers
  const unblockedUsers = req?.body?.unblockedUsers

  const blockedLeng = blockedUsers?.length
  const unblockedLeng = unblockedUsers?.length

  try {
    
  if ( blockedLeng > 0) {
    
    await User.find({'_id':{$in:blockedUsers}}).updateMany(
      {},{
        $set:{
          isBlocked:true
        }
      }
    
    )
    }
  if (unblockedLeng > 0) {
    
    await User.find({'_id':{$in:unblockedUsers}}).updateMany(
      {},{
        $set:{
          isBlocked:false
        }
      }
    
    )
  }
  
      const blockedAllUsers = await User.find({'_id':{$in:blockedUsers}})
      const unblockedAllUsers = await User.find({'_id':{$in:unblockedUsers}})
  
  
    res.json({
      blockedAllUsers,
      unblockedAllUsers,
    })
  } catch (error) {
    res.json(error)
  }

});



module.exports = {
    userRegisterCtrl,
    userLoginCtrl,
    allUsersCtrl,
    deleteUserCtrl,
    deleteUsersCtrl,
    userProfileCtrl,
    updateUserCtrl,
    blockOrUnblockUserCtrl,
    blockOrUnblockUsersCtrl
}