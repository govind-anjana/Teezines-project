import express from 'express';
import { createContact, getContacts } from '../controller/ContectController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router=express.Router();

router.get("/",verifyAdmin,getContacts);

router.post("/",createContact);

export default router