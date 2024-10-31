const { loginUser, registerUser, logoutUser ,AssignTask ,  DeleteTask2, UpdateTitle2, UpdateDescription2, UpdateStatus2} = require("../controllers/userController")
const {protect} = require("../middlewares/authMiddleware");
const router = require("express").Router()

router.post("/loginUser", loginUser)
router.post("/registerUser", registerUser)
router.get("/logoutUser", logoutUser)
router.get("/addTask",protect, AssignTask)

router.post("/UpdateStatus",UpdateStatus2)
router.post("/UpdateDescription" ,UpdateDescription2)
router.post("/UpdateTitle",UpdateTitle2)
router.post("/DeleteTask",DeleteTask2)

module.exports = router