import express from "express";

import CreditTransaction
  from "../models/CreditTransaction.js";

import { protect }
  from "../middleware/auth.js";


const router = express.Router();


// --------------------------------------------------
// GET CREDIT BALANCE + HISTORY
// --------------------------------------------------

router.get(
  "/",

  protect,

  async (req, res, next) => {

    try {

      const transactions =
        await CreditTransaction

          .find({
            userId:
              req.user._id
          })

          .sort("-createdAt");


      res.json({

        credits:
          req.user.credits,

        transactions

      });

    }

    catch (error) {

      next(error);

    }

  }
);


export default router;