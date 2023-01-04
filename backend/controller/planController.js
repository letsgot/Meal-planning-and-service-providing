const FoodplanModel = require("../model/planModel");

async function getAllPlansController(req, res) {
  try {
    // mera obj jo hai wo empty ??
    let plans = await FoodplanModel.find();
    res.status(200).json({
      Allplans: plans
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err.message });
  }
}

async function createPlanController(req, res) {
  try {
    console.log(req.body);
    let planNewObject = req.body;
    let isdataPresent = Object.keys(planNewObject).length > 0;
    // mera obj jo hai wo empty ??
    if (isdataPresent) {
      // got data successfully
      let newPlan = await FoodplanModel.create(planNewObject);
      console.log("10 planController", newPlan);
      res.status(201).json({
        result: "plan created",
        plan: newPlan
      })
    }
    else {
      // data incomplete
      res.status(404).json({
        message: "data is incomplete"
      })
    }
  } catch (error) {
    // internal error
    res.status(500).json({
      error: error.message
    })
  }
}

async function updatePlanController(req, res) {
  try {
    console.log(req.body);
    let id = req.params.planRoutes;
    let planNewObject = req.body;
    let isdataPresent = Object.keys(planNewObject).length > 0;
    // mera obj jo hai wo empty ??
    if (isdataPresent) {
      // got data successfully
      let plan = await FoodplanModel.findById(id);
      for(let key in planNewObject){
        plan[key] = planNewObject[key];
      }
      await plan.save();
      console.log("55 Update", plan);
      res.status(201).json({
        result: "plan found",
        plan: plan
      })
    }
    else {
      // data incomplete
      res.status(404).json({
        message: "data is incomplete"
      })
    }
  } catch (error) {
    // internal error
    res.status(500).json({
      error: error.message
    })
  }
}

async function deletePlanController(req, res) {
  try {
    let id = req.params.planRoutes;
    let plan = await FoodplanModel.findOneAndDelete(id);
    console.log("100000" + plan);
    // await plan.save();
    res.status(200).json({
      result: "plan found",
      plan: plan
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      "message": "Internal error"
    });
  }
}

async function getPlanController(req, res) {
  try {
    let id = req.params.planRoutes;
    let plan = await FoodplanModel.findById(id);
    console.log("100000" + plan);
    res.status(200).json({
      result: "plan found",
      plan: plan
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      "message": "Internal error"
    });
  }
}


module.exports = {
  getAllPlansController,
  createPlanController,
  updatePlanController,
  deletePlanController,
  getPlanController
}
