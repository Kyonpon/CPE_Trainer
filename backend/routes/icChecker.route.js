import express from 'express';
import { icGetResults } from '../controllers/icChecker.controller.js';


const router = express.Router();

router.post("/ictesterresult", icGetResults);

export { router as ICCheckerAPI };

