import { Request, Response } from "express";
import { MOCKDATA_ON } from "../flags";

import { STATUS_CODE } from "../utils/statusCode.utils";
import {
  createMockControl,
  deleteMockControlById,
  getAllMockControls,
  getMockControlById,
  updateMockControlById,
} from "../mocks/tools/control.mock.db";
import {
  createNewControlQuery,
  deleteControlByIdQuery,
  getAllControlsQuery,
  getControlByIdQuery,
  updateControlByIdQuery,
} from "../utils/control.utils";
import { createNewSubcontrolQuery } from "../utils/subControl.utils";
import { createControlCategoryQuery } from "../utils/controlCategory.util";
import { createMockControlCategory } from "../mocks/tools/controlCategory.mock.db";
import { createMockSubcontrol } from "../mocks/tools/subcontrol.mock.db";

export async function getAllControls(
  req: Request,
  res: Response
): Promise<any> {
  try {
    if (MOCKDATA_ON === true) {
      const controls = getAllMockControls();

      if (controls) {
        return res.status(200).json(STATUS_CODE[200](controls));
      }

      return res.status(204).json(STATUS_CODE[204](controls));
    } else {
      const controls = await getAllControlsQuery();

      if (controls) {
        return res.status(200).json(STATUS_CODE[200](controls));
      }

      return res.status(204).json(STATUS_CODE[204](controls));
    }
  } catch (error) {
    return res.status(500).json(STATUS_CODE[500]((error as Error).message));
  }
}

export async function getControlById(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const controlId = parseInt(req.params.id);

    if (MOCKDATA_ON === true) {
      const control = getMockControlById(controlId);

      if (control) {
        return res.status(200).json(STATUS_CODE[200](control));
      }

      return res.status(204).json(STATUS_CODE[204](control));
    } else {
      const control = await getControlByIdQuery(controlId);

      if (control) {
        return res.status(200).json(STATUS_CODE[200](control));
      }

      return res.status(204).json(STATUS_CODE[204](control));
    }
  } catch (error) {
    return res.status(500).json(STATUS_CODE[500]((error as Error).message));
  }
}

export async function createControl(req: Request, res: Response): Promise<any> {
  try {
    const newControl: {
      projectId: number;
      status: string;
      approver: string;
      riskReview: string;
      owner: string;
      reviewer: string;
      dueDate: Date;
      implementationDetails: string;
      controlGroup: string;
    } = req.body;

    if (MOCKDATA_ON === true) {
      const control = createMockControl(newControl);
      if (control) {
        return res.status(201).json(STATUS_CODE[201](control));
      }
      return res.status(400).json(STATUS_CODE[400](control));
    } else {
      const createdControl = await createNewControlQuery(newControl);

      if (createdControl) {
        return res.status(201).json(STATUS_CODE[201](createdControl));
      }

      return res.status(400).json(STATUS_CODE[400]({}));
    }
  } catch (error) {
    return res.status(500).json(STATUS_CODE[500]((error as Error).message));
  }
}

export async function updateControlById(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const controlId = parseInt(req.params.id);
    const updatedControl: {
      projectId: number;
      status: string;
      approver: string;
      riskReview: string;
      owner: string;
      reviewer: string;
      dueDate: Date;
      implementationDetails: string;
    } = req.body;

    if (MOCKDATA_ON === true) {
      const control = updateMockControlById(controlId, updatedControl);

      if (control) {
        return res.status(200).json(STATUS_CODE[200](control));
      }

      return res.status(400).json(STATUS_CODE[400](control));
    } else {
      const control = await updateControlByIdQuery(controlId, updatedControl);

      if (control) {
        return res.status(200).json(STATUS_CODE[200](control));
      }

      return res.status(400).json(STATUS_CODE[400](control));
    }
  } catch (error) {
    return res.status(500).json(STATUS_CODE[500]((error as Error).message));
  }
}

export async function deleteControlById(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const controlId = parseInt(req.params.id);

    if (MOCKDATA_ON === true) {
      const control = deleteMockControlById(controlId);

      if (control) {
        return res.status(200).json(STATUS_CODE[200](control));
      }

      return res.status(400).json(STATUS_CODE[400](control));
    } else {
      const control = await deleteControlByIdQuery(controlId);

      if (control) {
        return res.status(200).json(STATUS_CODE[200](control));
      }

      return res.status(400).json(STATUS_CODE[400](control));
    }
  } catch (error) {
    return res.status(500).json(STATUS_CODE[500]((error as Error).message));
  }
}

export async function saveControls(req: Request, res: Response): Promise<any> {
  try {
    const projectId = req.body.projectId;

    if (!projectId) {
      res.status(400).json(STATUS_CODE[400]({ message: "project_id is required" }))
    }

    if (MOCKDATA_ON === true) {
      // first, the id of the project is needed and will be sent inside the req.body
      const controlCategoryTitle = req.body.controlCategoryTitle;

      // then, we need to create the control category and use the projectId as the foreign key
      const controlCategory: any = createMockControlCategory({
        projectId,
        controlCategoryTitle,
      });

      // now, we need to create the control for the control category, and use the control category id as the foreign key
      const control: any = createMockControl({
        controlCategoryId: controlCategory.id,
        control: {
          contrlTitle: req.body.control.controlTitle,
          controlDescription: req.body.control.controlDescription,
          status: req.body.control.status,
          approver: req.body.control.approver,
          riskReview: req.body.control.riskReview,
          owner: req.body.control.owner,
          reviewer: req.body.control.reviewer,
          description: req.body.control.description,
          date: req.body.control.date,
        },
      });
      const controlId = control.id;

      // now we need to iterate over subcontrols inside the control, and create a subcontrol for each subcontrol
      const subcontrols = req.body.control.subControls;
      for (const subcontrol of subcontrols) {
        const subcontrolToSave: any = createMockSubcontrol({
          controlId,
          subcontrol: subcontrol,
        });
        console.log("subcontrolToSave : ", subcontrolToSave);
      }
      res.status(200).json(
        STATUS_CODE[200]({
          message: "Controls saved",
        })
      );
    } else {
      // first the id of the project is needed and will be sent inside the req.body
      const controlCategoryTitle = req.body.controlCategoryTitle;

      // then we need to create the control category and use the projectId as the foreign key
      const controlCategory: any = await createControlCategoryQuery({
        projectId,
        name: controlCategoryTitle,
      });

      const controlCategoryId = controlCategory.id;

      // now we need to create the control for the control category, and use the control category id as the foreign key
      const control: any = await createNewControlQuery({
        projectId: controlCategoryId, // now must be replaced with controlCategoryId
        // title: req.body.control.title,
        status: req.body.control.status,
        approver: req.body.control.approver,
        riskReview: req.body.control.riskReview,
        owner: req.body.control.owner,
        reviewer: req.body.control.reviewer,
        dueDate: req.body.control.date,
        implementationDetails: req.body.control.description,
      });

      const controlId = control.id;

      // now we need to iterate over subcontrols inside the control, and create a subcontrol for each subcontrol
      const subcontrols = req.body.control.subControls;
      for (const subcontrol of subcontrols) {
        const subcontrolToSave: any = await createNewSubcontrolQuery(
          controlId,
          subcontrol
        );
        console.log("subcontrolToSave : ", subcontrolToSave);
      }

      res.status(200).json(
        STATUS_CODE[200]({
          message: "Controls saved",
        })
      );
    }
  } catch (error) {
    return res.status(500).json(STATUS_CODE[500]((error as Error).message));
  }
}
