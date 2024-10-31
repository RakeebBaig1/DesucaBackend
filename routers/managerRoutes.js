const { loginUser , Manager_Own_Task,AssignTask} = require("../controllers/managerController")
const {protect} = require("../middlewares/authMiddleware");
const router = require("express").Router()

router.post("/loginUser", loginUser)
router.post("/getManagerTasks", Manager_Own_Task)
router.post("/getTasks", AssignTask)


module.exports = router