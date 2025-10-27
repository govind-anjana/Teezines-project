import express from 'express';
import { GetSection, SectionAdd, SectionDelete, SectionUpdate } from '../controller/SectionController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router=express.Router();

router.get("/",GetSection);

router.post("/",verifyAdmin,SectionAdd);

router.put("/:id",verifyAdmin,SectionUpdate);

router.delete("/:id",verifyAdmin,SectionDelete)

export default router;