const { LoginAdmin } = require("../controllers/adminController")
const {GetListUser} = require("../controllers/adminController")
const {registerUserbyAdmin} = require("../controllers/adminController")
const {ChangeManager} = require("../controllers/adminController")
const {GetManager}=require("../controllers/adminController")
const {AssignTask}=require("../controllers/adminController")
const {GetListOfTask}=require("../controllers/adminController")
const {GetotherUsers}=require("../controllers/adminController")

const {getUserForManager} =require("../controllers/adminController")

const {UpdateStatus} = require("../controllers/adminController")
const {UpdateDescription}=require("../controllers/adminController")
const {UpdateTitle}=require("../controllers/adminController")
const {DeleteTask}=require("../controllers/adminController")

const {protect} = require("../middlewares/authMiddleware")
const router = require("express").Router()

router.post("/getalltask", GetListOfTask)
router.post("/LoginAdmin", LoginAdmin)
router.get("/getUsers", GetListUser)
router.post("/newUser", registerUserbyAdmin)
router.post("/assignNewManager", ChangeManager)
router.post("/getmanager", GetManager)
router.post("/assignTask", AssignTask)

router.post("/UpdateStatus", UpdateStatus)
router.post("/UpdateDescription", UpdateDescription)
router.post("/UpdateTitle", UpdateTitle)
router.post("/DeleteTask", DeleteTask)

router.post("/getUserlistForManager", getUserForManager)
router.post("/getUser_unassign_Manager", GetotherUsers)




module.exports = router