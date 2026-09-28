import express from "express";

import StudyGroup
  from "../models/StudyGroup.js";

import { protect }
  from "../middleware/auth.js";


const router = express.Router();


// --------------------------------------------------
// GET STUDY GROUPS
// --------------------------------------------------

router.get(
  "/",

  async (req, res, next) => {

    try {

      const groups =
        await StudyGroup

          .find({
            isActive:
              true
          })

          .populate(
            "createdBy",
            "name"
          )

          .populate(
            "members",
            "name"
          );


      res.json({
        groups
      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// CREATE GROUP
// --------------------------------------------------

router.post(
  "/",

  protect,

  async (req, res, next) => {

    try {

      const {
        name,
        description,
        subject,
        topic,
        maxMembers = 20
      } = req.body;


      if (!name) {

        return res.status(400).json({

          message:
            "Group name is required"

        });

      }


      const group =
        await StudyGroup.create({

          name,

          description,

          subject,

          topic,

          maxMembers,

          createdBy:
            req.user._id,

          members: [
            req.user._id
          ]

        });


      res.status(201).json({

        message:
          "Study group created",

        group

      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// JOIN GROUP
// --------------------------------------------------

router.post(
  "/:id/join",

  protect,

  async (req, res, next) => {

    try {

      const group =
        await StudyGroup.findById(
          req.params.id
        );


      if (!group) {

        return res.status(404).json({

          message:
            "Group not found"

        });

      }


      const alreadyMember =
        group.members.some(
          member =>
            String(member) ===
            String(req.user._id)
        );


      if (alreadyMember) {

        return res.json({

          message:
            "Already a member",

          group

        });

      }


      if (
        group.members.length >=
        group.maxMembers
      ) {

        return res.status(400).json({

          message:
            "Group is full"

        });

      }


      group.members.push(
        req.user._id
      );


      await group.save();


      res.json({

        message:
          "Joined group",

        group

      });

    }

    catch (error) {

      next(error);

    }

  }
);


export default router;