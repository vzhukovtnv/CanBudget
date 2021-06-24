var express = require('express');
var router = express.Router();

const userDB = require('../models/user');


router.get('/', async (req, res) => {
  let data = await userDB.getUserList();
  console.info(`Users retrieved: `, data?.length)
  res.send(data);
});


router.put("/:id/addcashflow/", async(req, res) => {
  let userId = req.params.id
  let newCashFlow = req.body
  console.log(userId, newCashFlow)
  let response = await userDB.addCashFlow(userId, newCashFlow)
  res.send(response)
})

router.put("/:id/addbalancesheet/", async(req, res) => {
  let userId = req.params.id
  let newBalanceSheet = req.body
  console.log(userId, newBalanceSheet)
  let response = await userDB.addBalanceSheet(userId, newBalanceSheet)
  res.send(response)
})

router.post("/", async (req, res) => {
  let inputData = req.body
  try {
  let newUser = await userDB.createUser(inputData);
  res.send(newUser)} catch (error){console.log(error)}
})




module.exports = router;
