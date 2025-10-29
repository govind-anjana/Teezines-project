import express from 'express';
import { GetSection, SectionAdd, SectionDelete, SectionUpdate } from '../controller/SectionController.js';
import { verifyAdmin } from '../middleware/auth.js';
import { AddSectionPro, GetProductsBySection, GetSectionProduct, RemoveProductFromSection, SectionProductReplace } from '../controller/SectionProController.js';

const router=express.Router();

router.get("/",GetSection);

router.post("/",verifyAdmin,SectionAdd);

router.put("/:id",verifyAdmin,SectionUpdate);

router.delete("/:id",verifyAdmin,SectionDelete);

router.get("/product",GetSectionProduct)

router.get("/:section", GetProductsBySection);

router.post("/product",verifyAdmin,AddSectionPro);

router.post("/replace-product",verifyAdmin,SectionProductReplace);

router.post("/product-remove",verifyAdmin, RemoveProductFromSection);


export default router;